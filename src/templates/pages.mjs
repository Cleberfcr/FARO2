import { escapeHtml, opportunityCard, sourceList } from "./site.mjs";

const sectionLabel = (text) => `<p class="eyebrow">${escapeHtml(text)}</p>`;
const pill = (text, cls = "") =>
  `<span class="tag ${cls}">${escapeHtml(text)}</span>`;
const cta = (label, href, cls = "button button-dark") =>
  `<a class="${cls}" href="${href}">${escapeHtml(label)} <span aria-hidden="true">↗</span></a>`;
const list = (items, cls = "") =>
  `<ul class="${cls}">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;

export function homePage(site, items) {
  const newsletterReady =
    site.newsletterEnabled === true &&
    site.newsletterProvider === "netlify" &&
    Boolean(site.legalName && site.contactEmail);
  const heroImage = site.heroImage || site.staticHeroImage;
  const priorities = ["C01", "C02", "C06"]
    .map((id) => items.find((x) => x.id === id))
    .filter(Boolean);
  return `<main id="conteudo">
    <section class="hero wrap">
      <div class="hero-copy">${sectionLabel("UM FARO PARA OFERTAS · CONTEXTO ANTES DA COMPRA")}
        <h1>Um faro para ofertas.<br><em>Critério para decidir.</em></h1>
        <p class="hero-intro">O Perdigueiro FARO segue pistas de produtos interessantes. A curadoria separa sinal, hipótese e o que ainda falta confirmar — sem transformar uma oferta em promessa de venda.</p>
        <form class="search-box hero-search" data-search-form action="/radar/" method="get">
          <label class="sr-only" for="hero-query">Busque uma categoria ou necessidade</label><span class="search-icon" aria-hidden="true">⌕</span>
          <input id="hero-query" name="q" type="search" placeholder="Ex.: produto para pet em apartamento" autocomplete="off">
          <button class="button button-dark" type="submit">Buscar <span aria-hidden="true">↗</span></button>
        </form>
        <div class="intent-row"><span>Experimente:</span><button type="button" data-suggest="produto viral para cozinha">produto para cozinha</button><button type="button" data-suggest="produto para pet">pet</button><button type="button" data-suggest="produto com alta comissão">alta comissão</button></div>
        <div class="hero-proof"><span class="proof-dot"></span><span>8 famílias avaliadas</span><span class="proof-divider">·</span><span>todas em <strong>ANALISAR</strong></span></div>
      </div>
      <div class="hero-art" aria-label="Ilustração editorial da mascote Perdigueiro FARO seguindo pistas abstratas de oferta">
        <div class="hero-art-frame"><img src="${escapeHtml(heroImage)}" alt="Ilustração da mascote Perdigueiro FARO caminhando e farejando uma trilha de etiquetas abstratas de oferta, sem preço ou produto real" fetchpriority="high" onerror="this.hidden=true">
          <div class="hero-art-fallback" aria-hidden="true"><span class="fallback-orbit orbit-one"></span><span class="fallback-orbit orbit-two"></span><span class="fallback-trail"></span><span class="fallback-offer-tag"></span><span class="fallback-dot"></span></div>
          <span class="image-caption">Mascote FARO · segue pistas, não promessas</span>
        </div><div class="hero-side-note"><span>01 / 08</span><span>Uma hipótese<br>não é uma promessa.</span></div>
      </div>
      <div class="hero-index">FARO <span>—</span> 2026</div>
    </section>

    <section class="signal-strip"><div class="wrap signal-strip-inner"><span class="signal-mark" aria-hidden="true">✳</span><p><strong>Uma primeira leitura, não uma lista de “mais vendidos”.</strong> Ainda não há preço, estoque, vendas ou comissão confirmados por SKU.</p><a href="/metodologia/">Como ler os sinais <span aria-hidden="true">↗</span></a></div></section>

    <section class="section wrap" aria-labelledby="priority-heading"><div class="section-head"><div>${sectionLabel("PRIMEIRAS HIPÓTESES")}<h2 id="priority-heading">Por onde vale a pena olhar.</h2><p>Três categorias para um teste de conteúdo orgânico — cada uma com riscos e lacunas visíveis.</p></div>${cta("Ver as 8 oportunidades", "/radar/", "button button-outline")}</div>
      <div class="card-grid card-grid-three">${priorities.map((item) => opportunityCard(item, { compact: true })).join("")}</div>
    </section>

    <section class="section section-ink"><div class="wrap method-band"><div>${sectionLabel("A DIFERENÇA FARO")}<h2>Não escondemos o que<br> ainda não sabemos.</h2></div><div class="method-band-copy"><p>Cada oportunidade mostra a fonte, o score estimado, a confiança e as perguntas em aberto. O catálogo é editorial — não é um feed de marketplace nem uma promessa de renda.</p>${cta("Entender a metodologia", "/metodologia/", "button button-lime")}</div><div class="method-stamp"><span>NOTA</span><strong>77</strong><small>C01 · ESTIMATIVA<br>0–100</small></div></div></section>

    <section class="section wrap"><div class="section-head"><div>${sectionLabel("BUSCA POR INTENÇÃO")}<h2>Comece pelo problema,<br>não pelo hype.</h2><p>Escreva uma categoria, necessidade ou contexto. A busca editorial consulta a base curada; quando o OAuth estiver autorizado e testado, outra área consulta anúncios do Mercado Livre. Anúncio não significa venda confirmada nem link afiliado.</p></div></div>
      <div class="intent-grid"><button data-suggest="produto viral para cozinha"><span class="intent-no">01</span><strong>“Algo para organizar a cozinha”</strong><span>Correspondência aproximada; confirme medidas e uso.</span><b aria-hidden="true">↗</b></button><button data-suggest="produto para pet em apartamento"><span class="intent-no">02</span><strong>“Uma ideia para pet em apartamento”</strong><span>Veja enriquecimento e critérios de segurança.</span><b aria-hidden="true">↗</b></button><button data-suggest="produto com alta comissão"><span class="intent-no">03</span><strong>“Quero comparar comissão”</strong><span>Taxas por SKU não estão confirmadas.</span><b aria-hidden="true">↗</b></button></div>
    </section>

    <section class="newsletter-section"><div class="wrap newsletter-grid"><div>${sectionLabel("NOVIDADES, SEM PRESSA")}<h2>Receba novas leituras<br>do radar.</h2><p>${newsletterReady ? "Inscrições são processadas pelo Netlify Forms na publicação. Confira a Política de Privacidade antes de enviar." : "O formulário permanece desativado até o operador informar responsável legal, contato válido e revisar privacidade e retenção. Na prévia, nada é enviado."}</p></div>
      <form class="newsletter-form" ${newsletterReady ? 'name="faro-newsletter" method="POST" action="/obrigado/" data-netlify="true" netlify-honeypot="bot-field"' : 'aria-disabled="true"'} data-newsletter-form>
        ${newsletterReady ? '<input type="hidden" name="form-name" value="faro-newsletter"><p class="hidden-field"><label>Não preencha <input name="bot-field"></label></p>' : '<p class="micro">Captação desativada até completar a identificação e o contato do controlador.</p>'}
        <label for="newsletter-email">Seu e-mail</label><div class="newsletter-input-row"><input id="newsletter-email" name="email" type="email" placeholder="voce@exemplo.com" autocomplete="email" ${newsletterReady ? "required" : "disabled"}><button class="button button-dark" type="submit" ${newsletterReady ? "" : "disabled"}>Quero receber <span aria-hidden="true">↗</span></button></div>
        <label class="consent-label"><input type="checkbox" name="consent" ${newsletterReady ? "required" : "disabled"}><span>Concordo em receber novidades editoriais do FARO e li a <a href="/privacidade/">Política de Privacidade</a>.</span></label><p class="form-message" data-form-message aria-live="polite">${newsletterReady ? "A inscrição será processada pelo Netlify após a publicação." : "Prévia: nenhum dado é enviado ou armazenado."}</p>
      </form>
    </div></section>
  </main>`;
}

export function radarPage(items) {
  const categories = [...new Set(items.map((x) => x.category))].sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );
  return `<main id="conteudo" class="wrap page-main" data-radar><header class="page-hero page-hero-slim">${sectionLabel("RADAR · 08 FAMÍLIAS")}<h1>Uma lista para investigar,<br><em>não para comprar no escuro.</em></h1><p>Os scores são estimativas de categoria. Preço, estoque, quantidade vendida, avaliações por SKU e comissão efetiva ainda não foram confirmados.</p><div class="page-stat-row"><span><b>08</b> oportunidades</span><span><b>00</b> SKUs validados</span><span><b>ANALISAR</b> todas</span></div></header>
    <section class="radar-panel" aria-label="Pesquisar e filtrar oportunidades"><div class="radar-search-row"><label for="radar-query">Buscar no catálogo curado</label><div class="search-box"><span class="search-icon" aria-hidden="true">⌕</span><input id="radar-query" type="search" placeholder="Ex.: pet, cozinha ou cabelo"><button id="clear-search" class="clear-search" type="button" aria-label="Limpar busca">Limpar</button></div></div>
      <div class="filter-row"><label>Categoria<select id="filter-category"><option value="">Todas as categorias</option>${categories.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("")}</select></label><label>Score mínimo<select id="filter-score"><option value="0">Qualquer score</option><option value="60">60+</option><option value="70">70+</option><option value="80">80+</option></select></label><label>Confiança<select id="filter-confidence"><option value="">Todas</option><option value="Média">Média</option><option value="Baixa">Baixa</option></select></label><label>Ordenar<select id="filter-sort"><option value="score">Score alto → baixo</option><option value="score-asc">Score baixo → alto</option><option value="demand">Sinal de demanda</option><option value="viral">Potencial visual</option><option value="commission">Comissão potencial*</option></select></label></div>
      <p class="search-caveat"><strong>*Comissão potencial</strong> é um componente editorial do score, não uma taxa de afiliado. “Vendendo muito” não retorna unidades de venda quando não há dados por SKU.</p>
    </section>
    <section class="marketplace-search" data-marketplace-search aria-labelledby="marketplace-search-title"><div class="marketplace-search-header"><div>${sectionLabel("CATÁLOGO EXTERNO · SOMENTE LEITURA")}<h2 id="marketplace-search-title">Busca automática de anúncios</h2><p>Digite no campo acima. Quando a conexão estiver autorizada e testada, o FARO consulta o Mercado Livre e carrega as páginas conforme a API permitir. Não é uma busca literalmente infinita.</p></div><p id="marketplace-connection-status" class="marketplace-status" role="status" aria-live="polite">Verificando a integração…</p></div><p id="marketplace-results-status" class="marketplace-results-status" role="status" aria-live="polite"></p><div id="marketplace-results" class="marketplace-results"></div><button id="marketplace-load-more" class="button button-outline button-small" type="button" hidden>Carregar mais anúncios</button><p class="micro">A listagem não confirma vendas, estoque final, avaliação, elegibilidade afiliada, comissão ou recomendação. O link abre o anúncio do marketplace e não é link afiliado configurado pelo FARO.</p></section>
    <div class="radar-results-head"><p id="result-count" aria-live="polite">${items.length} oportunidades na base curada</p><button id="open-compare" class="button button-outline button-small" type="button" disabled>Comparar selecionadas <span id="compare-count">0/3</span></button></div>
    <div id="radar-results" class="card-grid card-grid-three">${items.map((item) => opportunityCard(item)).join("")}</div><p id="empty-results" class="empty-state" hidden>Nenhuma correspondência exata. Tente outro termo ou amplie os filtros.<a href="/metodologia/">Veja como funciona a busca.</a></p>
    <section class="inline-note"><span class="note-symbol" aria-hidden="true">i</span><p><strong>Dados atualizados: ${escapeHtml(items[0]?.updated || "não informado")}.</strong> Páginas externas, regras de programa, preço e oferta podem mudar. Acesse a fonte antes de decidir.</p></section>
  </main><dialog id="compare-dialog" class="compare-dialog"><div class="dialog-head"><div><p class="eyebrow">COMPARADOR</p><h2>Compare os critérios.</h2></div><button class="icon-button close-dialog" type="button" aria-label="Fechar comparador">×</button></div><div id="compare-table"></div><p class="compare-disclaimer">Os scores e a confiança são estimativas editoriais. Não representam venda, avaliação de cliente nem garantia.</p></dialog>`;
}

const metricLabels = [
  ["demand", "Demanda", 20],
  ["trend", "Tendência", 15],
  ["viral", "Potencial de viralização", 15],
  ["commission", "Comissão/margem potencial", 15],
  ["competition", "Concorrência (nota maior = condição melhor)", 10],
  ["reputation", "Reputação/prova social", 10],
  ["promotion", "Facilidade de divulgação", 5],
  ["availability", "Disponibilidade", 5],
  ["repurchase", "Potencial de recompra", 5],
];
export function detailPage(item, site) {
  const m = item.metrics;
  const metrics = metricLabels
    .map(
      ([key, label, max]) =>
        `<div class="metric-row"><div><span>${escapeHtml(label)}</span><strong>${Number(m[key])}<small>/${max}</small></strong></div><div class="metric-bar"><span style="width:${Math.max(0, Math.min(100, (Number(m[key]) / max) * 100))}%"></span></div></div>`,
    )
    .join("");
  const src = sourceList(item.sources);
  const offer = item.offer;
  const showOffer =
    site?.affiliateLinksConfigured === true &&
    item.action === "COMPRAR" &&
    offer?.ownerVerified === true &&
    Boolean(
      offer.sku &&
      offer.price &&
      offer.marketplace &&
      offer.verifiedAt &&
      /^https:\/\//.test(offer.productUrl || "") &&
      /^https:\/\//.test(offer.affiliateUrl || ""),
    );
  const commercePanel = showOffer
    ? `<div class="buy-placeholder offer-card"><span class="eyebrow">OFERTA POR SKU · INFORMADA PELO EDITOR</span><h3>${escapeHtml(offer.sku)}</h3><dl class="offer-details"><dt>Marketplace</dt><dd>${escapeHtml(offer.marketplace)}</dd><dt>Preço observado</dt><dd>${escapeHtml(offer.price)}</dd>${offer.seller ? `<dt>Vendedor</dt><dd>${escapeHtml(offer.seller)}</dd>` : ""}${offer.rating ? `<dt>Avaliação</dt><dd>${escapeHtml(offer.rating)}${offer.reviewCount ? ` · ${escapeHtml(offer.reviewCount)} avaliações` : ""}</dd>` : ""}${offer.commission ? `<dt>Comissão informada</dt><dd>${escapeHtml(offer.commission)}</dd>` : ""}${offer.stock ? `<dt>Estoque/entrega</dt><dd>${escapeHtml(offer.stock)}</dd>` : ""}<dt>Conferido em</dt><dd>${escapeHtml(offer.verifiedAt)}</dd></dl><p class="micro">Dados conferidos e fornecidos pelo editor, não por uma integração em tempo real. Podem mudar.</p><a class="button button-dark offer-cta" href="${escapeHtml(offer.affiliateUrl)}" target="_blank" rel="sponsored nofollow noopener noreferrer">Ver oferta afiliada <span aria-hidden="true">↗</span></a><p class="micro">${escapeHtml(site?.disclosure || "Este site pode receber comissão por compras qualificadas.")}</p><a class="offer-source-link" href="${escapeHtml(offer.productUrl)}" target="_blank" rel="noopener noreferrer">Abrir página do produto</a><div class="detail-actions"><button class="button button-outline button-small" type="button" data-share>Compartilhar análise</button><button class="button button-outline button-small" type="button" data-favorite="${escapeHtml(item.id)}" aria-pressed="false">♡ Salvar no navegador</button></div></div>`
    : `<div class="buy-placeholder"><span class="eyebrow">COMPRA</span><h3>SKU e link ainda não confirmados.</h3><p>O FARO não apresenta preço, estoque ou CTA de compra sem verificar produto e link afiliado elegível.</p><span class="disabled-link" aria-disabled="true">Link de compra indisponível</span><p class="micro">Estado da recomendação: <strong>${escapeHtml(item.action)}</strong></p><button class="button button-outline button-small" type="button" data-share>Compartilhar análise</button><button class="button button-outline button-small" type="button" data-favorite="${escapeHtml(item.id)}" aria-pressed="false">♡ Salvar no navegador</button></div>`;
  return `<main id="conteudo" class="wrap page-main opportunity-detail" data-detail-id="${escapeHtml(item.id)}"><nav class="breadcrumbs" aria-label="Trilha de navegação"><a href="/">Início</a><span aria-hidden="true">/</span><a href="/radar/">Radar</a><span aria-hidden="true">/</span><span aria-current="page">${escapeHtml(item.id)}</span></nav>
    <header class="detail-header"><div class="detail-heading">${sectionLabel(`${item.id} · ${item.category.toUpperCase()}`)}<h1>${escapeHtml(item.title)}</h1><p>${escapeHtml(item.need)}</p><div class="tag-row">${(item.tags || []).map((t) => pill(t)).join("")}</div></div><div class="detail-score"><span class="status-pill">${escapeHtml(item.action)}</span><strong>${Number(item.score)}<small>/100</small></strong><span>Score editorial estimado</span><span class="confidence">Confiança ${escapeHtml(item.confidence.toLowerCase())}</span><p>Última revisão: ${escapeHtml(item.updated)}</p></div></header>
    <div class="detail-layout"><div class="detail-main"><section class="detail-section"><h2>Por que esta família está no radar?</h2><p>${escapeHtml(item.rationale)}</p><div class="caution-box"><strong>O que este score não diz</strong><p>Não representa vendas, conversão, avaliação de clientes nem probabilidade de lucro. É uma priorização editorial baseada nos sinais disponíveis na data acima.</p></div></section>
      <section class="detail-section"><h2>Sinais identificados</h2>${list(item.signals, "signal-list")}</section><section class="detail-section"><h2>Para quem e para qual necessidade?</h2><p><strong>Público de hipótese:</strong> ${escapeHtml(item.audience)}</p><p><strong>Necessidade:</strong> ${escapeHtml(item.need)}</p><p><strong>Problema:</strong> ${escapeHtml(item.problem)}</p></section>
      <section class="detail-section"><h2>O que poderia virar conteúdo</h2><p>${escapeHtml(item.contentPotential)}</p>${list(item.contentPlan, "content-ideas")}</section>
      <section class="detail-section"><h2>Riscos e perguntas em aberto</h2><h3>Riscos a observar</h3>${list(item.risks, "risk-list")}<h3>Não foi possível confirmar</h3>${list(item.unknowns, "unknown-list")}</section>
      <section class="detail-section"><h2>Fontes consultadas</h2><p>As fontes de fabricante ou marketplace mostram que há páginas/categorias, não que este FARO tenha testado o item nem que haja estoque atual.</p>${src}</section></div>
      <aside class="detail-aside"><div class="score-card"><span class="eyebrow">DECOMPOSIÇÃO DO SCORE</span>${metrics}<p class="metric-footnote">Pesos: Demanda 20; Tendência 15; Viralização 15; Comissão/margem 15; Concorrência 10; Reputação/prova social 10; Divulgação 5; Disponibilidade 5; Recompra 5. Concorrência: nota mais alta significa condição mais favorável após ajuste.</p></div>${commercePanel}</aside></div>
    <section class="detail-related"><div><p class="eyebrow">PRÓXIMO PASSO</p><h2>Compare antes de priorizar.</h2></div>${cta("Voltar ao radar", "/radar/", "button button-dark")}</section>
  </main>`;
}

export function providersPage(partners) {
  return `<main id="conteudo" class="wrap page-main"><header class="page-hero">${sectionLabel("PROGRAMAS · MARKETPLACES · FORNECEDORES")}<h1>Quem intermedeia<br><em>também precisa de evidência.</em></h1><p>Programas de afiliados não são fornecedores. As taxas abaixo foram transcritas do relatório de pesquisa de 06/11/2026 e precisam ser reconfirmadas no painel antes de publicar links.</p></header><div class="provider-warning"><strong>Não há fornecedor independente de dropshipping validado.</strong><span>As páginas de produto encontradas são referências de marca ou marketplace. Reputação, estoque, prazo, qualidade e elegibilidade por SKU continuam pendentes.</span></div>
    <section class="provider-grid">${partners.map((p) => `<article class="provider-card"><div class="provider-card-top"><span class="provider-type">${escapeHtml(p.type)}</span><span class="status-pill">${escapeHtml(p.status.split(";")[0])}</span></div><h2>${escapeHtml(p.name)}</h2><div class="rate-list">${p.reportedRates.map((r) => `<div><span>${escapeHtml(r.category)}</span><strong>${escapeHtml(r.rate)}</strong></div>`).join("")}</div><dl class="provider-details"><dt>Atribuição</dt><dd>${escapeHtml(p.attribution)}</dd><dt>Pagamento e qualificação</dt><dd>${escapeHtml(p.payout)}</dd><dt>Limites e riscos</dt><dd>${escapeHtml(p.risk)}</dd></dl><div class="provider-links"><a href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer">Página oficial <span aria-hidden="true">↗</span></a><a href="${escapeHtml(p.termsUrl)}" target="_blank" rel="noopener noreferrer">Termos consultados <span aria-hidden="true">↗</span></a></div><p class="micro">Referência consultada em ${escapeHtml(p.sourceDate)}. Valores reportados, não promessa de comissão nem verificação de conta.</p></article>`).join("")}</section>
    <section class="section provider-bottom"><div>${sectionLabel("FORNECEDORES DIRETOS")}<h2>O que ainda precisa acontecer.</h2></div><div><p>Para classificar um fornecedor: verificar identidade jurídica e canal oficial, reputação em fontes independentes, política de devolução, estoque, prazos, notas fiscais, garantia, possibilidade de revenda/dropshipping e custo total entregue. Nenhum fornecedor recebe selo FARO sem essas verificações.</p><p>As fontes de produto estão listadas em cada oportunidade. São páginas de referência; não são vínculos comerciais do FARO.</p>${cta("Ver a metodologia", "/metodologia/", "button button-outline")}</div></section>
  </main>`;
}

export function methodologyPage(items) {
  const criteria = [
    ["Demanda", 20],
    ["Tendência", 15],
    ["Potencial de viralização", 15],
    ["Comissão/margem potencial", 15],
    ["Concorrência", 10],
    ["Reputação/prova social", 10],
    ["Facilidade de divulgação", 5],
    ["Disponibilidade", 5],
    ["Potencial de recompra", 5],
  ];
  return `<main id="conteudo" class="wrap page-main"><header class="page-hero">${sectionLabel("METODOLOGIA FARO")}<h1>Um número ajuda a comparar.<br><em>Não prevê o que vai vender.</em></h1><p>O radar organiza hipóteses e sinais públicos. Cada família precisa de validação de SKU, vendedor, preço, estoque, comissão e conteúdo antes de virar recomendação de compra.</p></header>
    <section class="method-intro-grid"><div><span class="big-index">01</span><h2>Produto → demanda → viabilidade.</h2></div><div><p>A avaliação inicial percorreu Produto → Demanda → Tendência → Concorrência → Monetização → Conteúdo → Tráfego → Conversão → Viabilidade. Se um sinal for apenas indireto, não o chamamos de venda.</p><p>Os dados-base são de 06/11/2026. Sites de marketplace mudam e alguns bloqueiam leitura automatizada; ausência de confirmação não significa ausência de oferta.</p></div></section>
    <section class="method-score"><div><p class="eyebrow">PONTUAÇÃO 0–100</p><h2>Nove dimensões<br>com pesos explícitos.</h2><p>Faixas: 90–100 excepcional; 80–89 muito forte; 70–79 interessante; 60–69 precisa validar; abaixo de 60 baixa prioridade. Nenhuma oportunidade está liberada para “COMPRAR”.</p></div><div class="weight-table">${criteria.map(([label, weight]) => `<div><span>${escapeHtml(label)}</span><b>${weight}</b></div>`).join("")}<div class="weight-total"><span>Total</span><b>100</b></div></div></section>
    <section class="section"><div class="section-head"><div>${sectionLabel("LEITURA DO RADAR")}<h2>Três etiquetas, três estados.</h2></div></div><div class="state-grid"><article><span class="status-pill status-buy">COMPRAR</span><h3>Exige prova.</h3><p>Não usar até confirmar oferta e link elegível por SKU. Nenhum item está nesta condição.</p></article><article><span class="status-pill">ANALISAR</span><h3>Estado atual.</h3><p>Há um sinal para investigar, mas faltam dados de oferta, comissão, preço, disponibilidade, reputação ou resultado.</p></article><article><span class="status-pill status-avoid">EVITAR</span><h3>Decisão fundamentada.</h3><p>Usar quando riscos, restrições ou falta de evidência superarem o benefício potencial; rever se surgirem novos fatos.</p></article></div></section>
    <section class="section methodology-evidence"><div><p class="eyebrow">MATRIZ EM ABERTO</p><h2>O que falta confirmar por SKU.</h2></div><div class="unknown-columns"><div><h3>Marketplace</h3><p>Preço, vendedor, estoque, avaliação, quantidade de avaliações, frete, prazo, devolução e disponibilidade.</p></div><div><h3>Afiliado</h3><p>Aprovação da conta, link, categoria, comissão real, janela, validação e restrições do canal.</p></div><div><h3>Conteúdo</h3><p>Interesse, retenção, cliques, CTR, leads, conversão, devoluções e comissão atribuída.</p></div></div></section>
    <section class="section"><div class="section-head"><div>${sectionLabel("FONTES")}<h2>Comece pelos dados, depois pelo vídeo.</h2><p>As fontes por categoria estão nas fichas. Esta primeira pesquisa usou documentos setoriais, páginas oficiais, marketplaces e fontes públicas brasileiras.</p></div>${cta("Abrir oportunidades", "/radar/", "button button-dark")}</div><p class="last-reviewed">Base: ${escapeHtml(items[0]?.updated || "06/11/2026")} · Score editorial revisável, não garantia de resultado.</p></section>
  </main>`;
}

export function guidePage() {
  return `<main id="conteudo" class="wrap page-main"><article class="guide-article"><header class="page-hero">${sectionLabel("GUIA PRÁTICO · PRIMEIRO TESTE")}<h1>Valide com conteúdo<br><em>antes de comprar estoque.</em></h1><p>Um roteiro de sete dias para aprender se uma categoria merece mais investigação, sem tratar visualizações como vendas.</p></header>
    <div class="guide-callout"><strong>Escopo do teste</strong><p>Escolha uma única família e no máximo três SKUs elegíveis. Só avance quando preço, vendedor, estoque, regras e links estiverem conferidos no dia da publicação.</p></div>
    <section class="guide-days">${[
      [
        "01",
        "Delimite o produto",
        "Escolha três SKUs que resolvam a mesma necessidade. Registre vendedor, preço, estoque, frete, avaliações e comissão, com data e URL.",
      ],
      [
        "02",
        "Leia as objeções",
        "Anote o que a pessoa precisa saber: tamanho, material, uso, manutenção, devolução, segurança e para quem não serve.",
      ],
      [
        "03",
        "Escreva três ganchos",
        "Crie ângulos diferentes de demonstração. Evite “viral”, “mais vendido” ou promessa de resultado sem evidência.",
      ],
      [
        "04",
        "Grave com transparência",
        "Use produto real, luz e ângulo consistentes. Identifique publicidade/afiliado quando aplicável. Se não testou, diga que não testou.",
      ],
      [
        "05",
        "Publique sem impulsionar",
        "Experimente TikTok, Reels e Shorts de forma orgânica; confirme as regras de disclosure e link em cada canal.",
      ],
      [
        "06",
        "Meça sinais de intenção",
        "Registre alcance, retenção quando disponível, cliques rastreados e perguntas recorrentes. Views não equivalem a pedidos.",
      ],
      [
        "07",
        "Decida e documente",
        "Continue, ajuste ou pare. Registre qual hipótese mudou e confira comissão validada, devoluções e cliques no painel do programa.",
      ],
    ]
      .map(
        ([day, title, desc]) =>
          `<article><span>${day}</span><div><h2>${title}</h2><p>${desc}</p></div></article>`,
      )
      .join("")}</section>
    <section class="guide-metrics"><div><h2>O que registrar</h2><p>Data da medição, plataforma, conteúdo, visualizações, retenção, cliques, CTR, leads, pedidos validados, comissão aprovada e devoluções. Use “não disponível” quando o painel não mostrar.</p></div><div><h2>O que não concluir</h2><p>Não trate viralização, curtidas, estimativas de ferramenta ou preço observado uma vez como procura contínua, lucro ou promessa de venda futura.</p></div></section>
    <p class="guide-footnote">Programa, canal e regra podem mudar. Reconfirme no termo oficial antes de cada campanha.</p>${cta("Ver prioridades do radar", "/radar/", "button button-dark")}</article></main>`;
}

export function aboutPage(site) {
  return `<main id="conteudo" class="wrap page-main"><header class="page-hero">${sectionLabel("SOBRE O PROJETO")}<h1>O FARO procura contexto.<br><em>Não promete atalhos.</em></h1><p>Um projeto editorial de curadoria de oportunidades digitais, ainda em validação, que separa sinais públicos de dados de venda e recomenda o próximo passo sem ocultar incertezas.</p></header><section class="about-grid"><div><span class="about-mark">F</span></div><div><h2>O que somos.</h2><p>Uma interface para organizar famílias de produtos, analisar sinais e transformar a pesquisa em conteúdo útil. A primeira rodada foi feita em 06/11/2026 e prioriza beleza capilar/labial como hipótese de teste.</p><h2>O que ainda não somos.</h2><p>Não somos varejista, fabricante, laboratório de testes nem promessa de renda. A busca Mercado Livre está em integração e ainda não tem conta conectada; só será liberada depois de OAuth e de um teste autorizado. Acesso experimental não confirma vendas, comissão afiliada, elegibilidade ou estabilidade futura da API.</p><h2>Sobre o nome.</h2><p>FARO é um nome genérico de trabalho escolhido pelo usuário em 07/11/2026. Nenhuma checagem desta página constitui liberação jurídica, registro, domínio, username ou disponibilidade comercial.</p></div></section><section class="about-values"><div><strong>01</strong><h3>Contexto</h3><p>Fonte e data perto da afirmação.</p></div><div><strong>02</strong><h3>Clareza</h3><p>Hipótese e dado comprovado nunca se confundem.</p></div><div><strong>03</strong><h3>Critério</h3><p>O score organiza prioridade; não decide pelo visitante.</p></div></section><p class="last-reviewed">${escapeHtml(site.description)}</p></main>`;
}

export function disclosurePage(site) {
  const affiliateMode =
    site?.affiliateLinksConfigured === true
      ? "A exibição global de links afiliados está habilitada. Apenas oportunidades marcadas COMPRAR com dados por SKU conferidos pelo editor podem exibir um CTA. O FARO não consulta o programa afiliado em tempo real."
      : "A exibição global de links está desabilitada. Nenhum CTA de compra será mostrado, mesmo que exista uma oferta no arquivo de dados.";
  return `<main id="conteudo" class="wrap page-main policy-page"><header class="page-hero">${sectionLabel("TRANSPARÊNCIA")}<h1>Afiliados: sem letra miúda.</h1><p>Como o FARO pode receber remuneração e o que esse vínculo não significa.</p></header><section><h2>Estado atual</h2><p>${escapeHtml(site.disclosure)}</p><p>${affiliateMode}</p></section><section><h2>Quando houver um link</h2><p>Um link será identificado como afiliado antes de o visitante sair do site. A possibilidade de comissão não altera a pontuação nem garante recomendação favorável. A decisão editorial deve considerar riscos e adequação do produto.</p></section><section><h2>Preços e disponibilidade</h2><p>Preço, avaliação, estoque, prazo, frete, vendedor e comissão variam. Sem uma verificação datada, a página dirá “Não foi possível confirmar.” O visitante deve conferir a oferta final no marketplace.</p></section><section><h2>Parcerias e testes</h2><p>Uma página de marketplace, fabricante ou programa não prova que o FARO recebeu amostra, comprou, testou ou foi pago. O site só alegará teste próprio após realizar e documentar um teste.</p></section><p class="policy-update">Estado da divulgação: 07/11/2026. Atualizar esta página quando qualquer vínculo comercial for habilitado.</p></main>`;
}
export function privacyPage(site) {
  const hasLegalContact = Boolean(site.legalName && site.contactEmail);
  const identityMessage = hasLegalContact
    ? `<p><strong>Responsável informado:</strong> ${escapeHtml(site.legalName)}. <strong>Contato para privacidade:</strong> ${escapeHtml(site.contactEmail)}. O operador deve confirmar que estes dados estão corretos e manter este canal ativo.</p>`
    : `<p>Este projeto está em fase de protótipo e ainda não apresenta a identificação legal completa e o contato de privacidade do controlador. Preencha ambos em <code>content/site.json</code> e revise esta política antes de ativar captação.</p>`;
  const intro = hasLegalContact
    ? "A identificação do controlador foi informada pelo operador; a política ainda deve ser revisada para refletir as práticas reais antes de qualquer captação."
    : "Resumo inicial para o protótipo editorial. A identidade legal do controlador e contatos ainda precisam ser preenchidos pelo operador antes de ativar captação.";
  const newsletterStatus =
    site.newsletterEnabled === true
      ? "O formulário está habilitado no site estático e envia inscrições ao Netlify Forms. Confirme a configuração, a finalidade, a retenção, o acesso, a segurança, o consentimento, o descadastro e o atendimento de pedidos antes de divulgar a captação."
      : "A captação fica desativada por padrão. Só ative após informar a identidade legal e contato do controlador, revisar finalidade, retenção, acesso, segurança, consentimento, descadastro e atendimento de pedidos; depois configure e teste Netlify Forms.";
  return `<main id="conteudo" class="wrap page-main policy-page"><header class="page-hero">${sectionLabel("PRIVACIDADE")}<h1>Dados mínimos,<br><em>expectativas claras.</em></h1><p>${intro}</p></header>
    <section><h2>Quem controla os dados</h2>${identityMessage}<p>O operador deve revisar este documento para a operação real antes do lançamento comercial.</p></section>
    <section><h2>Favoritos e comparação</h2><p>Favoritos ficam no armazenamento local deste navegador. A comparação existe apenas na sessão e não sincroniza entre dispositivos. Não inserir dados pessoais no painel editorial local.</p></section>
    <section><h2>Busca Mercado Livre</h2><p>Quando a integração estiver conectada e habilitada, o termo de busca digitado será enviado ao backend FARO e encaminhado à API do Mercado Livre para retornar anúncios. O FARO não grava a consulta ou resultados no banco do projeto; o provedor de hospedagem pode processar metadados de requisição conforme sua própria política.</p><p>Somente para a conexão administrativa, o FARO guarda access/refresh tokens cifrados com AES-256-GCM em banco gerenciado compartilhado entre desenvolvimento e produção. A chave de cifragem e a chave administrativa ficam em secrets do servidor, não no navegador, no HTML nem no Git. O status não expõe tokens nem dados da conta. A autorização pode ser removida localmente no painel e deve também ser revogada na conta Mercado Livre.</p></section>
    <section><h2>Newsletter</h2><p>${newsletterStatus} O formulário solicita consentimento explícito; o operador deve fornecer um processo de descadastro válido.</p></section>
    <section><h2>Analytics e hospedagem</h2><p>${escapeHtml(site.privacyNote)} A prévia Manus pode incluir métricas da plataforma conforme configuração do projeto. O ZIP estático não inclui por conta própria um script de analytics. Consulte as políticas dos provedores efetivamente escolhidos.</p></section>
    <section><h2>Links externos</h2><p>Ao abrir anúncio, marketplace, rede social ou fonte, passam a valer os avisos e políticas desses serviços. Anúncios retornados pela API não são links afiliados do FARO e o FARO não controla cookies, anúncios, checkout ou tratamento desses serviços.</p></section>
    <section><h2>Cookies, contato e revisão</h2><p>O código FARO não define cookies próprios de publicidade. Favoritos usam armazenamento local; a conexão OAuth redireciona ao Mercado Livre e usa estado temporário no servidor, sem cookie de sessão do visitante. O operador deve inserir contato válido, período de retenção, base legal e processo de direitos antes de captação real.</p></section>
    <p class="policy-update">Última revisão: 07/11/2026 · Documento-modelo do protótipo; requer revisão do operador antes da produção.</p></main>`;
}
export function termsPage() {
  return `<main id="conteudo" class="wrap page-main policy-page"><header class="page-hero">${sectionLabel("TERMOS DE USO")}<h1>Use o radar como<br><em>ponto de partida.</em></h1><p>Condições editoriais do protótipo FARO.</p></header><section><h2>Natureza do conteúdo</h2><p>O site organiza sinais e hipóteses com base em fontes públicas. Não é aconselhamento jurídico, financeiro, médico, veterinário ou profissional, nem garantia de demanda, desempenho, preço, comissão ou resultado comercial.</p></section><section><h2>Busca por API e anúncios</h2><p>A busca Mercado Livre depende de OAuth e disponibilidade da API, pode falhar e está sujeita a limites do provedor e do FARO. Resultados são anúncios retornados no momento da consulta, não prova de venda, estoque ou avaliação atual; o link é externo e não afiliado. Não há promessa de pesquisa infinita, renda ou compatibilidade futura.</p></section><section><h2>Atualidade e decisões</h2><p>Fontes externas e condições de marketplace mudam. O visitante deve confirmar preço final, vendedor, estoque, entrega, avaliação, política de devolução, elegibilidade e regras no serviço de origem antes de agir.</p></section><section><h2>Links de terceiros</h2><p>Sites externos têm termos próprios. Uma indicação de fonte não equivale a validação independente do produto nem endosso de todas as alegações de seus vendedores.</p></section><section><h2>Ferramentas administrativas</h2><p>O painel editorial <code>/painel/</code> guarda rascunhos apenas no navegador. A conexão Mercado Livre <code>/conectar-mercadolivre/</code> usa chave administrativa e mantém tokens criptografados no servidor; não compartilhe essa chave e use somente em HTTPS. O banco gerenciado é compartilhado entre Preview e produção. Revogue o app nas configurações da conta Mercado Livre quando quiser encerrar a autorização.</p></section><section><h2>Nome FARO</h2><p>FARO é nome genérico de trabalho; seu uso neste protótipo não afirma disponibilidade, registro, titularidade ou liberação de marca.</p></section><p class="policy-update">Documento inicial de protótipo, a ser revisado pelo operador antes do lançamento comercial.</p></main>`;
}

export function cookiesPage(site) {
  const newsletterStatus =
    site.newsletterEnabled === true
      ? "O formulário de newsletter está habilitado via Netlify Forms; revise a configuração real do provedor e a política antes de captar."
      : "A captação de e-mails está desativada por padrão e só deve ser ativada depois de configurar identidade legal, contato e privacidade.";
  return `<main id="conteudo" class="wrap page-main policy-page"><header class="page-hero">${sectionLabel("COOKIES E MÉTRICAS")}<h1>O que fica no seu navegador?</h1><p>Resumo do comportamento do protótipo e de sua hospedagem.</p></header><section><h2>Armazenamento local</h2><p>Favoritos podem ser guardados no localStorage deste navegador. Isso não é um cookie e não sincroniza entre aparelhos. Limpar os dados do navegador remove os favoritos.</p></section><section><h2>Cookies do protótipo</h2><p>O código FARO não instala cookies próprios de publicidade nem pixels de redes sociais. O fluxo OAuth salva estado temporário no banco para validar o callback e não cria cookie de sessão do visitante. ${newsletterStatus}</p></section><section><h2>Métricas da plataforma</h2><p>${escapeHtml(site.privacyNote)} A hospedagem Manus Preview está configurada com métricas de plataforma habilitadas no momento desta implementação; isso é separado do ZIP estático. Verifique o Dashboard e atualize este texto se alterar analytics ou provedor.</p></section><section><h2>Serviços externos</h2><p>Links de saída e buscas ao vivo podem transmitir informações aos marketplaces e aplicar tecnologias próprias. Veja a política do serviço antes de continuar.</p></section></main>`;
}
export function panelPage() {
  return `<main id="conteudo" class="wrap page-main panel-page"><header class="page-hero">${sectionLabel("FERRAMENTA LOCAL · SEM LOGIN")}<h1>Editar a base<br><em>sem mexer no layout.</em></h1><p>Escolha uma oportunidade, edite os campos do formulário, salve um rascunho neste navegador e exporte o catálogo.</p></header>
    <div class="panel-warning"><strong>Este painel é local e não é privado.</strong><span>Não digite senha, e-mail de cliente ou dado confidencial. Nada muda no site publicado até baixar o JSON, substituí-lo no projeto, reconstruir e republicar.</span></div>
    <div class="panel-selector"><label for="panel-opportunity">Oportunidade para editar</label><select id="panel-opportunity"></select><button class="button button-outline button-small" id="new-opportunity" type="button">+ Criar oportunidade em rascunho</button></div>
    <div class="panel-toolbar"><label class="button button-outline file-button">Importar JSON<input id="catalog-file" type="file" accept="application/json,.json"></label><button class="button button-outline" id="load-catalog" type="button">Recarregar base original</button><button class="button button-lime" id="download-catalog" type="button">Baixar catálogo editado</button><button class="button button-text" id="validate-catalog" type="button">Validar catálogo</button></div>
    <p id="panel-status" class="panel-status" role="status" aria-live="polite">Carregando a base…</p>
    <form id="opportunity-form" class="editor-form" onsubmit="return false">
      <fieldset class="editor-section"><legend>Informações da oportunidade</legend><div class="edit-grid">
        <label>ID<input id="edit-id" readonly></label><label>Slug da página<input id="edit-slug" required></label><label class="field-wide">Nome da oportunidade<input id="edit-title" required></label><label>Categoria<input id="edit-category" required></label>
        <label>Confiança<select id="edit-confidence"><option>Média</option><option>Baixa</option><option>Alta</option></select></label><label>Recomendação<select id="edit-action"><option>ANALISAR</option><option>COMPRAR</option><option>EVITAR</option></select></label>
        <label class="field-wide">Necessidade<textarea id="edit-need" rows="3"></textarea></label><label class="field-wide">Público de hipótese<textarea id="edit-audience" rows="3"></textarea></label><label class="field-wide">Resumo e justificativa<textarea id="edit-rationale" rows="4"></textarea></label><label class="field-wide">Problema observado ou hipótese<textarea id="edit-problem" rows="3"></textarea></label><label class="field-wide">Potencial para conteúdo<textarea id="edit-content-potential" rows="3"></textarea></label>
      </div></fieldset>
      <fieldset class="editor-section"><legend>Fontes e evidências</legend><p class="micro">Adicione pelo menos uma fonte HTTPS por oportunidade. Uma página de produto é evidência de oferta, não prova de vendas.</p><div id="source-rows" class="source-rows"></div><button class="button button-outline button-small" id="add-source" type="button">+ Adicionar fonte</button></fieldset>
      <fieldset class="editor-section"><legend>Componentes do score editorial</legend><p class="micro">Altere os pontos por dimensão. O total é calculado automaticamente de 0 a 100; nota não representa vendas.</p><div id="metric-fields" class="metric-fields"></div><div class="score-total-box"><span>Score total</span><output id="score-total">0/100</output></div></fieldset>
      <fieldset class="editor-section"><legend>Oferta por SKU — opcional</legend><p class="micro">Preencha somente depois de conferir a página do produto. A URL de afiliado deve pertencer a um programa em que sua conta foi aprovada.</p>
        <div class="edit-grid"><label>SKU ou descrição curta<input id="offer-sku" placeholder="Ex.: lip oil, tom X, 5 ml"></label><label>Preço observado<input id="offer-price" placeholder="Ex.: R$ 49,90"></label><label>Marketplace<input id="offer-marketplace" placeholder="Ex.: Amazon Brasil"></label><label>Vendedor observado<input id="offer-seller" placeholder="Nome mostrado na oferta"></label><label>Avaliação, se verificada<input id="offer-rating" placeholder="Ex.: 4,7 / 5"></label><label>Quantidade de avaliações<input id="offer-reviews" placeholder="Ex.: 128"></label><label>Comissão informada pelo painel<input id="offer-commission" placeholder="Ex.: 8% — confirmar regras"></label><label>Estoque e entrega<input id="offer-stock" placeholder="Ex.: disponibilidade e prazo observados"></label><label class="field-wide">URL direta do produto (HTTPS)<input id="offer-product-url" type="url" placeholder="https://…"></label><label class="field-wide">URL afiliada (HTTPS)<input id="offer-affiliate-url" type="url" placeholder="https://…"></label><label>Data de conferência<input id="offer-verified-at" type="date"></label></div>
        <label class="verify-check"><input id="offer-owner-verified" type="checkbox"><span>Conferi os dados acima hoje, o vendedor/oferta, o link e a permissão do programa; posso divulgá-los.</span></label>
        <p class="micro">Marcar a caixa registra a declaração do editor; o software não valida a oferta, elegibilidade, comissão, preço ou estoque. Atualize os dados antes de cada campanha.</p>
      </fieldset>
      <div class="editor-actions"><button class="button button-dark" id="save-item" type="button">Salvar no rascunho local</button><span class="micro">Rascunho salvo apenas neste navegador.</span></div>
    </form>
    <details class="advanced-json"><summary>Editor JSON avançado e importação/exportação</summary><label for="catalog-json" class="panel-label">Catálogo completo</label><textarea id="catalog-json" class="json-editor" spellcheck="false" aria-describedby="panel-help"></textarea><div class="panel-toolbar"><button class="button button-outline" id="apply-advanced" type="button">Aplicar JSON avançado</button></div><p id="panel-help" class="micro">A base editável é <code>content/opportunities.json</code>. Depois de exportar, substitua esse arquivo no projeto, execute <code>npm run build</code> e publique a pasta <code>dist</code>.</p></details>
    <section class="panel-steps"><h2>Para publicar uma mudança</h2><ol><li>Salve alterações e baixe o catálogo editado.</li><li>Substitua <code>content/opportunities.json</code> no projeto pelo arquivo baixado.</li><li>Rode <code>npm run build</code> e confira as páginas antes de subir a pasta <code>dist</code>.</li><li>No Netlify, publique a nova versão. Essa hospedagem estática mostra o catálogo curado; a busca ao vivo exige o backend Manus ou serviço equivalente, nunca secrets no navegador.</li></ol></section>
  </main>`;
}

export function mercadoLivreConnectPage(site) {
  const origin = site.marketplaceAllowedOrigins?.[0] || "";
  const callbackPath = site.marketplaceCallbackPath || "/api/mercadolivre/oauth/callback";
  const redirectUri = origin ? `${origin}${callbackPath}` : "Configure a origem pública permitida.";
  return `<main id="conteudo" class="wrap page-main panel-page" data-meli-admin>
    <header class="page-hero">${sectionLabel("CONFIGURAÇÃO DO OPERADOR · DADOS SENSÍVEIS NO SERVIDOR")}<h1>Conectar o app<br><em>Mercado Livre.</em></h1><p>Esta página é pública; somente ações administrativas exigem uma chave segura. O FARO solicita OAuth do administrador. Copie a URL de retorno para o cadastro do app e use a chave configurada em segredo para iniciar a conexão.</p></header>
    <section class="integration-card"><h2>1. URL de retorno OAuth</h2><p>Cadastre exatamente esta URL na aplicação do Mercado Livre. Ela usa o domínio aberto nesta página; esse domínio também precisa estar cadastrado em <code>marketplaceAllowedOrigins</code> no servidor.</p><div class="copy-field"><code id="meli-redirect-uri" data-callback-path="${escapeHtml(callbackPath)}">${escapeHtml(redirectUri)}</code><button class="button button-outline button-small" id="meli-copy-redirect" type="button">Copiar URL</button></div></section>
    <section class="integration-card"><h2>2. Chave administrativa</h2><p>Digite a chave FARO somente nesta página HTTPS. Ela é mantida apenas em memória enquanto a página estiver aberta; não a envie no chat nem reutilize uma senha pessoal.</p><label for="meli-admin-key">Chave administrativa</label><input id="meli-admin-key" type="password" autocomplete="off" spellcheck="false" minlength="32" aria-describedby="meli-admin-help"><p class="micro" id="meli-admin-help">A chave deve ter pelo menos 32 caracteres e estar cadastrada nos segredos do projeto.</p><div class="panel-toolbar"><button class="button button-dark" id="meli-connect" type="button">Conectar conta</button><button class="button button-outline" id="meli-test-search" type="button">Testar busca somente leitura</button><button class="button button-text" id="meli-disconnect" type="button">Remover token local</button></div><p id="meli-admin-status" class="panel-status" role="status" aria-live="polite">Verificando se a API está disponível…</p></section>
    <section class="inline-note"><span class="note-symbol" aria-hidden="true">i</span><p>As credenciais e tokens ficam no servidor. A busca automática só será liberada depois de OAuth real e de um teste autorizado retornar anúncios. Digitar dispara a busca; “Carregar mais” é manual, respeita o total retornado e tem limite de segurança FARO de 1.000 anúncios por consulta (a API pode limitar antes). Isso não comprova vendas nem comissão. Remover o token local não revoga a permissão no Mercado Livre — faça também a revogação nas configurações da conta.</p></section>
  </main>`;
}

export function thanksPage() {
  return `<main id="conteudo" class="wrap page-main thank-you"><span class="thank-icon" aria-hidden="true">✓</span>${sectionLabel("FORMULÁRIO")}<h1>Recebemos sua inscrição.</h1><p>O envio foi processado pelo provedor do formulário. Para deixar de receber mensagens ou solicitar acesso/remoção, use o contato do operador que foi configurado no serviço.</p>${cta("Voltar ao radar", "/radar/", "button button-dark")}</main>`;
}

export function notFoundPage() {
  return `<main id="conteudo" class="wrap page-main not-found"><span class="eyebrow">404 · FORA DO MAPA</span><h1>Não encontramos<br>essa página.</h1><p>Confira o endereço ou volte ao radar. Uma rota ausente não deve parecer um produto validado.</p>${cta("Abrir o radar", "/radar/", "button button-dark")}</main>`;
}
