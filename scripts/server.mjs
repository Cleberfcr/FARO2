import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { buildSite } from "./build.mjs";
import { closeDatabase, migrateDatabase } from "../src/server/db.mjs";
import { handleMercadoLivre } from "../src/server/mercadolivre.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const port = Number(process.env.PORT || 3000);
const host = "0.0.0.0";
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".ico": "image/x-icon",
};

function headers(res, type = "text/plain; charset=utf-8") {
  res.setHeader("Content-Type", type);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cache-Control", "no-cache");
}

async function main() {
  buildSite();
  await migrateDatabase();
  const server = http.createServer(async (req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url || "/", "http://localhost").pathname);
    } catch {
      headers(res);
      res.writeHead(400);
      res.end("Bad request");
      return;
    }
    if (pathname.includes("\0") || pathname.split("/").includes("..")) {
      headers(res);
      res.writeHead(400);
      res.end("Bad request");
      return;
    }
    if (pathname === "/healthz" && req.method === "GET") {
      const body = JSON.stringify({ status: "ok" });
      headers(res, "application/json; charset=utf-8");
      res.writeHead(200, { "Content-Length": Buffer.byteLength(body), "Cache-Control": "no-store" });
      res.end(body);
      return;
    }
    if (pathname.startsWith("/api/")) {
      const handled = await handleMercadoLivre(req, res, new URL(req.url || "/", "http://localhost"));
      if (handled !== false) return;
      headers(res, "application/json; charset=utf-8");
      res.writeHead(404);
      res.end(JSON.stringify({ error: "not_found" }));
      return;
    }
    if (req.method !== "GET" && req.method !== "HEAD") {
      headers(res);
      res.writeHead(405, { Allow: "GET, HEAD" });
      res.end("Method not allowed");
      return;
    }

    let target = pathname === "/"
      ? path.join(dist, "index.html")
      : path.resolve(dist, `.${pathname}`);
    if (!target.startsWith(`${dist}${path.sep}`) && target !== path.join(dist, "index.html")) {
      headers(res);
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    try {
      if (fs.existsSync(target) && fs.statSync(target).isDirectory())
        target = path.join(target, "index.html");
      if (!path.extname(target) && fs.existsSync(`${target}/index.html`))
        target = `${target}/index.html`;
      if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
        const notFound = path.join(dist, "404.html");
        const body = fs.existsSync(notFound) ? fs.readFileSync(notFound) : Buffer.from("Not found");
        headers(res, "text/html; charset=utf-8");
        res.writeHead(404, { "Content-Length": body.length, "Cache-Control": "no-store" });
        res.end(req.method === "HEAD" ? undefined : body);
        return;
      }
      const body = fs.readFileSync(target);
      headers(res, mime[path.extname(target)] || "application/octet-stream");
      res.writeHead(200, { "Content-Length": body.length });
      res.end(req.method === "HEAD" ? undefined : body);
    } catch {
      headers(res);
      res.writeHead(500);
      res.end("Internal server error");
    }
  });

  server.listen(port, host, () => console.log(`FARO servidor pronto na porta ${port}.`));
  const shutdown = () => {
    server.close(async () => {
      await closeDatabase().catch(() => {});
      process.exit(0);
    });
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((error) => {
  console.error(`FARO startup failed: ${error?.code || error?.name || "unknown"}`);
  closeDatabase().finally(() => process.exit(1));
});
