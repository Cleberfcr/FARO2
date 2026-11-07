import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderPage } from "../src/templates/site.mjs";
import {
  homePage,
  radarPage,
  detailPage,
  providersPage,
  methodologyPage,
  guidePage,
  aboutPage,
  disclosurePage,
  privacyPage,
  termsPage,
  cookiesPage,
  panelPage,
  mercadoLivreConnectPage,
  thanksPage,
  notFoundPage,
} from "../src/templates/pages.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");
const metricsWeights = {
  demand: 20,
  trend: 15,
  viral: 15,
  commission: 15,
  competition: 10,
  reputation: 10,
  promotion: 5,
  availability: 5,
  repurchase: 5,
};

function assertData(site, items, partners) {
  if (!site.brand || !Array.isArray(items) || !items.length)
    throw new Error("Configuração ou catálogo vazio.");
  const ids = new Set();
  const slugs = new Set();
  for (const item of items) {
    if (ids.has(item.id) || slugs.has(item.slug))
      throw new Error(`ID ou slug duplicado: ${item.id}/${item.slug}`);
    ids.add(item.id);
    slugs.add(item.slug);
    const sum = Object.values(item.metrics || {}).reduce(
      (a, b) => a + Number(b || 0),
      0,
    );
    if (sum !== Number(item.score))
      throw new Error(
        `${item.id}: componentes (${sum}) não somam score (${item.score}).`,
      );
    if (
      Number(item.score) < 0 ||
      Number(item.score) > 100 ||
      !Number.isInteger(Number(item.score))
    )
      throw new Error(`${item.id}: score fora do intervalo 0–100.`);
    if (!Array.isArray(item.sources) || !item.sources.length)
      throw new Error(`${item.id}: adicione ao menos uma fonte.`);
    for (const source of item.sources) {
      let url;
      try {
        url = new URL(source.url);
      } catch {
        throw new Error(`${item.id}: fonte sem URL válida.`);
      }
      if (!source.title || url.protocol !== "https:")
        throw new Error(`${item.id}: fonte precisa de título e URL HTTPS.`);
    }
    if (Object.keys(metricsWeights).some((key) => !(key in item.metrics)))
      throw new Error(`${item.id}: dimensão de score ausente.`);
    if (!["ANALISAR", "COMPRAR", "EVITAR"].includes(item.action))
      throw new Error(`${item.id}: ação desconhecida.`);
    if (
      item.action === "COMPRAR" &&
      (!item.offer?.ownerVerified || !item.offer?.affiliateUrl)
    )
      throw new Error(
        `${item.id}: não usar COMPRAR sem oferta e link afiliado conferidos.`,
      );
    if (item.offer?.ownerVerified) {
      for (const key of ["productUrl", "affiliateUrl"]) {
        let url;
        try {
          url = new URL(item.offer[key]);
        } catch {
          throw new Error(`${item.id}: ${key} inválida.`);
        }
        if (url.protocol !== "https:")
          throw new Error(`${item.id}: ${key} deve ser HTTPS.`);
      }
      if (
        !item.offer.sku ||
        !item.offer.price ||
        !item.offer.marketplace ||
        !item.offer.verifiedAt
      )
        throw new Error(
          `${item.id}: oferta conferida exige SKU, preço, marketplace e data.`,
        );
    }
  }
  if (!Array.isArray(partners)) throw new Error("Lista de parceiros inválida.");
  if (site.publicOrigin) {
    const u = new URL(site.publicOrigin);
    if (u.protocol !== "https:" || u.pathname !== "/" || u.search || u.hash)
      throw new Error("publicOrigin deve ser apenas uma origem HTTPS pública.");
  }
}
function writeText(file, body) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, body);
}
function page(site, config, content = config.content) {
  return renderPage({ site, ...config, content });
}
function routeFile(route) {
  return route === "/"
    ? path.join(output, "index.html")
    : path.join(
        output,
        route.replace(/^\//, "").replace(/\/$/, ""),
        "index.html",
      );
}
function xmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
function metadata(
  title,
  description,
  keywords,
  pathValue,
  active,
  content,
  noindex = false,
  pageType = "website",
) {
  return {
    title,
    description,
    keywords,
    path: pathValue,
    active,
    content,
    noindex,
    pageType,
  };
}

export function buildSite() {
  const site = JSON.parse(
    fs.readFileSync(path.join(root, "content/site.json"), "utf8"),
  );
  const sourceItems = JSON.parse(
    fs.readFileSync(path.join(root, "content/opportunities.json"), "utf8"),
  );
  const partners = JSON.parse(
    fs.readFileSync(path.join(root, "content/partners.json"), "utf8"),
  );
  assertData(site, sourceItems, partners);
  const items = sourceItems.map((item) =>
    item.action === "COMPRAR" && site.affiliateLinksConfigured !== true
      ? { ...item, action: "ANALISAR" }
      : item,
  );
  fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(output, { recursive: true });
  fs.cpSync(path.join(root, "public"), output, { recursive: true });
  fs.mkdirSync(path.join(output, "assets"), { recursive: true });
  fs.copyFileSync(
    path.join(root, "src/css/styles.css"),
    path.join(output, "assets/styles.css"),
  );
  fs.copyFileSync(
    path.join(root, "src/js/app.js"),
    path.join(output, "assets/app.js"),
  );
  fs.mkdirSync(path.join(output, "data"), { recursive: true });
  writeText(
    path.join(output, "data/opportunities.json"),
    `${JSON.stringify(items, null, 2)}\n`,
  );
  fs.copyFileSync(
    path.join(root, "content/partners.json"),
    path.join(output, "data/partners.json"),
  );
  fs.copyFileSync(
    path.join(root, "content/site.json"),
    path.join(output, "data/site.json"),
  );

  const pages = [];
  pages.push({
    route: "/",
    ...metadata(
      "FARO — Radar de oportunidades em curadoria útil",
      "Descubra oportunidades de produtos com fontes, scores estimados, riscos e limites explícitos. A pesquisa não garante vendas.",
      [
        "FARO",
        "radar de produtos",
        "curadoria",
        "oportunidades de afiliados",
        "marketing de afiliados",
      ],
      "/",
      "",
      homePage(site, items),
    ),
  });
  pages.push({
    route: "/radar/",
    ...metadata(
      "Radar de oportunidades de produtos | FARO",
      "Explore oito famílias de produtos, filtre por categoria e score e confira as lacunas antes de pesquisar SKUs.",
      [
        "radar de produtos",
        "produtos em análise",
        "pesquisa de mercado",
        "oportunidades",
      ],
      "/radar/",
      "radar",
      radarPage(items),
    ),
  });
  for (const item of items) {
    const content = detailPage(item, site);
    const description = `${item.title}: score editorial ${item.score}/100, confiança ${item.confidence.toLowerCase()}. Veja sinais, riscos, fontes e o que não foi confirmado.`;
    pages.push({
      route: `/oportunidades/${item.slug}/`,
      ...metadata(
        `FARO: ${item.title} — análise editorial`,
        description.slice(0, 158),
        [
          "oportunidade de produto",
          item.category.toLowerCase(),
          "análise editorial",
          "afiliados",
        ],
        `/oportunidades/${item.slug}/`,
        "radar",
        content,
        false,
        "article",
      ),
    });
  }
  pages.push({
    route: "/fornecedores/",
    ...metadata(
      "Programas de afiliados e fontes | FARO",
      "Compare regras consultadas de Amazon, Mercado Livre e Shopee e veja por que fornecedor, marketplace e afiliado não são a mesma coisa.",
      [
        "programa de afiliados",
        "Amazon Associados",
        "Mercado Livre afiliados",
        "Shopee afiliados",
        "fornecedores",
      ],
      "/fornecedores/",
      "fornecedores",
      providersPage(partners),
    ),
  });
  pages.push({
    route: "/metodologia/",
    ...metadata(
      "Como o FARO avalia oportunidades | Score e fontes",
      "Entenda os pesos do score FARO, as faixas, as fontes usadas e as perguntas que ainda precisam ser validadas por produto.",
      [
        "metodologia de score",
        "pesquisa de produtos",
        "sinais de mercado",
        "fontes",
      ],
      "/metodologia/",
      "metodologia",
      methodologyPage(items),
    ),
  });
  pages.push({
    route: "/guias/primeiro-teste/",
    ...metadata(
      "Guia: validar produto como afiliado | FARO",
      "Roteiro de sete dias para testar conteúdo orgânico e intenção antes de comprar estoque, sem tratar visualizações como vendas.",
      [
        "validar produto afiliado",
        "teste de produto",
        "conteúdo orgânico",
        "afiliados",
      ],
      "/guias/primeiro-teste/",
      "guias",
      guidePage(),
      false,
      "article",
    ),
  });
  pages.push({
    route: "/sobre/",
    ...metadata(
      "Sobre o FARO: radar editorial de produtos",
      "Conheça o projeto de curadoria, as limitações da primeira rodada e o status genérico e provisório do nome FARO.",
      ["sobre FARO", "curadoria editorial", "radar de oportunidades"],
      "/sobre/",
      "",
      aboutPage(site),
    ),
  });
  pages.push({
    route: "/afiliados/",
    ...metadata(
      "Divulgação de afiliados e comissões | FARO",
      "Entenda quando o FARO pode receber comissão, como os links serão identificados e por que o vínculo não garante recomendação.",
      ["divulgação de afiliados", "comissões", "transparência"],
      "/afiliados/",
      "",
      disclosurePage(site),
    ),
  });
  pages.push({
    route: "/privacidade/",
    ...metadata(
      "Política de Privacidade | FARO",
      site.newsletterEnabled
        ? "Resumo sobre favoritos locais, formulário de newsletter configurado e analytics da hospedagem; revise a política antes da captação."
        : "Resumo inicial sobre favoritos locais, formulário de newsletter inativo, analytics da hospedagem e limites do protótipo FARO.",
      ["privacidade", "dados pessoais", "newsletter", "cookies"],
      "/privacidade/",
      "",
      privacyPage(site),
    ),
  });
  pages.push({
    route: "/termos/",
    ...metadata(
      "Termos de uso do radar FARO | Regras",
      "Termos editoriais do protótipo: fontes, estimativas, ofertas externas, painel local e nome genérico de trabalho.",
      ["termos de uso", "informação editorial", "marketplaces"],
      "/termos/",
      "",
      termsPage(),
    ),
  });
  pages.push({
    route: "/cookies/",
    ...metadata(
      "Cookies e métricas do site | FARO",
      "Veja o armazenamento local de favoritos, o uso de métricas na prévia Manus e o que muda na exportação estática.",
      ["cookies", "analytics", "métricas", "favoritos"],
      "/cookies/",
      "",
      cookiesPage(site),
    ),
  });
  pages.push({
    route: "/painel/",
    ...metadata(
      "Painel local de edição do catálogo | FARO",
      "Edite e exporte a base de oportunidades no navegador. Alterações locais não são publicadas nem salvas em servidor.",
      ["painel de edição", "JSON", "catálogo de produtos"],
      "/painel/",
      "",
      panelPage(),
      true,
    ),
  });
  pages.push({
    route: "/conectar-mercadolivre/",
    ...metadata(
      "Conectar Mercado Livre para busca | FARO",
      "Página de configuração OAuth do administrador FARO, com chave mantida no navegador apenas durante a sessão e conexão somente de leitura.",
      ["OAuth", "Mercado Livre", "integração privada"],
      "/conectar-mercadolivre/",
      "",
      mercadoLivreConnectPage(site),
      true,
    ),
  });
  pages.push({
    route: "/obrigado/",
    ...metadata(
      "Confirmação de inscrição FARO | Novidades",
      "Confirmação de envio do formulário de novidades, quando publicado e configurado no provedor Netlify.",
      ["newsletter", "FARO", "novidades"],
      "/obrigado/",
      "",
      thanksPage(),
      true,
    ),
  });

  for (const item of pages) {
    const target = routeFile(item.route);
    writeText(
      target,
      page(
        site,
        item.route === "/painel/" ||
        item.route === "/obrigado/" ||
        item.route === "/conectar-mercadolivre/"
          ? { ...item, noindex: true }
          : item,
        item.content,
      ),
    );
  }
  writeText(
    path.join(output, "404.html"),
    page(
      site,
      metadata(
        "Página não encontrada | FARO",
        "Esta rota não existe no site FARO. Volte ao radar para consultar as análises disponíveis.",
        ["FARO", "página não encontrada"],
        "/404.html",
        "",
        notFoundPage(),
        true,
      ),
    ),
  );
  const routes = JSON.parse(
    fs.readFileSync(path.join(root, "public/manus-routes.json"), "utf8"),
  );
  const generatedRoutes = new Set(pages.map((x) => x.route));
  for (const route of routes.routes) {
    if (route.path.includes(":")) continue;
    if (!generatedRoutes.has(route.path))
      throw new Error(`Rota declarada sem página: ${route.path}`);
  }
  for (const route of generatedRoutes) {
    if (
      route === "/obrigado/" ||
      route === "/painel/" ||
      route === "/conectar-mercadolivre/"
    )
      continue;
    if (route.startsWith("/oportunidades/")) continue;
    if (!routes.routes.some((x) => x.path === route))
      throw new Error(`Página sem rota declarada: ${route}`);
  }

  const publicOrigin = String(site.publicOrigin || "").replace(/\/$/, "");
  const crawlable = pages.filter(
    (x) => !x.noindex && x.route !== "/painel/" && x.route !== "/obrigado/",
  );
  if (publicOrigin) {
    const lastmod = site.researchDate || new Date().toISOString().slice(0, 10);
    const urls = crawlable
      .map(
        (x) =>
          `  <url><loc>${xmlEscape(publicOrigin + x.route)}</loc><lastmod>${xmlEscape(lastmod)}</lastmod><changefreq>monthly</changefreq></url>`,
      )
      .join("\n");
    writeText(
      path.join(output, "sitemap.xml"),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    );
  }
  writeText(
    path.join(output, "robots.txt"),
    `User-agent: *\nAllow: /\n${publicOrigin ? `Sitemap: ${publicOrigin}/sitemap.xml\n` : ""}`,
  );
  console.log(
    `Build concluído: ${pages.length} rotas HTML em dist/. Sitemap ${publicOrigin ? "gerado para origem configurada" : "omitido até configurar uma origem pública real"}.`,
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  buildSite();
