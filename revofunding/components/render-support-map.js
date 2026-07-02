(function () {
  "use strict";

  const DATA_URL = window.REVO_SUPPORT_MAP_DATA_URL || "../data/revo-support-map-data.json";
  const JAPAN_GEOJSON_URL = "https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/japan.geojson";
  const TYPE_LABELS = {
    project: "起案者",
    sparker: "スパーカー",
    booster: "ブースター",
    certifiedArtist: "認定アーティスト",
    revoArtSpot: "レボアートスポット"
  };
  const TYPE_ORDER = ["project", "sparker", "booster", "certifiedArtist", "revoArtSpot"];
  const PREFECTURE_GROUPS = [
    {
      region: "北海道",
      prefectures: ["北海道"]
    },
    {
      region: "東北",
      prefectures: ["青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"]
    },
    {
      region: "関東",
      prefectures: ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"]
    },
    {
      region: "中部",
      prefectures: ["新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県"]
    },
    {
      region: "近畿",
      prefectures: ["三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"]
    },
    {
      region: "中国",
      prefectures: ["鳥取県", "島根県", "岡山県", "広島県", "山口県"]
    },
    {
      region: "四国",
      prefectures: ["徳島県", "香川県", "愛媛県", "高知県"]
    },
    {
      region: "九州・沖縄",
      prefectures: ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"]
    }
  ];

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

  function getText(value, fallback) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    return fallback;
  }

  function isDisplayable(item) {
    return Boolean(
      item &&
      item.isMapPublished === true &&
      item.mapOptOut !== true &&
      item.status !== "hidden"
    );
  }

  function canShowPinpointMap(item) {
    return Boolean(
      item &&
      item.googleMapEnabled === true &&
      item.googleMapPermission === true &&
      item.mapOptOut !== true &&
      item.status !== "hidden" &&
      typeof item.googleMapUrl === "string" &&
      item.googleMapUrl.startsWith("https://")
    );
  }

  function createGoogleMapButton(item) {
    if (!canShowPinpointMap(item)) {
      return null;
    }

    const link = document.createElement("a");
    link.className = "rf-support-map-google-link";
    link.href = item.googleMapUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Google Mapで見る";
    return link;
  }

  function getCategoryLabel(item) {
    if (item && TYPE_LABELS[item.sourceType]) {
      return TYPE_LABELS[item.sourceType];
    }
    return getText(item && item.categoryLabel, "その他");
  }

  function countByCategory(items) {
    const counts = new Map();
    TYPE_ORDER.forEach((type) => {
      counts.set(TYPE_LABELS[type], 0);
    });

    items.forEach((item) => {
      const label = getCategoryLabel(item);
      counts.set(label, (counts.get(label) || 0) + 1);
    });

    return counts;
  }

  function countByPrefecture(items) {
    const counts = new Map();
    items.forEach((item) => {
      const prefecture = getText(item.prefecture, "都道府県未設定");
      if (!counts.has(prefecture)) {
        counts.set(prefecture, {
          total: 0,
          categories: new Map(),
          items: []
        });
      }
      const summary = counts.get(prefecture);
      summary.total += 1;
      summary.items.push(item);
      const category = getCategoryLabel(item);
      summary.categories.set(category, (summary.categories.get(category) || 0) + 1);
    });
    return counts;
  }

  function groupByMunicipality(items) {
    const municipalities = new Map();

    items.forEach((item) => {
      const municipality = getText(item.municipality, "市町村未設定");
      const category = getCategoryLabel(item);

      if (!municipalities.has(municipality)) {
        municipalities.set(municipality, {
          total: 0,
          categories: new Map(),
          items: []
        });
      }

      const summary = municipalities.get(municipality);
      summary.total += 1;
      summary.categories.set(category, (summary.categories.get(category) || 0) + 1);
      summary.items.push(item);
    });

    return municipalities;
  }

  function groupByRegion(items) {
    const prefectures = new Map();

    items.forEach((item) => {
      const prefecture = getText(item.prefecture, "都道府県未設定");

      if (!prefectures.has(prefecture)) {
        prefectures.set(prefecture, []);
      }

      prefectures.get(prefecture).push(item);
    });

    return prefectures;
  }

  function getFeaturePrefectureName(feature) {
    const properties = feature && feature.properties ? feature.properties : {};
    return getText(properties.name, getText(properties.nam_ja, getText(properties.N03_001, "")));
  }

  function getMapColor(count) {
    if (count >= 6) {
      return "#7c3aed";
    }
    if (count >= 3) {
      return "#8b5cf6";
    }
    if (count >= 1) {
      return "#c4b5fd";
    }
    return "#f1f5f9";
  }

  function renderCounter(label, value) {
    const card = createElement("div", "revo-support-map-counter");
    card.append(
      createElement("span", "revo-support-map-counter__label", label),
      createElement("strong", "revo-support-map-counter__value", String(value))
    );
    return card;
  }

  function renderCounters(items) {
    const prefectureCount = new Set(items.map((item) => getText(item.prefecture, "都道府県未設定"))).size;
    const municipalityCount = new Set(
      items.map((item) => `${getText(item.prefecture, "都道府県未設定")}::${getText(item.municipality, "市町村未設定")}`)
    ).size;
    const categoryCounts = countByCategory(items);
    const grid = createElement("div", "revo-support-map-counters");

    grid.append(
      renderCounter("都道府県", prefectureCount),
      renderCounter("市町村", municipalityCount),
      renderCounter("表示件数", items.length)
    );

    categoryCounts.forEach((count, label) => {
      grid.append(renderCounter(label, count));
    });

    return grid;
  }

  function renderCategoryChips(categories) {
    const list = createElement("div", "revo-support-map-region__chips");
    categories.forEach((count, label) => {
      const chip = createElement("span", "revo-support-map-region__chip", `${label} ${count}`);
      list.appendChild(chip);
    });
    return list;
  }

  function renderMunicipalityList(items, titleText) {
    const wrapper = createElement("div", "revo-support-map-regions");
    const title = createElement("h3", "revo-support-map-regions__title", titleText);
    const list = createElement("div", "revo-support-map-regions__list");
    const groups = groupByMunicipality(items);

    if (groups.size === 0) {
      const empty = createElement("p", "revo-support-map-regions__empty", "現在、この都道府県の公開対象データはありません。");
      wrapper.append(title, empty);
      return wrapper;
    }

    Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b, "ja"))
      .forEach(([municipality, summary]) => {
        const row = createElement("article", "revo-support-map-region");
        const rowHead = createElement("div", "revo-support-map-region__head");
        rowHead.append(
          createElement("strong", "revo-support-map-region__name", municipality),
          createElement("span", "revo-support-map-region__count", `${summary.total}件`)
        );
        row.append(rowHead, renderCategoryChips(summary.categories));
        summary.items.forEach((item) => {
          const googleMapButton = createGoogleMapButton(item);
          if (googleMapButton) {
            row.appendChild(googleMapButton);
          }
        });
        list.appendChild(row);
      });

    wrapper.append(title, list);
    return wrapper;
  }

  function renderPrefectureDetails(prefecture, items) {
    const detail = createElement("section", "revo-support-map-detail");
    const title = createElement("h3", "revo-support-map-detail__title", prefecture || "都道府県");

    if (!items.length) {
      detail.append(
        title,
        createElement("p", "revo-support-map-detail__empty", "現在、この都道府県の公開対象データはありません。")
      );
      return detail;
    }

    const total = createElement("p", "revo-support-map-detail__total", `総数：${items.length}件`);
    const categoryTitle = createElement("h4", "revo-support-map-detail__subhead", "カテゴリ");
    detail.append(title, total, renderMunicipalityList(items, "市町村"), categoryTitle, renderCategoryChips(countByCategory(items)));
    return detail;
  }

  function renderPrefectureChip(prefecture, summary, onSelect) {
    const hasItems = Boolean(summary && summary.total > 0);
    const chip = createElement(
      "button",
      hasItems ? "revo-support-map-prefecture-chip is-active" : "revo-support-map-prefecture-chip",
      ""
    );
    chip.type = "button";
    chip.dataset.prefecture = prefecture;
    chip.addEventListener("click", () => onSelect(prefecture));

    const name = createElement("span", "revo-support-map-prefecture-chip__name", prefecture);
    const count = createElement("strong", "revo-support-map-prefecture-chip__count", hasItems ? `${summary.total}件` : "0件");
    chip.append(name, count);

    if (hasItems) {
      const categoryList = createElement("span", "revo-support-map-prefecture-chip__categories");
      summary.categories.forEach((categoryCount, label) => {
        const category = createElement("span", "revo-support-map-prefecture-chip__category", `${label} ${categoryCount}`);
        categoryList.appendChild(category);
      });
      chip.appendChild(categoryList);
    }

    return chip;
  }

  function renderPrefectureChips(counts, onSelect) {
    const grid = createElement("div", "revo-support-map-japan__grid");
    PREFECTURE_GROUPS.forEach((group) => {
      const groupCard = createElement("section", "revo-support-map-area");
      const title = createElement("h4", "revo-support-map-area__title", group.region);
      const chips = createElement("div", "revo-support-map-area__chips");
      group.prefectures.forEach((prefecture) => {
        chips.appendChild(renderPrefectureChip(prefecture, counts.get(prefecture), onSelect));
      });
      groupCard.append(title, chips);
      grid.appendChild(groupCard);
    });

    return grid;
  }

  function renderGeoJsonError(mapElement, message) {
    const error = createElement("p", "revo-support-map-leaflet__error", message);
    mapElement.replaceChildren(error);
  }

  function renderMapTabs(japanPanel, worldPanel, onJapanActive) {
    const wrapper = createElement("div", "revo-support-map-tabs");
    const controls = createElement("div", "revo-support-map-tabs__controls");
    const japanButton = createElement("button", "revo-support-map-tabs__button is-active", "日本マップ");
    const worldButton = createElement("button", "revo-support-map-tabs__button", "世界マップ");
    japanButton.type = "button";
    worldButton.type = "button";

    function activate(target) {
      const isJapan = target === "japan";
      japanButton.classList.toggle("is-active", isJapan);
      worldButton.classList.toggle("is-active", !isJapan);
      japanPanel.classList.toggle("is-active", isJapan);
      worldPanel.classList.toggle("is-active", !isJapan);
      if (isJapan && typeof onJapanActive === "function") {
        onJapanActive();
      }
    }

    japanButton.addEventListener("click", () => activate("japan"));
    worldButton.addEventListener("click", () => activate("world"));
    controls.append(japanButton, worldButton);
    wrapper.append(controls, japanPanel, worldPanel);
    return wrapper;
  }

  function renderMapPanel(items) {
    const counts = countByPrefecture(items);
    const itemsByPrefecture = groupByRegion(items);
    const section = createElement("section", "revo-support-map-japan");
    const head = createElement("div", "revo-support-map-japan__head");
    const detailSlot = createElement("div", "revo-support-map-detail-slot");
    let leafletMap = null;
    let geoJsonLayer = null;

    function getItemsForPrefecture(prefecture) {
      return itemsByPrefecture.get(prefecture) || [];
    }

    function selectPrefecture(prefecture) {
      const selectedItems = getItemsForPrefecture(prefecture);
      detailSlot.replaceChildren(renderPrefectureDetails(prefecture, selectedItems));
      if (geoJsonLayer) {
        geoJsonLayer.eachLayer((layer) => {
          const name = getFeaturePrefectureName(layer.feature);
          const count = counts.get(name) ? counts.get(name).total : 0;
          layer.setStyle({
            fillColor: getMapColor(count),
            fillOpacity: name === prefecture ? 0.95 : count > 0 ? 0.74 : 0.42,
            weight: name === prefecture ? 2 : 1,
            color: name === prefecture ? "#4c1d95" : "#ffffff"
          });
        });
      }
    }

    head.append(
      createElement("h3", "revo-support-map-japan__title", "日本地図表示"),
      createElement("p", "revo-support-map-japan__text", "都道府県境界のある日本地図で、公開対象データがある地域を強調しています。都道府県を選ぶと市町村とカテゴリ内訳を確認できます。")
    );

    const japanPanel = createElement("div", "revo-support-map-tab-panel is-active");
    const mapElement = createElement("div", "revo-support-map-leaflet");
    const legend = createElement("div", "revo-support-map-legend");
    legend.append(
      createElement("span", "revo-support-map-legend__label", "表示件数"),
      createElement("span", "revo-support-map-legend__item revo-support-map-legend__item--empty", "0"),
      createElement("span", "revo-support-map-legend__item revo-support-map-legend__item--low", "1〜2"),
      createElement("span", "revo-support-map-legend__item revo-support-map-legend__item--mid", "3〜5"),
      createElement("span", "revo-support-map-legend__item revo-support-map-legend__item--high", "6+")
    );
    japanPanel.append(mapElement, legend);

    const worldPanel = createElement("div", "revo-support-map-tab-panel");
    const worldPending = createElement("div", "revo-support-map-world-pending");
    worldPending.append(
      createElement("strong", "revo-support-map-world-pending__title", "世界マップは準備中です。"),
      createElement("p", "revo-support-map-world-pending__text", "海外の公開対象データが入り次第、日本マップと同じ考え方で表示します。")
    );
    worldPanel.appendChild(worldPending);

    section.append(head, renderMapTabs(japanPanel, worldPanel, () => {
      if (leafletMap) {
        setTimeout(() => leafletMap.invalidateSize(), 0);
      }
    }), detailSlot, renderPrefectureChips(counts, selectPrefecture));

    const initialPrefecture = counts.has("宮城県") ? "宮城県" : Array.from(counts.keys())[0] || "宮城県";
    selectPrefecture(initialPrefecture);

    if (typeof window.L === "undefined") {
      renderGeoJsonError(mapElement, "地図プログラムを読み込めませんでした。市町村とカテゴリの一覧はこのまま確認できます。");
      return section;
    }

    setTimeout(() => {
      leafletMap = window.L.map(mapElement, {
        center: [36.5, 137.5],
        zoom: 5,
        scrollWheelZoom: false,
        zoomControl: true
      });

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "OpenStreetMap",
        subdomains: "abc",
        maxZoom: 18
      }).addTo(leafletMap);

      fetch(JAPAN_GEOJSON_URL)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to load Japan GeoJSON: ${response.status}`);
          }
          return response.json();
        })
        .then((geojson) => {
          geoJsonLayer = window.L.geoJSON(geojson, {
            style(feature) {
              const name = getFeaturePrefectureName(feature);
              const count = counts.get(name) ? counts.get(name).total : 0;
              return {
                fillColor: getMapColor(count),
                fillOpacity: count > 0 ? 0.74 : 0.42,
                weight: 1,
                color: "#ffffff",
                opacity: 1
              };
            },
            onEachFeature(feature, layer) {
              const name = getFeaturePrefectureName(feature);
              const count = counts.get(name) ? counts.get(name).total : 0;
              layer.on("click", () => {
                selectPrefecture(name);
              });
              layer.on("mouseover", () => {
                layer.setStyle({
                  fillOpacity: 0.95,
                  weight: 2,
                  color: "#4c1d95"
                });
              });
              layer.on("mouseout", () => {
                const currentDetailTitle = detailSlot.querySelector(".revo-support-map-detail__title");
                if (currentDetailTitle && currentDetailTitle.textContent === name) {
                  return;
                }
                layer.setStyle({
                  fillColor: getMapColor(count),
                  fillOpacity: count > 0 ? 0.74 : 0.42,
                  weight: 1,
                  color: "#ffffff"
                });
              });
            }
          }).addTo(leafletMap);
          selectPrefecture(initialPrefecture);
        })
        .catch(() => {
          renderGeoJsonError(mapElement, "日本地図を読み込めませんでした。通信環境を確認してください。");
        });
    }, 0);

    return section;
  }

  function renderEmpty(container) {
    const empty = createElement("div", "revo-support-map__empty");
    empty.append(
      createElement("strong", "revo-support-map__empty-title", "公開対象の地域情報を準備中です。"),
      createElement("p", "revo-support-map__empty-text", "表示できる全国応援Map情報が整い次第、都道府県・市町村単位で掲載します。")
    );
    container.replaceChildren(empty);
  }

  function renderSupportMap(container, messageContainer, items) {
    const displayableItems = Array.isArray(items) ? items.filter(isDisplayable) : [];

    if (messageContainer) {
      messageContainer.textContent = "";
    }

    if (displayableItems.length === 0) {
      renderEmpty(container);
      return;
    }

    container.replaceChildren(renderCounters(displayableItems), renderMapPanel(displayableItems));
  }

  async function initSupportMap() {
    const container = document.getElementById("revo-support-map");
    const messageContainer = document.getElementById("revo-support-map-message");

    if (!container) {
      return;
    }

    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) {
        throw new Error(`Failed to load support map data: ${response.status}`);
      }
      const items = await response.json();
      renderSupportMap(container, messageContainer, items);
    } catch (error) {
      container.replaceChildren();
      if (messageContainer) {
        messageContainer.textContent = "全国応援Map情報を読み込めませんでした。現在、公開対象の地域情報を準備中です。";
      }
      console.error(error);
    }
  }

  document.addEventListener("DOMContentLoaded", initSupportMap);
})();
