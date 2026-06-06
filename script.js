const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".challenge-card");
const toast = document.querySelector(".toast");
const shareButtons = document.querySelectorAll(".share-trigger");
const sizeButtons = document.querySelectorAll(".size");
const copyTemplate = document.querySelector(".copy-template");
const copyEmbed = document.querySelector(".copy-embed");
const instagramButtons = document.querySelectorAll(".instagram-copy");
const copyReferral = document.querySelector(".copy-referral");
const dynamicShareLinks = document.querySelectorAll(".dynamic-share-link");
const referralLinkOutput = document.querySelector(".referral-link-output");
const siteFooter = document.querySelector(".site-footer");
const rankingList = document.querySelector(".ranking-list");
const rankSortButtons = document.querySelectorAll(".rank-sort");
const categoryFilter = document.querySelector(".category-filter");
const videoEmbeds = document.querySelectorAll(".video-embed");
const artMapSection = document.querySelector("#place-map");
const publicBaseUrl = "https://revofunding.onokun.com/";
const counterDataUrl = window.REVO_COUNTER_DATA_URL || "https://docs.google.com/spreadsheets/d/e/2PACX-1vRcKmEgg9vkR0RHr8i1dbqnjOCZS7Julyl54k9tqUEBGxEejykf3X5eS4iZOKnsowGrtwiGZ7b7vRBN/pub?gid=403200930&single=true&output=csv";
const projectsDataUrl = window.REVO_PROJECTS_DATA_URL || "projects-data.json";
const projectDataFallbackUrl = "projects-data.json";
const projectDetailRoot = document.querySelector("[data-project-detail]");
let activeStatusFilter = "all";
let activeSort = "active";
let activeCategory = "all";

const revoArtMapData = {
  japanGeoJsonUrl: "https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/japan.geojson",
  worldGeoJsonUrl: "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json",
  locations: [
    {
      id: "higashimatsushima-base",
      prefecture: "宮城県",
      city: "東松島市",
      name: "おのくん活動拠点 / 東松島",
      type: "活動拠点",
      icon: "🏠",
      description: "おのくん、レボリストLab、防災×帽祭の文脈とつながる、レボアートの起点となるエリアです。公開できる開催地や連携先を、ここから全国へ広げていきます。",
      area: "宮城県 東松島市",
      mapQuery: "宮城県東松島市矢本字上新沼8",
      image: "onokun-a.jpeg",
      officialUrl: "https://onokun.com/art-project/",
    },
    {
      id: "miyagi-school-sample",
      prefecture: "宮城県",
      city: "東松島市",
      name: "学校・施設・商店街 連携候補",
      type: "開催候補",
      icon: "🏫",
      description: "ウォールアート、ペイントハット、展示、地域共創イベントなど、公開許可を得た場所から順次追加します。",
      area: "宮城県 東松島市",
      mapQuery: "宮城県東松島市",
      image: "RevoFunding.png",
      officialUrl: "#apply",
    },
    {
      id: "miyagi-company-sample",
      prefecture: "宮城県",
      city: "仙台市",
      name: "企業協賛・展示連携候補",
      type: "企業協賛",
      icon: "🏢",
      description: "レボリンクと連動し、企業協賛が地域や防災アートを支える流れを活動レポートとして見える化します。",
      area: "宮城県 仙台市",
      mapQuery: "宮城県仙台市",
      image: "RevoFunding.png",
      officialUrl: "https://onokun.com/socially-responsible-sponsorship/",
    },
    {
      id: "tokyo-partner-sample",
      prefecture: "東京都",
      city: "渋谷区",
      name: "レボアート企業共創候補",
      type: "企業協賛",
      icon: "🏢",
      description: "首都圏の企業やクリエイターと連携し、社会貢献型アートの協賛・発信・展示の入口をつくります。",
      area: "東京都 渋谷区",
      mapQuery: "東京都渋谷区",
      image: "onokun-b.jpeg",
      officialUrl: "https://onokun.com/socially-responsible-sponsorship/",
    },
    {
      id: "tochigi-hat-sample",
      prefecture: "栃木県",
      city: "宇都宮市",
      name: "レボハット体験候補",
      type: "ワークショップ",
      icon: "🎩",
      description: "帽子を入口に、アート、ファッション、防災体験をつなぐレボハットのワークショップ候補地です。",
      area: "栃木県 宇都宮市",
      mapQuery: "栃木県宇都宮市",
      image: "onokun-b.jpeg",
      officialUrl: "https://onokun.com/revohat/",
    },
    {
      id: "fukuoka-art-sample",
      prefecture: "福岡県",
      city: "朝倉市",
      name: "地域共創アート候補",
      type: "地域共創",
      icon: "🎨",
      description: "地域の記憶や自然、防災の文脈をアートで伝える開催候補地です。市町村ごとの登録一覧として公開していきます。",
      area: "福岡県 朝倉市",
      mapQuery: "福岡県朝倉市",
      image: "RevoFunding.png",
      officialUrl: "#apply",
    },
  ],
};

function pageUrl(path = window.location.pathname.split("/").pop() || "index.html") {
  return new URL(path, publicBaseUrl).href;
}

function currentPublicPageUrl() {
  const fileName = window.location.pathname.split("/").pop() || "index.html";
  return pageUrl(fileName);
}

function buildShareUrl(platform, targetUrl, shareText = "防災×帽祭 応援Tシャツを応援しています") {
  const threadsText = `${shareText}。${targetUrl}`;

  if (platform === "x") {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(targetUrl)}`;
  }

  if (platform === "threads") {
    return `https://www.threads.net/intent/post?text=${encodeURIComponent(threadsText)}`;
  }

  if (platform === "line") {
    return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(targetUrl)}`;
  }

  if (platform === "facebook") {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(targetUrl)}`;
  }

  return targetUrl;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 2200);
}

function videoEmbedUrl(url) {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace("www.", "");

    if (host === "youtu.be") {
      return `https://www.youtube.com/embed/${parsed.pathname.replace("/", "")}`;
    }

    if (host.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/shorts/")) {
        return `https://www.youtube.com/embed/${parsed.pathname.split("/")[2] || ""}`;
      }

      const videoId = parsed.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    if (host.includes("vimeo.com")) {
      const videoId = parsed.pathname.split("/").filter(Boolean).pop();
      if (videoId) {
        return `https://player.vimeo.com/video/${videoId}`;
      }
    }
  } catch (error) {
    return "";
  }

  return "";
}

videoEmbeds.forEach((embed) => {
  const embedUrl = videoEmbedUrl(embed.dataset.videoUrl || "");
  if (!embedUrl) return;

  const title = embed.dataset.videoTitle || "Project video";
  embed.innerHTML = `<iframe src="${embedUrl}" title="${title}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
});

function escHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function countUnique(items, key) {
  return new Set(items.map((item) => item[key]).filter(Boolean)).size;
}

function revoArtColor(count) {
  if (count >= 6) return "#d63d33";
  if (count >= 3) return "#f26f4f";
  if (count >= 1) return "#f8cdbb";
  return "#f4f5f7";
}

function revoArtOpacity(count) {
  return count > 0 ? 0.84 : 0.52;
}

function revoArtGoogleMapEmbedUrl(location) {
  const query = location.mapQuery || [location.name, location.prefecture, location.city].filter(Boolean).join(" ");
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed&hl=ja`;
}

function revoArtGoogleMapSearchUrl(location) {
  const query = location.mapQuery || [location.name, location.prefecture, location.city].filter(Boolean).join(" ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function setupRevoArtMap() {
  if (!artMapSection) return;
  if (typeof L === "undefined") {
    const list = artMapSection.querySelector("[data-revo-art-list]");
    if (list) list.innerHTML = "<p>地図プログラムの読み込み中です。ページを再読み込みしてください。</p>";
    return;
  }

  const locations = revoArtMapData.locations;
  const prefData = locations.reduce((result, location) => {
    result[location.prefecture] = (result[location.prefecture] || 0) + 1;
    return result;
  }, {});
  const worldData = { Japan: locations.length };
  const totalCounter = artMapSection.querySelector("[data-revo-art-total]");
  const label = artMapSection.querySelector("[data-revo-art-selected-label]");
  const title = artMapSection.querySelector("[data-revo-art-selected-title]");
  const description = artMapSection.querySelector("[data-revo-art-selected-description]");
  const cityList = artMapSection.querySelector("[data-revo-art-cities]");
  const list = artMapSection.querySelector("[data-revo-art-list]");
  const rankingListElement = artMapSection.querySelector("[data-revo-art-ranking-list]");
  const detail = artMapSection.querySelector("[data-revo-art-detail]");
  const detailName = artMapSection.querySelector("[data-revo-art-detail-name]");
  const detailMeta = artMapSection.querySelector("[data-revo-art-detail-meta]");
  const detailImage = artMapSection.querySelector("[data-revo-art-detail-image]");
  const detailDescription = artMapSection.querySelector("[data-revo-art-detail-description]");
  const detailArea = artMapSection.querySelector("[data-revo-art-detail-area]");
  const detailMap = artMapSection.querySelector("[data-revo-art-detail-map]");
  const officialLink = artMapSection.querySelector("[data-revo-art-official]");
  const googleLink = artMapSection.querySelector("[data-revo-art-google]");
  const backButton = artMapSection.querySelector("[data-revo-art-back]");
  const tabs = [...artMapSection.querySelectorAll("[data-revo-art-map-tab]")];
  const japanMapElement = artMapSection.querySelector("#revo-art-japan-map");
  const worldMapElement = artMapSection.querySelector("#revo-art-world-map");
  let japanLayer;
  let japanMap;
  let worldMap;

  if (totalCounter) totalCounter.textContent = String(locations.length);

  function locationsByPrefecture(prefecture) {
    return locations.filter((location) => !prefecture || location.prefecture === prefecture);
  }

  function groupedCities(selectedLocations) {
    return selectedLocations.reduce((result, location) => {
      const city = location.city || "市町村未設定";
      if (!result[city]) result[city] = [];
      result[city].push(location);
      return result;
    }, {});
  }

  function renderCityList(selectedLocations, prefecture = "") {
    if (!cityList) return;
    const cities = groupedCities(selectedLocations);

    if (!Object.keys(cities).length) {
      cityList.innerHTML = `<div class="city-summary-item"><strong>${escHtml(prefecture || "全国")}</strong><span>登録なし</span></div>`;
      return;
    }

    cityList.innerHTML = Object.entries(cities)
      .map(([city, items]) => `<button class="city-summary-item" type="button" data-revo-art-city="${escHtml(city)}"><strong>${escHtml(city)}</strong><span>${items.length}件</span></button>`)
      .join("");
  }

  function renderLocationCard(location) {
    return `
      <article class="art-location-card">
        <span>${escHtml(location.icon)} ${escHtml(location.type)}</span>
        <h3>${escHtml(location.name)}</h3>
        <p>${escHtml(location.description)}</p>
        <dl>
          <div><dt>都道府県</dt><dd>${escHtml(location.prefecture)}</dd></div>
          <div><dt>市町村</dt><dd>${escHtml(location.city)}</dd></div>
          <div><dt>表示エリア</dt><dd>${escHtml(location.area)}</dd></div>
        </dl>
        <button type="button" data-revo-art-location="${escHtml(location.id)}">詳細・GoogleMapを見る</button>
      </article>
    `;
  }

  function renderLocationList(selectedLocations, prefecture = "") {
    if (!list) return;

    list.innerHTML = selectedLocations.length
      ? selectedLocations.map(renderLocationCard).join("")
      : `
        <article class="art-location-card">
          <span>Entry</span>
          <h3>${escHtml(prefecture || "この地域")}の開催地を募集しています</h3>
          <p>公開許可を得た施設、学校、商店街、企業、イベント会場を登録できます。レボアート開催地として相談してください。</p>
          <a href="#apply">開催地として相談する</a>
        </article>
      `;
  }

  function renderRanking() {
    if (!rankingListElement) return;
    const ranking = Object.entries(prefData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    rankingListElement.innerHTML = ranking.length
      ? ranking.map(([prefecture, count], index) => `<button type="button" data-revo-art-pref="${escHtml(prefecture)}"><strong>${index + 1}位</strong><span>${escHtml(prefecture)}</span><em>${count}件</em></button>`).join("")
      : "<p>登録が入るとランキングが表示されます。</p>";
  }

  function showDetail(location, shouldScroll = true) {
    if (!detail || !location) return;
    if (detailName) detailName.textContent = location.name;
    if (detailMeta) detailMeta.textContent = `${location.icon} ${location.type} / ${location.prefecture} ${location.city}`;
    if (detailImage) {
      detailImage.src = location.image || "onokun-a.jpeg";
      detailImage.alt = `${location.name} イメージ`;
    }
    if (detailDescription) detailDescription.textContent = location.description;
    if (detailArea) detailArea.textContent = location.area || `${location.prefecture} ${location.city}`;
    if (detailMap) {
      detailMap.src = revoArtGoogleMapEmbedUrl(location);
      detailMap.title = `${location.name} Google Map`;
    }
    if (officialLink) {
      officialLink.href = location.officialUrl || "#apply";
      officialLink.textContent = location.officialUrl && location.officialUrl.startsWith("http") ? "公式サイト" : "相談フォームへ";
      officialLink.toggleAttribute("target", Boolean(location.officialUrl && location.officialUrl.startsWith("http")));
      officialLink.rel = location.officialUrl && location.officialUrl.startsWith("http") ? "noreferrer" : "";
    }
    if (googleLink) googleLink.href = revoArtGoogleMapSearchUrl(location);
    detail.classList.add("visible");
    if (shouldScroll) detail.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderPrefecture(prefecture = "") {
    const selectedLocations = locationsByPrefecture(prefecture);
    if (label) label.textContent = prefecture || "全国";
    if (title) title.textContent = prefecture ? `${prefecture}の登録スポット` : "全国の登録スポット";
    if (description) {
      description.textContent = prefecture
        ? selectedLocations.length
          ? `${prefecture}には${selectedLocations.length}件の公開登録があります。市町村ごとの一覧から個別のGoogleMapを確認できます。`
          : `${prefecture}には、まだ公開登録がありません。開催地として相談するとここに追加できます。`
        : "都道府県をクリックすると、市町村ごとの登録数と開催地一覧が表示されます。";
    }
    renderCityList(selectedLocations, prefecture);
    renderLocationList(selectedLocations, prefecture);
    if (selectedLocations[0]) showDetail(selectedLocations[0], false);
  }

  function renderCity(city) {
    const selectedLocations = locations.filter((location) => location.city === city);
    renderLocationList(selectedLocations, city);
    if (selectedLocations[0]) showDetail(selectedLocations[0]);
  }

  function initJapanMap() {
    if (!japanMapElement) return;
    japanMap = L.map(japanMapElement, {
      center: [36.5, 137.5],
      zoom: 5,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: "abc",
      maxZoom: 19,
    }).addTo(japanMap);

    fetch(revoArtMapData.japanGeoJsonUrl)
      .then((response) => response.json())
      .then((geojson) => {
        japanLayer = L.geoJSON(geojson, {
          style(feature) {
            const name = feature.properties.name || feature.properties.nam_ja || "";
            const count = prefData[name] || 0;
            return {
              fillColor: revoArtColor(count),
              fillOpacity: revoArtOpacity(count),
              weight: 1,
              color: "#fff",
              opacity: 1,
            };
          },
          onEachFeature(feature, layer) {
            const name = feature.properties.name || feature.properties.nam_ja || "";
            const count = prefData[name] || 0;
            layer.bindTooltip(`<strong>${escHtml(name)}</strong><br>開催登録: <strong>${count}</strong> 件`, {
              direction: "auto",
              sticky: true,
            });
            layer.on("mouseover", function () {
              this.setStyle({ fillOpacity: 1, weight: 2, color: "#007aff" });
            });
            layer.on("mouseout", function () {
              japanLayer.resetStyle(this);
            });
            layer.on("click", () => {
              renderPrefecture(name);
              layer.bindPopup(`<strong>${escHtml(name)}</strong><br>開催登録: <strong>${count}</strong> 件`).openPopup();
            });
          },
        }).addTo(japanMap);
      })
      .catch(() => {
        japanMapElement.innerHTML = '<p class="map-load-error">日本地図を読み込めませんでした。通信環境を確認してください。</p>';
      });
  }

  function initWorldMap() {
    if (!worldMapElement) return;
    worldMap = L.map(worldMapElement, {
      center: [20, 0],
      zoom: 2,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: "abc",
      maxZoom: 19,
    }).addTo(worldMap);

    fetch(revoArtMapData.worldGeoJsonUrl)
      .then((response) => response.json())
      .then((geojson) => {
        L.geoJSON(geojson, {
          style(feature) {
            const name = feature.properties.name || "";
            const count = worldData[name] || 0;
            return {
              fillColor: revoArtColor(count),
              fillOpacity: revoArtOpacity(count),
              weight: 1,
              color: "#fff",
              opacity: 1,
            };
          },
        }).addTo(worldMap);
      })
      .catch(() => {
        worldMapElement.innerHTML = '<p class="map-load-error">世界地図を読み込めませんでした。</p>';
      });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.revoArtMapTab;
      tabs.forEach((item) => item.classList.toggle("active", item === tab));
      japanMapElement?.classList.toggle("active", target === "japan");
      worldMapElement?.classList.toggle("active", target === "world");
      window.setTimeout(() => {
        japanMap?.invalidateSize();
        worldMap?.invalidateSize();
      }, 80);
    });
  });

  artMapSection.addEventListener("click", (event) => {
    const cityButton = event.target.closest("[data-revo-art-city]");
    const locationButton = event.target.closest("[data-revo-art-location]");
    const prefButton = event.target.closest("[data-revo-art-pref]");

    if (cityButton) renderCity(cityButton.dataset.revoArtCity);
    if (locationButton) {
      const location = locations.find((item) => item.id === locationButton.dataset.revoArtLocation);
      showDetail(location);
    }
    if (prefButton) renderPrefecture(prefButton.dataset.revoArtPref);
  });

  if (backButton) {
    backButton.addEventListener("click", () => {
      artMapSection.querySelector(".art-location-browser")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  renderRanking();
  renderPrefecture("");
  initJapanMap();
  initWorldMap();
}

setupRevoArtMap();

function parseCounterCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return text
    ? rows
    .slice(1)
    .reduce((items, columns) => {
      const [key, value] = columns;
      if (key && value) {
        items[key.trim()] = value;
      }
      return items;
    }, {})
    : {};
}

function parseProjectCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  const headers = rows[0] || [];
  return rows.slice(1).map((columns) => headers.reduce((project, header, index) => {
    project[header] = columns[index] || "";
    return project;
  }, {}));
}

function normalizeCounterData(data) {
  if (data?.counters) {
    return reconcileCounterAliases(data.counters);
  }

  if (Array.isArray(data)) {
    const counters = data.reduce((items, row) => {
      if (row.key && row.value) {
        items[row.key] = row.value;
      }
      return items;
    }, {});
    return reconcileCounterAliases(counters);
  }

  return reconcileCounterAliases(data || {});
}

function numberOnly(value) {
  const match = String(value).match(/[0-9,]+/);
  return match ? match[0] : value;
}

function reconcileCounterAliases(counters) {
  const mergedCounters = { ...counters };

  if (mergedCounters.supportersCount) {
    mergedCounters.supportersNumber = numberOnly(mergedCounters.supportersCount);
  }

  if (mergedCounters.fansCount) {
    mergedCounters.fansNumber = numberOnly(mergedCounters.fansCount);
  }

  if (mergedCounters.soldCount) {
    mergedCounters.soldNumber = numberOnly(mergedCounters.soldCount);
  }

  return mergedCounters;
}

function applyCounterData(counters) {
  document.querySelectorAll("[data-counter]").forEach((item) => {
    const value = counters[item.dataset.counter];
    if (value !== undefined) {
      item.textContent = value;
    }
  });

  document.querySelectorAll("[data-counter-small]").forEach((item) => {
    const value = counters[item.dataset.counterSmall];
    if (value !== undefined) {
      item.textContent = value;
    }
  });

  const bousaiCard = document.querySelector('[data-project="bousai"]');
  if (bousaiCard) {
    if (counters.supportersNumber) bousaiCard.dataset.supporters = numberOnly(counters.supportersNumber);
    if (counters.fansNumber) bousaiCard.dataset.fans = numberOnly(counters.fansNumber);
    if (counters.soldNumber) bousaiCard.dataset.sales = numberOnly(counters.soldNumber);
    if (counters.salesAmount) bousaiCard.dataset.money = numberOnly(counters.salesAmount).replace(/,/g, "");
  }

  updateRanking();
}

async function loadCounterData() {
  try {
    const response = await fetch(counterDataUrl, { cache: "no-store" });
    if (!response.ok) return;

    const contentType = response.headers.get("content-type") || "";
    const isCsv = counterDataUrl.endsWith(".csv") || counterDataUrl.includes("output=csv") || contentType.includes("text/csv");
    const counters = isCsv
      ? reconcileCounterAliases(parseCounterCsv(await response.text()))
      : normalizeCounterData(await response.json());

    applyCounterData(counters);
  } catch (error) {
    // カウンター取得に失敗しても、HTMLに書いた初期値をそのまま表示します。
  }
}

loadCounterData();

if (siteFooter && !siteFooter.querySelector('a[href="legal.html"]')) {
  const footerLinks = document.createElement("p");
  footerLinks.className = "footer-links";
  footerLinks.innerHTML = '<a href="legal.html">法務・購入条件</a><span>特商法 / 返品 / 発送 / 個人情報</span>';
  siteFooter.appendChild(footerLinks);
}

dynamicShareLinks.forEach((link) => {
  const targetUrl = pageUrl(link.dataset.url || window.location.pathname.split("/").pop() || "index.html");
  const shareText = link.dataset.text || "レボファンディングを応援しています";
  link.href = buildShareUrl(link.dataset.platform, targetUrl, shareText);
});

if (referralLinkOutput || copyReferral) {
  const referralUrl = pageUrl("shop.html?ref=revo-bousai-001");
  if (referralLinkOutput) {
    referralLinkOutput.textContent = referralUrl;
  }
  if (copyReferral) {
    copyReferral.dataset.link = referralUrl;
  }
}

if (copyEmbed) {
  const embedCode = document.querySelector(".embed-card code");
  if (embedCode) {
    embedCode.innerText = `<iframe
  src="${pageUrl("shop.html")}"
  title="防災×帽祭 応援Tシャツ"
  width="100%"
  height="520"
  style="border:1px solid #ded7c7;border-radius:8px;">
</iframe>`;
  }
}

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    activeStatusFilter = filter.dataset.filter;

    filters.forEach((item) => item.classList.remove("active"));
    filter.classList.add("active");

    updateRanking();
  });
});

function scoreCard(card, sortType) {
  const supporters = Number(card.dataset.supporters || 0);
  const fans = Number(card.dataset.fans || 0);
  const sales = Number(card.dataset.sales || 0);
  const money = Number(card.dataset.money || 0);
  const updated = Number(card.dataset.updated || 0);

  if (sortType === "money") return money;
  if (sortType === "supporters") return supporters;
  if (sortType === "sales") return sales;
  if (sortType === "updated") return updated;

  return supporters * 3 + fans * 1.5 + sales * 2 + money / 10000 + updated / 1000000;
}

function updateRanking() {
  if (!rankingList) return;

  const rankingCards = [...rankingList.querySelectorAll(".challenge-card")];

  rankingCards
    .sort((a, b) => scoreCard(b, activeSort) - scoreCard(a, activeSort))
    .forEach((card, index) => {
      const statusMatch = activeStatusFilter === "all" || card.dataset.status === activeStatusFilter;
      const categoryMatch = activeCategory === "all" || (card.dataset.category || "").includes(activeCategory);
      card.classList.toggle("hidden", !(statusMatch && categoryMatch));
      card.style.order = String(index + 1);
    });
}

function plainNumber(value) {
  const normalized = String(value || "").replace(/[^\d.-]/g, "");
  return normalized ? Number(normalized) : 0;
}

function formatCurrency(value) {
  const number = plainNumber(value);
  return number ? `${number.toLocaleString("ja-JP")}円` : "0円";
}

function formatCount(value, suffix = "人") {
  const number = plainNumber(value);
  return number ? `${number.toLocaleString("ja-JP")}${suffix}` : `0${suffix}`;
}

function splitList(value) {
  if (Array.isArray(value)) return value;
  return String(value || "")
    .split(/\n|\||,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function displayProjectStatus(status) {
  if (status === "closed") return "終了済み";
  if (status === "published") return "公開中";
  if (status === "open") return "募集中";
  if (status === "next") return "二次募集予定";
  if (status === "done") return "達成済み";
  return status || "準備中";
}

function isPublicProject(project) {
  return ["published", "closed", "open", "next", "done"].includes(project.status);
}

function normalizeProject(project) {
  const productList = Array.isArray(project.productList) ? project.productList : [];
  const firstProduct = productList[0] || {};
  const detailImages = project.detail_image_urls || project.galleryImages || [];
  const meisterProfile = project.meisterProfile || {};
  const targetAmount = plainNumber(project.target_amount || project.afterAmount || project.money);
  const currentAmount = plainNumber(project.current_amount || project.money || project.beforeAmount);
  const targetSupporters = plainNumber(project.target_supporters || project.boostGoalCount || project.sparkGoalCount || project.supporters);
  const currentSupporters = plainNumber(project.current_supporters || project.supporters || project.sparkCurrentCount || project.boostCurrentCount);
  const status = String(project.status || "draft").trim();

  return {
    id: project.project_id || project.projectId || project.id || "",
    status,
    statusLabel: project.status_label || project.statusLabel || displayProjectStatus(status),
    title: project.title || "",
    subtitle: project.subtitle || project.subTitle || project.catchCopy || "",
    shortDescription: project.short_description || project.summary || project.subTitle || "",
    detailDescription: project.detail_description || project.detailBody || project.summary || "",
    mainImageUrl: project.main_image_url || project.mainImage || "",
    detailImageUrls: splitList(detailImages).map((item) => (typeof item === "string" ? { src: item, caption: "" } : item)),
    creatorName: project.creator_name || meisterProfile.name || "",
    creatorProfile: project.creator_profile || meisterProfile.message || "",
    creatorImageUrl: project.creator_image_url || meisterProfile.image || "",
    creatorOfficialUrl: project.creator_official_url || meisterProfile.officialUrl || "",
    creatorSnsUrl: project.creator_sns_url || meisterProfile.snsUrl || "",
    category: project.category || "",
    productType: project.product_type || project.productionItemName || firstProduct.name || "",
    targetAmount,
    currentAmount,
    targetSupporters,
    currentSupporters,
    fanTargetAfterSuccess: plainNumber(project.fan_target_after_success || project.fans || project.boostGoalCount),
    baseProductUrl: project.base_product_url || firstProduct.purchaseUrl || "",
    productPrice: project.product_price || firstProduct.price || "",
    startDate: project.start_date || "",
    endDate: project.end_date || "",
    publishedAt: project.published_at || project.updated || "",
    updatedAt: project.updated_at || project.updated || "",
    displayOrder: plainNumber(project.display_order || 999),
    fans: plainNumber(project.fans || project.fan_target_after_success || 0),
    sales: plainNumber(project.sales || project.productionGoalCount || 0),
    money: currentAmount,
    updated: String(project.updated_at || project.published_at || project.updated || "").replaceAll("-", ""),
    nextAction: project.next_action || project.nextAction || "",
    shareText: project.share_text || project.shareText || "",
  };
}

function projectDetailUrl(project) {
  return `project.html?id=${encodeURIComponent(project.id)}`;
}

function progressPercent(current, target) {
  if (!target) return 0;
  return Math.round((current / target) * 100);
}

function createProjectCard(project) {
  const article = document.createElement("article");
  const visualClass = project.category.includes("アート")
    ? "photo-art"
    : project.category.includes("広告")
      ? "photo-links"
      : project.category.includes("おのくん")
        ? "photo-onokun"
        : "photo-bousai";
  const publicStatus = project.status === "closed" ? "done" : project.status === "next" ? "next" : "open";
  const percent = progressPercent(project.currentAmount, project.targetAmount);
  const supportersPercent = progressPercent(project.currentSupporters, project.targetSupporters);

  article.className = "challenge-card project-card dynamic-project-card";
  article.dataset.project = project.id;
  article.dataset.status = publicStatus;
  article.dataset.category = project.category;
  article.dataset.money = String(project.currentAmount);
  article.dataset.supporters = String(project.currentSupporters);
  article.dataset.fans = String(project.fanTargetAfterSuccess || project.fans);
  article.dataset.sales = String(project.sales);
  article.dataset.updated = project.updated;
  article.innerHTML = `
    <div class="project-photo ${visualClass}">
      <span class="project-mode">${project.productType || "REVO PROJECT"}</span>
      <strong>${project.subtitle || project.title}</strong>
    </div>
    <div class="project-content">
      <div class="card-row"><span class="status ${publicStatus}">${project.statusLabel}</span><span class="step">${project.nextAction || `${percent}%`}</span></div>
      <h3>${project.title}</h3>
      <p>${project.shortDescription}</p>
      <div class="project-progress-map spark-map" aria-label="プロジェクトの進行">
        <div><span>応援者</span><strong>${project.currentSupporters}/${project.targetSupporters || "-"}</strong></div>
        <i></i>
        <div><span>達成率</span><strong>${percent}%</strong></div>
        <i></i>
        <div><span>ファン目標</span><strong>${project.fanTargetAfterSuccess || "-"}人</strong></div>
      </div>
      <div class="project-stats">
        <div class="mini-stat"><span>現在金額</span><strong>${formatCurrency(project.currentAmount)}</strong></div>
        <div class="mini-stat"><span>目標金額</span><strong>${formatCurrency(project.targetAmount)}</strong></div>
        <div class="mini-stat"><span>応援人数</span><strong>${supportersPercent}%</strong></div>
      </div>
      <p class="project-message">${project.nextAction || "応援が次の循環へ進む準備をしています。"}</p>
      <div class="card-actions">
        <a class="button small primary" href="${projectDetailUrl(project)}">Project詳細を見る</a>
        ${project.baseProductUrl ? `<a class="button small secondary" href="${project.baseProductUrl}" target="_blank" rel="noreferrer">BASEで見る</a>` : '<span class="button small secondary disabled">BASE準備中</span>'}
        <button class="button small icon share-trigger" type="button" data-url="${projectDetailUrl(project)}" data-share="${project.title}">共有</button>
      </div>
    </div>
  `;

  return article;
}

function applyProjectData(projects) {
  const normalizedProjects = projects
    .map(normalizeProject)
    .filter((project) => project.id && isPublicProject(project))
    .sort((a, b) => a.displayOrder - b.displayOrder || String(b.publishedAt).localeCompare(String(a.publishedAt)));

  if (rankingList) {
    rankingList.innerHTML = "";

    if (!normalizedProjects.length) {
      const empty = document.createElement("div");
      empty.className = "project-empty-state";
      empty.innerHTML = "<strong>公開準備中です。</strong><span>Projectsシートでstatusをpublishedにしたプロジェクトがここに表示されます。</span>";
      rankingList.appendChild(empty);
    } else {
      normalizedProjects.forEach((project) => rankingList.appendChild(createProjectCard(project)));
    }
  }

  updateRanking();
  return normalizedProjects;
}

async function fetchProjectsFrom(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Project data could not be loaded.");

  const contentType = response.headers.get("content-type") || "";
  const isCsv = url.endsWith(".csv") || url.includes("output=csv") || contentType.includes("text/csv");
  const projects = isCsv ? parseProjectCsv(await response.text()) : (await response.json()).projects;

  if (isCsv && projects.length) {
    const headers = Object.keys(projects[0]);
    const hasProjectColumns = headers.includes("project_id") || headers.includes("id") || headers.includes("title");
    if (!hasProjectColumns) {
      throw new Error("Projects CSV does not include project columns.");
    }
  }

  return projects || [];
}

async function loadProjectData({ renderList = true } = {}) {
  if (!rankingList && !projectDetailRoot) return [];

  try {
    const projects = await fetchProjectsFrom(projectsDataUrl);
    return renderList ? applyProjectData(projects) : projects.map(normalizeProject);
  } catch (error) {
    try {
      const fallbackProjects = await fetchProjectsFrom(projectDataFallbackUrl);
      return renderList ? applyProjectData(fallbackProjects) : fallbackProjects.map(normalizeProject);
    } catch (fallbackError) {
      updateRanking();
      return [];
    }
  }
}

function renderProjectDetail(project) {
  if (!projectDetailRoot) return;

  if (!project) {
    projectDetailRoot.innerHTML = '<section class="section"><div class="project-empty-state"><strong>Projectが見つかりません。</strong><span>URLのid、またはProjectsシートのproject_idを確認してください。</span><a class="button primary" href="supporters.html">一覧へ戻る</a></div></section>';
    return;
  }

  const percent = progressPercent(project.currentAmount, project.targetAmount);
  const detailImages = project.detailImageUrls.length ? project.detailImageUrls : [{ src: project.mainImageUrl, caption: project.title }];
  const baseButton = project.baseProductUrl
    ? `<a class="button primary" href="${project.baseProductUrl}" target="_blank" rel="noreferrer">BASEで購入する</a>`
    : '<span class="button primary disabled">BASE準備中</span>';

  document.title = `${project.title} | レボファンディング`;
  projectDetailRoot.innerHTML = `
    <section class="project-hero-detail">
      <div class="project-hero-copy">
        <p class="eyebrow">${project.statusLabel} / ${project.category}</p>
        <h1>${project.title}</h1>
        <p class="lead">${project.subtitle}</p>
        <p>${project.shortDescription}</p>
        <div class="project-status-row"><span class="status ${project.status === "closed" ? "done" : "open"}">${project.statusLabel}</span><span>${project.nextAction || `${percent}%達成`}</span></div>
        <div class="project-cta-row">${baseButton}<button class="button icon share-trigger" type="button" data-url="${projectDetailUrl(project)}" data-share="${project.title}">SNSで共有する</button></div>
      </div>
      <div class="project-template-image">${project.mainImageUrl ? `<img src="${project.mainImageUrl}" alt="${project.title}" />` : "<span>Project Visual</span>"}</div>
    </section>

    <section class="section project-number-section" aria-label="挑戦の数字">
      <div class="project-number-grid">
        <div class="number-card spark"><span>現在金額</span><strong>${formatCurrency(project.currentAmount)}</strong><small>目標 ${formatCurrency(project.targetAmount)}</small></div>
        <div class="number-card"><span>達成率</span><strong>${percent}%</strong><small>current_amount / target_amount</small></div>
        <div class="number-card"><span>現在応援人数</span><strong>${formatCount(project.currentSupporters)}</strong><small>目標 ${formatCount(project.targetSupporters)}</small></div>
        <div class="number-card boost"><span>達成後ファン目標</span><strong>${formatCount(project.fanTargetAfterSuccess)}</strong><small>次の循環へ広げる人数</small></div>
        <div class="number-card amplify"><span>商品種別</span><strong>${project.productType || "未設定"}</strong><small>${project.productPrice || "価格未設定"}</small></div>
      </div>
    </section>

    <section class="section project-story-layout">
      <article class="project-story-body">
        <p class="eyebrow">Story</p>
        <h2>挑戦の詳細</h2>
        <p>${project.detailDescription || project.shortDescription}</p>
      </article>
      <aside class="project-side-panel">
        <h2>起案者</h2>
        ${project.creatorImageUrl ? `<img class="creator-image" src="${project.creatorImageUrl}" alt="${project.creatorName}" />` : ""}
        <h3>${project.creatorName || "起案者情報 未設定"}</h3>
        <p>${project.creatorProfile || "Projectsシートでcreator_profileを入力すると表示されます。"}</p>
        <div class="card-actions">
          ${project.creatorOfficialUrl ? `<a class="button small secondary" href="${project.creatorOfficialUrl}" target="_blank" rel="noreferrer">公式サイト</a>` : ""}
          ${project.creatorSnsUrl ? `<a class="button small secondary" href="${project.creatorSnsUrl}" target="_blank" rel="noreferrer">SNS</a>` : ""}
        </div>
      </aside>
    </section>

    <section class="section project-gallery-section">
      <div class="section-head"><div><p class="eyebrow">Gallery</p><h2>詳細画像</h2></div></div>
      <div class="project-gallery">
        ${detailImages.map((image) => `<figure><img src="${image.src}" alt="${image.caption || project.title}" /><figcaption>${image.caption || project.title}</figcaption></figure>`).join("")}
      </div>
    </section>

    <section class="section project-share-panel">
      <div><p class="eyebrow">Share</p><h2>このProjectを広げる</h2><p>${project.shareText || `${project.title}を応援しています。`}</p></div>
      <div class="project-cta-row">
        <a class="button secondary dynamic-share-link" href="#" data-platform="x" data-url="${projectDetailUrl(project)}" data-text="${project.shareText || project.title}" target="_blank" rel="noreferrer">Xで共有</a>
        <a class="button secondary dynamic-share-link" href="#" data-platform="line" data-url="${projectDetailUrl(project)}" data-text="${project.shareText || project.title}" target="_blank" rel="noreferrer">LINEで送る</a>
      </div>
    </section>
  `;

  projectDetailRoot.querySelectorAll(".dynamic-share-link").forEach((link) => {
    const targetUrl = pageUrl(link.dataset.url);
    link.href = buildShareUrl(link.dataset.platform, targetUrl, link.dataset.text);
  });
}

async function loadProjectDetail() {
  if (!projectDetailRoot) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const projects = await loadProjectData({ renderList: false });
  const publicProjects = projects.filter(isPublicProject);
  renderProjectDetail(publicProjects.find((project) => project.id === id));
}

rankSortButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeSort = button.dataset.sort || "active";
    rankSortButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    updateRanking();
  });
});

if (categoryFilter) {
  categoryFilter.addEventListener("change", () => {
    activeCategory = categoryFilter.value;
    updateRanking();
  });
}

updateRanking();
loadProjectData();
loadProjectDetail();

shareButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const title = button.dataset.share || "レボファンディング";
    const text = `${title}を応援しています。応援者とファンで挑戦を次の展開へ育てるレボファンディングです。`;
    const targetUrl = pageUrl(button.dataset.url || window.location.pathname.split("/").pop() || "index.html");
    const shareData = {
      title,
      text,
      url: targetUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast("共有画面を開きました");
      } catch (error) {
        showToast("共有を取りやめました");
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(`${text}\n${targetUrl}`);
      showToast("共有文をコピーしました");
    } catch (error) {
      showToast("共有文: " + text);
    }
  });
});

document.addEventListener("click", async (event) => {
  const button = event.target.closest(".share-trigger");
  if (!button || Array.from(shareButtons).includes(button)) return;

  const title = button.dataset.share || "レボファンディング";
  const text = `${title}を応援しています。応援者とファンで挑戦を次の展開へ育てるレボファンディングです。`;
  const targetUrl = pageUrl(button.dataset.url || window.location.pathname.split("/").pop() || "index.html");
  const shareData = { title, text, url: targetUrl };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (error) {
      // 共有をキャンセルした場合はコピーに切り替えません。
      return;
    }
  }

  await navigator.clipboard.writeText(`${text}\n${targetUrl}`);
  showToast("共有リンクをコピーしました");
});

sizeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    sizeButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

if (copyTemplate) {
  copyTemplate.addEventListener("click", async () => {
    const text = document.querySelector(".copy-text")?.value || "";
    try {
      await navigator.clipboard.writeText(text);
      showToast("投稿文をコピーしました");
    } catch (error) {
      showToast("投稿文を選択してコピーしてください");
    }
  });
}

if (copyEmbed) {
  copyEmbed.addEventListener("click", async () => {
    const code = document.querySelector(".embed-card code")?.innerText || "";
    try {
      await navigator.clipboard.writeText(code);
      showToast("埋め込みコードをコピーしました");
    } catch (error) {
      showToast("コードを選択してコピーしてください");
    }
  });
}

instagramButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const targetUrl = pageUrl(button.dataset.url || window.location.pathname.split("/").pop() || "shop.html");
    const text = button.dataset.instagramText || `防災×帽祭 応援Tシャツを応援しています。
おのくんのビジュアルをきっかけに、防災をもっと身近に広げるレボチャレンジです。
購入やシェアが、次回ロットとファン化につながります。
${targetUrl}

#防災 #帽祭 #おのくん #レボファンディング`;

    try {
      await navigator.clipboard.writeText(text);
      showToast("Instagram用文面をコピーしました");
      window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    } catch (error) {
      showToast("Instagram用文面を選択してコピーしてください");
    }
  });
});

if (copyReferral) {
  copyReferral.addEventListener("click", async () => {
    const link = copyReferral.dataset.link || window.location.href;
    try {
      await navigator.clipboard.writeText(link);
      showToast("紹介リンクをコピーしました");
    } catch (error) {
      showToast("リンクを選択してコピーしてください");
    }
  });
}
