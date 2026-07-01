/*
  レボファンディング本体の詳細ページ描画JSです。
  決済導線、本番CTAリンク、一覧カードからの遷移生成は含みません。
*/

(() => {
  const detailStateClasses = [
    "revo-detail-page--spark",
    "revo-detail-page--boost",
    "revo-detail-page--completed"
  ];

  const detailStateClassByType = {
    spark: "revo-detail-page--spark",
    boost: "revo-detail-page--boost"
  };

  function setText(id, text) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = text || "";
    }
    return element;
  }

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    if (text !== undefined) {
      element.textContent = text;
    }
    return element;
  }

  function setMetricValue(id, text) {
    const element = document.getElementById(id);
    if (!element) {
      return null;
    }

    const value = element.querySelector(".revo-detail-page__metric-value");
    if (value) {
      value.textContent = text || "";
      return value;
    }

    element.textContent = text || "";
    return element;
  }

  function setMessage(text) {
    setText("revo-detail-message", text);
  }

  function fallbackText(text = "詳細は順次公開します") {
    return text;
  }

  function hasValue(value) {
    return typeof value === "string" ? value.trim() !== "" : value !== undefined && value !== null;
  }

  function countPair(currentDisplay, targetDisplay, fallbackDisplay) {
    if (currentDisplay && targetDisplay) {
      return `${currentDisplay} / ${targetDisplay}`;
    }
    return fallbackDisplay || "-";
  }

  function progressValue(progressRate) {
    const rate = Number(progressRate);
    return Number.isFinite(rate) ? rate : 0;
  }

  function clampProgress(progressRate) {
    return Math.min(Math.max(progressValue(progressRate), 0), 100);
  }

  function setProgress(progressRate, project) {
    const rate = metricValue(project, "sparkAchievementRate", "boostAchievementRate") || progressValue(progressRate);
    setText("revo-detail-progress-label", `${progressValue(rate)}%`);

    const bar = document.getElementById("revo-detail-progress-bar");
    if (bar) {
      bar.style.width = `${clampProgress(rate)}%`;
    }
  }

  function supportSpreadText(project) {
    if (isCompleted(project)) {
      return "目標達成までに広がった応援を記録し、次の挑戦へつなげます。";
    }

    if (project.type === "boost") {
      return "残り人数と達成回数を確認しながら、応援の輪を次へ広げます。";
    }

    return "達成人数と組数の広がりを確認しながら、最初の仲間を集めます。";
  }

  function statusLabel(project) {
    const typeLabels = {
      spark: "スパーク",
      boost: "ブースト"
    };
    const typeLabel = typeLabels[project.type] || "挑戦";

    if (isCompleted(project)) {
      return `${typeLabel} / 達成済み`;
    }

    const statusLabels = {
      pending: "準備中",
      approved: "公開準備中",
      published: `${typeLabel}募集中`
    };
    if (statusLabels[project.status]) {
      return statusLabels[project.status];
    }

    return typeLabel;
  }

  function setDetailStateClass(project) {
    const page = document.getElementById("revo-detail-page");
    if (!page) {
      return;
    }

    page.classList.remove(...detailStateClasses);

    const typeClass = detailStateClassByType[project.type];
    if (typeClass) {
      page.classList.add(typeClass);
    }

    if (isCompleted(project)) {
      page.classList.add("revo-detail-page--completed");
    }
  }

  function isCompleted(project) {
    return project && (project.status === "completed" || project.isCompleted === true);
  }

  function metricValue(project, ...keys) {
    for (const key of keys) {
      const value = project[key];
      if (value !== undefined && value !== null && value !== "") {
        return value;
      }
    }
    return "";
  }

  function formatPercent(value) {
    const rate = progressValue(value);
    return `${rate}%`;
  }

  function metricDisplay(project, fallbackDisplay, ...keys) {
    return metricValue(project, ...keys) || fallbackDisplay;
  }

  function percentDisplay(project, ...keys) {
    const value = metricValue(project, ...keys);
    return value === "" ? "0%" : formatPercent(value);
  }

  function detailMetricItems(project) {
    return project.type === "boost"
      ? [
        ["残り人数", metricDisplay(project, "集計準備中", "boostRemainingPeople")],
        ["目標人数", metricDisplay(project, "受付後に反映", "boostTargetPeople", "targetSupporterCountDisplay")],
        ["達成率", percentDisplay(project, "boostAchievementRate", "progressRate")],
        ["達成回数", metricDisplay(project, "集計準備中", "boostAchievedCount")],
        ["目標回数", metricDisplay(project, "受付後に反映", "boostTargetCount")],
        ["目標期日", metricDisplay(project, "受付後に反映", "boostTargetDate", "remainingDaysDisplay")]
      ]
      : [
        ["達成人数", metricDisplay(project, "集計準備中", "sparkAchievedPeople", "currentSupporterCountDisplay")],
        ["目標人数", metricDisplay(project, "受付後に反映", "sparkTargetPeople", "targetSupporterCountDisplay")],
        ["達成率", percentDisplay(project, "sparkAchievementRate", "progressRate")],
        ["達成目標期日", metricDisplay(project, "受付後に反映", "sparkTargetDate", "remainingDaysDisplay")],
        ["目標組数", metricDisplay(project, "受付後に反映", "sparkTargetGroups", "targetGroupCountDisplay")],
        ["達成組数", metricDisplay(project, "集計準備中", "sparkAchievedGroups", "currentGroupCountDisplay")],
        ["目標金額", metricDisplay(project, "受付後に反映", "sparkTargetAmount", "targetAmountDisplay")]
      ];
  }

  function renderMetricItems(project) {
    const metrics = document.getElementById("revo-detail-metrics");
    if (!metrics) {
      return;
    }

    const items = detailMetricItems(project);

    metrics.replaceChildren(
      ...items.map(([labelText, valueText], index) => {
        const item = createElement("div", `revo-detail-page__metric${index === 0 ? " revo-detail-page__metric--primary" : ""}`);
        const label = createElement("span", "revo-detail-page__metric-label", labelText);
        const value = createElement("span", "revo-detail-page__metric-value", valueText);
        item.append(label, value);
        return item;
      })
    );
  }

  function firstAvailableText(...texts) {
    return texts.find((text) => typeof text === "string" && text.trim()) || "";
  }

  function publicRegionText(project) {
    return firstAvailableText(
      project.activityArea,
      [project.region, project.city].filter(Boolean).join(" "),
      [project.prefecture, project.municipality].filter(Boolean).join(" ")
    );
  }

  function publicNameText(project) {
    if (project.publicNamePermission === false || project.profilePermission === false) {
      return "";
    }

    return firstAvailableText(project.publicName, project.organizerName);
  }

  function publicProfileText(project) {
    if (project.profilePermission === false) {
      return "";
    }

    return firstAvailableText(project.operatorProfile, project.revoMeisterMessage);
  }

  function statusText(project) {
    if (project.status === "hidden") {
      return "非公開";
    }
    if (isCompleted(project)) {
      return "達成済み / 応援完了";
    }

    const labels = {
      published: "募集中",
      pending: "準備中",
      approved: "公開準備中"
    };
    return labels[project.status] || "募集中";
  }

  function setInfoCard(id, bodyText, metaText = "") {
    const card = document.getElementById(id);
    if (!card) {
      return;
    }

    if (!hasValue(bodyText)) {
      card.hidden = true;
      return;
    }

    card.hidden = false;

    const body = card.querySelector(".revo-detail-page__info-body");
    const meta = card.querySelector(".revo-detail-page__info-meta");

    if (body) {
      body.textContent = bodyText;
    }

    if (meta) {
      meta.textContent = metaText || "";
      meta.hidden = !metaText;
    }
  }

  function typeText(project) {
    return project.type === "boost" ? "ブースト" : "スパーク";
  }

  function setInfoListCard(id, titleText, items, metaText = "") {
    const card = document.getElementById(id);
    if (!card) {
      return;
    }

    const title = card.querySelector(".revo-detail-page__info-title");
    const body = card.querySelector(".revo-detail-page__info-body");
    const meta = card.querySelector(".revo-detail-page__info-meta");

    if (title) {
      title.textContent = titleText;
    }

    const visibleItems = items.filter(([, valueText]) => hasValue(valueText));
    if (visibleItems.length === 0) {
      card.hidden = true;
      return;
    }

    card.hidden = false;

    if (body) {
      body.replaceChildren();
      const list = createElement("dl", "revo-detail-page__info-metrics");
      visibleItems.forEach(([labelText, valueText]) => {
        const row = createElement("div", "revo-detail-page__info-metric");
        const label = createElement("dt", "revo-detail-page__info-metric-label", labelText);
        const value = createElement("dd", "revo-detail-page__info-metric-value", valueText);
        row.append(label, value);
        list.append(row);
      });
      body.append(list);
    }

    if (meta) {
      meta.textContent = metaText || "";
      meta.hidden = !metaText;
    }
  }

  function setProjectOverviewCard(project) {
    setInfoListCard(
      "revo-detail-project-overview",
      "基本情報",
      [
        ["種別", typeText(project)],
        ["募集状況", statusText(project)],
        ["カテゴリ", firstAvailableText(project.category) || fallbackText()],
        ["活動地域", publicRegionText(project)],
        ["公開用起案者名", publicNameText(project)]
      ],
      "公開ページで伝える基本情報です"
    );
  }

  function setTypeMetricInfoCard(project) {
    const card = document.getElementById("revo-detail-type-metrics");
    if (!card) {
      return;
    }

    const title = card.querySelector(".revo-detail-page__info-title");
    const body = card.querySelector(".revo-detail-page__info-body");
    const meta = card.querySelector(".revo-detail-page__info-meta");
    const isBoost = project.type === "boost";
    const items = detailMetricItems(project);

    if (title) {
      title.textContent = isBoost ? "ブースト情報" : "スパーク情報";
    }

    if (body) {
      body.replaceChildren();
      const list = createElement("dl", "revo-detail-page__info-metrics");
      items.forEach(([labelText, valueText]) => {
        const row = createElement("div", "revo-detail-page__info-metric");
        const label = createElement("dt", "revo-detail-page__info-metric-label", labelText);
        const value = createElement("dd", "revo-detail-page__info-metric-value", valueText);
        row.append(label, value);
        list.append(row);
      });
      body.append(list);
    }

    if (meta) {
      meta.textContent = isBoost
        ? "残り人数と回数を中心に、応援の広がりを確認します"
        : "達成人数・組数・目標金額を中心に、スパークの進み具合を確認します";
      meta.hidden = false;
    }
  }

  function setJoinInfoCard(project) {
    const card = document.getElementById("revo-detail-join");
    if (!card) {
      return;
    }

    const body = card.querySelector(".revo-detail-page__info-body");
    const meta = card.querySelector(".revo-detail-page__info-meta");

    if (body) {
      body.replaceChildren();
      const text = createElement("p", "", firstAvailableText(project.howToJoin, "参加の入口から確認できます") || fallbackText("参加の入口から確認できます"));
      const action = createElement("a", "revo-detail-page__info-action", "参加の入口を見る");
      action.href = "list.html";
      body.append(text, action);
    }

    if (meta) {
      meta.textContent = "";
      meta.hidden = true;
    }
  }

  function renderFormFields(project) {
    setProjectOverviewCard(project);
    setTypeMetricInfoCard(project);
    setInfoCard(
      "revo-detail-purpose",
      firstAvailableText(project.purpose, project.longDescription, project.description) || fallbackText()
    );
    setInfoCard(
      "revo-detail-background",
      firstAvailableText(project.background, project.story) || fallbackText()
    );
    setInfoCard(
      "revo-detail-support-request",
      firstAvailableText(project.supportRequest, project.impactText) || fallbackText()
    );
    setInfoCard(
      "revo-detail-impact",
      firstAvailableText(project.impact, project.impactText)
    );
    setInfoCard(
      "revo-detail-target-audience",
      firstAvailableText(project.targetAudience)
    );
    setInfoCard(
      "revo-detail-area",
      publicRegionText(project)
    );
    setInfoCard(
      "revo-detail-schedule",
      firstAvailableText(project.schedule, project.flowText) || fallbackText(),
      project.type === "boost"
        ? `目標期日: ${metricValue(project, "boostTargetDate") || fallbackText()}`
        : `達成目標期日: ${metricValue(project, "sparkTargetDate") || fallbackText()}`
    );
    setJoinInfoCard(project);
    setInfoCard(
      "revo-detail-operator",
      publicProfileText(project),
      publicNameText(project) ? `公開名: ${publicNameText(project)}` : ""
    );
    const publicStatusCard = document.getElementById("revo-detail-public-status");
    if (publicStatusCard) {
      publicStatusCard.hidden = true;
    }
  }

  function firstAvailableArray(array) {
    return Array.isArray(array) ? array.filter((item) => typeof item === "string" && item.trim()) : [];
  }

  function isImageSrc(src) {
    return typeof src === "string" && src.trim() !== "";
  }

  function createFallbackGallery(project) {
    const baseAlt = project.imageAlt || project.title || "プロジェクト画像";
    return [
      {
        label: "メイン",
        alt: baseAlt,
        caption: "挑戦の全体像"
      },
      {
        label: "活動",
        alt: "活動のイメージ",
        caption: "活動の空気"
      },
      {
        label: "応援",
        alt: "応援のイメージ",
        caption: "応援の広がり"
      }
    ];
  }

  function normalizeImageItem(item, index, project) {
    if (typeof item === "string") {
      return {
        src: item,
        alt: project.imageAlt || project.title || `プロジェクト画像 ${index + 1}`,
        label: index === 0 ? "メイン" : `画像${index + 1}`,
        caption: index === 0 ? "挑戦の全体像" : `画像${index + 1}`
      };
    }

    if (item && typeof item === "object") {
      return {
        src: item.src || item.url || "",
        alt: item.alt || project.imageAlt || project.title || `プロジェクト画像 ${index + 1}`,
        label: item.label || (index === 0 ? "メイン" : `画像${index + 1}`),
        caption: item.caption || item.label || (index === 0 ? "挑戦の全体像" : `画像${index + 1}`)
      };
    }

    return null;
  }

  function collectProjectImages(project) {
    const imageItems = [];

    if (Array.isArray(project.images)) {
      project.images.forEach((item, index) => {
        const normalized = normalizeImageItem(item, index, project);
        if (normalized) {
          imageItems.push(normalized);
        }
      });
    }

    [
      ["mainImageUrl", "メイン", "挑戦の全体像"],
      ["subImageUrl1", "活動", "活動の空気"],
      ["subImageUrl2", "制作", "制作の様子"],
      ["subImageUrl3", "仲間", "関わる人"],
      ["subImageUrl4", "地域", "地域の広がり"],
      ["subImageUrl5", "応援", "応援の広がり"]
    ].forEach(([key, label, caption]) => {
      if (isImageSrc(project[key]) && !imageItems.some((item) => item.src === project[key])) {
        imageItems.push({
          src: project[key],
          alt: project.imageAlt || project.title || label,
          label,
          caption
        });
      }
    });

    if (isImageSrc(project.image) && !imageItems.some((item) => item.src === project.image)) {
      imageItems.unshift({
        src: project.image,
        alt: project.imageAlt || project.title || "プロジェクト画像",
        label: "メイン",
        caption: "挑戦の全体像"
      });
    }

    return imageItems.length > 0 ? imageItems : createFallbackGallery(project);
  }

  function renderGalleryImage(container, item) {
    container.textContent = "";
    container.setAttribute("aria-label", item.alt || "プロジェクト画像");

    if (isImageSrc(item.src)) {
      const image = document.createElement("img");
      image.className = "revo-detail-page__media-image";
      image.src = item.src;
      image.alt = item.alt || "";
      container.appendChild(image);
      return;
    }

    const visual = createElement("span", "revo-detail-page__media-visual");
    const label = createElement("span", "revo-detail-page__media-label", item.caption || item.label || "挑戦イメージ");
    visual.appendChild(label);
    container.appendChild(visual);
  }

  function renderProjectGallery(project) {
    const media = document.getElementById("revo-detail-media");
    const thumbnails = document.getElementById("revo-detail-thumbnails");
    if (!media) {
      return;
    }

    const images = collectProjectImages(project);
    let activeIndex = 0;

    function setActiveImage(index) {
      activeIndex = index;
      renderGalleryImage(media, images[activeIndex]);

      if (!thumbnails) {
        return;
      }

      thumbnails.querySelectorAll(".revo-detail-page__thumbnail").forEach((button, buttonIndex) => {
        const isActive = buttonIndex === activeIndex;
        button.classList.toggle("revo-detail-page__thumbnail--active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
    }

    setActiveImage(0);

    if (!thumbnails) {
      return;
    }

    thumbnails.textContent = "";
    images.forEach((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "revo-detail-page__thumbnail";
      if (index === activeIndex) {
        button.classList.add("revo-detail-page__thumbnail--active");
      }
      button.setAttribute("aria-label", `${item.label || `画像${index + 1}`}を表示`);
      button.setAttribute("aria-pressed", String(index === activeIndex));

      if (isImageSrc(item.src)) {
        const image = document.createElement("img");
        image.className = "revo-detail-page__thumbnail-image";
        image.src = item.src;
        image.alt = "";
        button.appendChild(image);
      } else {
        button.textContent = item.label || `画像${index + 1}`;
      }

      button.addEventListener("click", () => {
        setActiveImage(index);
      });

      thumbnails.appendChild(button);
    });
  }

  function setSectionText(sectionId, headingText, bodyText) {
    const section = document.getElementById(sectionId);
    if (!section) {
      return;
    }

    const heading = section.querySelector("h2");
    const paragraph = section.querySelector("p");

    if (heading) {
      heading.textContent = headingText;
    }

    if (paragraph) {
      paragraph.textContent = bodyText;
    }
  }

  function fallbackStoryBlocks(project) {
    return [
      {
        type: "text",
        heading: "挑戦の概要",
        body: firstAvailableText(project.longDescription, project.description, "この挑戦の概要は準備中です。")
      },
      {
        type: "image",
        label: "本文内画像プレースホルダー",
        caption: "挑戦の現場にある空気を伝える記録です。"
      },
      {
        type: "text",
        heading: "この挑戦に込めた想い",
        body: firstAvailableText(project.story, project.longDescription, project.description, "この挑戦の背景・想いは準備中です。")
      },
      {
        type: "text",
        heading: "応援によって動くこと",
        body: firstAvailableText(
          project.impactText,
          `支援者 ${countPair(
            project.currentSupporterCountDisplay,
            project.targetSupporterCountDisplay,
            project.supporterCountDisplay
          )}、組数 ${countPair(
            project.currentGroupCountDisplay,
            project.targetGroupCountDisplay,
            ""
          )} の広がりをもとに、次の動きを準備していきます。`
        )
      },
      {
        type: "text",
        heading: "これからの流れ",
        body: firstAvailableText(project.flowText, "次の流れは準備中です。")
      }
    ];
  }

  function createStoryTextBlock(block) {
    const section = createElement("section", "revo-detail-page__section");
    const heading = createElement("h2", "", block.heading || "本文");
    const body = createElement("p", "", block.body || "");

    section.append(heading, body);
    return section;
  }

  function createStoryImageBlock(block) {
    const figure = createElement("figure", "rf-detail-story-image");
    const placeholder = createElement("div", "rf-detail-story-placeholder");
    const label = createElement("span", "rf-detail-story-placeholder__label", block.label || "本文内画像プレースホルダー");
    const caption = createElement("figcaption", "rf-detail-story-caption", block.caption || "説明用画像が入る想定です");

    placeholder.appendChild(label);
    figure.append(placeholder, caption);
    return figure;
  }

  function renderStoryBlocks(project) {
    const container = document.getElementById("revo-detail-story-blocks");
    if (!container) {
      return;
    }

    const blocks = Array.isArray(project.storyBlocks) && project.storyBlocks.length > 0
      ? project.storyBlocks
      : fallbackStoryBlocks(project);

    container.textContent = "";
    blocks.forEach((block) => {
      if (!block || typeof block !== "object") {
        return;
      }

      if (block.type === "image") {
        container.appendChild(createStoryImageBlock(block));
        return;
      }

      container.appendChild(createStoryTextBlock(block));
    });
  }

  function setPersonDetail(project) {
    const name = document.querySelector(".revo-detail-page__person-name");
    if (name) {
      name.textContent = publicNameText(project) || "レボマイスター";
    }

    const role = document.querySelector(".revo-detail-page__person-role");
    if (role && project.revoMeisterRole) {
      role.textContent = project.revoMeisterRole;
    }

    const comment = document.querySelector(".revo-detail-page__person-comment");
    if (comment) {
      comment.textContent = publicProfileText(project) || "この挑戦の起点となり、最初の応援や共感を集める人です。";
    }

    const labels = firstAvailableArray(project.revoMeisterLabels);
    const labelsContainer = document.querySelector(".revo-detail-page__person-labels");
    if (!labelsContainer || labels.length === 0) {
      return;
    }

    labelsContainer.textContent = "";
    labels.slice(0, 2).forEach((label) => {
      const element = document.createElement("span");
      element.className = "revo-detail-page__person-label";
      element.textContent = label;
      labelsContainer.appendChild(element);
    });
  }

  function setParticipationLinks() {
    const container = document.getElementById("revo-detail-cta");
    if (!container) {
      return;
    }

    const text = createElement(
      "p",
      "revo-detail-page__cta-text",
      "応援や参加の方法は、参加の入口から確認できます。"
    );
    const actions = createElement("div", "revo-detail-page__cta-actions");

    const listLink = createElement("a", "revo-detail-page__cta-link revo-detail-page__cta-link--primary", "参加の入口を見る");
    listLink.href = "list.html";

    actions.appendChild(listLink);
    container.replaceChildren(text, actions);
  }

  function getProjectIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id") || "";
  }

  function findProjectById(projects, projectId) {
    if (!Array.isArray(projects) || !projectId) {
      return null;
    }
    return projects.find((project) => project && project.id === projectId) || null;
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

  function renderRevoDetail(options = {}) {
    const { project, messageContainer } = options;

    if (!project) {
      setDetailStateClass({});
      const message = "指定された挑戦が見つかりませんでした。";
      if (messageContainer) {
        messageContainer.textContent = message;
      } else {
        setMessage(message);
      }
      return null;
    }

    if (project.status === "hidden") {
      setDetailStateClass({});
      const message = "この挑戦は現在公開されていません。";
      if (messageContainer) {
        messageContainer.textContent = message;
      } else {
        setMessage(message);
      }
      return null;
    }

    setDetailStateClass(project);

    setText("revo-detail-title", project.title || "挑戦の詳細");
    setText("revo-detail-category", project.category || "挑戦");
    setText("revo-detail-status", statusLabel(project));
    renderMetricItems(project);
    setText("revo-detail-amount", isCompleted(project) ? "目標達成" : "現在の応援状況");
    setText("revo-detail-days", project.type === "boost" ? `目標期日 ${metricValue(project, "boostTargetDate", "remainingDaysDisplay") || "-"}` : `達成目標期日 ${metricValue(project, "sparkTargetDate", "remainingDaysDisplay") || "-"}`);
    setProgress(project.progressRate, project);

    renderProjectGallery(project);

    setText("revo-detail-panel-note", supportSpreadText(project));
    renderFormFields(project);
    renderStoryBlocks(project);

    setPersonDetail(project);

    setParticipationLinks();

    const message = "projects-data.json から挑戦の詳細を表示しています。";
    if (messageContainer) {
      messageContainer.textContent = message;
    } else {
      setMessage(message);
    }

    return project;
  }

  window.RevoDetail = {
    loadRevoProjects,
    getProjectIdFromUrl,
    findProjectById,
    renderRevoDetail
  };
})();
