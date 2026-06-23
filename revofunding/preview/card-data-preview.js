(() => {
  const DATA_URL = "../data/projects-data.json";
  const root = document.getElementById("revo-card-data-preview") || document.getElementById("revo-list-preview") || document.getElementById("revo-list-page");
  const message = document.getElementById("revo-card-data-message") || document.getElementById("revo-list-preview-message") || document.getElementById("revo-list-page-message");

  const modifierByType = {
    spark: "revo-card--spark",
    boost: "revo-card--boost",
    done: "revo-card--done"
  };

  function setMessage(text) {
    if (message) {
      message.textContent = text;
    }
  }

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
    appendTextElement(stat, "span", "revo-card__stat-value", value);

    return stat;
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

  function createProjectCard(project) {
    const article = document.createElement("article");
    article.classList.add("revo-card");

    const typeClass = modifierByType[project.type];
    if (typeClass) {
      article.classList.add(typeClass);
    }

    const media = document.createElement("div");
    media.className = "revo-card__media";

    const placeholder = document.createElement("div");
    placeholder.className = "revo-card__media-placeholder";
    placeholder.textContent = project.image ? (project.imageAlt || "プロジェクト画像") : "画像プレースホルダー";
    media.appendChild(placeholder);
    article.appendChild(media);

    const body = document.createElement("div");
    body.className = "revo-card__body";

    appendTextElement(body, "span", "revo-card__badge", project.category || "検品用");
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
      countPair(project.currentSupporterCountDisplay, project.targetSupporterCountDisplay, project.supporterCountDisplay),
      ["revo-card__stat--primary"]
    ));
    primaryStats.appendChild(createStat(
      "組数",
      countPair(project.currentGroupCountDisplay, project.targetGroupCountDisplay, ""),
      ["revo-card__stat--primary"]
    ));

    const secondaryStats = document.createElement("div");
    secondaryStats.className = "revo-card__stats-secondary";
    secondaryStats.appendChild(createStat("現在", project.currentAmountDisplay, ["revo-card__stat--compact", "revo-card__stat--amount"]));
    secondaryStats.appendChild(createStat("残り", project.remainingDaysDisplay, ["revo-card__stat--compact"]));
    secondaryStats.appendChild(createStat("達成率", `${project.progressRate}%`, ["revo-card__stat--compact"]));

    stats.appendChild(primaryStats);
    stats.appendChild(secondaryStats);
    body.appendChild(stats);

    const actions = document.createElement("div");
    actions.className = "revo-card__actions";
    appendTextElement(actions, "span", "revo-card__action", project.ctaLabel || "確認する");
    body.appendChild(actions);

    article.appendChild(body);
    return article;
  }

  async function loadProjects() {
    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const projects = await response.json();
      if (!Array.isArray(projects)) {
        throw new Error("projects-data.json is not an array");
      }

      root.replaceChildren(...projects.map(createProjectCard));
      setMessage("projects-data.json の4件を描画しています。これは検品用表示です。");
    } catch (error) {
      root.replaceChildren();
      setMessage("projects-data.json を読み込めませんでした。ローカルで表示できない場合は、簡易サーバー経由で確認してください。");
      console.error(error);
    }
  }

  if (root) {
    loadProjects();
  }
})();
