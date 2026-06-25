/*
  レボファンディング本体の共通カード描画JSです。
  ページ全体の制御、決済導線、詳細ページ遷移は含みません。
*/

(() => {
  const modifierByType = {
    spark: "revo-card--spark",
    boost: "revo-card--boost"
  };

  function appendTextElement(parent, tagName, className, text) {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = text || "";
    parent.appendChild(element);
    return element;
  }

  function createStat(label, value, modifiers = []) {
    const stat = document.createElement("div");
    stat.classList.add("revo-card__stat", ...modifiers);

    appendTextElement(stat, "span", "revo-card__stat-label", label);
    appendTextElement(stat, "span", "revo-card__stat-value", value || "-");

    return stat;
  }

  function createAction(project) {
    const label = project.ctaLabel || "確認する";

    if (!project.id) {
      const action = document.createElement("span");
      action.className = "revo-card__action";
      action.textContent = label;
      return action;
    }

    const action = document.createElement("a");
    action.className = "revo-card__action";
    action.href = `detail.html?id=${encodeURIComponent(project.id)}`;
    action.textContent = label;
    return action;
  }

  function hasDisplayValue(value) {
    if (value === undefined || value === null) {
      return false;
    }

    if (typeof value === "number") {
      return Number.isFinite(value);
    }

    return String(value).trim() !== "" && String(value) !== "NaN" && String(value) !== "undefined";
  }

  function displayValue(...values) {
    for (const value of values) {
      if (hasDisplayValue(value)) {
        return value;
      }
    }
    return "";
  }

  function countPair(currentDisplay, targetDisplay, fallbackDisplay) {
    if (hasDisplayValue(currentDisplay) && hasDisplayValue(targetDisplay)) {
      return `${currentDisplay} / ${targetDisplay}`;
    }
    return displayValue(fallbackDisplay) || "-";
  }

  function numericValue(...values) {
    for (const value of values) {
      if (!hasDisplayValue(value)) {
        continue;
      }

      const number = Number(value);
      if (Number.isFinite(number)) {
        return number;
      }
    }
    return 0;
  }

  function clampProgress(...values) {
    const number = numericValue(...values);
    return Math.max(0, Math.min(100, number));
  }

  function percentDisplay(...values) {
    return `${clampProgress(...values)}%`;
  }

  function metricConfigForProject(project) {
    if (project.type === "boost") {
      const rate = clampProgress(project.boostAchievementRate, project.progressRate);
      return {
        progressRate: rate,
        primary: [
          ["残り人数", displayValue(project.boostRemainingPeople) || "-"],
          ["目標人数", displayValue(project.boostTargetPeople, project.targetSupporterCountDisplay) || "受付後に反映"]
        ],
        secondary: [
          ["達成率", percentDisplay(project.boostAchievementRate, project.progressRate)],
          ["達成回数", displayValue(project.boostAchievedCount) || "-"],
          ["目標回数", displayValue(project.boostTargetCount) || "受付後に反映"],
          ["目標期日", displayValue(project.boostTargetDate, project.remainingDaysDisplay) || "受付後に反映"]
        ]
      };
    }

    if (project.type === "spark") {
      const rate = clampProgress(project.sparkAchievementRate, project.progressRate);
      return {
        progressRate: rate,
        primary: [
          ["達成人数", displayValue(project.sparkAchievedPeople, project.currentSupporterCountDisplay, project.supporterCountDisplay) || "集計準備中"],
          ["目標人数", displayValue(project.sparkTargetPeople, project.targetSupporterCountDisplay) || "受付後に反映"]
        ],
        secondary: [
          ["達成率", percentDisplay(project.sparkAchievementRate, project.progressRate)],
          ["目標期日", displayValue(project.sparkTargetDate, project.remainingDaysDisplay) || "受付後に反映"],
          ["目標組数", displayValue(project.sparkTargetGroups, project.targetGroupCountDisplay) || "受付後に反映"],
          ["達成組数", displayValue(project.sparkAchievedGroups, project.currentGroupCountDisplay) || "集計準備中"],
          ["目標金額", displayValue(project.sparkTargetAmount, project.targetAmountDisplay, project.currentAmountDisplay) || "受付後に反映"]
        ]
      };
    }

    return {
      progressRate: clampProgress(project.progressRate),
      primary: [
        ["支援者", countPair(project.currentSupporterCountDisplay, project.targetSupporterCountDisplay, project.supporterCountDisplay)],
        ["組数", countPair(project.currentGroupCountDisplay, project.targetGroupCountDisplay, "")]
      ],
      secondary: [
        ["現在", displayValue(project.currentAmountDisplay) || "-"],
        ["残り", displayValue(project.remainingDaysDisplay) || "-"],
        ["達成率", percentDisplay(project.progressRate)]
      ]
    };
  }

  function isLocalImagePath(src) {
    return typeof src === "string" && src.trim() !== "" && !/^https?:\/\//i.test(src);
  }

  function createMedia(project) {
    const media = document.createElement("div");
    media.className = "revo-card__media";

    if (isLocalImagePath(project.image)) {
      const image = document.createElement("img");
      image.className = "revo-card__media-image";
      image.src = project.image;
      image.alt = project.imageAlt || "プロジェクト画像";
      media.appendChild(image);
      return media;
    }

    const placeholder = document.createElement("div");
    placeholder.className = "revo-card__media-placeholder";
    placeholder.textContent = "画像プレースホルダー";
    media.appendChild(placeholder);

    return media;
  }

  function createProjectCard(project) {
    const article = document.createElement("article");
    article.classList.add("revo-card");

    const typeClass = modifierByType[project.type];
    if (typeClass) {
      article.classList.add(typeClass);
    }

    article.appendChild(createMedia(project));

    const body = document.createElement("div");
    body.className = "revo-card__body";

    appendTextElement(body, "span", "revo-card__badge", project.category || "挑戦");
    appendTextElement(body, "h2", "revo-card__title", project.title);
    appendTextElement(body, "p", "revo-card__description", project.description);

    const progress = document.createElement("div");
    progress.className = "revo-card__progress";

    const progressTrack = document.createElement("div");
    progressTrack.className = "revo-card__progress-track";

    const cardMetrics = metricConfigForProject(project);

    const progressBar = document.createElement("div");
    progressBar.className = "revo-card__progress-bar";
    progressBar.style.width = `${cardMetrics.progressRate}%`;

    progressTrack.appendChild(progressBar);
    progress.appendChild(progressTrack);
    body.appendChild(progress);

    const stats = document.createElement("div");
    stats.className = "revo-card__stats";

    const primaryStats = document.createElement("div");
    primaryStats.className = "revo-card__stats-primary";
    cardMetrics.primary.forEach(([label, value]) => {
      primaryStats.appendChild(createStat(label, value, ["revo-card__stat--primary"]));
    });

    const secondaryStats = document.createElement("div");
    secondaryStats.className = "revo-card__stats-secondary";
    cardMetrics.secondary.forEach(([label, value]) => {
      const modifiers = ["revo-card__stat--compact"];
      if (label.includes("金額") || label === "現在") {
        modifiers.push("revo-card__stat--amount");
      }
      secondaryStats.appendChild(createStat(label, value, modifiers));
    });

    stats.appendChild(primaryStats);
    stats.appendChild(secondaryStats);
    body.appendChild(stats);

    const actions = document.createElement("div");
    actions.className = "revo-card__actions";
    actions.appendChild(createAction(project));
    body.appendChild(actions);

    article.appendChild(body);
    return article;
  }

  async function loadRevoProjects(jsonPath) {
    const response = await fetch(jsonPath);
    if (!response.ok) {
      throw new Error(`projects-data.json を読み込めませんでした: HTTP ${response.status}`);
    }

    const projects = await response.json();
    if (!Array.isArray(projects)) {
      throw new Error("projects-data.json は配列形式である必要があります。");
    }

    return projects;
  }

  function renderRevoCards(options = {}) {
    const { container, projects, messageContainer } = options;

    if (!container) {
      throw new Error("renderRevoCards には描画先 container が必要です。");
    }

    if (!Array.isArray(projects)) {
      throw new Error("renderRevoCards には projects 配列が必要です。");
    }

    const cards = projects.map(createProjectCard);
    container.replaceChildren(...cards);

    if (messageContainer) {
      messageContainer.textContent = `${projects.length}件の挑戦を表示しています。`;
    }

    return cards;
  }

  window.RevoCards = {
    loadRevoProjects,
    renderRevoCards,
    createProjectCard
  };
})();
