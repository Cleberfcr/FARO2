import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSite } from "./build.mjs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const routes = JSON.parse(
  fs.readFileSync(path.join(root, "public/manus-routes.json"), "utf8"),
).routes;
const site = JSON.parse(
  fs.readFileSync(path.join(root, "content/site.json"), "utf8"),
);
const items = JSON.parse(
  fs.readFileSync(path.join(root, "content/opportunities.json"), "utf8"),
);
const failures = [];
const warnings = [];
const files = [];
function fileFor(route) {
  return route === "/"
    ? path.join(dist, "index.html")
    : path.join(
        dist,
        route.replace(/^\//, "").replace(/\/$/, ""),
        "index.html",
      );
}
function check(condition, message) {
  if (!condition) failures.push(message);
}
buildSite();
const builtItems = JSON.parse(
  fs.readFileSync(path.join(dist, "data/opportunities.json"), "utf8"),
);
for (const route of routes) {
  if (route.path.includes(":")) continue;
  const file = fileFor(route.path);
  check(fs.existsSync(file), `Rota ausente ${route.path}`);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, "utf8");
  files.push(file);
  check(/<html lang="pt-BR">/.test(html), `Idioma ausente: ${route.path}`);
  check(
    /<main id="conteudo"/.test(html),
    `Conteúdo principal ausente: ${route.path}`,
  );
  check(/<h1\b/.test(html), `H1 ausente: ${route.path}`);
  check(
    /<meta name="description" content=".{50,160}"/.test(html),
    `Meta description fora da faixa esperada: ${route.path}`,
  );
  const title = (html.match(/<title>(.*?)<\/title>/) || [])[1] || "";
  if (title.length < 30 || title.length > 60)
    warnings.push(`Título ${title.length} chars: ${route.path}`);
  const keywords =
    (html.match(/<meta name="keywords" content="([^"]*)"/) || [])[1] || "";
  const count = keywords.split(",").filter(Boolean).length;
  if (count < 3 || count > 8)
    warnings.push(`Meta keywords ${count}: ${route.path}`);
  if (
    route.path === "/painel/" ||
    route.path === "/obrigado/" ||
    route.path === "/conectar-mercadolivre/"
  )
    check(
      /name="robots" content="noindex,nofollow"/.test(html),
      `Noindex ausente: ${route.path}`,
    );
  if (route.path === "/")
    check(
      /Um faro para ofertas/.test(html),
      `Home sem conteúdo: ${route.path}`,
    );
}
for (const item of items) {
  const route = `/oportunidades/${item.slug}/`;
  const file = fileFor(route);
  const renderedItem = builtItems.find((entry) => entry.id === item.id);
  check(fs.existsSync(file), `Detalhe ausente: ${item.id}`);
  if (fs.existsSync(file)) {
    const html = fs.readFileSync(file, "utf8");
    check(html.includes(item.title), `Título de detalhe ausente: ${item.id}`);
    check(
      html.includes(`data-detail-id="${item.id}"`),
      `ID de detalhe ausente: ${item.id}`,
    );
    check(
      Boolean(renderedItem) &&
        html.includes(
          `<span class="status-pill">${renderedItem.action}</span>`,
        ),
      `Estado de recomendação ausente: ${item.id}`,
    );
  }
}
check(fs.existsSync(path.join(dist, "404.html")), "404.html ausente");
check(
  fs.existsSync(path.join(dist, "manus-routes.json")),
  "manus-routes.json ausente",
);
check(fs.existsSync(path.join(dist, "robots.txt")), "robots.txt ausente");
const robots = fs.readFileSync(path.join(dist, "robots.txt"), "utf8");
check(
  !/Disallow:\s*\/(painel|obrigado)\//i.test(robots),
  "robots.txt bloqueia página que deve ser lida para aplicar noindex.",
);
check(
  site.affiliateLinksConfigured === true ||
    builtItems.every((item) => item.action !== "COMPRAR"),
  "Kill switch de afiliados não desativou status COMPRAR no catálogo público.",
);
const heroPath = String(site.heroImage || site.staticHeroImage || "");
const heroFile = path.join(dist, heroPath.replace(/^\//, ""));
const heroIsPortable =
  heroPath.startsWith("/assets/") && fs.existsSync(heroFile);
const heroIsManaged =
  /^\/manus-storage\/async-images\/[A-Za-z0-9_-]+\/image-1\.webp$/.test(
    heroPath,
  );
check(
  heroIsPortable || heroIsManaged,
  "Hero deve ser um arquivo local incluído em dist ou um asset estável do Manus",
);
check(
  fs.readFileSync(path.join(dist, "index.html"), "utf8").includes(
    `src="${heroPath}"`,
  ),
  "Home sem hero portátil",
);
check(
  !fs.existsSync(path.join(dist, "sitemap.xml")) ||
    fs
      .readFileSync(path.join(dist, "sitemap.xml"), "utf8")
      .includes("https://"),
  "Sitemap contém origem absoluta.",
);
const routeSet = new Set([
  ...routes.map((x) => x.path).filter((x) => !x.includes(":")),
  ...items.map((x) => `/oportunidades/${x.slug}/`),
  "/obrigado/",
  "/painel/",
  "/conectar-mercadolivre/",
]);
for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  for (const match of html.matchAll(/\shref="(\/[^"#?]*\/?)(?:[?#][^"]*)?"/g)) {
    const href = match[1];
    if (
      href.startsWith("/assets/") ||
      href.startsWith("/data/") ||
      href === "/manus-routes.json" ||
      href === "/favicon.ico" ||
      href === "/robots.txt" ||
      href === "/sitemap.xml" ||
      href.startsWith("/manus-storage/")
    )
      continue;
    if (href === "/404.html") continue;
    if (
      !routeSet.has(href) &&
      !routeSet.has(href.endsWith("/") ? href : `${href}/`)
    )
      failures.push(
        `Link interno sem rota (${path.relative(dist, file)}): ${href}`,
      );
  }
}
const applicationJs = fs.readFileSync(path.join(dist, "assets/app.js"), "utf8");
check(
  applicationJs.includes("initRadar") &&
    applicationJs.includes("initPanel") &&
    applicationJs.includes("initLiveMarketplaceSearch") &&
    applicationJs.includes("initMercadoLivreAdmin"),
  "Busca curada, busca ao vivo ou painel OAuth ausente no JS",
);
if (warnings.length)
  console.log(`Avisos SEO (${warnings.length}):\n- ${warnings.join("\n- ")}`);
if (failures.length) {
  console.error(`Falhas (${failures.length}):\n- ${failures.join("\n- ")}`);
  process.exitCode = 1;
} else
  console.log(
    `Validação local concluída: ${files.length} páginas públicas e ${items.length} análises; sem falhas críticas.`,
  );
