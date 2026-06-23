(function () {
  "use strict";

  const dataUrl = "../data/revo-art-data.json";
  const winningSpotsUrl = "../data/revo-art-winning-spots.json";
  const applicationFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdII732mhijp5vlt-iWxg1qCv-Uli03VYySpiQ3EapsZy0O_w/viewform?usp=dialog";

  async function loadRevoArtData() {
    const response = await fetch(dataUrl);

    if (!response.ok) {
      throw new Error("レボアート情報を読み込めませんでした。");
    }

    return response.json();
  }

  async function loadWinningRevoArtSpots() {
    const response = await fetch(winningSpotsUrl);

    if (!response.ok) {
      throw new Error("当選レボアートスポット情報を読み込めませんでした。");
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  }

  function getText(value, fallbackText) {
    if (typeof value === "string" && value.trim() !== "") {
      return value;
    }

    return fallbackText;
  }

  function getArray(value) {
    if (Array.isArray(value)) {
      return value.filter((item) => typeof item === "string" && item.trim() !== "");
    }

    return [];
  }

  function createTextElement(tagName, className, text) {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = text;
    return element;
  }

  function createLabelList(items, className) {
    const list = document.createElement("div");
    list.className = className;

    for (const item of getArray(items)) {
      const label = document.createElement("span");
      label.className = "rf-art-chip";
      label.textContent = item;
      list.append(label);
    }

    return list;
  }

  function createTextList(items, className) {
    const list = document.createElement("ul");
    list.className = className;

    for (const item of getArray(items)) {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      list.append(listItem);
    }

    return list;
  }

  function createInfoItem(label, value) {
    const item = document.createElement("div");
    item.className = "rf-art-info__item";

    const labelElement = createTextElement("span", "rf-art-info__label", label);
    const valueElement = createTextElement("span", "rf-art-info__value", value);

    item.append(labelElement, valueElement);
    return item;
  }

  function getVisualMotifs(categoryId) {
    if (categoryId === "wall") {
      return ["面", "線", "壁"];
    }

    if (categoryId === "car") {
      return ["巡", "流", "道"];
    }

    if (categoryId === "hat") {
      return ["帽", "飾", "場"];
    }

    return ["表", "現", "応"];
  }

  function getCategoryVisualImage(categoryId) {
    const images = {
      wall: "../assets/images/revo-art-wall-1200x630.png",
      car: "../assets/images/revo-art-car-1200x630.png",
      hat: "../assets/images/revo-art-hat-1200x630.png"
    };

    return images[categoryId] || "";
  }

  function createCategoryVisual(item, modifierClass) {
    const visual = document.createElement("div");
    const categoryId = getText(item && item.id, getText(item && item.categoryId, "art"));
    visual.className = `rf-art-visual rf-art-visual--${categoryId} ${modifierClass}`;
    visual.setAttribute("aria-hidden", "true");

    const imageSrc = getCategoryVisualImage(categoryId);
    if (imageSrc) {
      const image = document.createElement("img");
      image.src = imageSrc;
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      image.style.display = "block";
      image.style.width = "100%";
      image.style.height = "auto";
      image.style.gridArea = "1 / 1";
      visual.appendChild(image);
      return visual;
    }

    const motifList = document.createElement("div");
    motifList.className = "rf-art-visual__motifs";

    for (const motifText of getVisualMotifs(categoryId)) {
      const motif = document.createElement("span");
      motif.className = "rf-art-visual__motif";
      motif.textContent = motifText;
      motifList.appendChild(motif);
    }

    const line = document.createElement("span");
    line.className = "rf-art-visual__line";

    visual.appendChild(motifList);
    visual.appendChild(line);
    return visual;
  }

  function createApplicationBlock(item) {
    const block = document.createElement("section");
    block.className = "rf-art-application";
    block.setAttribute("aria-label", "申請受付情報");

    const status = createTextElement("p", "rf-art-application__status", getText(item.applicationMonthLabel, "申請受付準備中"));
    const method = createTextElement("p", "rf-art-application__method", getText(item.applicationMethodLabel, "申請制"));
    const selection = createTextElement("p", "rf-art-application__selection", getText(item.selectionMethodLabel, "運営サイドで確認・抽選・決定"));
    const note = createTextElement("p", "rf-art-application__note", getText(item.applicationNote, "申請内容を運営サイドで確認し、決定したものを掲載していきます。"));

    block.append(status, method, selection, note);
    return block;
  }

  function createApplicationSummaryBlock(item) {
    const block = document.createElement("div");
    block.className = "rf-art-application-summary";

    block.appendChild(createTextElement("span", "rf-art-application-summary__item", getText(item.applicationMethodLabel, "申請制")));
    block.appendChild(createTextElement("span", "rf-art-application-summary__item", getText(item.applicationMonthLabel, "申請受付準備中")));
    block.appendChild(createTextElement("span", "rf-art-application-summary__item", getText(item.selectionMethodLabel, "運営サイドで確認・抽選・決定")));

    return block;
  }

  function createPreparingMapBlock(labelText) {
    const block = document.createElement("section");
    block.className = "rf-art-map-placeholder__inner";
    block.setAttribute("aria-label", "全国地図準備中");

    const title = createTextElement("h2", "rf-art-map-placeholder__title", "全国地図");
    const label = createTextElement("p", "rf-art-map-placeholder__label", getText(labelText, "全国展開準備中"));
    const text = createTextElement("p", "rf-art-map-placeholder__text", "全国へ広がる様子を、公開許可済みの地域ラベルで見せる準備中です。");

    block.append(title, label, text);
    return block;
  }

  function createCounterPreviewBlock() {
    const counters = [
      ["募集中のアート企画数", "3"],
      ["展開地域数", "準備中"],
      ["参加アーティスト数", "準備中"],
      ["当選レボアートスポット", "準備中"]
    ];

    const fragment = document.createDocumentFragment();

    for (const [label, value] of counters) {
      const item = document.createElement("div");
      item.className = "rf-art-counter";

      const labelElement = createTextElement("span", "rf-art-counter__label", label);
      const valueElement = createTextElement("span", "rf-art-counter__value", value);

      item.append(labelElement, valueElement);
      fragment.append(item);
    }

    return fragment;
  }

  function getWinningSpotStatusLabel(item) {
    const status = getText(item && item.status, "");
    const isPublished = Boolean(item && item.isPublished);

    if (status === "preparing" && !isPublished) {
      return "申請受付後に掲載";
    }

    if (status === "published" && isPublished) {
      return "当選レボアートスポットとして掲載中";
    }

    if (status === "hidden" && !isPublished) {
      return "";
    }

    return "確認中";
  }

  function filterVisibleWinningRevoArtSpots(items) {
    if (!Array.isArray(items)) {
      return [];
    }

    return items.filter((item) => getWinningSpotStatusLabel(item) !== "");
  }

  function filterWinningRevoArtSpotsByCategory(items, categoryId) {
    return filterVisibleWinningRevoArtSpots(items).filter((item) => item.categoryId === categoryId);
  }

  function getPreparingCount(items, categoryId) {
    return filterVisibleWinningRevoArtSpots(items).filter((item) => {
      if (categoryId && item.categoryId !== categoryId) {
        return false;
      }

      return item.status === "preparing" && item.isPublished === false;
    }).length;
  }

  function getCategoryName(categoryId) {
    if (categoryId === "wall") {
      return "ウォールアート";
    }

    if (categoryId === "car") {
      return "カーアート";
    }

    if (categoryId === "hat") {
      return "ハットアート";
    }

    return "レボアート";
  }

  function createWinningSpotCounterSummary(items) {
    const counters = [
      ["当選レボアートスポット", `${getPreparingCount(items)}件掲載予定`],
      ["ウォールアート", `${getPreparingCount(items, "wall")}件掲載予定`],
      ["カーアート", `${getPreparingCount(items, "car")}件掲載予定`],
      ["ハットアート", `${getPreparingCount(items, "hat")}件掲載予定`],
      ["展開地域数", "申請受付後に集計"]
    ];

    const list = document.createElement("div");
    list.className = "rf-art-winning-spot-counters";

    for (const [label, value] of counters) {
      const item = document.createElement("div");
      item.className = "rf-art-winning-spot-counter";
      item.append(
        createTextElement("span", "rf-art-winning-spot-counter__label", label),
        createTextElement("span", "rf-art-winning-spot-counter__value", value)
      );
      list.append(item);
    }

    return list;
  }

  function createWinningRevoArtSpotCard(item) {
    const card = document.createElement("article");
    card.className = "rf-art-winning-spot-card";

    const statusLabel = getWinningSpotStatusLabel(item);
    const status = createTextElement("p", "rf-art-winning-spot-status", statusLabel || "確認中");
    const title = createTextElement("h3", "rf-art-winning-spot-card__title", getText(item.title, "当選レボアートスポット"));
    const message = createTextElement("p", "rf-art-winning-spot-card__message", getText(item.shortMessage, "公開許可済みの当選レボアートスポットを、申請受付後に順次掲載します。"));
    const description = createTextElement("p", "rf-art-winning-spot-card__description", getText(item.description, "申請受付後、運営確認・抽選・決定を経て、公開許可済みの当選レボアートスポットを掲載します。"));

    const meta = document.createElement("div");
    meta.className = "rf-art-winning-spot-meta";
    meta.append(
      createInfoItem("カテゴリ", getCategoryName(item.categoryId)),
      createInfoItem("公開名称", getText(item.publicName, "公開許可済み名称")),
      createInfoItem("地域", getText(item.regionLabel, "地域確認中")),
      createInfoItem("当選月", getText(item.winningMonth, "確認中")),
      createInfoItem("地図表示", getText(item.mapLabel, "申請受付後に掲載"))
    );

    const labels = createLabelList(item.labels, "rf-art-winning-spot-card__labels");
    const notice = createTextElement("p", "rf-art-winning-spot-card__notice", getText(item.notice, "公開許可済みの情報だけを掲載します。"));

    card.append(status, title, message, description, meta);

    if (labels.childElementCount > 0) {
      card.append(labels);
    }

    card.append(notice);
    return card;
  }

  function createWinningRevoArtSpotBlock(items) {
    const block = document.createElement("section");
    block.className = "rf-art-winning-spot__inner";

    const title = createTextElement("h2", "rf-art-winning-spot__title", "当選レボアートスポット");
    const text = createTextElement("p", "rf-art-winning-spot__text", "公開許可済みの情報だけを、これから広がるスポットとして掲載していきます。");
    const status = createTextElement("p", "rf-art-winning-spot__status", "申請受付後、運営確認・抽選・決定を経て、公開許可済みの当選レボアートスポットを掲載します。");
    const visibleItems = filterVisibleWinningRevoArtSpots(items);

    block.append(title, text, status);

    if (visibleItems.length === 0) {
      block.append(createTextElement("p", "rf-art-winning-spot__empty", "当選レボアートスポットは、申請受付後に順次公開されます。"));
      return block;
    }

    block.append(createWinningSpotCounterSummary(visibleItems));

    const list = document.createElement("div");
    list.className = "rf-art-winning-spot-list";

    for (const item of visibleItems) {
      list.append(createWinningRevoArtSpotCard(item));
    }

    block.append(list);
    return block;
  }

  function createWinningRevoArtSpotByCategoryBlock(items, categoryId) {
    const block = document.createElement("section");
    block.className = "rf-art-winning-spot__inner";

    const categoryItems = filterWinningRevoArtSpotsByCategory(items, categoryId);
    const title = createTextElement("h2", "rf-art-winning-spot__title", "当選レボアートスポット");
    const text = createTextElement("p", "rf-art-winning-spot__text", "公開許可済み情報だけで、このカテゴリの広がりを表示します。");

    block.append(title, text);

    if (categoryItems.length === 0) {
      block.append(createTextElement("p", "rf-art-winning-spot__empty", "このカテゴリの当選レボアートスポットは、申請受付後に順次公開されます。"));
      return block;
    }

    const list = document.createElement("div");
    list.className = "rf-art-winning-spot-list";

    for (const item of categoryItems) {
      list.append(createWinningRevoArtSpotCard(item));
    }

    block.append(list);
    return block;
  }

  function createDisabledAction(label) {
    const button = document.createElement("button");
    button.className = "rf-art-action";
    button.type = "button";
    button.disabled = true;
    button.textContent = label;
    return button;
  }

  function createApplicationAction(item) {
    const label = getText(item && item.applicationCtaLabel, "申請受付準備中");
    const url = getText(item && item.applicationFormUrl, "");

    if (item && item.applicationLinkEnabled === true && url === applicationFormUrl) {
      const link = document.createElement("a");
      link.className = "rf-art-action rf-art-action--link";
      link.href = applicationFormUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = label;
      return link;
    }

    return createDisabledAction(label);
  }

  function createDetailLink(item) {
    const link = document.createElement("a");
    link.className = "rf-art-card__detail-link";
    link.href = `revo-art-detail.html?id=${encodeURIComponent(getText(item.id, ""))}`;
    link.textContent = "詳細を見る";
    return link;
  }

  function createRevoArtCard(item) {
    const card = document.createElement("article");
    card.className = "rf-card--art";
    const visual = createCategoryVisual(item, "rf-art-visual--card");

    const header = document.createElement("div");
    header.className = "rf-art-card__header";

    const title = createTextElement("h3", "rf-art-card__title", getText(item.title, "レボアート"));
    const theme = createTextElement("p", "rf-art-card__theme", getText(item.theme, "応援の物語をアートで広げる企画です。"));
    header.append(title, theme);

    const shortMessage = createTextElement("p", "rf-art-card__short-message", getText(item.shortMessage, "応援と表現を広げる準備中です。"));
    const area = createTextElement("p", "rf-art-card__area", getText(item.areaLabel, "全国展開準備中"));
    const labels = createLabelList(item.labels, "rf-art-card__labels");
    const application = createApplicationSummaryBlock(item);
    const winningLabel = createTextElement("p", "rf-art-card__winning-label", getText(item.winningRevoArtSpotLabel, "当選レボアートスポット"));

    const actions = document.createElement("div");
    actions.className = "rf-art-card__actions";
    actions.append(createApplicationAction(item), createDetailLink(item));

    card.append(visual, header, shortMessage, area);

    if (labels.childElementCount > 0) {
      card.append(labels);
    }

    card.append(application, winningLabel, actions);
    return card;
  }

  function renderRevoArtList(items, winningSpots) {
    const container = document.getElementById("rf-art-list");
    const message = document.getElementById("rf-art-message");
    const mapContainer = document.getElementById("rf-art-map");
    const counterContainer = document.getElementById("rf-art-counters");
    const winningContainer = document.getElementById("rf-art-winning-spot");

    if (!container) {
      return;
    }

    container.replaceChildren();

    if (!Array.isArray(items) || items.length === 0) {
      if (message) {
        message.textContent = "現在表示できるレボアート企画はありません。";
      }
      return;
    }

    for (const item of items) {
      container.append(createRevoArtCard(item));
    }

    if (message) {
      message.textContent = "レボアート3カテゴリの申請受付情報を表示しています。";
    }

    if (mapContainer) {
      mapContainer.replaceChildren(createPreparingMapBlock("全国展開準備中"));
    }

    if (counterContainer) {
      counterContainer.replaceChildren(createCounterPreviewBlock());
    }

    if (winningContainer) {
      winningContainer.replaceChildren(createWinningRevoArtSpotBlock(winningSpots));
    }
  }

  function getRevoArtIdFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id") || "";
  }

  function createBackLink() {
    const link = document.createElement("a");
    link.className = "rf-art-detail__back-link";
    link.href = "revo-art.html";
    link.textContent = "一覧ページへ戻る";
    return link;
  }

  function renderNotFound(container, message) {
    container.replaceChildren();

    const block = document.createElement("section");
    block.className = "rf-art-detail__empty";

    const title = createTextElement("h1", "rf-art-detail__title", "該当するレボアート企画が見つかりません。");
    const text = createTextElement("p", "rf-art-detail__text", "URLの内容を確認するか、一覧ページからレボアート企画を選んでください。");
    block.append(title, text, createBackLink());
    container.append(block);

    if (message) {
      message.textContent = "レボアート企画が見つかりませんでした。";
    }
  }

  function renderRevoArtDetail(items, winningSpots) {
    const container = document.getElementById("rf-art-detail");
    const message = document.getElementById("rf-art-detail-message");

    if (!container) {
      return;
    }

    const id = getRevoArtIdFromQuery();
    const item = Array.isArray(items) ? items.find((entry) => entry.id === id) : null;

    if (!item) {
      renderNotFound(container, message);
      return;
    }

    container.replaceChildren();

    const header = document.createElement("header");
    header.className = "rf-art-detail__hero";
    const heroTop = document.createElement("div");
    heroTop.className = "rf-art-detail__hero-grid";

    const heroCopy = document.createElement("div");
    heroCopy.className = "rf-art-detail__hero-copy";
    heroCopy.append(
      createTextElement("p", "rf-art-detail__eyebrow", "レボアート詳細"),
      createTextElement("h1", "rf-art-detail__title", getText(item.title, "レボアート")),
      createTextElement("p", "rf-art-detail__lead", getText(item.shortMessage, getText(item.theme, "応援の物語をアートで広げる企画です。"))),
      createApplicationSummaryBlock(item),
      createTextElement("p", "rf-art-application-summary__note", getText(item.applicationNote, "申請は先着順ではありません。運営サイドで確認・抽選・決定します。"))
    );

    const heroAction = document.createElement("div");
    heroAction.className = "rf-art-detail__hero-action";
    heroAction.appendChild(createApplicationAction(item));

    heroTop.append(createCategoryVisual(item, "rf-art-visual--detail"), heroCopy, heroAction);
    header.append(
      heroTop,
      createTextElement("p", "rf-art-detail__text", getText(item.description, "このレボアート企画は準備中です。"))
    );

    const detailLead = createTextElement("p", "rf-art-detail__lead-card", getText(item.detailLead, "詳細情報は準備中です。"));

    const targetSection = document.createElement("section");
    targetSection.className = "rf-art-detail__section";
    targetSection.append(
      createTextElement("h2", "rf-art-detail__section-title", "募集対象"),
      createTextList(item.targetItems, "rf-art-detail__list")
    );

    const stepsSection = document.createElement("section");
    stepsSection.className = "rf-art-detail__section";
    stepsSection.append(
      createTextElement("h2", "rf-art-detail__section-title", "参加までの流れ"),
      createTextList(item.participationSteps, "rf-art-detail__list")
    );

    const counterSection = document.createElement("section");
    counterSection.className = "rf-art-detail__section";
    counterSection.append(
      createTextElement("h2", "rf-art-detail__section-title", "関連カウンター"),
      createLabelList(item.relatedCounters, "rf-art-detail__labels")
    );

    const mapBlock = document.createElement("section");
    mapBlock.className = "rf-art-map-placeholder";
    mapBlock.append(createPreparingMapBlock(getText(item.mapLabel, "全国展開準備中")));

    const notice = createTextElement("p", "rf-art-detail__notice", getText(item.notice, "公開許可を得た情報のみ掲載します。"));
    const actions = document.createElement("div");
    actions.className = "rf-art-detail__actions";
    actions.append(createApplicationAction(item), createBackLink());

    const winning = document.createElement("section");
    winning.className = "rf-art-winning-spot";
    winning.append(createWinningRevoArtSpotByCategoryBlock(winningSpots, id));

    container.append(header, detailLead, targetSection, stepsSection, counterSection, mapBlock, winning, notice, actions);

    if (message) {
      message.textContent = "レボアート詳細を表示しています。";
    }
  }

  function renderLoadError() {
    const listContainer = document.getElementById("rf-art-list");
    const listMessage = document.getElementById("rf-art-message");
    const detailContainer = document.getElementById("rf-art-detail");
    const detailMessage = document.getElementById("rf-art-detail-message");

    if (listContainer) {
      listContainer.replaceChildren();
    }

    if (listMessage) {
      listMessage.textContent = "レボアート情報を読み込めませんでした。時間をおいて再度ご確認ください。";
    }

    if (detailContainer) {
      detailContainer.replaceChildren();
    }

    if (detailMessage) {
      detailMessage.textContent = "レボアート情報を読み込めませんでした。時間をおいて再度ご確認ください。";
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const pageRoot = document.querySelector("[data-revo-art-page]");

    if (!pageRoot) {
      return;
    }

    try {
      const [data, winningSpots] = await Promise.all([
        loadRevoArtData(),
        loadWinningRevoArtSpots().catch((error) => {
          console.error(error);
          return [];
        })
      ]);
      const pageType = pageRoot.getAttribute("data-revo-art-page");

      if (pageType === "detail") {
        renderRevoArtDetail(data, winningSpots);
      } else {
        renderRevoArtList(data, winningSpots);
      }
    } catch (error) {
      renderLoadError();
      console.error(error);
    }
  });
}());
