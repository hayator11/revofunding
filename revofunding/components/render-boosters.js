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

  function getBoosterCategoryText(booster) {
    return [
      booster && booster.title,
      booster && booster.description,
      booster && booster.boosterRole,
      ...(Array.isArray(booster && booster.boosterTypes) ? booster.boosterTypes : []),
      ...(Array.isArray(booster && booster.labels) ? booster.labels : [])
    ].filter((value) => typeof value === "string").join(" ");
  }

  function matchesCategory(booster, category) {
    if (category === "all") {
      return true;
    }

    return getBoosterCategoryText(booster).includes(category);
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
      chip.className = "revo-booster-card__chip";
      chip.textContent = item;
      list.append(chip);
    }

    return list;
  }

  function createMetric(label, value) {
    const metric = document.createElement("div");
    metric.className = "revo-booster-card__metric";

    const labelElement = createTextElement("span", "revo-booster-card__metric-label", label);
    const valueElement = createTextElement("span", "revo-booster-card__metric-value", `${value}`);

    metric.append(labelElement, valueElement);
    return metric;
  }

  function createMediaBlock() {
    const media = document.createElement("div");
    media.className = "revo-booster-card__media";
    media.setAttribute("aria-label", "ブースト募集の画像枠");

    const placeholder = createTextElement("span", "revo-booster-card__media-placeholder", "関わり方のイメージ");
    media.append(placeholder);
    return media;
  }

  function getStatusLabel(project) {
    if (project && project.status === "completed") {
      return "達成済み";
    }

    if (project && project.status === "published") {
      return "ブースト受付中";
    }

    return "順次受付予定";
  }

  function createProgressBlock(project) {
    const rate = getRate(project && project.boostAchievementRate, project && project.progressRate);
    const progress = document.createElement("div");
    progress.className = "revo-booster-card__progress";

    const progressHead = document.createElement("div");
    progressHead.className = "revo-booster-card__progress-head";

    const progressLabel = createTextElement("span", "revo-booster-card__progress-label", "達成率");
    const progressValue = createTextElement("span", "revo-booster-card__progress-value", `${rate}%`);
    progressHead.append(progressLabel, progressValue);

    const progressTrack = document.createElement("div");
    progressTrack.className = "revo-booster-card__progress-track";
    progressTrack.setAttribute("aria-hidden", "true");

    const progressFill = document.createElement("div");
    progressFill.className = "revo-booster-card__progress-fill";
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

  function createCard(booster, project) {
    const card = document.createElement("article");
    card.className = "revo-booster-card";

    const media = createMediaBlock();

    const header = document.createElement("div");
    header.className = "revo-booster-card__header";

    const status = createTextElement("span", "revo-booster-card__status", getStatusLabel(project));
    const title = createTextElement("h3", "revo-booster-card__title", getText(booster.title, getText(project && project.title, "ブースト募集")));
    const role = createTextElement("p", "revo-booster-card__role", getText(booster.boosterRole, getText(project && project.revoMeisterRole, "挑戦を広げる人")));
    header.append(status, title, role);

    const description = createTextElement("p", "revo-booster-card__description", getText(booster.description, getText(project && project.description, "このブースト募集の内容を確認できます。")));

    const typeList = createChipList(Array.isArray(booster.boosterTypes) ? booster.boosterTypes : [], "revo-booster-card__chips");
    const labels = Array.isArray(booster.labels) ? booster.labels : [];
    const labelList = createChipList(labels, "revo-booster-card__labels");

    const metrics = document.createElement("div");
    metrics.className = "revo-booster-card__metrics";
    metrics.append(
      createMetric("残り", getText(project && project.boostRemainingPeople, "集計準備中")),
      createMetric("目標", getText(project && project.boostTargetPeople, "受付後に反映")),
      createMetric("達成", getText(project && project.boostAchievedCount, "集計準備中")),
      createMetric("目標", getText(project && project.boostTargetCount, "受付後に反映")),
      createMetric("残り", getRemainingDays(project, "boostTargetDate")),
      createMetric("目標", getText(project && project.targetAmountDisplay, getText(project && project.currentAmountDisplay, "集計準備中")))
    );

    const progress = createProgressBlock(project);
    const related = createTextElement("p", "revo-booster-card__related", `関連する挑戦：${getText(project && project.title, fallbackProjectTitle)}`);

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
      action.className = "revo-booster-card__action";
      action.href = `detail.html?id=${encodeURIComponent(project.id)}`;
      action.textContent = "募集を見る";
      card.append(action);
    }

    return card;
  }

  function renderBoosters({ container, messageContainer, boosters, projects, activeCategory = "all" }) {
    container.replaceChildren();

    const projectMap = createProjectMap(projects);
    const sortedBoosters = Array.isArray(boosters)
      ? [...boosters].filter((booster) => matchesCategory(booster, activeCategory)).sort(compareNewestFirst)
      : [];

    if (sortedBoosters.length === 0) {
      if (messageContainer) {
        messageContainer.textContent = "このカテゴリで表示できるブースト募集はありません。";
      }
      return;
    }

    for (const booster of sortedBoosters) {
      const project = projectMap.get(booster.relatedProjectId);
      container.append(createCard(booster, project));
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
      { label: "拡散", value: "拡散" },
      { label: "紹介", value: "紹介" },
      { label: "地域", value: "地域" },
      { label: "アート", value: "アート" },
      { label: "場づくり", value: "場づくり" }
    ];

    container.replaceChildren();

    for (const category of categories) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "revo-booster-filter__button";
      button.textContent = category.label;
      button.dataset.category = category.value;
      button.setAttribute("aria-pressed", category.value === "all" ? "true" : "false");
      button.addEventListener("click", () => {
        for (const currentButton of container.querySelectorAll(".revo-booster-filter__button")) {
          currentButton.setAttribute("aria-pressed", currentButton === button ? "true" : "false");
        }

        onChange(category.value);
      });
      container.append(button);
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("revo-booster-list");
    const messageContainer = document.getElementById("revo-booster-message");
    const filterContainer = document.getElementById("revo-booster-filter-list");

    if (!container) {
      return;
    }

    try {
      const [boosters, projects] = await Promise.all([
        fetchJson(withCacheToken("../data/boosters-data.json")),
        fetchJson(withCacheToken("../data/projects-data.json"))
      ]);

      renderFilterControls({
        container: filterContainer,
        onChange: (activeCategory) => renderBoosters({
          container,
          messageContainer,
          boosters,
          projects,
          activeCategory
        })
      });

      renderBoosters({
        container,
        messageContainer,
        boosters,
        projects
      });
    } catch (error) {
      container.replaceChildren();

      if (messageContainer) {
        messageContainer.textContent = "ブースト募集データを読み込めませんでした。ローカルで表示できない場合は、簡易サーバー経由で確認してください。";
      }

      console.error(error);
    }
  });
}());
