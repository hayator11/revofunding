(function () {
  "use strict";

  const PAGE_CONFIG = {
    "certified-artists": {
      dataUrl: "../data/certified-artists-data.json",
      containerId: "revo-certified-artist-list",
      messageId: "revo-certified-artist-message",
      emptyText: "現在表示できる認定アーティストはありません。",
      loadedText: "公開用に整理済みの認定アーティスト情報を掲載しています。",
      cardModifier: "revo-person-card--artist",
      statusLabel: "認定アーティスト",
      activityLabel: "実施回数",
      specialtyLabel: "得意領域",
      defaultActionLabel: "詳細を見る",
      defaultUrl: "revo-art.html",
      detailPage: "certified-artist-detail.html"
    },
    "certified-artist-detail": {
      dataUrl: "../data/certified-artists-data.json",
      containerId: "revo-certified-artist-detail",
      messageId: "revo-certified-artist-detail-message",
      emptyText: "現在表示できる認定アーティスト詳細はありません。",
      loadedText: "認定アーティスト詳細を表示しています。",
      cardModifier: "revo-person-card--artist",
      statusLabel: "認定アーティスト",
      activityLabel: "実施回数",
      specialtyLabel: "得意領域",
      defaultActionLabel: "詳細を見る",
      defaultUrl: "certified-artists.html",
      detailPage: "certified-artist-detail.html"
    },
    "badge-sparkers": {
      dataUrl: "../data/badge-sparkers-data.json",
      containerId: "revo-badge-sparker-list",
      messageId: "revo-badge-sparker-message",
      emptyText: "現在表示できるバッチスパーカーはありません。",
      loadedText: "公開用に整理済みのバッチスパーカー情報を掲載しています。",
      cardModifier: "revo-person-card--badge",
      statusLabel: "バッチスパーカー",
      activityLabel: "実施回数",
      specialtyLabel: "バッチ種別",
      defaultActionLabel: "活動詳細を見る",
      defaultUrl: "sparkers.html",
      detailPage: "badge-sparker-detail.html",
      detailBackUrl: "badge-sparkers.html",
      detailBackLabel: "バッチスパーカー一覧へ戻る",
      detailRelatedUrl: "sparkers.html",
      detailRelatedLabel: "スパーク一覧を見る",
      sectionProfileTitle: "スパーカーとしての関わり",
      sectionWorksTitle: "展開しているプロジェクト",
      sectionCollaborationTitle: "応援の広げ方"
    },
    "badge-sparker-detail": {
      dataUrl: "../data/badge-sparkers-data.json",
      containerId: "revo-badge-sparker-detail",
      messageId: "revo-badge-sparker-detail-message",
      emptyText: "現在表示できるバッチスパーカー詳細はありません。",
      loadedText: "バッチスパーカー詳細を表示しています。",
      cardModifier: "revo-person-card--badge",
      statusLabel: "バッチスパーカー",
      activityLabel: "実施回数",
      specialtyLabel: "バッチ種別",
      defaultActionLabel: "活動詳細を見る",
      defaultUrl: "badge-sparkers.html",
      detailPage: "badge-sparker-detail.html",
      detailBackUrl: "badge-sparkers.html",
      detailBackLabel: "バッチスパーカー一覧へ戻る",
      detailRelatedUrl: "sparkers.html",
      detailRelatedLabel: "スパーク一覧を見る",
      sectionProfileTitle: "スパーカーとしての関わり",
      sectionWorksTitle: "展開しているプロジェクト",
      sectionCollaborationTitle: "応援の広げ方"
    }
  };

  async function fetchJson(url) {
    const response = await fetch(withCacheBuster(url));

    if (!response.ok) {
      throw new Error(`${url} を読み込めませんでした。`);
    }

    return response.json();
  }

  function withCacheBuster(url) {
    const version = new URLSearchParams(window.location.search).get("t") || "v2";
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}t=${encodeURIComponent(version)}`;
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

  function createLabelList(labels) {
    const list = document.createElement("div");
    list.className = "revo-person-card__labels";

    if (!Array.isArray(labels)) {
      return list;
    }

    for (const label of labels) {
      if (typeof label !== "string" || label.trim() === "") {
        continue;
      }

      const item = createTextElement("span", "revo-person-card__label", label);
      list.append(item);
    }

    return list;
  }

  function createMeta(label, value) {
    const item = document.createElement("div");
    item.className = "revo-person-card__meta";
    item.append(
      createTextElement("span", "revo-person-card__meta-label", label),
      createTextElement("span", "revo-person-card__meta-value", value)
    );
    return item;
  }

  function createProjectSummary(projects) {
    if (!Array.isArray(projects) || projects.length === 0) {
      return null;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "revo-person-card__project-summary";
    wrapper.append(createTextElement("span", "revo-person-card__project-summary-label", "展開プロジェクト"));

    const list = document.createElement("div");
    list.className = "revo-person-card__project-list";

    projects.slice(0, 2).forEach((project) => {
      const item = createTextElement("span", "revo-person-card__project-item", getText(project.title, "プロジェクト名公開準備中"));
      list.append(item);
    });

    if (projects.length > 2) {
      list.append(createTextElement("span", "revo-person-card__project-more", `ほか${projects.length - 2}件`));
    }

    wrapper.append(list);
    return wrapper;
  }

  function createProjectHistory(projects) {
    const section = document.createElement("section");
    section.className = "revo-person-detail__history";

    section.append(
      createTextElement("h2", "revo-person-detail__history-title", "スパーク活動履歴"),
      createTextElement("p", "revo-person-detail__history-lead", "カードに収まりきらない活動回数やプロジェクトは、ここでまとめて確認できます。")
    );

    const list = document.createElement("div");
    list.className = "revo-person-detail__history-list";

    if (!Array.isArray(projects) || projects.length === 0) {
      list.append(createTextElement("p", "revo-person-detail__history-empty", "公開許可後に、関わったスパーク活動を掲載します。"));
      section.append(list);
      return section;
    }

    projects.forEach((project, index) => {
      const item = document.createElement("article");
      item.className = "revo-person-detail__history-item";

      const count = getText(project.count, `${index + 1}回目`);
      const title = getText(project.title, "プロジェクト名公開準備中");
      const role = getText(project.role, "スパーク参加");
      const area = getText(project.area, "公開許可後に掲載");

      item.append(
        createTextElement("span", "revo-person-detail__history-count", count),
        createTextElement("h3", "revo-person-detail__history-name", title),
        createTextElement("p", "revo-person-detail__history-role", role),
        createTextElement("p", "revo-person-detail__history-area", area)
      );

      const note = getText(project.note, "");
      if (note) {
        item.append(createTextElement("p", "revo-person-detail__history-note", note));
      }

      const url = getText(project.url, "");
      if (url) {
        const link = document.createElement("a");
        link.className = "revo-person-detail__history-link";
        link.href = url;
        link.textContent = "プロジェクトを見る";
        item.append(link);
      }

      list.append(item);
    });

    section.append(list);
    return section;
  }

  function getDetailUrl(person, config) {
    const explicitUrl = getText(person && person.detailUrl, "");

    if (explicitUrl) {
      return explicitUrl;
    }

    if (config && config.detailPage && person && getText(person.id, "")) {
      return `${config.detailPage}?id=${encodeURIComponent(person.id)}`;
    }

    return config.defaultUrl;
  }

  function getPersonIdFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id") || "";
  }

  function createDetailMeta(label, value) {
    const item = document.createElement("div");
    item.className = "revo-person-detail__meta";
    item.append(
      createTextElement("span", "revo-person-detail__meta-label", label),
      createTextElement("strong", "revo-person-detail__meta-value", value)
    );
    return item;
  }

  function createDetailSection(title, text) {
    const section = document.createElement("section");
    section.className = "revo-person-detail__section";
    section.append(
      createTextElement("h2", "revo-person-detail__section-title", title),
      createTextElement("p", "revo-person-detail__section-text", text)
    );
    return section;
  }

  function createCard(person, config) {
    const card = document.createElement("article");
    card.className = `revo-person-card ${config.cardModifier}`;

    const media = document.createElement("div");
    media.className = "revo-person-card__media";
    media.setAttribute("aria-label", `${config.statusLabel}の画像枠`);
    media.append(createTextElement("span", "revo-person-card__media-placeholder", config.statusLabel));

    const header = document.createElement("div");
    header.className = "revo-person-card__header";
    header.append(
      createTextElement("span", "revo-person-card__status", getText(person.statusLabel, config.statusLabel)),
      createTextElement("h3", "revo-person-card__name", getText(person.name, config.statusLabel)),
      createTextElement("p", "revo-person-card__role", getText(person.role, "公開準備中"))
    );

    const description = createTextElement("p", "revo-person-card__description", getText(person.description, "公開許可後に紹介文を掲載します。"));

    const labels = createLabelList(person.labels);

    const metaList = document.createElement("div");
    metaList.className = "revo-person-card__meta-list";
    metaList.append(
      createMeta(config.activityLabel, getText(person.activityCount, "公開準備中")),
      createMeta("活動地域", getText(person.area, "公開許可後に掲載")),
      createMeta(config.specialtyLabel, getText(person.specialty || person.badgeType, "公開準備中"))
    );

    const action = document.createElement("a");
    action.className = "revo-person-card__action";
    action.href = getDetailUrl(person, config);
    action.textContent = getText(person.actionLabel, config.defaultActionLabel);

    card.append(media, header, description);

    if (labels.childElementCount > 0) {
      card.append(labels);
    }

    const projectSummary = createProjectSummary(person.sparkProjects);
    if (projectSummary) {
      card.append(projectSummary);
    }

    card.append(metaList, action);
    return card;
  }

  function renderPersonDetail({ container, messageContainer, people, config }) {
    const sortedPeople = Array.isArray(people)
      ? [...people].sort((a, b) => getNumber(a.displayOrder) - getNumber(b.displayOrder))
      : [];
    const requestedId = getPersonIdFromQuery();
    const person = sortedPeople.find((entry) => entry.id === requestedId) || sortedPeople[0];

    if (!person) {
      if (messageContainer) {
        messageContainer.textContent = config.emptyText;
      }
      return;
    }

    container.replaceChildren();

    const hero = document.createElement("section");
    hero.className = "revo-person-detail__hero";

    const visual = document.createElement("div");
    visual.className = "revo-person-detail__visual";
    visual.append(createTextElement("span", "revo-person-detail__visual-label", getText(person.statusLabel, config.statusLabel)));

    const copy = document.createElement("div");
    copy.className = "revo-person-detail__copy";
    copy.append(
      createTextElement("p", "revo-people-page__eyebrow", getText(person.statusLabel, config.statusLabel)),
      createTextElement("h1", "revo-person-detail__title", getText(person.name, config.statusLabel)),
      createTextElement("p", "revo-person-detail__role", getText(person.role, "公開準備中")),
      createTextElement("p", "revo-person-detail__lead", getText(person.description, "公開許可後に紹介文を掲載します。"))
    );

    const labels = createLabelList(person.labels);

    if (labels.childElementCount > 0) {
      copy.append(labels);
    }

    hero.append(visual, copy);

    const meta = document.createElement("section");
    meta.className = "revo-person-detail__meta-grid";
    meta.setAttribute("aria-label", `${config.statusLabel}基本情報`);
    meta.append(
      createDetailMeta(config.activityLabel, getText(person.activityCount, "公開準備中")),
      createDetailMeta("活動地域", getText(person.area, "公開許可後に掲載")),
      createDetailMeta(config.specialtyLabel, getText(person.specialty || person.badgeType, "公開準備中"))
    );

    const sections = document.createElement("div");
    sections.className = "revo-person-detail__sections";
    sections.append(
      createDetailSection(getText(config.sectionProfileTitle, "プロフィール"), getText(person.profile, "公開許可後に詳しいプロフィールを掲載します。")),
      createDetailSection(getText(config.sectionWorksTitle, "作品・実績"), getText(person.worksNote, "公開可能な作品や実績を掲載予定です。")),
      createDetailSection(getText(config.sectionCollaborationTitle, "レボアートでの関わり方"), getText(person.collaborationNote, "申請内容に応じて、制作や表現の相談先として紹介します。"))
    );

    const actions = document.createElement("nav");
    actions.className = "revo-person-detail__actions";
    actions.setAttribute("aria-label", `${config.statusLabel}詳細の導線`);

    const backLink = document.createElement("a");
    backLink.className = "revo-people-page__link";
    backLink.href = getText(config.detailBackUrl, config.defaultUrl);
    backLink.textContent = getText(config.detailBackLabel, "一覧へ戻る");

    const artLink = document.createElement("a");
    artLink.className = "revo-people-page__link";
    artLink.href = getText(config.detailRelatedUrl, "revo-art.html");
    artLink.textContent = getText(config.detailRelatedLabel, "関連ページを見る");

    actions.append(backLink, artLink);
    container.append(hero, meta, sections);

    if (Array.isArray(person.sparkProjects)) {
      container.append(createProjectHistory(person.sparkProjects));
    }

    container.append(actions);

    if (messageContainer) {
      messageContainer.textContent = config.loadedText;
    }
  }

  function renderPeople({ container, messageContainer, people, config }) {
    container.replaceChildren();

    const sortedPeople = Array.isArray(people)
      ? [...people].sort((a, b) => getNumber(a.displayOrder) - getNumber(b.displayOrder))
      : [];

    if (sortedPeople.length === 0) {
      if (messageContainer) {
        messageContainer.textContent = config.emptyText;
      }
      return;
    }

    for (const person of sortedPeople) {
      container.append(createCard(person, config));
    }

    if (messageContainer) {
      messageContainer.textContent = config.loadedText;
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const pageType = document.body && document.body.dataset ? document.body.dataset.peoplePage : "";
    const config = PAGE_CONFIG[pageType];

    if (!config) {
      return;
    }

    const container = document.getElementById(config.containerId);
    const messageContainer = document.getElementById(config.messageId);

    if (!container) {
      return;
    }

    try {
      const people = await fetchJson(config.dataUrl);

      if (pageType === "certified-artist-detail" || pageType === "badge-sparker-detail") {
        renderPersonDetail({ container, messageContainer, people, config });
      } else {
        renderPeople({ container, messageContainer, people, config });
      }
    } catch (error) {
      if (messageContainer) {
        messageContainer.textContent = container.childElementCount > 0
          ? "サンプル表示を使用しています。公開用データは簡易サーバー経由で読み込まれます。"
          : "人物紹介データを読み込めませんでした。ローカルで表示できない場合は、簡易サーバー経由で確認してください。";
      }

      console.error(error);
    }
  });
}());
