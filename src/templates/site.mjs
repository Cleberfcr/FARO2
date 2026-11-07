export const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const safeJson = (value) =>
  JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");

export function brandMark() {
  return `<svg class="brand-mark" viewBox="0 0 44 44" role="img" aria-label="Símbolo FARO" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 3.5 26.6 17.4 40.5 22l-13.9 4.6L22 40.5l-4.6-13.9L3.5 22l13.9-4.6L22 3.5Z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>
    <circle cx="22" cy="22" r="4.2" fill="currentColor"/>
    <path d="M22 10v5M34 22h-5M22 34v-5M10 22h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
}

export function header(active = "") {
  const links = [
    ["Radar", "/radar/", "radar"],
    ["Fornecedores", "/fornecedores/", "fornecedores"],
    ["Metodologia", "/metodologia/", "metodologia"],
    ["Guias", "/guias/primeiro-teste/", "guias"],
  ];
  return `<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
  <header class="site-header"><div class="header-inner wrap">
    <a class="brand" href="/" aria-label="FARO, página inicial">${brandMark()}<span class="brand-word">FARO<span class="brand-dot">.</span><small>RADAR DE OPORTUNIDADES</small></span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav"><span class="sr-only">Abrir menu</span><span class="menu-lines" aria-hidden="true"></span></button>
    <nav id="primary-nav" class="primary-nav" aria-label="Navegação principal"><div class="nav-links">${links.map(([label, href, id]) => `<a href="${href}"${active === id ? ' aria-current="page"' : ""}>${label}</a>`).join("")}</div><a class="button button-small button-dark nav-cta" href="/radar/">Explorar radar <span aria-hidden="true">↗</span></a></nav>
  </div></header>`;
}

export function footer(site) {
  return `<footer class="site-footer"><div class="wrap footer-grid">
    <div class="footer-brand"><a class="brand brand-footer" href="/">${brandMark()}<span class="brand-word">FARO<span class="brand-dot">.</span><small>RADAR DE OPORTUNIDADES</small></span></a><p>Curadoria editorial para descobrir possibilidades, entender os sinais e conferir o que ainda falta confirmar.</p></div>
    <div><h2 class="footer-heading">Explore</h2><a href="/radar/">Radar</a><a href="/fornecedores/">Programas e fontes</a><a href="/metodologia/">Como avaliamos</a><a href="/guias/primeiro-teste/">Guia de validação</a></div>
    <div><h2 class="footer-heading">Transparência</h2><a href="/afiliados/">Divulgação de afiliados</a><a href="/privacidade/">Privacidade</a><a href="/termos/">Termos de uso</a><a href="/cookies/">Cookies e métricas</a><a href="/sobre/">Sobre o FARO</a></div>
    <div class="footer-note"><span class="eyebrow">Nome de trabalho</span><p>FARO é um nome genérico provisório. Não representa uma marca liberada, domínio reservado ou perfil social confirmado.</p><p class="footer-disclosure">${escapeHtml(site.disclosure)}</p></div>
  </div><div class="wrap footer-bottom"><span>Pesquisa-base: ${escapeHtml(site.researchLabel)} · Conteúdo editorial, não garantia de venda.</span><a href="/painel/">Editar dados</a></div></footer>`;
}

export function opportunityCard(item, { compact = false } = {}) {
  const title = escapeHtml(item.title);
  const tags = (item.tags || [])
    .slice(0, 3)
    .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join("");
  const url = `/oportunidades/${encodeURIComponent(item.slug)}/`;
  const scoreLabel =
    item.score >= 70
      ? "Interessante · estimativa"
      : item.score >= 60
        ? "Precisa de validação"
        : "Baixa prioridade";
  return `<article class="opportunity-card${compact ? " opportunity-card-compact" : ""}" data-opportunity-card data-id="${escapeHtml(item.id)}" data-score="${Number(item.score)}" data-category="${escapeHtml(item.category)}" data-confidence="${escapeHtml(item.confidence)}" data-action="${escapeHtml(item.action)}">
    <div class="card-topline"><span class="opportunity-id">${escapeHtml(item.id)}</span><span class="status-pill">${escapeHtml(item.action)}</span></div>
    <div class="tag-row">${tags}</div>
    <h3><a href="${url}">${title}</a></h3>
    <p class="card-copy">${escapeHtml(item.need)}</p>
    <div class="score-line"><div><strong>${Number(item.score)}<small>/100</small></strong><span>Score editorial estimado</span></div><span class="confidence">Confiança ${escapeHtml(item.confidence.toLowerCase())}</span></div>
    <div class="score-track" role="img" aria-label="Score estimado ${Number(item.score)} de 100"><span style="width:${Math.max(0, Math.min(100, Number(item.score)))}%"></span></div>
    <p class="score-meaning">${scoreLabel}; não é previsão de vendas.</p>
    <div class="card-actions"><a class="text-link" href="${url}">Ver análise <span aria-hidden="true">↗</span></a><div class="card-tools"><button class="icon-button" type="button" data-favorite="${escapeHtml(item.id)}" aria-label="Salvar ${title}" aria-pressed="false" title="Salvar">♡</button><button class="compare-button" type="button" data-compare="${escapeHtml(item.id)}" aria-pressed="false">+ Comparar</button></div></div>
  </article>`;
}

export function renderPage({
  site,
  title,
  description,
  keywords = [],
  path,
  active = "",
  pageType = "website",
  noindex = false,
  content,
  includeApp = true,
}) {
  const publicOrigin = String(site.publicOrigin || "").replace(/\/$/, "");
  const canonical = /^https:\/\//i.test(publicOrigin)
    ? `${publicOrigin}${path}`
    : "";
  const heroAsset = site.heroImage || site.staticHeroImage;
  const hero =
    /^https:\/\//i.test(publicOrigin) && heroAsset
      ? `${publicOrigin}${heroAsset}`
      : "";
  const robots = noindex
    ? "noindex,nofollow"
    : "index,follow,max-image-preview:large";
  const keywordList = [
    ...new Set(keywords.map((x) => String(x).trim()).filter(Boolean)),
  ].slice(0, 8);
  let structured = "";
  if (canonical) {
    const schema =
      path === "/"
        ? {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "FARO — Radar de Oportunidades",
            url: canonical,
            description,
            inLanguage: "pt-BR",
            publisher: {
              "@type": "Organization",
              name: "FARO — nome genérico de trabalho",
              url: canonical,
            },
          }
        : {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: title,
            url: canonical,
            description,
            inLanguage: "pt-BR",
          };
    structured = `<script type="application/ld+json">${safeJson(schema)}</script>`;
  }
  const metaOrigin = canonical
    ? `<link rel="canonical" href="${escapeHtml(canonical)}"><meta property="og:url" content="${escapeHtml(canonical)}">`
    : "";
  const socialImage = hero
    ? `<meta property="og:image" content="${escapeHtml(hero)}"><meta name="twitter:image" content="${escapeHtml(hero)}">`
    : "";
  return `<!doctype html>
<html lang="pt-BR"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}">
  ${keywordList.length ? `<meta name="keywords" content="${escapeHtml(keywordList.join(", "))}">` : ""}
  <meta name="robots" content="${robots}"><meta name="theme-color" content="${escapeHtml(site.palette.forest)}">
  ${metaOrigin}<meta property="og:type" content="${escapeHtml(pageType)}"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:site_name" content="FARO — Radar de Oportunidades">
  <meta name="twitter:card" content="${socialImage ? "summary_large_image" : "summary"}"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(description)}">${socialImage}
  <link rel="icon" href="/assets/faro-mark.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/styles.css">
  ${structured}
</head><body data-page="${escapeHtml(active || "home")}">${header(active)}${content}${footer(site)}
  <div class="toast" id="site-toast" role="status" aria-live="polite"></div>
  ${includeApp ? '<script type="module" src="/assets/app.js"></script>' : ""}
</body></html>`;
}

export function sourceList(sources = []) {
  if (!sources.length)
    return '<p class="muted">Não há fonte específica adicional cadastrada para esta hipótese.</p>';
  return `<ul class="source-list">${sources.map((source) => `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title)} <span aria-hidden="true">↗</span></a><span>${escapeHtml(source.kind || "Fonte consultada")}</span></li>`).join("")}</ul>`;
}
