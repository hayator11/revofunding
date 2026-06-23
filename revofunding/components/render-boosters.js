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
    media.setAttribute("aria-label", "ブースター募集の画像枠");

    const placeholder = createTextElement("span", "revo-booster-card__media-placeholder", "関わり方のイメージ");
    media.append(placeholder);
    return media;
  }

  function createAccumulationItem(label, value) {
    const item = document.createElement("div");
    item.className = "revo-booster-card__accumulation-item";

    const labelElement = createTextElement("span", "revo-booster-card__accumulation-label", label);
    const valueElement = createTextElement("span", "revo-booster-card__accumulation-value", value);

    item.append(labelElement, valueElement);
    return item;
  }

  function getProgressWidth(rateLabel) {
    if (rateLabel === "0%") {
      return "0%";
    }

    return "0%";
  }

  function createAccumulationProgress(booster) {
    const rateLabel = getText(booster.achievementRateLabel, "0%");
    const progress = document.createElement("div");
    progress.className = "revo-booster-card__progress";

    const progressHead = document.createElement("div");
    progressHead.className = "revo-booster-card__progress-head";

    const progressLabel = createTextElement("span", "revo-booster-card__progress-label", "次の節目に対する積み上げ率");
    const progressValue = createTextElement("span", "revo-booster-card__progress-value", rateLabel);
    progressHead.append(progressLabel, progressValue);

    const progressTrack = document.createElement("div");
    progressTrack.className = "revo-booster-card__progress-track";
    progressTrack.setAttribute("aria-hidden", "true");

    const progressFill = document.createElement("div");
    progressFill.className = "revo-booster-card__progress-fill";
    progressFill.style.width = getProgressWidth(rateLabel);

    progressTrack.append(progressFill);
    progress.append(progressHead, progressTrack);
    return progress;
  }

  function createAccumulationBlock(booster) {
    const block = document.createElement("section");
    block.className = "revo-booster-card__accumulation";
    block.setAttribute("aria-label", "応援パッケージの積み上げ状況");

    const modelText = createTextElement(
      "p",
      "revo-booster-card__accumulation-text",
      getText(booster.boostModelText, "応援を広げる関わり方を確認できます。")
    );

    const status = document.createElement("div");
    status.className = "revo-booster-card__accumulation-status";
    status.append(
      createAccumulationItem("現在", `${getText(booster.displayAccumulatedPackageCount, "0")} ${getText(booster.packageUnitLabel, "応援パッケージ")}`),
      createAccumulationItem("次の節目", getText(booster.displayMilestonePackageCount, "確認中")),
      createAccumulationItem("次の節目まで", `あと${getText(booster.displayRemainingToMilestone, "確認中")}`),
      createAccumulationItem("積み上げ率", getText(booster.achievementRateLabel, "確認中"))
    );

    const progress = createAccumulationProgress(booster);

    block.append(modelText, progress, status);

    if (booster.isUnlimitedAccumulation === true) {
      const continuityLabel = createTextElement("span", "revo-booster-card__accumulation-badge", "積み上げ継続型");
      block.append(continuityLabel);
    }

    return block;
  }

  function createCard(booster, projectTitle) {
    const card = document.createElement("article");
    card.className = "revo-booster-card";

    const media = createMediaBlock();

    const header = document.createElement("div");
    header.className = "revo-booster-card__header";

    const title = createTextElement("h3", "revo-booster-card__title", getText(booster.title, "ブースター募集"));
    const role = createTextElement("p", "revo-booster-card__role", getText(booster.boosterRole, "挑戦を広げる人"));
    header.append(title, role);

    const description = createTextElement("p", "revo-booster-card__description", getText(booster.description, "このブースター募集の内容を確認できます。"));
    const accumulation = createAccumulationBlock(booster);

    const boosterTypes = Array.isArray(booster.boosterTypes) ? booster.boosterTypes : [];
    const typeList = createChipList(boosterTypes, "revo-booster-card__chips");

    const metrics = document.createElement("div");
    metrics.className = "revo-booster-card__metrics";
    metrics.append(
      createMetric("必要な仲間", getNumber(booster.neededCount)),
      createMetric("参加予定", getNumber(booster.currentCount)),
      createMetric("関係する組", getNumber(booster.groupCount))
    );

    const labels = Array.isArray(booster.labels) ? booster.labels : [];
    const labelList = createChipList(labels, "revo-booster-card__labels");

    const related = createTextElement("p", "revo-booster-card__related", `関連する挑戦：${projectTitle}`);

    const action = document.createElement("span");
    action.className = "revo-booster-card__action";
    action.textContent = getText(booster.ctaLabel, "順次受付予定");

    card.append(media, header, description, accumulation);

    if (typeList.childElementCount > 0) {
      card.append(typeList);
    }

    card.append(metrics);

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

  function renderBoosters({ container, messageContainer, boosters, projects }) {
    container.replaceChildren();

    const projectTitleMap = createProjectTitleMap(projects);
    const sortedBoosters = Array.isArray(boosters)
      ? [...boosters].sort((a, b) => getNumber(a.displayOrder) - getNumber(b.displayOrder))
      : [];

    if (sortedBoosters.length === 0) {
      if (messageContainer) {
        messageContainer.textContent = "現在表示できるブースター募集案内はありません。";
      }
      return;
    }

    for (const booster of sortedBoosters) {
      const projectTitle = projectTitleMap.get(booster.relatedProjectId) || fallbackProjectTitle;
      container.append(createCard(booster, projectTitle));
    }

    if (messageContainer) {
      messageContainer.textContent = "ブースター募集を一覧で表示しています。気になる募集があれば、内容を確認して参加をご検討ください。";
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("revo-booster-list");
    const messageContainer = document.getElementById("revo-booster-message");

    if (!container) {
      return;
    }

    try {
      const [boosters, projects] = await Promise.all([
        fetchJson("../data/boosters-data.json"),
        fetchJson("../data/projects-data.json")
      ]);

      renderBoosters({
        container,
        messageContainer,
        boosters,
        projects
      });
    } catch (error) {
      container.replaceChildren();

      if (messageContainer) {
        messageContainer.textContent = "ブースター募集データを読み込めませんでした。ローカルで表示できない場合は、簡易サーバー経由で確認してください。";
      }

      console.error(error);
    }
  });
}());
