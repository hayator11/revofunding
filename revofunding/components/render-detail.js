/*
  レボファンディング本体の詳細ページ描画JSです。
  決済導線、本番CTAリンク、一覧カードからの遷移生成は含みません。
*/

(() => {
  const detailStateClasses = [
    "revo-detail-page--normal",
    "revo-detail-page--spark",
    "revo-detail-page--boost",
    "revo-detail-page--done"
  ];

  const detailStateClassByType = {
    normal: "revo-detail-page--normal",
    spark: "revo-detail-page--spark",
    boost: "revo-detail-page--boost",
    done: "revo-detail-page--done"
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

  function countPair(currentDisplay, targetDisplay, fallbackDisplay) {
    if (currentDisplay && targetDisplay) {
      return `${currentDisplay} / ${targetDisplay}`;
    }
    return fallbackDisplay || "-";
  }

  function amountPair(currentDisplay, targetDisplay) {
    if (currentDisplay && targetDisplay) {
      return `現在 ${currentDisplay} / 目標 ${targetDisplay}`;
    }
    if (currentDisplay) {
      return `現在 ${currentDisplay}`;
    }
    if (targetDisplay) {
      return `目標 ${targetDisplay}`;
    }
    return "金額は準備中です";
  }

  function progressValue(progressRate) {
    const rate = Number(progressRate);
    return Number.isFinite(rate) ? rate : 0;
  }

  function clampProgress(progressRate) {
    return Math.min(Math.max(progressValue(progressRate), 0), 100);
  }

  function setProgress(progressRate) {
    setText("revo-detail-progress-label", `${progressValue(progressRate)}%`);

    const bar = document.getElementById("revo-detail-progress-bar");
    if (bar) {
      bar.style.width = `${clampProgress(progressRate)}%`;
    }
  }

  function supportSpreadText(project) {
    return "支援者数と組数の広がりを確認します。";
  }

  function statusLabel(project) {
    const labels = {
      normal: "募集中",
      spark: "注目中",
      boost: "加速中",
      done: "達成"
    };
    return labels[project.type] || labels[project.status] || "準備中";
  }

  function setDetailStateClass(project) {
    const page = document.getElementById("revo-detail-page");
    if (!page) {
      return;
    }

    page.classList.remove(...detailStateClasses);

    const stateClass = detailStateClassByType[project.type] || detailStateClassByType[project.status];
    if (stateClass) {
      page.classList.add(stateClass);
    }
  }

  function firstAvailableText(...texts) {
    return texts.find((text) => typeof text === "string" && text.trim()) || "";
  }

  function firstAvailableArray(array) {
    return Array.isArray(array) ? array.filter((item) => typeof item === "string" && item.trim()) : [];
  }

  function isExternalImageUrl(src) {
    return typeof src === "string" && /^https?:\/\//i.test(src.trim());
  }

  function keepMediaPlaceholder(project) {
    const media = document.getElementById("revo-detail-media");
    if (!media) {
      return;
    }

    media.textContent = "画像プレースホルダー";
    if (project.image && !isExternalImageUrl(project.image)) {
      media.setAttribute("aria-label", project.imageAlt || "プロジェクト画像");
    } else {
      media.setAttribute("aria-label", "プロジェクト画像");
    }
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
        caption: "活動風景や制作過程の画像が入る想定です"
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
    const role = document.querySelector(".revo-detail-page__person-role");
    if (role && project.revoMeisterRole) {
      role.textContent = project.revoMeisterRole;
    }

    const comment = document.querySelector(".revo-detail-page__person-comment");
    if (comment && project.revoMeisterMessage) {
      comment.textContent = project.revoMeisterMessage;
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
      "応援の入口は準備中です。参加の入口から関わり方を確認できます。"
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

    setDetailStateClass(project);

    setText("revo-detail-title", project.title || "挑戦の詳細");
    setText("revo-detail-category", project.category || "挑戦");
    setText("revo-detail-status", statusLabel(project));
    setMetricValue(
      "revo-detail-supporters",
      countPair(
        project.currentSupporterCountDisplay,
        project.targetSupporterCountDisplay,
        project.supporterCountDisplay
      )
    );
    setMetricValue(
      "revo-detail-groups",
      countPair(project.currentGroupCountDisplay, project.targetGroupCountDisplay, "")
    );
    setText("revo-detail-amount", amountPair(project.currentAmountDisplay, project.targetAmountDisplay));
    setText("revo-detail-days", `残り ${project.remainingDaysDisplay || "-"}`);
    setProgress(project.progressRate);

    keepMediaPlaceholder(project);

    setText("revo-detail-panel-note", supportSpreadText(project));
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
