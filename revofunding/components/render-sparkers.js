(function () {
  "use strict";

  const fallbackProjectTitle = "関連する挑戦は確認中です";

  function withCacheBuster(url) {
    const version = new URLSearchParams(window.location.search).get("t") || "v2";
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}t=${encodeURIComponent(version)}`;
  }

  async function fetchJson(url) {
    const response = await fetch(withCacheBuster(url));

    if (!response.ok) {
      throw new Error(`${url} を読み込めませんでした。`);
    }

    return response.json();
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

  function getRate(value, fallbackValue) {
    const rate = getNumber(value);

    if (rate > 0) {
      return Math.max(0, Math.min(100, rate));
    }

    return Math.max(0, Math.min(100, getNumber(fallbackValue)));
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
    media.setAttribute("aria-label", "スパーカー募集の画像枠");

    const placeholder = createTextElement("span", "revo-sparker-card__media-placeholder", "募集イメージ");
    media.append(placeholder);
    return media;
  }

  function getStatusLabel(project) {
    if (project && project.status === "completed") {
      return "達成済み";
    }

    if (project && project.status === "published") {
      return "スパーカー募集中";
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
    const title = createTextElement("h3", "revo-sparker-card__title", getText(sparker.title, getText(project && project.title, "スパーカー募集")));
    const role = createTextElement("p", "revo-sparker-card__role", getText(sparker.sparkerRole, getText(project && project.revoMeisterRole, "最初の火をつける仲間")));
    header.append(status, title, role);

    const description = createTextElement("p", "revo-sparker-card__description", getText(sparker.description, getText(project && project.description, "このスパーカー募集の内容を確認できます。")));

    const typeList = createChipList(Array.isArray(sparker.sparkerTypes) ? sparker.sparkerTypes : [], "revo-sparker-card__chips");
    const labels = Array.isArray(sparker.labels) ? sparker.labels : [];
    const labelList = createChipList(labels, "revo-sparker-card__labels");

    const metrics = document.createElement("div");
    metrics.className = "revo-sparker-card__metrics";
    metrics.append(
      createMetric("達成人数", getText(project && project.sparkAchievedPeople, "集計準備中")),
      createMetric("目標人数", getText(project && project.sparkTargetPeople, "受付後に反映")),
      createMetric("達成率", `${getRate(project && project.sparkAchievementRate, project && project.progressRate)}%`),
      createMetric("目標期日", getText(project && project.sparkTargetDate, "受付後に反映")),
      createMetric("目標組数", getText(project && project.sparkTargetGroups, "受付後に反映")),
      createMetric("達成組数", getText(project && project.sparkAchievedGroups, "集計準備中")),
      createMetric("目標金額", getText(project && project.sparkTargetAmount, "受付後に反映"))
    );

    const progress = createProgressBlock(project);
    const related = createTextElement("p", "revo-sparker-card__related", `関連する挑戦：${getText(project && project.title, fallbackProjectTitle)}`);

    card.append(media, header, description);

    if (typeList.childElementCount > 0) {
      card.append(typeList);
    }

    card.append(progress, metrics);

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

  function renderSparkers({ container, messageContainer, sparkers, projects }) {
    container.replaceChildren();

    const projectMap = createProjectMap(projects);
    const sortedSparkers = Array.isArray(sparkers)
      ? [...sparkers].sort((a, b) => getNumber(a.displayOrder) - getNumber(b.displayOrder))
      : [];

    if (sortedSparkers.length === 0) {
      if (messageContainer) {
        messageContainer.textContent = "現在表示できるスパーカー募集はありません。";
      }
      return;
    }

    for (const sparker of sortedSparkers) {
      const project = projectMap.get(sparker.relatedProjectId);
      container.append(createCard(sparker, project));
    }

    if (messageContainer) {
      messageContainer.textContent = "現在表示できる募集を掲載しています。新しい募集は順次追加されます。";
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("revo-sparker-list");
    const messageContainer = document.getElementById("revo-sparker-message");

    if (!container) {
      return;
    }

    try {
      const [sparkers, projects] = await Promise.all([
        fetchJson("../data/sparkers-data.json"),
        fetchJson("../data/projects-data.json")
      ]);

      renderSparkers({
        container,
        messageContainer,
        sparkers,
        projects
      });
    } catch (error) {
      container.replaceChildren();

      if (messageContainer) {
        messageContainer.textContent = "スパーカー募集データを読み込めませんでした。ローカルで表示できない場合は、簡易サーバー経由で確認してください。";
      }

      console.error(error);
    }
  });
}());
