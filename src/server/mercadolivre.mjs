import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { getDbPool } from "./db.mjs";

const PROVIDER = "mercadolivre";
const AUTH_URL = "https://auth.mercadolivre.com.br/authorization";
const TOKEN_URL = "https://api.mercadolibre.com/oauth/token";
// Candidato testado somente depois de OAuth explícito; a busca permanece bloqueada até o teste retornar dados válidos.
const SEARCH_URL = "https://api.mercadolibre.com/sites/MLB/search";
const CALLBACK_PATH = "/api/mercadolivre/oauth/callback";
const ADMIN_PATH = "/conectar-mercadolivre/";
const KEY_CONTEXT = Buffer.from("faro/mercadolivre/token-bundle/v1", "utf8");
const MAX_BODY_BYTES = 8 * 1024;
const PAGE_SIZE = 20;
const MAX_RESULTS_PER_QUERY = 1_000;

function json(res, status, value) {
  const body = JSON.stringify(value);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
    "Pragma": "no-cache",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
  });
  res.end(body);
}

function text(res, status, body, headers = {}) {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    ...headers,
  });
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    const declaredLength = Number(req.headers["content-length"] || 0);
    if (declaredLength > MAX_BODY_BYTES) {
      reject(new Error("body_too_large"));
      req.resume();
      return;
    }
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
        reject(new Error("body_too_large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        const parsed = JSON.parse(body);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
          return reject(new Error("invalid_json"));
        resolve(parsed);
      } catch {
        reject(new Error("invalid_json"));
      }
    });
    req.on("error", () => reject(new Error("request_read_failed")));
  });
}

function secretsReady() {
  return Boolean(
    process.env.MERCADOLIVRE_CLIENT_ID &&
      process.env.MERCADOLIVRE_CLIENT_SECRET &&
      process.env.FARO_ADMIN_KEY &&
      process.env.FARO_TOKEN_ENCRYPTION_KEY,
  );
}

function adminKeyValid(req) {
  const expectedText = process.env.FARO_ADMIN_KEY || "";
  const suppliedText = /^Bearer (.+)$/i.exec(req.headers.authorization || "")?.[1] || "";
  if (expectedText.length < 32 || suppliedText.length < 32) return false;
  const expected = Buffer.from(expectedText, "utf8");
  const supplied = Buffer.from(suppliedText, "utf8");
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}

function encryptionKey() {
  const value = String(process.env.FARO_TOKEN_ENCRYPTION_KEY || "").trim();
  const key = Buffer.from(value, "base64");
  if (key.length !== 32 || key.toString("base64") !== value)
    throw new Error("token_encryption_key_invalid");
  return key;
}

function encryptBundle(bundle) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  cipher.setAAD(KEY_CONTEXT);
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(bundle), "utf8"),
    cipher.final(),
  ]);
  return {
    ciphertext: ciphertext.toString("base64"),
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
  };
}

function decryptBundle(row) {
  const decipher = createDecipheriv(
    "aes-256-gcm",
    encryptionKey(),
    Buffer.from(row.token_bundle_iv, "base64"),
  );
  decipher.setAAD(KEY_CONTEXT);
  decipher.setAuthTag(Buffer.from(row.token_bundle_tag, "base64"));
  const clear = Buffer.concat([
    decipher.update(Buffer.from(row.token_bundle_ciphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");
  return JSON.parse(clear);
}

function appConfig() {
  return JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), "content/site.json"), "utf8"),
  );
}

function allowedOrigin(value) {
  if (typeof value !== "string" || value.length > 512) return false;
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }
  if (parsed.origin !== value || parsed.username || parsed.password) return false;
  const allowlist = Array.isArray(appConfig().marketplaceAllowedOrigins)
    ? appConfig().marketplaceAllowedOrigins
    : [];
  return parsed.protocol === "https:" && allowlist.includes(parsed.origin);
}

function callbackUri(origin) {
  if (!allowedOrigin(origin)) throw new Error("origin_not_allowed");
  return new URL(CALLBACK_PATH, origin).toString();
}

function encryptionFields(bundle) {
  const encrypted = encryptBundle(bundle);
  return [encrypted.ciphertext, encrypted.iv, encrypted.tag];
}

async function saveTokenBundle(bundle, { accountId = null, scope = null } = {}) {
  const db = getDbPool();
  const [ciphertext, iv, tag] = encryptionFields(bundle);
  const expiresAt = Number(bundle.expires_at_ms);
  await db.execute(
    `INSERT INTO faro_marketplace_connections
      (provider, account_id, token_bundle_ciphertext, token_bundle_iv, token_bundle_tag, expires_at_ms, scope, search_verified, search_tested_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, NULL)
     ON DUPLICATE KEY UPDATE
      account_id = VALUES(account_id), token_bundle_ciphertext = VALUES(token_bundle_ciphertext),
      token_bundle_iv = VALUES(token_bundle_iv), token_bundle_tag = VALUES(token_bundle_tag),
      expires_at_ms = VALUES(expires_at_ms), scope = VALUES(scope), search_verified = 0,
      search_tested_at = NULL`,
    [PROVIDER, accountId, ciphertext, iv, tag, expiresAt, scope],
  );
}

async function readConnection() {
  const db = getDbPool();
  const [rows] = await db.execute(
    `SELECT provider, account_id, token_bundle_ciphertext, token_bundle_iv, token_bundle_tag,
            expires_at_ms, scope, search_verified
       FROM faro_marketplace_connections WHERE provider = ? LIMIT 1`,
    [PROVIDER],
  );
  return rows[0] || null;
}

async function setSearchVerified(verified) {
  const db = getDbPool();
  await db.execute(
    `UPDATE faro_marketplace_connections
       SET search_verified = ?, search_tested_at = ${verified ? "CURRENT_TIMESTAMP(3)" : "NULL"}
     WHERE provider = ?`,
    [verified ? 1 : 0, PROVIDER],
  );
}

async function refreshBundle(row, force = false) {
  const db = getDbPool();
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.execute(
      `SELECT provider, account_id, token_bundle_ciphertext, token_bundle_iv, token_bundle_tag,
              expires_at_ms, scope
         FROM faro_marketplace_connections WHERE provider = ? FOR UPDATE`,
      [PROVIDER],
    );
    const locked = rows[0];
    if (!locked) {
      await conn.commit();
      return null;
    }
    let bundle = decryptBundle(locked);
    const expiresAt = Number(locked.expires_at_ms);
    if (!force && expiresAt > Date.now() + 90_000) {
      await conn.commit();
      return bundle;
    }
    if (!bundle.refresh_token) {
      await conn.rollback();
      return null;
    }

    const payload = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.MERCADOLIVRE_CLIENT_ID || "",
      client_secret: process.env.MERCADOLIVRE_CLIENT_SECRET || "",
      refresh_token: bundle.refresh_token,
    });
    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload,
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) {
      await conn.rollback();
      return null;
    }
    const token = await response.json();
    if (!token.access_token || !Number.isFinite(Number(token.expires_in))) {
      await conn.rollback();
      return null;
    }
    bundle = {
      access_token: token.access_token,
      refresh_token: token.refresh_token || bundle.refresh_token,
      token_type: token.token_type || "Bearer",
      scope: token.scope || bundle.scope || "",
      expires_at_ms: Date.now() + Number(token.expires_in) * 1000,
    };
    const [ciphertext, iv, tag] = encryptionFields(bundle);
    await conn.execute(
      `UPDATE faro_marketplace_connections
         SET token_bundle_ciphertext = ?, token_bundle_iv = ?, token_bundle_tag = ?,
             expires_at_ms = ?, scope = ? WHERE provider = ?`,
      [ciphertext, iv, tag, bundle.expires_at_ms, bundle.scope || null, PROVIDER],
    );
    await conn.commit();
    return bundle;
  } catch (error) {
    await conn.rollback().catch(() => {});
    throw error;
  } finally {
    conn.release();
  }
}

async function getAccessToken(forceRefresh = false) {
  const row = await readConnection();
  if (!row) return null;
  if (forceRefresh || Number(row.expires_at_ms) <= Date.now() + 90_000) {
    const refreshed = await refreshBundle(row, forceRefresh);
    return refreshed?.access_token || null;
  }
  return decryptBundle(row).access_token || null;
}

async function requestSearch(query, offset, limit = 20) {
  let accessToken = await getAccessToken(false);
  if (!accessToken) return { ok: false, code: "reauthorization_required", status: 401 };

  const url = new URL(SEARCH_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));
  let response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
    signal: AbortSignal.timeout(12_000),
  });
  if (response.status === 401) {
    accessToken = await getAccessToken(true);
    if (!accessToken)
      return { ok: false, code: "reauthorization_required", status: 401 };
    response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
      signal: AbortSignal.timeout(12_000),
    });
  }
  if (!response.ok)
    return { ok: false, code: `marketplace_http_${response.status}`, status: response.status };

  let data;
  try {
    data = await response.json();
  } catch {
    return { ok: false, code: "marketplace_response_shape_unknown", status: 502 };
  }
  if (!Array.isArray(data.results) || !data.paging || !Number.isFinite(Number(data.paging.total)))
    return { ok: false, code: "marketplace_response_shape_unknown", status: 502 };

  return {
    ok: true,
    total: Number(data.paging.total),
    offset: Number(data.paging.offset ?? offset),
    limit: Number(data.paging.limit ?? limit),
    results: data.results.map(normalizeResult).filter(Boolean),
  };
}

function safeHttpsUrl(value, allowedDomains) {
  if (typeof value !== "string" || value.length > 2048) return "";
  try {
    const url = new URL(value);
    const validHost = allowedDomains.some(
      (domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`),
    );
    return url.protocol === "https:" &&
      validHost &&
      !url.username &&
      !url.password &&
      (!url.port || url.port === "443")
      ? url.toString()
      : "";
  } catch {
    return "";
  }
}

function normalizeResult(item) {
  if (!item || typeof item !== "object" || !item.id || !item.title) return null;
  const permalink = safeHttpsUrl(item.permalink, ["mercadolivre.com.br", "mercadolibre.com"]);
  const picture = safeHttpsUrl(item.secure_thumbnail || item.thumbnail, ["mlstatic.com"]);
  return {
    id: String(item.id).slice(0, 80),
    title: String(item.title).slice(0, 240),
    price:
      item.price != null && Number.isFinite(Number(item.price))
        ? Number(item.price)
        : null,
    currency: typeof item.currency_id === "string" ? item.currency_id.slice(0, 8) : null,
    picture,
    url: permalink,
    seller: typeof item.seller?.nickname === "string" ? item.seller.nickname.slice(0, 100) : null,
    categoryId: typeof item.category_id === "string" ? item.category_id.slice(0, 80) : null,
    condition: typeof item.condition === "string" ? item.condition.slice(0, 24) : null,
    availableQuantity:
      item.available_quantity != null &&
      Number.isFinite(Number(item.available_quantity))
      ? Number(item.available_quantity)
      : null,
  };
}

function searchErrorMessage(code) {
  if (code === "reauthorization_required")
    return "A autorização precisa ser refeita pelo responsável do FARO.";
  if (code === "marketplace_http_403")
    return "O Mercado Livre recusou a busca geral (403). Esta aplicação pode não ter esse escopo; a busca curada continua disponível.";
  if (code === "marketplace_http_429")
    return "O Mercado Livre limitou temporariamente as consultas. Aguarde e tente novamente.";
  if (code === "marketplace_http_401")
    return "A autorização expirou ou foi revogada. O responsável precisa conectar o app novamente.";
  return "A busca ao vivo não está disponível agora. A busca curada continua disponível.";
}

async function consumeState(state) {
  if (typeof state !== "string" || state.length < 32 || state.length > 128)
    return null;
  const db = getDbPool();
  const hash = createHash("sha256").update(state).digest("hex");
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.execute(
      `SELECT state_hash, redirect_uri, return_origin, expires_at_ms
         FROM faro_oauth_states WHERE state_hash = ? FOR UPDATE`,
      [hash],
    );
    const row = rows[0];
    if (!row || Number(row.expires_at_ms) < Date.now()) {
      if (row)
        await conn.execute("DELETE FROM faro_oauth_states WHERE state_hash = ?", [hash]);
      await conn.commit();
      return null;
    }
    await conn.execute("DELETE FROM faro_oauth_states WHERE state_hash = ?", [hash]);
    await conn.commit();
    return row;
  } catch (error) {
    await conn.rollback().catch(() => {});
    throw error;
  } finally {
    conn.release();
  }
}

function callbackRedirect(res, origin, status) {
  const target = new URL(ADMIN_PATH, origin);
  target.searchParams.set("oauth", status);
  res.writeHead(303, {
    Location: target.toString(),
    "Cache-Control": "no-store",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
  });
  res.end();
}

async function oauthCallback(req, res, url) {
  const state = await consumeState(url.searchParams.get("state") || "");
  if (!state) return text(res, 400, "Solicitação OAuth inválida ou expirada. Volte ao FARO e tente de novo.");
  if (!allowedOrigin(state.return_origin) || callbackUri(state.return_origin) !== state.redirect_uri)
    return text(res, 400, "Origem de retorno inválida. Volte ao FARO e tente de novo.");
  if (url.searchParams.get("error"))
    return callbackRedirect(res, state.return_origin, "cancelled");
  const code = url.searchParams.get("code");
  if (!code || code.length > 2048)
    return callbackRedirect(res, state.return_origin, "error");

  try {
    const payload = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.MERCADOLIVRE_CLIENT_ID || "",
      client_secret: process.env.MERCADOLIVRE_CLIENT_SECRET || "",
      code,
      redirect_uri: state.redirect_uri,
    });
    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload,
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) return callbackRedirect(res, state.return_origin, "error");
    const token = await response.json();
    if (
      !token.access_token ||
      !token.refresh_token ||
      !Number.isFinite(Number(token.expires_in))
    )
      return callbackRedirect(res, state.return_origin, "error");

    await saveTokenBundle(
      {
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        token_type: token.token_type || "Bearer",
        scope: token.scope || "",
        expires_at_ms: Date.now() + Number(token.expires_in) * 1000,
      },
      {
        accountId: token.user_id == null ? null : String(token.user_id).slice(0, 64),
        scope: typeof token.scope === "string" ? token.scope.slice(0, 1024) : null,
      },
    );
    return callbackRedirect(res, state.return_origin, "connected");
  } catch {
    return callbackRedirect(res, state.return_origin, "error");
  }
}

async function startOAuth(req, res) {
  if (!adminKeyValid(req)) return json(res, 403, { error: "admin_key_invalid", message: "Chave de administração inválida." });
  if (!secretsReady())
    return json(res, 409, { error: "secrets_missing", message: "Configure os segredos solicitados pelo FARO antes de conectar o app." });

  const body = await readJson(req);
  const origin = body.origin;
  const redirectUri = callbackUri(origin);
  const state = randomBytes(32).toString("base64url");
  const stateHash = createHash("sha256").update(state).digest("hex");
  const db = getDbPool();
  const expiresAt = Date.now() + 10 * 60 * 1000;
  await db.execute("DELETE FROM faro_oauth_states WHERE expires_at_ms < ?", [Date.now()]);
  await db.execute(
    `INSERT INTO faro_oauth_states (state_hash, redirect_uri, return_origin, expires_at_ms)
     VALUES (?, ?, ?, ?)`,
    [stateHash, redirectUri, origin, expiresAt],
  );

  const authorization = new URL(AUTH_URL);
  authorization.searchParams.set("response_type", "code");
  authorization.searchParams.set("client_id", process.env.MERCADOLIVRE_CLIENT_ID);
  authorization.searchParams.set("redirect_uri", redirectUri);
  authorization.searchParams.set("state", state);
  return json(res, 200, { authorizationUrl: authorization.toString() });
}

async function publicStatus(res) {
  const row = await readConnection();
  return json(res, 200, {
    connected: Boolean(row),
    liveSearchAvailable: Boolean(row?.search_verified),
  });
}

async function testSearch(req, res) {
  if (!adminKeyValid(req)) return json(res, 403, { error: "admin_key_invalid", message: "Chave de administração inválida." });
  const body = await readJson(req);
  const query = String(body.query || "fone bluetooth").trim().slice(0, 100);
  if (query.length < 3)
    return json(res, 400, { error: "query_too_short", message: "Use pelo menos 3 caracteres." });
  const result = await requestSearch(query, 0, 8);
  if (!result.ok) {
    await setSearchVerified(false);
    const message = searchErrorMessage(result.code);
    return json(res, result.status >= 400 && result.status < 500 ? result.status : 502, {
      verified: false,
      error: result.code,
      message,
    });
  }
  if (!result.results.length) {
    await setSearchVerified(false);
    return json(res, 200, {
      verified: false,
      error: "search_returned_no_items",
      message: "O endpoint respondeu, mas o teste não retornou anúncios. A busca ao vivo continua desativada.",
    });
  }
  await setSearchVerified(true);
  return json(res, 200, {
    verified: true,
    returned: result.results.length,
    message: "A consulta somente leitura retornou anúncios. Busca paginada ativada; campos ausentes continuam sem inferência.",
  });
}

async function publicSearch(req, res, url) {
  const row = await readConnection();
  if (!row?.search_verified)
    return json(res, 503, {
      error: "search_not_verified",
      message: "A busca ao vivo ainda não passou por teste autorizado. A base curada continua disponível.",
    });

  const query = String(url.searchParams.get("q") || "").trim();
  if (query.length < 3 || query.length > 100)
    return json(res, 400, { error: "invalid_query", message: "Digite de 3 a 100 caracteres." });
  const rawOffset = Number(url.searchParams.get("offset") || 0);
  if (
    !Number.isSafeInteger(rawOffset) ||
    rawOffset < 0 ||
    rawOffset >= MAX_RESULTS_PER_QUERY
  )
    return json(res, 400, { error: "invalid_offset", message: "O limite de resultados desta busca foi atingido. Refine o termo." });

  const pageLimit = Math.min(PAGE_SIZE, MAX_RESULTS_PER_QUERY - rawOffset);
  const result = await requestSearch(query, rawOffset, pageLimit);
  if (!result.ok) {
    if (result.status === 401 || result.status === 403) await setSearchVerified(false);
    return json(res, result.status >= 400 && result.status < 500 ? result.status : 502, {
      error: result.code,
      message: searchErrorMessage(result.code),
    });
  }
  const nextOffset = result.offset + result.results.length;
  const capped = nextOffset >= MAX_RESULTS_PER_QUERY && nextOffset < result.total;
  return json(res, 200, {
    query,
    source: "Mercado Livre",
    fetchedAt: new Date().toISOString(),
    total: result.total,
    offset: result.offset,
    limit: result.limit,
    hasMore: nextOffset < result.total && nextOffset < MAX_RESULTS_PER_QUERY && result.results.length > 0,
    capped,
    results: result.results,
    disclaimer: "Dados retornados pela API no momento da consulta; não representam vendas confirmadas, avaliações, comissão afiliada ou recomendação do FARO.",
  });
}

async function disconnect(req, res) {
  if (!adminKeyValid(req)) return json(res, 403, { error: "admin_key_invalid", message: "Chave de administração inválida." });
  const db = getDbPool();
  await db.execute("DELETE FROM faro_marketplace_connections WHERE provider = ?", [PROVIDER]);
  return json(res, 200, {
    disconnected: true,
    message: "O token local foi removido. Para revogar o acesso também no Mercado Livre, remova a aplicação nas configurações da sua conta.",
  });
}

let searchRateWindowStart = 0;
let searchRateCount = 0;
function allowedSearchRate() {
  const now = Date.now();
  if (now - searchRateWindowStart >= 60_000) {
    searchRateWindowStart = now;
    searchRateCount = 0;
  }
  if (searchRateCount >= 120) return false;
  searchRateCount += 1;
  return true;
}

export async function handleMercadoLivre(req, res, url) {
  const route = url.pathname;
  try {
    if (route === `${CALLBACK_PATH}` && req.method === "GET")
      return await oauthCallback(req, res, url);
    if (route === "/api/mercadolivre/status" && req.method === "GET")
      return await publicStatus(res);
    if (route === "/api/mercadolivre/oauth/start" && req.method === "POST")
      return await startOAuth(req, res);
    if (route === "/api/mercadolivre/test-search" && req.method === "POST")
      return await testSearch(req, res);
    if (route === "/api/mercadolivre/disconnect" && req.method === "POST")
      return await disconnect(req, res);
    if (route === "/api/mercadolivre/search" && req.method === "GET") {
      if (!allowedSearchRate())
        return json(res, 429, { error: "rate_limited", message: "Muitas consultas em pouco tempo. Aguarde e tente novamente." });
      return await publicSearch(req, res, url);
    }
    if (route.startsWith("/api/mercadolivre/"))
      return json(res, 404, { error: "not_found", message: "Endpoint não encontrado." });
    return false;
  } catch (error) {
    const code = error?.message === "origin_not_allowed" ? "origin_not_allowed" : "request_failed";
    const status = code === "origin_not_allowed" ? 403 : 500;
    return json(res, status, {
      error: code,
      message: code === "origin_not_allowed"
        ? "Esta origem não está autorizada para o fluxo OAuth."
        : "Não foi possível concluir esta solicitação. Consulte o estado no painel sem compartilhar segredos.",
    });
  }
}
