(function () {
  "use strict";

  const fallbackProjectTitle = "関連する挑戦は確認中です";

  async function fetchJson(url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`${url} を読み込めませんでした。`);
    }

    return response.json();
  }

  function withCacheToken(url) {
    const token = new URLSearchParams(window.location.search).get("t") || "card-fit-004";
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}t=${encodeURIComponent(token)}`;
  }

  function getText(value, fallbackText) {
    if (typeof value === "string" && value.trim() !== "") {
      return value;
    }

    return fallbackText;
  }

  function getNumber(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    return 0;
  }

  function getTimestamp(value) {
    if (typeof value !== "string" || value.trim() === "") {
      return 0;
    }

    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp) ? timestamp : 0;
  }

  function compareNewestFirst(a, b) {
    const timestampDiff = Math.max(getTimestamp(b.updatedAt), getTimestamp(b.createdAt)) - Math.max(getTimestamp(a.updatedAt), getTimestamp(a.createdAt));

    if (timestampDiff !== 0) {
      return timestampDiff;
    }

    return getNumber(a.displayOrder) - getNumber(b.displayOrder);
  }

  function getSparkerCategoryText(sparker) {
    return [
      sparker && sparker.title,
      sparker && sparker.description,
      sparker && sparker.sparkerRole,
      ...(Array.isArray(sparker && sparker.sparkerTypes) ? sparker.sparkerTypes : []),
      ...(Array.isArray(sparker && sparker.labels) ? sparker.labels : [])
    ].filter((value) => typeof value === "string").join(" ");
  }

  function matchesCategory(sparker, category) {
    if (category === "all") {
      return true;
    }

    return getSparkerCategoryText(sparker).includes(category);
  }

  function getRate(value, fallbackValue) {
    const rate = getNumber(value);

    if (rate > 0) {
      return Math.max(0, Math.min(100, rate));
    }

    return Math.max(0, Math.min(100, getNumber(fallbackValue)));
  }

  function getRemainingDays(project, targetDateKey) {
    return getText(project && project.remainingDaysDisplay, getText(project && project[targetDateKey], "受付後に反映"));
  }

  function getPeopleRemaining(project) {
    const explicitRemaining = getText(project && project.sparkRemainingPeople, "");

    if (explicitRemaining !== "") {
      return explicitRemaining;
    }

    const achieved = parseInt(getText(project && project.sparkAchievedPeople, ""), 10);
    const target = parseInt(getText(project && project.sparkTargetPeople, ""), 10);

    if (Number.isFinite(achieved) && Number.isFinite(target)) {
      return `${Math.max(0, target - achieved)}人`;
    }

    return "集計準備中";
  }

  function createTextElement(tagName, className, text) {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = text;
    return element;
  }

  function createChipList(items, className) {
    const list = document.createElement("div");
    list.className = className;

    for (const item of items) {
      if (typeof item !== "string" || item.trim() === "") {
        continue;
      }

      const chip = document.createElement("span");
      chip.className = "revo-sparker-card__chip";
      chip.textContent = item;
      list.append(chip);
    }

    return list;
  }

  function createPersonLabelList(items) {
    const list = document.createElement("div");
    list.className = "revo-person-card__labels";

    if (!Array.isArray(items)) {
      return list;
    }

    for (const item of items) {
      if (typeof item !== "string" || item.trim() === "") {
        continue;
      }

      list.append(createTextElement("span", "revo-person-card__label", item));
    }

    return list;
  }

  function createMetric(label, value) {
    const metric = document.createElement("div");
    metric.className = "revo-sparker-card__metric";

    const labelElement = createTextElement("span", "revo-sparker-card__metric-label", label);
    const valueElement = createTextElement("span", "revo-sparker-card__metric-value", `${value}`);

    metric.append(labelElement, valueElement);
    return metric;
  }

  function createMediaBlock() {
    const media = document.createElement("div");
    media.className = "revo-sparker-card__media";
    media.setAttribute("aria-label", "スパーク募集の画像枠");

    const placeholder = createTextElement("span", "revo-sparker-card__media-placeholder", "募集イメージ");
    media.append(placeholder);
    return media;
  }

  function createRevoMeisterCard(project) {
    const card = document.createElement("article");
    card.className = "revo-person-card revo-person-card--meister";

    const media = document.createElement("div");
    media.className = "revo-person-card__media";
    media.setAttribute("aria-label", "レボマイスターの画像枠");
    media.append(createTextElement("span", "revo-person-card__media-placeholder", "レボマイスター"));

    const header = document.createElement("div");
    header.className = "revo-person-card__header";
    header.append(
      createTextElement("span", "revo-person-card__status", "起案者紹介"),
      createTextElement("h3", "revo-person-card__name", getText(project.title, "レボマイスター")),
      createTextElement("p", "revo-person-card__role", getText(project.revoMeisterRole, "挑戦を起こす人"))
    );

    const description = createTextElement("p", "revo-person-card__description", getText(project.revoMeisterMessage, "挑戦の背景や想いを、公開許可後に掲載します。"));
    const labels = createPersonLabelList(project.revoMeisterLabels);

    const metaList = document.createElement("div");
    metaList.className = "revo-person-card__meta-list";
    metaList.append(
      createMetricLikePerson("関連する挑戦", getText(project.title, "公開準備中")),
      createMetricLikePerson("挑戦タイプ", project.type === "boost" ? "ブースト" : "スパーク"),
      createMetricLikePerson("公開状態", project.status === "completed" ? "達成済み" : "募集中")
    );

    const action = document.createElement("a");
    action.className = "revo-person-card__action";
    action.href = `detail.html?id=${encodeURIComponent(project.id)}`;
    action.textContent = "起案者の挑戦を見る";

    card.append(media, header, description);

    if (labels.childElementCount > 0) {
      card.append(labels);
    }

    card.append(metaList, action);
    return card;
  }

  function createMetricLikePerson(label, value) {
    const item = document.createElement("div");
    item.className = "revo-person-card__meta";
    item.append(
      createTextElement("span", "revo-person-card__meta-label", label),
      createTextElement("span", "revo-person-card__meta-value", value)
    );
    return item;
  }

  function getStatusLabel(project) {
    if (project && project.status === "completed") {
      return "達成済み";
    }

    if (project && project.status === "published") {
      return "スパーク受付中";
    }

    return "順次受付予定";
  }

  function createProgressBlock(project) {
    const rate = getRate(project && project.sparkAchievementRate, project && project.progressRate);
    const progress = document.createElement("div");
    progress.className = "revo-sparker-card__progress";

    const progressHead = document.createElement("div");
    progressHead.className = "revo-sparker-card__progress-head";

    const progressContext = createTextElement("span", "revo-sparker-card__progress-label", "達成率");
    const progressValue = createTextElement("span", "revo-sparker-card__progress-value", `${rate}%`);
    progressHead.append(progressContext, progressValue);

    const progressTrack = document.createElement("div");
    progressTrack.className = "revo-sparker-card__progress-track";
    progressTrack.setAttribute("aria-hidden", "true");

    const progressFill = document.createElement("div");
    progressFill.className = "revo-sparker-card__progress-fill";
    progressFill.style.width = `${rate}%`;

    progressTrack.append(progressFill);
    progress.append(progressHead, progressTrack);
    return progress;
  }

  function createProjectMap(projects) {
    const projectMap = new Map();

    if (!Array.isArray(projects)) {
      return projectMap;
    }

    for (const project of projects) {
      if (project && typeof project.id === "string") {
        projectMap.set(project.id, project);
      }
    }

    return projectMap;
  }

  function createCard(sparker, project) {
    const card = document.createElement("article");
    card.className = "revo-sparker-card";

    const media = createMediaBlock();

    const header = document.createElement("div");
    header.className = "revo-sparker-card__header";

    const status = createTextElement("span", "revo-sparker-card__status", getStatusLabel(project));
    const title = createTextElement("h3", "revo-sparker-card__title", getText(sparker.title, getText(project && project.title, "スパーク募集")));
    const role = createTextElement("p", "revo-sparker-card__role", getText(sparker.sparkerRole, getText(project && project.revoMeisterRole, "最初の火をつける仲間")));
    header.append(status, title, role);

    const description = createTextElement("p", "revo-sparker-card__description", getText(sparker.description, getText(project && project.description, "このスパーク募集の内容を確認できます。")));

    const typeList = createChipList(Array.isArray(sparker.sparkerTypes) ? sparker.sparkerTypes : [], "revo-sparker-card__chips");
    const labels = Array.isArray(sparker.labels) ? sparker.labels : [];
    const labelList = createChipList(labels, "revo-sparker-card__labels");

    const metrics = document.createElement("div");
    metrics.className = "revo-sparker-card__metrics";
    metrics.append(
      createMetric("残り", getPeopleRemaining(project)),
      createMetric("目標", getText(project && project.sparkTargetPeople, "受付後に反映")),
      createMetric("達成", getText(project && project.sparkAchievedGroups, "集計準備中")),
      createMetric("目標", getText(project && project.sparkTargetGroups, "受付後に反映")),
      createMetric("残り", getRemainingDays(project, "sparkTargetDate")),
      createMetric("目標", getText(project && project.sparkTargetAmount, "受付後に反映"))
    );

    const progress = createProgressBlock(project);
    const related = createTextElement("p", "revo-sparker-card__related", `関連する挑戦：${getText(project && project.title, fallbackProjectTitle)}`);

    card.append(media, header, description);

    if (typeList.childElementCount > 0) {
      card.append(typeList);
    }

    card.append(metrics, progress);

    if (labelList.childElementCount > 0) {
      card.append(labelList);
    }

    card.append(related);

    if (project && typeof project.id === "string") {
      const action = document.createElement("a");
      action.className = "revo-sparker-card__action";
      action.href = `detail.html?id=${encodeURIComponent(project.id)}`;
      action.textContent = "募集を見る";
      card.append(action);
    }

    return card;
  }

  function renderSparkers({ container, messageContainer, sparkers, projects, activeCategory = "all" }) {
    container.replaceChildren();

    const projectMap = createProjectMap(projects);
    const sortedSparkers = Array.isArray(sparkers)
      ? [...sparkers].filter((sparker) => matchesCategory(sparker, activeCategory)).sort(compareNewestFirst)
      : [];

    if (sortedSparkers.length === 0) {
      if (messageContainer) {
        messageContainer.textContent = "このカテゴリで表示できるスパーク募集はありません。";
      }
      return;
    }

    for (const sparker of sortedSparkers) {
      const project = projectMap.get(sparker.relatedProjectId);
      container.append(createCard(sparker, project));
    }

    if (messageContainer) {
      messageContainer.textContent = activeCategory === "all"
        ? "現在表示できる募集を掲載しています。新しい募集は順次追加されます。"
        : `${activeCategory}に関係する募集を表示しています。`;
    }
  }

  function renderFilterControls({ container, onChange }) {
    if (!container) {
      return;
    }

    const categories = [
      { label: "すべて", value: "all" },
      { label: "共感", value: "共感" },
      { label: "紹介", value: "紹介" },
      { label: "地域", value: "地域" },
      { label: "アート", value: "アート" },
      { label: "見守り", value: "見守り" }
    ];

    container.replaceChildren();

    for (const category of categories) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "revo-sparker-filter__button";
      button.textContent = category.label;
      button.dataset.category = category.value;
      button.setAttribute("aria-pressed", category.value === "all" ? "true" : "false");
      button.addEventListener("click", () => {
        for (const currentButton of container.querySelectorAll(".revo-sparker-filter__button")) {
          currentButton.setAttribute("aria-pressed", currentButton === button ? "true" : "false");
        }

        onChange(category.value);
      });
      container.append(button);
    }
  }

  function renderRevoMeisters({ container, sparkers, projects }) {
    if (!container) {
      return;
    }

    container.replaceChildren();

    const projectMap = createProjectMap(projects);
    const sortedSparkers = Array.isArray(sparkers)
      ? [...sparkers].sort(compareNewestFirst)
      : [];
    const meisterProjects = sortedSparkers
      .map((sparker) => projectMap.get(sparker.relatedProjectId))
      .filter((project) => project && typeof project.id === "string" && project.status !== "hidden");
    const fallbackProjects = Array.isArray(projects)
      ? projects.filter((project) => project && typeof project.id === "string" && project.type === "spark" && project.status !== "hidden")
      : [];
    const publicProjects = meisterProjects.length > 0 ? meisterProjects : fallbackProjects;

    for (const project of publicProjects) {
      container.append(createRevoMeisterCard(project));
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("revo-sparker-list");
    const messageContainer = document.getElementById("revo-sparker-message");
    const filterContainer = document.getElementById("revo-sparker-filter-list");

    if (!container) {
      return;
    }

    try {
      const [sparkers, projects] = await Promise.all([
        fetchJson(withCacheToken("../data/sparkers-data.json")),
        fetchJson(withCacheToken("../data/projects-data.json"))
      ]);

      renderFilterControls({
        container: filterContainer,
        onChange: (activeCategory) => renderSparkers({
          container,
          messageContainer,
          sparkers,
          projects,
          activeCategory
        })
      });

      renderSparkers({
        container,
        messageContainer,
        sparkers,
        projects
      });

      renderRevoMeisters({
        container: document.getElementById("revo-meister-list"),
        sparkers,
        projects
      });
    } catch (error) {
      container.replaceChildren();

      if (messageContainer) {
        messageContainer.textContent = "スパーク募集データを読み込めませんでした。ローカルで表示できない場合は、簡易サーバー経由で確認してください。";
      }

      console.error(error);
    }
  });
}());
