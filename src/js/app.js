const normalize = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
const stopWords = new Set([
  "produto",
  "produtos",
  "para",
  "com",
  "que",
  "esta",
  "estao",
  "muito",
  "alta",
  "alto",
  "em",
  "de",
  "da",
  "do",
  "e",
  "o",
  "a",
  "um",
  "uma",
  "quero",
  "ideia",
]);
const intentIds = {
  cozinha: ["C03"],
  organizacao: ["C03", "C07"],
  pet: ["C02"],
  cachorro: ["C02"],
  gato: ["C02"],
  academia: ["C08", "C05"],
  treino: ["C08", "C05"],
  esporte: ["C08"],
  tiktok: ["C01", "C02", "C06"],
  viral: ["C01", "C02", "C06"],
  beleza: ["C01"],
  cabelo: ["C01"],
  labial: ["C01"],
  viagem: ["C07"],
  bagagem: ["C07"],
  jardim: ["C06"],
  plantas: ["C06"],
  iluminacao: ["C04"],
  espelho: ["C04"],
  cadeira: ["C05"],
  comissao: [],
  afiliado: [],
};
const categoryIntentKeys = new Set([
  "cozinha",
  "organizacao",
  "pet",
  "cachorro",
  "gato",
  "academia",
  "treino",
  "esporte",
  "beleza",
  "cabelo",
  "labial",
  "viagem",
  "bagagem",
  "jardim",
  "plantas",
  "iluminacao",
  "espelho",
  "cadeira",
]);
const toast = document.getElementById("site-toast");
let toastTimer;
function announce(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

const menuButton = document.querySelector(".menu-toggle");
const nav = document.getElementById("primary-nav");
menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  nav?.classList.toggle("is-open", !open);
  menuButton.querySelector(".sr-only").textContent = open
    ? "Abrir menu"
    : "Fechar menu";
});

document.querySelectorAll("[data-suggest]").forEach((button) =>
  button.addEventListener("click", () => {
    window.location.href = `/radar/?q=${encodeURIComponent(button.dataset.suggest)}`;
  }),
);
document.querySelectorAll("[data-search-form]").forEach((form) =>
  form.addEventListener("submit", (event) => {
    const input = form.querySelector('input[name="q"]');
    if (!input?.value.trim()) {
      event.preventDefault();
      input?.focus();
    }
  }),
);

let catalog = [];
fetch("/data/opportunities.json")
  .then((r) => {
    if (!r.ok) throw new Error("Catálogo indisponível");
    return r.json();
  })
  .then((data) => {
    catalog = Array.isArray(data) ? data : [];
    initRadar();
    initPanel();
  })
  .catch(() => {
    const status = document.getElementById("panel-status");
    if (status)
      status.textContent =
        "Não foi possível carregar a base; importe um JSON válido.";
    initRadar();
  });

function initRadar() {
  const root = document.querySelector("[data-radar]");
  if (!root) return;
  const results = document.getElementById("radar-results");
  const count = document.getElementById("result-count");
  const empty = document.getElementById("empty-results");
  const query = document.getElementById("radar-query");
  const category = document.getElementById("filter-category");
  const minScore = document.getElementById("filter-score");
  const confidence = document.getElementById("filter-confidence");
  const sort = document.getElementById("filter-sort");
  const notice = document.createElement("p");
  notice.id = "search-notice";
  notice.className = "search-notice";
  notice.setAttribute("aria-live", "polite");
  root.querySelector(".radar-panel")?.after(notice);
  const initial = new URLSearchParams(window.location.search).get("q") || "";
  query.value = initial;
  const cardMap = new Map(
    [...results.querySelectorAll("[data-opportunity-card]")].map((card) => [
      card.dataset.id,
      card,
    ]),
  );
  function render() {
    const raw = query.value;
    const q = normalize(raw);
    const tokens = q
      .split(/[^a-z0-9]+/)
      .filter((x) => x.length > 1 && !stopWords.has(x));
    const ids = new Set();
    const categoryIds = new Set();
    for (const token of tokens) {
      for (const [key, values] of Object.entries(intentIds)) {
        if (token === key || token.startsWith(key) || key.startsWith(token)) {
          values.forEach((id) => ids.add(id));
          if (categoryIntentKeys.has(key))
            values.forEach((id) => categoryIds.add(id));
        }
      }
    }
    const commissionIntent = /comissao|afiliado|ganhar dinheiro/.test(q);
    const trendIntent = /vendendo|mais vendido|em alta|popular/.test(q);
    const viralIntent = /viral|tiktok|video|conteudo/.test(q);
    const priceIntent = /barato|preco/.test(q);
    let filtered = catalog.filter((item) => {
      const hay = normalize(
        [
          item.id,
          item.title,
          item.category,
          item.need,
          item.problem,
          item.rationale,
          ...(item.tags || []),
        ].join(" "),
      );
      const hasDirect =
        tokens.length === 0 || tokens.some((term) => hay.includes(term));
      const hasMapped = ids.size > 0 && ids.has(item.id);
      const termMatch = categoryIds.size
        ? categoryIds.has(item.id)
        : hasDirect ||
          hasMapped ||
          commissionIntent ||
          trendIntent ||
          viralIntent ||
          priceIntent;
      return (
        termMatch &&
        (!category.value || item.category === category.value) &&
        Number(item.score) >= Number(minScore.value || 0) &&
        (!confidence.value || item.confidence === confidence.value)
      );
    });
    const sortMode = sort.value;
    filtered.sort((a, b) => {
      if (sortMode === "score-asc") return a.score - b.score;
      if (sortMode === "demand") return b.metrics.demand - a.metrics.demand;
      if (sortMode === "viral") return b.metrics.viral - a.metrics.viral;
      if (sortMode === "commission")
        return b.metrics.commission - a.metrics.commission;
      if (commissionIntent) return b.metrics.commission - a.metrics.commission;
      if (viralIntent) return b.metrics.viral - a.metrics.viral;
      if (trendIntent) return b.metrics.demand - a.metrics.demand;
      return b.score - a.score;
    });
    const notices = [];
    if (/vendendo|mais vendido/.test(q))
      notices.push(
        "Não há unidades vendidas confirmadas por SKU. Os resultados são ordenados por sinal de demanda da categoria; isso não significa “mais vendido”.",
      );
    if (/barato|preco/.test(q))
      notices.push(
        "Preço por SKU não confirmado. Não é possível afirmar que estes produtos são baratos; confira as ofertas no marketplace.",
      );
    if (commissionIntent)
      notices.push(
        "A ordem reflete o componente editorial de comissão potencial, não uma taxa. Comissão efetiva por SKU e programa não confirmada.",
      );
    if (viralIntent)
      notices.push(
        "“Viral” é uma intenção de busca: o ranking mostra potencial visual estimado, não viralização observada.",
      );
    if (
      ids.size &&
      !tokens.every((t) =>
        [...Object.keys(intentIds)].some(
          (k) => t === k || t.startsWith(k) || k.startsWith(t),
        ),
      )
    )
      notices.push(
        "A correspondência por intenção é aproximada e não substitui a validação do produto.",
      );
    notice.textContent = notices.join(" ");
    notice.hidden = !notices.length;
    let visible = 0;
    for (const item of filtered) {
      const card = cardMap.get(item.id);
      if (card) {
        card.hidden = false;
        results.appendChild(card);
        visible++;
      }
    }
    for (const item of catalog) {
      if (!filtered.some((x) => x.id === item.id)) {
        const card = cardMap.get(item.id);
        if (card) card.hidden = true;
      }
    }
    count.textContent = `${visible} ${visible === 1 ? "oportunidade" : "oportunidades"} na base curada`;
    empty.hidden = visible > 0;
    updateFavoriteButtons();
  }
  [query, category, minScore, confidence, sort].forEach((el) =>
    el?.addEventListener("input", render),
  );
  document.getElementById("clear-search")?.addEventListener("click", () => {
    query.value = "";
    category.value = "";
    minScore.value = "0";
    confidence.value = "";
    render();
    query.focus();
  });
  query?.addEventListener("search", render);
  render();
  initCompare(results, catalog);
  initLiveMarketplaceSearch(root, query);
}

const compareIds = new Set();
function initCompare(container, items) {
  const openButton = document.getElementById("open-compare");
  const count = document.getElementById("compare-count");
  const dialog = document.getElementById("compare-dialog");
  const table = document.getElementById("compare-table");
  const metrics = [
    ["demand", "Demanda"],
    ["trend", "Tendência"],
    ["viral", "Potencial visual"],
    ["commission", "Comissão potencial*"],
    ["competition", "Concorrência (nota maior = melhor)"],
    ["reputation", "Reputação"],
    ["promotion", "Divulgação"],
    ["availability", "Disponibilidade"],
    ["repurchase", "Recompra"],
  ];
  function update() {
    if (count) count.textContent = `${compareIds.size}/3`;
    if (openButton) openButton.disabled = compareIds.size < 2;
    container?.querySelectorAll("[data-compare]").forEach((button) => {
      const selected = compareIds.has(button.dataset.compare);
      button.setAttribute("aria-pressed", String(selected));
      button.textContent = selected ? "✓ Comparar" : " + Comparar";
    });
  }
  container?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-compare]");
    if (!button) return;
    const id = button.dataset.compare;
    if (compareIds.has(id)) compareIds.delete(id);
    else if (compareIds.size < 3) compareIds.add(id);
    else announce("O comparador aceita até três oportunidades.");
    update();
  });
  openButton?.addEventListener("click", () => {
    const chosen = items.filter((x) => compareIds.has(x.id));
    table.innerHTML = `<div class="compare-table-wrap"><table class="compare-table"><thead><tr><th scope="col">Critério</th>${chosen.map((x) => `<th scope="col">${escapeHTML(x.id)} · ${escapeHTML(x.title)}</th>`).join("")}</tr></thead><tbody><tr><th scope="row">Score editorial</th>${chosen.map((x) => `<td>${Number(x.score)}/100 · ${escapeHTML(x.confidence)} · ${escapeHTML(x.action)}</td>`).join("")}</tr>${metrics.map(([key, label]) => `<tr><th scope="row">${label}</th>${chosen.map((x) => `<td>${Number(x.metrics[key])}</td>`).join("")}</tr>`).join("")}<tr><th scope="row">Preço / comissão / estoque</th>${chosen.map(() => "<td>Não confirmado</td>").join("")}</tr></tbody></table></div>`;
    dialog?.showModal();
  });
  dialog
    ?.querySelector(".close-dialog")
    ?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  update();
}
function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function readFavorites() {
  try {
    return new Set(
      JSON.parse(localStorage.getItem("faro:favorites:v1") || "[]"),
    );
  } catch {
    return new Set();
  }
}
function updateFavoriteButtons() {
  const saved = readFavorites();
  document.querySelectorAll("[data-favorite]").forEach((button) => {
    const active = saved.has(button.dataset.favorite);
    button.setAttribute("aria-pressed", String(active));
    button.textContent = active ? "♥" : "♡";
    if (button.dataset.favLabel)
      button.setAttribute(
        "aria-label",
        active ? "Remover dos favoritos" : "Salvar nos favoritos",
      );
  });
}
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-favorite]");
  if (button) {
    const saved = readFavorites();
    const id = button.dataset.favorite;
    if (saved.has(id)) saved.delete(id);
    else saved.add(id);
    localStorage.setItem("faro:favorites:v1", JSON.stringify([...saved]));
    updateFavoriteButtons();
    announce(
      saved.has(id)
        ? "Salvo apenas neste navegador."
        : "Removido dos favoritos.",
    );
    return;
  }
  const share = event.target.closest("[data-share]");
  if (share) {
    const url = window.location.href;
    const text = `Análise FARO: ${document.title}`;
    const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
    window.open(whatsapp, "_blank", "noopener,noreferrer");
    announce("Abrindo compartilhamento do WhatsApp.");
  }
});
updateFavoriteButtons();

function initPanel() {
  const textarea = document.getElementById("catalog-json");
  if (!textarea) return;
  const status = document.getElementById("panel-status");
  const fileInput = document.getElementById("catalog-file");
  const selector = document.getElementById("panel-opportunity");
  const metricFields = document.getElementById("metric-fields");
  const draftKey = "faro:catalog-draft:v1";
  const schema = [
    ["demand", "Demanda", 20],
    ["trend", "Tendência", 15],
    ["viral", "Potencial visual", 15],
    ["commission", "Comissão potencial", 15],
    ["competition", "Atratividade frente à concorrência", 10],
    ["reputation", "Reputação/prova social", 10],
    ["promotion", "Facilidade de divulgação", 5],
    ["availability", "Disponibilidade", 5],
    ["repurchase", "Potencial de recompra", 5],
  ];
  const setStatus = (text, ok = true) => {
    status.textContent = text;
    status.style.color = ok ? "#214d3a" : "#9b432c";
  };
  function errorsFor(data) {
    const errors = [];
    if (!Array.isArray(data)) return ["A base deve ser uma lista JSON."];
    const ids = new Set(),
      slugs = new Set();
    for (const item of data) {
      if (!item || typeof item !== "object") {
        errors.push("Há um item que não é objeto.");
        continue;
      }
      if (!item.id || !item.slug || !item.title)
        errors.push("Cada item precisa de ID, slug e título.");
      if (ids.has(item.id)) errors.push(`ID duplicado: ${item.id}.`);
      if (slugs.has(item.slug)) errors.push(`Slug duplicado: ${item.slug}.`);
      ids.add(item.id);
      slugs.add(item.slug);
      if (
        !Number.isInteger(Number(item.score)) ||
        item.score < 0 ||
        item.score > 100
      )
        errors.push(`Score inválido em ${item.id}.`);
      if (!["ANALISAR", "COMPRAR", "EVITAR"].includes(item.action))
        errors.push(`Ação inválida em ${item.id}.`);
      if (!item.metrics || schema.some(([key]) => !(key in item.metrics)))
        errors.push(`Dimensões de score incompletas em ${item.id}.`);
      else {
        let sum = 0;
        for (const [key, label, max] of schema) {
          const value = Number(item.metrics[key]);
          if (!Number.isInteger(value) || value < 0 || value > max)
            errors.push(`${label} fora de 0–${max} em ${item.id}.`);
          sum += value;
        }
        if (sum !== Number(item.score))
          errors.push(
            `Componentes não somam o score de ${item.id} (${sum} ≠ ${item.score}).`,
          );
      }
      if (!Array.isArray(item.sources) || !item.sources.length)
        errors.push(`Adicione ao menos uma fonte em ${item.id}.`);
      else
        for (const source of item.sources) {
          if (!source.title || !source.url)
            errors.push(`Fonte precisa de título e URL em ${item.id}.`);
          try {
            if (new URL(source.url).protocol !== "https:") throw 0;
          } catch {
            errors.push(`Fonte precisa de URL HTTPS em ${item.id}.`);
          }
        }
      if (
        item.action === "COMPRAR" &&
        (!item.offer?.ownerVerified || !item.offer?.affiliateUrl)
      )
        errors.push(
          `${item.id}: não usar COMPRAR sem oferta e link afiliado conferidos.`,
        );
      if (item.offer?.ownerVerified) {
        for (const key of ["productUrl", "affiliateUrl"]) {
          try {
            if (new URL(item.offer[key]).protocol !== "https:") throw 0;
          } catch {
            errors.push(
              `${item.id}: ${key} precisa ser HTTPS para exibir oferta.`,
            );
          }
        }
        if (
          !item.offer.sku ||
          !item.offer.marketplace ||
          !item.offer.price ||
          !item.offer.verifiedAt
        )
          errors.push(
            `${item.id}: oferta conferida exige SKU, marketplace, preço e data.`,
          );
      }
    }
    return errors;
  }
  function persist() {
    textarea.value = JSON.stringify(catalog, null, 2);
    localStorage.setItem(draftKey, JSON.stringify(catalog));
  }
  function fillSelector(selected = "") {
    const wanted = selected || selector.value;
    selector.innerHTML = "";
    for (const item of catalog) {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${item.id} · ${item.title}`;
      selector.append(option);
    }
    if (catalog.some((x) => x.id === wanted)) selector.value = wanted;
    else if (catalog.length) selector.value = catalog[0].id;
  }
  function currentItem() {
    return catalog.find((item) => item.id === selector.value);
  }
  function paintMetrics(metrics = {}) {
    metricFields.innerHTML = schema
      .map(
        ([key, label, max]) =>
          `<label>${label}<span class="metric-editor-input"><input type="number" min="0" max="${max}" step="1" value="${Number(metrics[key] || 0)}" data-edit-metric="${key}"><span>/${max}</span></span></label>`,
      )
      .join("");
    metricFields
      .querySelectorAll("[data-edit-metric]")
      .forEach((input) => input.addEventListener("input", updateTotal));
    updateTotal();
  }
  function updateTotal() {
    const total = [
      ...metricFields.querySelectorAll("[data-edit-metric]"),
    ].reduce((sum, input) => sum + (Number(input.value) || 0), 0);
    document.getElementById("score-total").textContent = `${total}/100`;
    return total;
  }
  function collectSources() {
    return [...document.querySelectorAll(".source-editor-row")]
      .map((row) => ({
        title: row.querySelector("[data-source-title]").value.trim(),
        url: row.querySelector("[data-source-url]").value.trim(),
        kind: row.querySelector("[data-source-kind]").value.trim(),
      }))
      .filter((source) => source.title || source.url || source.kind);
  }
  function paintSources(sources = []) {
    const container = document.getElementById("source-rows");
    const rows = sources.length ? sources : [{ title: "", url: "", kind: "" }];
    container.innerHTML = rows
      .map(
        (source, index) =>
          `<div class="source-editor-row"><label>Título<input data-source-title value="${escapeHTML(source.title || "")}"></label><label>URL HTTPS<input type="url" data-source-url value="${escapeHTML(source.url || "")}" placeholder="https://…"></label><label>Tipo/evidência<input data-source-kind value="${escapeHTML(source.kind || "")}" placeholder="Ex.: fonte setorial; alegação de fabricante"></label><button class="button button-text remove-source" type="button" aria-label="Remover fonte ${index + 1}">Remover</button></div>`,
      )
      .join("");
    container.querySelectorAll(".remove-source").forEach((button, index) =>
      button.addEventListener("click", () => {
        const values = collectSources();
        values.splice(index, 1);
        paintSources(values);
      }),
    );
  }
  function populate(item) {
    if (!item) return;
    for (const [id, key] of [
      ["edit-id", "id"],
      ["edit-slug", "slug"],
      ["edit-title", "title"],
      ["edit-category", "category"],
      ["edit-confidence", "confidence"],
      ["edit-action", "action"],
      ["edit-need", "need"],
      ["edit-audience", "audience"],
      ["edit-rationale", "rationale"],
      ["edit-problem", "problem"],
      ["edit-content-potential", "contentPotential"],
    ]) {
      const el = document.getElementById(id);
      if (el) el.value = item[key] ?? "";
    }
    paintMetrics(item.metrics || {});
    paintSources(item.sources || []);
    const offer = item.offer || {};
    for (const [id, key] of [
      ["offer-sku", "sku"],
      ["offer-price", "price"],
      ["offer-marketplace", "marketplace"],
      ["offer-seller", "seller"],
      ["offer-rating", "rating"],
      ["offer-reviews", "reviewCount"],
      ["offer-commission", "commission"],
      ["offer-stock", "stock"],
      ["offer-product-url", "productUrl"],
      ["offer-affiliate-url", "affiliateUrl"],
      ["offer-verified-at", "verifiedAt"],
    ]) {
      const el = document.getElementById(id);
      if (el) el.value = offer[key] ?? "";
    }
    document.getElementById("offer-owner-verified").checked =
      offer.ownerVerified === true;
  }
  function collectOffer(existing = {}) {
    const keys = {
      sku: "offer-sku",
      price: "offer-price",
      marketplace: "offer-marketplace",
      seller: "offer-seller",
      rating: "offer-rating",
      reviewCount: "offer-reviews",
      commission: "offer-commission",
      stock: "offer-stock",
      productUrl: "offer-product-url",
      affiliateUrl: "offer-affiliate-url",
      verifiedAt: "offer-verified-at",
    };
    const offer = { ...existing };
    for (const [key, id] of Object.entries(keys)) {
      const value = document.getElementById(id).value.trim();
      if (value) offer[key] = value;
      else delete offer[key];
    }
    offer.ownerVerified = document.getElementById(
      "offer-owner-verified",
    ).checked;
    if (!Object.keys(keys).some((key) => offer[key]) && !offer.ownerVerified)
      return null;
    return offer;
  }
  function saveActive() {
    const old = currentItem();
    if (!old) return null;
    const metrics = Object.fromEntries(
      [...metricFields.querySelectorAll("[data-edit-metric]")].map((input) => [
        input.dataset.editMetric,
        Number(input.value),
      ]),
    );
    const item = {
      ...old,
      id: document.getElementById("edit-id").value.trim(),
      slug: document.getElementById("edit-slug").value.trim(),
      title: document.getElementById("edit-title").value.trim(),
      category: document.getElementById("edit-category").value.trim(),
      confidence: document.getElementById("edit-confidence").value,
      action: document.getElementById("edit-action").value,
      need: document.getElementById("edit-need").value.trim(),
      audience: document.getElementById("edit-audience").value.trim(),
      rationale: document.getElementById("edit-rationale").value.trim(),
      problem: document.getElementById("edit-problem").value.trim(),
      contentPotential: document
        .getElementById("edit-content-potential")
        .value.trim(),
      sources: collectSources(),
      metrics,
      score: updateTotal(),
      offer: collectOffer(old.offer || {}),
    };
    if (!item.offer) delete item.offer;
    catalog = catalog.map((x) => (x.id === old.id ? item : x));
    persist();
    fillSelector(item.id);
    populate(item);
    return item;
  }
  function makeNew() {
    let index = 9;
    while (catalog.some((x) => x.id === `C${String(index).padStart(2, "0")}`))
      index++;
    const id = `C${String(index).padStart(2, "0")}`;
    const slug = `nova-oportunidade-${index}`;
    const item = {
      id,
      slug,
      title: "Nova oportunidade",
      category: "Nova categoria",
      score: 0,
      confidence: "Baixa",
      action: "ANALISAR",
      updated: new Date().toISOString().slice(0, 10),
      metrics: Object.fromEntries(schema.map(([key]) => [key, 0])),
      tags: [],
      audience: "",
      need: "Descreva a necessidade que esta oportunidade atende.",
      problem: "",
      rationale: "Sinal a pesquisar; ainda não verificado.",
      signals: ["Não foi possível confirmar."],
      contentPotential: "Hipótese de conteúdo a validar.",
      contentPlan: [],
      risks: ["Evidência ainda insuficiente."],
      unknowns: [
        "Preço, estoque, vendas, comissão e fornecedor não confirmados.",
      ],
      recommendation: "ANALISAR somente após validar fontes e oferta.",
      sources: [],
    };
    catalog.push(item);
    persist();
    fillSelector(id);
    populate(item);
    setStatus(
      `${id} criado como rascunho local. Adicione fontes HTTPS antes de publicar.`,
    );
  }
  async function loadBase() {
    try {
      const response = await fetch("/data/opportunities.json");
      if (!response.ok) throw new Error("Catálogo não disponível");
      const data = await response.json();
      catalog = data;
      localStorage.removeItem(draftKey);
      fillSelector(data[0]?.id || "");
      populate(currentItem());
      persist();
      setStatus(`${data.length} oportunidades carregadas da base original.`);
    } catch {
      setStatus(
        "Não foi possível carregar a base. Importe um JSON válido para começar.",
        false,
      );
    }
  }
  document.getElementById("add-source").addEventListener("click", () => {
    const sources = collectSources();
    sources.push({ title: "", url: "", kind: "" });
    paintSources(sources);
  });
  selector.addEventListener("change", () => populate(currentItem()));
  document.getElementById("new-opportunity").addEventListener("click", makeNew);
  document.getElementById("save-item").addEventListener("click", () => {
    const item = saveActive();
    if (!item) {
      setStatus("Selecione uma oportunidade.", false);
      return;
    }
    const errors = errorsFor(catalog);
    setStatus(
      errors.length
        ? errors[0]
        : "Alterações guardadas somente neste navegador. Baixe o catálogo quando estiver pronto.",
      !errors.length,
    );
  });
  document.getElementById("validate-catalog").addEventListener("click", () => {
    saveActive();
    const errors = errorsFor(catalog);
    setStatus(
      errors.length
        ? errors.join(" ")
        : `Base válida: ${catalog.length} oportunidades; scores e fontes verificáveis estruturalmente.`,
      !errors.length,
    );
  });
  document.getElementById("download-catalog").addEventListener("click", () => {
    saveActive();
    const errors = errorsFor(catalog);
    if (errors.length) {
      setStatus(errors.join(" "), false);
      return;
    }
    const blob = new Blob([`${JSON.stringify(catalog, null, 2)}\n`], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "opportunities.json";
    link.click();
    URL.revokeObjectURL(link.href);
    setStatus(
      "Catálogo validado e baixado. Substitua o arquivo-fonte, reconstrua o site e publique a nova versão.",
    );
  });
  document.getElementById("load-catalog").addEventListener("click", loadBase);
  fileInput?.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const errors = errorsFor(data);
      if (errors.length) {
        setStatus(errors.join(" "), false);
        return;
      }
      catalog = data;
      persist();
      fillSelector(catalog[0]?.id || "");
      populate(currentItem());
      setStatus(
        `Importado ${file.name}: ${data.length} oportunidades válidas.`,
      );
    } catch {
      setStatus(
        "Não foi possível ler o JSON. Confira o formato e tente novamente.",
        false,
      );
    }
  });
  document.getElementById("apply-advanced").addEventListener("click", () => {
    try {
      const data = JSON.parse(textarea.value);
      const errors = errorsFor(data);
      if (errors.length) {
        setStatus(errors.join(" "), false);
        return;
      }
      catalog = data;
      persist();
      fillSelector(catalog[0]?.id || "");
      populate(currentItem());
      setStatus(`JSON avançado aplicado: ${data.length} oportunidades.`);
    } catch {
      setStatus("JSON inválido; corrija a sintaxe e tente novamente.", false);
    }
  });
  const saved = localStorage.getItem(draftKey);
  let restored = false;
  if (saved) {
    try {
      const data = JSON.parse(saved);
      const problems = errorsFor(data);
      if (!problems.length) {
        catalog = data;
        fillSelector(data[0]?.id || "");
        populate(currentItem());
        textarea.value = JSON.stringify(catalog, null, 2);
        setStatus("Rascunho local restaurado neste navegador.");
        restored = true;
      }
    } catch {}
  }
  if (!restored) {
    fillSelector(catalog[0]?.id || "");
    populate(currentItem());
    textarea.value = JSON.stringify(catalog, null, 2);
    setStatus(
      saved
        ? "Rascunho local inválido; base original carregada. Revise ou importe outro catálogo."
        : `${catalog.length} oportunidades carregadas. Selecione uma para editar.`,
      !saved,
    );
  }
}
const newsletter = document.querySelector("[data-newsletter-form]");
newsletter?.addEventListener("submit", (event) => {
  const host = window.location.hostname;
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".manus.computer")
  ) {
    event.preventDefault();
    const message = newsletter.querySelector("[data-form-message]");
    if (message)
      message.textContent =
        "Modo de prévia: nenhum dado foi enviado ou armazenado. A captação precisa ser publicada e configurada no Netlify.";
    announce("Prévia: inscrição não enviada.");
  }
});


function initLiveMarketplaceSearch(root, queryInput) {
  const section = root.querySelector("[data-marketplace-search]");
  if (!section || !queryInput) return;
  const connectionStatus = document.getElementById("marketplace-connection-status");
  const resultsStatus = document.getElementById("marketplace-results-status");
  const results = document.getElementById("marketplace-results");
  const loadMore = document.getElementById("marketplace-load-more");
  let connected = false;
  let available = false;
  let controller;
  let timer;
  let activeQuery = "";
  let nextOffset = 0;
  let hasMore = false;
  let queryCapped = false;
  let loading = false;

  function clearResults() {
    results.replaceChildren();
    nextOffset = 0;
    hasMore = false;
    queryCapped = false;
    loadMore.hidden = true;
  }

  function renderResult(item) {
    const card = document.createElement("article");
    card.className = "marketplace-result-card";
    if (item.picture) {
      const image = document.createElement("img");
      image.className = "marketplace-result-image";
      image.src = item.picture;
      image.alt = "Imagem ilustrativa do anúncio";
      image.loading = "lazy";
      image.referrerPolicy = "no-referrer";
      card.appendChild(image);
    }
    const body = document.createElement("div");
    body.className = "marketplace-result-body";
    const title = document.createElement("h3");
    title.className = "marketplace-result-title";
    if (item.url) {
      const link = document.createElement("a");
      link.href = item.url;
      link.target = "_blank";
      link.rel = "nofollow noopener noreferrer";
      link.textContent = item.title || "Anúncio no Mercado Livre";
      title.appendChild(link);
    } else {
      title.textContent = item.title || "Anúncio no Mercado Livre";
    }
    body.appendChild(title);

    const price = document.createElement("p");
    price.className = "marketplace-result-price";
    if (Number.isFinite(item.price) && /^[A-Z]{3}$/i.test(item.currency || "")) {
      try {
        price.textContent = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: item.currency.toUpperCase(),
        }).format(item.price);
      } catch {
        price.textContent = "Preço informado pelo marketplace";
      }
    } else {
      price.textContent = "Preço não informado pela API";
    }
    body.appendChild(price);

    const details = [item.categoryId, item.condition, item.seller].filter(Boolean);
    if (details.length) {
      const meta = document.createElement("p");
      meta.className = "marketplace-result-meta";
      meta.textContent = details.join(" · ");
      body.appendChild(meta);
    }
    const disclosure = document.createElement("p");
    disclosure.className = "marketplace-result-meta";
    disclosure.textContent = "Anúncio externo · link não afiliado do FARO";
    body.appendChild(disclosure);
    card.appendChild(body);
    return card;
  }

  async function fetchPage(query, offset, append) {
    if (!available || loading) return;
    loading = true;
    controller?.abort();
    controller = new AbortController();
    if (!append) {
      activeQuery = query;
      clearResults();
    }
    if (resultsStatus) resultsStatus.textContent = "Buscando anúncios…";
    if (loadMore) loadMore.disabled = true;
    try {
      const params = new URLSearchParams({ q: query, offset: String(offset) });
      const response = await fetch(`/api/mercadolivre/search?${params}`, {
        signal: controller.signal,
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json"))
        throw new Error("backend_unavailable");
      const data = await response.json();
      if (queryInput.value.trim() !== query) return;
      if (!response.ok) throw new Error(data.message || "search_unavailable");
      if (!Array.isArray(data.results)) throw new Error("search_unavailable");
      if (!append) results.replaceChildren();
      for (const item of data.results) results.appendChild(renderResult(item));
      nextOffset = Number(data.offset || 0) + data.results.length;
      hasMore = Boolean(data.hasMore) && data.results.length > 0;
      queryCapped = Boolean(data.capped);
      loadMore.hidden = !hasMore;
      resultsStatus.textContent = data.results.length
        ? `${results.children.length} anúncios exibidos. Total informado pela API: ${Number(data.total || 0).toLocaleString("pt-BR")}. Isso não significa unidades vendidas.${queryCapped ? " Limite de 1.000 resultados do FARO atingido; refine a busca." : ""}`
        : "Nenhum anúncio foi retornado para este termo.";
    } catch (error) {
      if (error.name === "AbortError") return;
      if (!append) results.replaceChildren();
      hasMore = false;
      queryCapped = false;
      loadMore.hidden = true;
      resultsStatus.textContent = error.message === "backend_unavailable"
        ? "A busca ao vivo exige o backend FARO. Esta hospedagem estática mantém a busca curada, sem credenciais no navegador."
        : error.message || "A busca ao vivo falhou; tente novamente mais tarde. A curadoria editorial continua disponível.";
    } finally {
      loading = false;
      if (loadMore) loadMore.disabled = false;
    }
  }

  function scheduleSearch() {
    window.clearTimeout(timer);
    controller?.abort();
    const query = queryInput.value.trim();
    clearResults();
    if (query.length < 3) {
      if (resultsStatus) resultsStatus.textContent = query
        ? "Digite pelo menos 3 caracteres para a busca ao vivo."
        : "A busca ao vivo é automática enquanto você digita; os filtros editoriais continuam separados.";
      return;
    }
    if (!available) {
      if (resultsStatus) resultsStatus.textContent = connected
        ? "A conexão existe, mas a busca geral ainda não passou no teste somente leitura."
        : "A integração não está conectada; as oportunidades curadas acima continuam pesquisáveis.";
      return;
    }
    timer = window.setTimeout(() => fetchPage(query, 0, false), 450);
  }

  queryInput.addEventListener("input", scheduleSearch);
  queryInput.addEventListener("search", scheduleSearch);
  loadMore?.addEventListener("click", () => {
    if (hasMore && activeQuery && !loading) fetchPage(activeQuery, nextOffset, true);
  });

  fetch("/api/mercadolivre/status", {
    cache: "no-store",
    headers: { Accept: "application/json" },
  })
    .then(async (response) => {
      if (!response.ok || !(response.headers.get("content-type") || "").includes("application/json"))
        throw new Error("backend_unavailable");
      return response.json();
    })
    .then((data) => {
      connected = Boolean(data.connected);
      available = Boolean(data.liveSearchAvailable);
      if (connectionStatus) {
        connectionStatus.textContent = available
          ? "Busca somente leitura habilitada após teste autorizado; a API pode alterar disponibilidade ou paginação."
          : connected
            ? "Conta conectada, mas a busca geral ainda não passou por teste autorizado."
            : "Integração ainda não conectada. O catálogo curado permanece disponível.";
      }
      if (queryInput.value.trim().length >= 3) scheduleSearch();
    })
    .catch(() => {
      if (connectionStatus)
        connectionStatus.textContent = "Backend FARO indisponível nesta hospedagem; a busca editorial continua funcionando.";
    });
}

function initMercadoLivreAdmin() {
  const root = document.querySelector("[data-meli-admin]");
  if (!root) return;
  const keyInput = document.getElementById("meli-admin-key");
  const status = document.getElementById("meli-admin-status");
  const connectButton = document.getElementById("meli-connect");
  const testButton = document.getElementById("meli-test-search");
  const disconnectButton = document.getElementById("meli-disconnect");
  const redirectCode = document.getElementById("meli-redirect-uri");
  if (redirectCode) {
    try {
      redirectCode.textContent = new URL(
        redirectCode.dataset.callbackPath || "/api/mercadolivre/oauth/callback",
        window.location.origin,
      ).toString();
    } catch {}
  }
  const setStatus = (message) => { if (status) status.textContent = message; };
  const adminKey = () => keyInput?.value.trim() || "";

  async function readStatus() {
    try {
      const response = await fetch("/api/mercadolivre/status", {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (!response.ok || !(response.headers.get("content-type") || "").includes("application/json"))
        throw new Error("backend_unavailable");
      const data = await response.json();
      setStatus(data.liveSearchAvailable
        ? "Conta conectada; o teste autorizado da busca retornou anúncios. A API pode mudar ou limitar resultados."
        : data.connected
          ? "Conta conectada. Ainda é necessário testar se esta aplicação pode fazer busca geral."
          : "Ainda não há uma conta Mercado Livre conectada.");
    } catch {
      setStatus("Backend indisponível. A conexão OAuth só funciona no servidor Manus; ZIP estático não armazena tokens.");
    }
  }

  async function postAdmin(path, body = {}) {
    if (adminKey().length < 32) throw new Error("Informe a chave administrativa configurada no projeto.");
    const response = await fetch(path, {
      method: "POST",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminKey()}`,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "A solicitação não foi autorizada.");
    return data;
  }

  connectButton?.addEventListener("click", async () => {
    connectButton.disabled = true;
    setStatus("Preparando o fluxo OAuth seguro…");
    try {
      const data = await postAdmin("/api/mercadolivre/oauth/start", {
        origin: window.location.origin,
      });
      window.location.assign(data.authorizationUrl);
    } catch (error) {
      setStatus(error.message || "Não foi possível iniciar a conexão.");
      connectButton.disabled = false;
    }
  });

  testButton?.addEventListener("click", async () => {
    testButton.disabled = true;
    setStatus("Executando uma consulta somente leitura de teste…");
    try {
      const data = await postAdmin("/api/mercadolivre/test-search", { query: "fone bluetooth" });
      setStatus(data.message || "Teste concluído.");
    } catch (error) {
      setStatus(error.message || "O teste da busca falhou.");
    } finally {
      testButton.disabled = false;
      await readStatus();
    }
  });

  disconnectButton?.addEventListener("click", async () => {
    if (!window.confirm("Remover do FARO o token criptografado armazenado? Isso não revoga a permissão no Mercado Livre.")) return;
    disconnectButton.disabled = true;
    setStatus("Removendo token local…");
    try {
      const data = await postAdmin("/api/mercadolivre/disconnect");
      setStatus(data.message || "Token removido.");
    } catch (error) {
      setStatus(error.message || "Não foi possível remover a conexão.");
    } finally {
      disconnectButton.disabled = false;
      await readStatus();
    }
  });

  document.getElementById("meli-copy-redirect")?.addEventListener("click", async () => {
    const code = document.getElementById("meli-redirect-uri");
    const value = code?.textContent?.trim() || "";
    try {
      await navigator.clipboard.writeText(value);
      setStatus("URL de retorno copiada. Cadastre-a exatamente no app do Mercado Livre.");
    } catch {
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      setStatus("Selecione a URL destacada e copie-a manualmente.");
    }
  });

  const oauthStatus = new URLSearchParams(window.location.search).get("oauth");
  if (oauthStatus === "connected")
    setStatus("Autorização concluída. Digite novamente a chave administrativa e teste a busca somente leitura.");
  else if (oauthStatus === "cancelled")
    setStatus("A autorização foi cancelada. Nenhum token novo foi salvo.");
  else if (oauthStatus === "error")
    setStatus("A autorização não foi concluída. Confira no app o client ID e a URL de retorno.");
  if (oauthStatus) window.history.replaceState({}, document.title, window.location.pathname);
  readStatus();
}

initMercadoLivreAdmin();
