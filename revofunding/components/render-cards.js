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

  function countPair(currentDisplay, targetDisplay, fallbackDisplay) {
    if (currentDisplay && targetDisplay) {
      return `${currentDisplay} / ${targetDisplay}`;
    }
    return fallbackDisplay || "-";
  }

  function clampProgress(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) {
      return 0;
    }
    return Math.max(0, Math.min(100, number));
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

    const progressBar = document.createElement("div");
    progressBar.className = "revo-card__progress-bar";
    progressBar.style.width = `${clampProgress(project.progressRate)}%`;

    progressTrack.appendChild(progressBar);
    progress.appendChild(progressTrack);
    body.appendChild(progress);

    const stats = document.createElement("div");
    stats.className = "revo-card__stats";

    const primaryStats = document.createElement("div");
    primaryStats.className = "revo-card__stats-primary";
    primaryStats.appendChild(createStat(
      "支援者",
      countPair(
        project.currentSupporterCountDisplay,
        project.targetSupporterCountDisplay,
        project.supporterCountDisplay
      ),
      ["revo-card__stat--primary"]
    ));
    primaryStats.appendChild(createStat(
      "組数",
      countPair(project.currentGroupCountDisplay, project.targetGroupCountDisplay, ""),
      ["revo-card__stat--primary"]
    ));

    const secondaryStats = document.createElement("div");
    secondaryStats.className = "revo-card__stats-secondary";
    secondaryStats.appendChild(createStat(
      "現在",
      project.currentAmountDisplay,
      ["revo-card__stat--compact", "revo-card__stat--amount"]
    ));
    secondaryStats.appendChild(createStat(
      "残り",
      project.remainingDaysDisplay,
      ["revo-card__stat--compact"]
    ));
    secondaryStats.appendChild(createStat(
      "達成率",
      `${project.progressRate || 0}%`,
      ["revo-card__stat--compact"]
    ));

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
