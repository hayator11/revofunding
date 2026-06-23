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

  function getProgressWidth(progressLabel) {
    if (progressLabel.includes("0%")) {
      return "0%";
    }

    return "0%";
  }

  function createProgressBlock(sparker) {
    const progressLabelText = getText(sparker.progressLabel, "最初の仲間集まり率は確認中です");
    const progress = document.createElement("div");
    progress.className = "revo-sparker-card__progress";

    const progressHead = document.createElement("div");
    progressHead.className = "revo-sparker-card__progress-head";

    const progressContext = createTextElement("span", "revo-sparker-card__progress-label", "最初の仲間集まり率");
    const progressValue = createTextElement("span", "revo-sparker-card__progress-value", progressLabelText);
    progressHead.append(progressContext, progressValue);

    const progressTrack = document.createElement("div");
    progressTrack.className = "revo-sparker-card__progress-track";
    progressTrack.setAttribute("aria-hidden", "true");

    const progressFill = document.createElement("div");
    progressFill.className = "revo-sparker-card__progress-fill";
    progressFill.style.width = getProgressWidth(progressLabelText);

    const progressNote = createTextElement("p", "revo-sparker-card__progress-note", "ブーストへ進む準備が整う節目として扱います。");

    progressTrack.append(progressFill);
    progress.append(progressHead, progressTrack, progressNote);
    return progress;
  }

  function createCard(sparker, projectTitle) {
    const card = document.createElement("article");
    card.className = "revo-sparker-card";

    const media = createMediaBlock();

    const header = document.createElement("div");
    header.className = "revo-sparker-card__header";

    const title = createTextElement("h3", "revo-sparker-card__title", getText(sparker.title, "スパーカー募集"));
    const role = createTextElement("p", "revo-sparker-card__role", getText(sparker.sparkerRole, "最初の火をつける仲間"));
    header.append(title, role);

    const description = createTextElement("p", "revo-sparker-card__description", getText(sparker.description, "このスパーカー募集の内容を確認できます。"));

    const sparkerTypes = Array.isArray(sparker.sparkerTypes) ? sparker.sparkerTypes : [];
    const typeList = createChipList(sparkerTypes, "revo-sparker-card__chips");

    const metrics = document.createElement("div");
    metrics.className = "revo-sparker-card__metrics";
    metrics.append(
      createMetric("必要なスパーカー", getNumber(sparker.neededSparkerCount)),
      createMetric("参加予定", getNumber(sparker.currentSparkerCount)),
      createMetric("関係する組", getNumber(sparker.groupCount))
    );

    const progress = createProgressBlock(sparker);

    const labels = Array.isArray(sparker.labels) ? sparker.labels : [];
    const labelList = createChipList(labels, "revo-sparker-card__labels");

    const related = createTextElement("p", "revo-sparker-card__related", `関連する挑戦：${projectTitle}`);

    const action = document.createElement("span");
    action.className = "revo-sparker-card__action";
    action.textContent = getText(sparker.ctaLabel, "順次受付予定");

    card.append(media, header, description);

    if (typeList.childElementCount > 0) {
      card.append(typeList);
    }

    card.append(metrics, progress);

    if (labelList.childElementCount > 0) {
      card.append(labelList);
    }

    card.append(related, action);
    return card;
  }

  function createProjectTitleMap(projects) {
    const projectTitleMap = new Map();

    if (!Array.isArray(projects)) {
      return projectTitleMap;
    }

    for (const project of projects) {
      if (project && typeof project.id === "string" && typeof project.title === "string") {
        projectTitleMap.set(project.id, project.title);
      }
    }

    return projectTitleMap;
  }

  function renderSparkers({ container, messageContainer, sparkers, projects }) {
    container.replaceChildren();

    const projectTitleMap = createProjectTitleMap(projects);
    const sortedSparkers = Array.isArray(sparkers)
      ? [...sparkers].sort((a, b) => getNumber(a.displayOrder) - getNumber(b.displayOrder))
      : [];

    if (sortedSparkers.length === 0) {
      if (messageContainer) {
        messageContainer.textContent = "現在表示できるスパーカー募集案内はありません。";
      }
      return;
    }

    for (const sparker of sortedSparkers) {
      const projectTitle = projectTitleMap.get(sparker.relatedProjectId) || fallbackProjectTitle;
      container.append(createCard(sparker, projectTitle));
    }

    if (messageContainer) {
      messageContainer.textContent = "スパーカー募集を一覧で表示しています。気になる募集があれば、内容を確認して参加をご検討ください。";
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
