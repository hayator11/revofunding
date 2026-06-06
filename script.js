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
const projectWorkRoot = document.querySelector("[data-project-work]");
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

function formatRatio(current, target, suffix = "") {
  const currentNumber = plainNumber(current);
  const targetNumber = plainNumber(target);
  const currentText = currentNumber.toLocaleString("ja-JP");
  const targetText = targetNumber ? targetNumber.toLocaleString("ja-JP") : "-";
  return suffix ? `${currentText}${suffix} / ${targetText}${suffix}` : `${currentText} / ${targetText}`;
}

function hasProjectValue(project, key) {
  return Object.prototype.hasOwnProperty.call(project, key) && String(project[key] ?? "").trim() !== "";
}

function projectNumber(project, key, fallback = 0) {
  if (hasProjectValue(project, key)) return plainNumber(project[key]);
  return plainNumber(fallback);
}

function projectText(project, key, fallback = "") {
  if (hasProjectValue(project, key)) return String(project[key]).trim();
  return fallback;
}

function salesProgressText(project) {
  if (!project.targetSalesCount && !project.currentSalesCount) return "商品決定後に開始";
  return formatRatio(project.currentSalesCount, project.targetSalesCount, "点");
}

function salesProgressNote(project) {
  if (!project.targetSalesCount && !project.currentSalesCount) return "販売金額は商品の決定後に開始";
  if (project.salesAmount) return `販売金額 ${formatCurrency(project.salesAmount)}`;
  return "販売金額は手動更新";
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
  const targetAmount = projectNumber(project, "target_amount", project.afterAmount || project.money);
  const currentAmount = projectNumber(project, "current_amount", project.beforeAmount || project.money);
  const targetSupporters = projectNumber(project, "target_supporters", project.sparkGoalCount || project.boostGoalCount || project.supporters);
  const currentSupporters = projectNumber(project, "current_supporters", project.sparkCurrentCount || project.boostCurrentCount || project.supporters);
  const productPrice = projectText(project, "product_price", firstProduct.price || "");
  const targetSalesCount = projectNumber(project, "target_sales_count", project.productionGoalCount || 0);
  const currentSalesCount = projectNumber(project, "current_sales_count", project.sales || project.wornCount || 0);
  const salesAmount = projectNumber(project, "sales_amount", 0);
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
    productPrice,
    targetAmount,
    currentAmount,
    targetSupporters,
    currentSupporters,
    fanTargetAfterSuccess: projectNumber(project, "fan_target_after_success", project.fans || project.boostGoalCount),
    targetSalesCount,
    currentSalesCount,
    salesAmount,
    boosterTargetSupporters: projectNumber(project, "booster_target_supporters", project.boostGoalCount || 0),
    boosterCurrentSupporters: projectNumber(project, "booster_current_supporters", project.boostCurrentCount || 0),
    boosterStatus: project.booster_status || "募集ページ設定後に公開",
    baseProductUrl: project.base_product_url || firstProduct.purchaseUrl || "",
    workFormUrl: project.work_form_url || project.project_input_form_url || "",
    workNote: project.work_note || project.operator_note || "",
    startDate: project.start_date || "",
    endDate: project.end_date || "",
    publishedAt: project.published_at || project.updated || "",
    updatedAt: project.updated_at || project.updated || "",
    displayOrder: plainNumber(project.display_order || 999),
    fans: plainNumber(project.fans || project.fan_target_after_success || 0),
    sales: currentSalesCount,
    money: currentAmount,
    updated: String(project.updated_at || project.published_at || project.updated || "").replaceAll("-", ""),
    nextAction: project.next_action || project.nextAction || "",
    shareText: project.share_text || project.shareText || "",
  };
}

function projectDetailUrl(project) {
  return `project.html?id=${encodeURIComponent(project.id)}`;
}

function projectWorkUrl(project) {
  return `project-work.html?id=${encodeURIComponent(project.id)}`;
}

function progressPercent(current, target) {
  if (!target) return 0;
  return Math.round((current / target) * 100);
}

function progressBar(current, target, label) {
  const percent = Math.min(progressPercent(current, target), 100);
  return `<div class="metric-progress" aria-label="${label}"><span style="width: ${percent}%"></span></div>`;
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
        <div><span>応援者目標</span><strong>${formatCount(project.targetSupporters)}</strong></div>
        <i></i>
        <div><span>達成人数</span><strong>${formatCount(project.currentSupporters)}</strong></div>
        <i></i>
        <div><span>ファン目標</span><strong>${formatCount(project.fanTargetAfterSuccess)}</strong></div>
      </div>
      <div class="project-stats">
        <div class="mini-stat"><span>目標金額</span><strong>${formatCurrency(project.targetAmount)}</strong><small>達成金額 ${formatCurrency(project.currentAmount)}</small>${progressBar(project.currentAmount, project.targetAmount, "金額の進行")}</div>
        <div class="mini-stat"><span>応援者</span><strong>${formatRatio(project.currentSupporters, project.targetSupporters, "人")}</strong><small>${supportersPercent}%</small>${progressBar(project.currentSupporters, project.targetSupporters, "応援人数の進行")}</div>
        <div class="mini-stat"><span>販売</span><strong>${salesProgressText(project)}</strong><small>${salesProgressNote(project)}</small></div>
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
  if (!rankingList && !projectDetailRoot && !projectWorkRoot) return [];

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
  const supportersPercent = progressPercent(project.currentSupporters, project.targetSupporters);
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
        <div class="number-card spark"><span>目標金額</span><strong>${formatCurrency(project.targetAmount)}</strong><small>達成金額 ${formatCurrency(project.currentAmount)}</small>${progressBar(project.currentAmount, project.targetAmount, "金額の進行")}</div>
        <div class="number-card"><span>達成金額</span><strong>${formatCurrency(project.currentAmount)}</strong><small>${percent}%達成</small>${progressBar(project.currentAmount, project.targetAmount, "達成率")}</div>
        <div class="number-card"><span>応援者の目標人数</span><strong>${formatCount(project.targetSupporters)}</strong><small>達成人数 ${formatCount(project.currentSupporters)} / ${supportersPercent}%</small>${progressBar(project.currentSupporters, project.targetSupporters, "応援人数の進行")}</div>
        <div class="number-card boost"><span>達成後ファン目標</span><strong>${formatCount(project.fanTargetAfterSuccess)}</strong><small>次の循環へ広げる人数</small></div>
        <div class="number-card amplify"><span>販売</span><strong>${salesProgressText(project)}</strong><small>${salesProgressNote(project)}</small></div>
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

function workStepState(project, step) {
  if (project.status === "published" || project.status === "closed") return "done";
  if (step.required.some((key) => String(project[key] || "").trim())) return "done";
  if (project.status === "review" || project.status === "approved") return "review";
  return "todo";
}

function workDraftKey(projectId = "new") {
  return `revo-work-draft-${projectId || "new"}`;
}

function projectWorkForm(project = {}) {
  return `
    <section class="section">
      <div class="section-head"><div><p class="eyebrow">Work Form</p><h2>作業ページで入力する</h2></div><span class="section-note">入力内容はこのブラウザに下書き保存されます。</span></div>
      <form class="work-input-form" data-work-form data-project-id="${project.id || "new"}">
        <div class="work-form-status" data-work-form-status>入力中</div>
        <label>Projectタイトル<input name="title" type="text" placeholder="例: おのくんキャラバン レボアート" value="${project.title || ""}" /></label>
        <label>キャッチコピー<input name="subtitle" type="text" placeholder="例: 孤独な挑戦者を、減らしたい。" value="${project.subtitle || ""}" /></label>
        <label>短い説明<textarea name="shortDescription" placeholder="一覧ページに出す2〜3行の説明を書いてください。">${project.shortDescription || ""}</textarea></label>
        <label>詳細本文<textarea name="detailDescription" placeholder="挑戦の背景、なぜ今やるのか、誰に届けたいのか、次の循環で何をしたいのかを書いてください。">${project.detailDescription || ""}</textarea></label>
        <div class="work-form-grid">
          <label>メイン画像URL<input name="mainImageUrl" type="url" placeholder="https://..." value="${project.mainImageUrl || ""}" /></label>
          <label>詳細画像URL<input name="detailImageUrls" type="text" placeholder="複数ある場合はカンマ区切り" value="${project.detailImageUrls?.map((image) => image.src).join(", ") || ""}" /></label>
          <label>商品種別<input name="productType" type="text" placeholder="Tシャツ、帽子、ステッカーなど" value="${project.productType || ""}" /></label>
          <label>BASE商品URL<input name="baseProductUrl" type="url" placeholder="https://..." value="${project.baseProductUrl || ""}" /></label>
          <label>目標金額<input name="targetAmount" type="number" min="0" placeholder="例: 500000" value="${project.targetAmount || ""}" /></label>
          <label>目標応援人数<input name="targetSupporters" type="number" min="0" placeholder="例: 100" value="${project.targetSupporters || ""}" /></label>
          <label>達成後ファン目標<input name="fanTargetAfterSuccess" type="number" min="0" placeholder="例: 300" value="${project.fanTargetAfterSuccess || ""}" /></label>
          <label>公式サイト / SNS<input name="creatorOfficialUrl" type="url" placeholder="https://..." value="${project.creatorOfficialUrl || project.creatorSnsUrl || ""}" /></label>
        </div>
        <label>運営へのメモ<textarea name="operatorNote" placeholder="相談したいこと、確認してほしいこと、画像提出方法などを書いてください。"></textarea></label>
        <div class="project-cta-row">
          <button class="button secondary" type="button" data-save-work>下書き保存</button>
          <button class="button primary" type="submit">運営確認待ちにする</button>
        </div>
        <textarea class="work-submit-output" data-work-output readonly placeholder="提出用テキストがここに生成されます。"></textarea>
      </form>
    </section>
  `;
}

function bindProjectWorkForm() {
  const form = projectWorkRoot?.querySelector("[data-work-form]");
  if (!form) return;

  const projectId = form.dataset.projectId || "new";
  const key = workDraftKey(projectId);
  const output = form.querySelector("[data-work-output]");
  const status = form.querySelector("[data-work-form-status]");
  const saved = JSON.parse(localStorage.getItem(key) || "{}");

  Object.entries(saved).forEach(([name, value]) => {
    const field = form.elements[name];
    if (field) field.value = value;
  });

  function collect() {
    return Array.from(new FormData(form).entries()).reduce((result, [name, value]) => {
      result[name] = String(value || "").trim();
      return result;
    }, {});
  }

  function saveDraft(message = "下書きを保存しました") {
    localStorage.setItem(key, JSON.stringify(collect()));
    if (status) status.textContent = "下書き保存済み";
    showToast(message);
  }

  function buildSubmissionText(data) {
    return [
      "【レボファンディング 作業ページ入力】",
      `project_id: ${projectId}`,
      `Projectタイトル: ${data.title || ""}`,
      `キャッチコピー: ${data.subtitle || ""}`,
      "",
      "【短い説明】",
      data.shortDescription || "",
      "",
      "【詳細本文】",
      data.detailDescription || "",
      "",
      "【画像URL】",
      `メイン画像: ${data.mainImageUrl || ""}`,
      `詳細画像: ${data.detailImageUrls || ""}`,
      "",
      "【商品・目標】",
      `商品種別: ${data.productType || ""}`,
      `目標金額: ${data.targetAmount || ""}`,
      `目標応援人数: ${data.targetSupporters || ""}`,
      `達成後ファン目標: ${data.fanTargetAfterSuccess || ""}`,
      `BASE商品URL: ${data.baseProductUrl || ""}`,
      "",
      "【公式リンク】",
      data.creatorOfficialUrl || "",
      "",
      "【運営へのメモ】",
      data.operatorNote || "",
    ].join("\n");
  }

  form.querySelector("[data-save-work]")?.addEventListener("click", () => saveDraft());
  form.addEventListener("input", () => {
    localStorage.setItem(key, JSON.stringify(collect()));
    if (status) status.textContent = "入力中 / 自動保存";
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = collect();
    const text = buildSubmissionText(data);
    localStorage.setItem(key, JSON.stringify({ ...data, submittedAt: new Date().toISOString() }));
    if (output) output.value = text;
    if (status) status.textContent = "運営確認待ち";

    try {
      await navigator.clipboard.writeText(text);
      showToast("提出用テキストをコピーしました");
    } catch (error) {
      showToast("提出用テキストを生成しました");
    }
  });
}

function renderProjectWorkGate() {
  if (!projectWorkRoot) return;

  document.title = "申請が必要です | レボファンディング";
  projectWorkRoot.innerHTML = `
    <section class="project-work-hero">
      <div>
        <p class="eyebrow">Before Work Room</p>
        <h1>作業ページへ進む前に、Googleフォーム申請が必要です。</h1>
        <p class="lead">このページは、申請が完了した方が次の準備を進めるためのページです。まず起案者申請フォームを送信してください。</p>
      </div>
      <div class="work-room-card">
        <span>先に必要なこと</span>
        <strong>起案者申請を送信する</strong>
        <p>申請完了後、Googleフォームの完了画面に表示されるリンクから、本文・画像・商品案の準備ページへ進めます。</p>
        <div class="project-cta-row">
          <a class="button primary" href="https://docs.google.com/forms/d/e/1FAIpQLSdtm4PpMVwWIRXsKLtSahzwWjCu2N4Qi14N-nHQh_ZF6UQzOg/viewform?usp=dialog" target="_blank" rel="noreferrer">Googleフォームで申請する</a>
          <a class="button secondary" href="challenger.html">起案者ページへ戻る</a>
        </div>
      </div>
    </section>
  `;
}

function renderProjectWorkStart(requestedId = "") {
  if (!projectWorkRoot) return;

  document.title = "申請後の準備ページ | レボファンディング";
  projectWorkRoot.innerHTML = `
    <section class="project-work-hero">
      <div>
        <p class="eyebrow">Application Next Step</p>
        <h1>申請ありがとうございます。次に公開準備を進めましょう</h1>
        <p class="lead">申請内容を確認後、運営から個別作業ページURLをお送りします。個別URLでは、あなたのプロジェクト内容を確認しながら公開準備を進められます。</p>
        ${requestedId ? `<div class="project-status-row"><span class="status next">確認中</span><span>指定されたproject_id: ${requestedId}</span></div>` : ""}
      </div>
      <div class="work-room-card">
        <span>公開準備</span>
        <strong>先に整理しておく内容</strong>
        <p>個別作業ページURLが届く前に、本文、画像、商品案、目標値、公式リンクをまとめておくと公開までの確認がスムーズになります。</p>
        <div class="project-cta-row">
          <a class="button primary" href="https://docs.google.com/forms/d/e/1FAIpQLSdtm4PpMVwWIRXsKLtSahzwWjCu2N4Qi14N-nHQh_ZF6UQzOg/viewform?usp=dialog" target="_blank" rel="noreferrer">公開準備情報を送る</a>
          <a class="button secondary" href="supporters.html">公開Projectを見る</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head"><div><p class="eyebrow">Preparation Checklist</p><h2>公開準備で整理する項目</h2></div></div>
      <div class="work-checklist">
        <article class="work-step todo"><span>文章</span><h3>プロジェクトタイトル</h3><p>一覧や詳細ページで最初に見える、挑戦の名前を整理します。</p></article>
        <article class="work-step todo"><span>文章</span><h3>サブタイトル</h3><p>挑戦の方向性が一言で伝わる短いコピーを準備します。</p></article>
        <article class="work-step todo"><span>文章</span><h3>小説明</h3><p>一覧カードに表示する、2〜3行のわかりやすい説明を用意します。</p></article>
        <article class="work-step todo"><span>文章</span><h3>詳細説明</h3><p>何を実現したいのか、どう広げるのか、次の循環までを文章にします。</p></article>
        <article class="work-step todo"><span>想い</span><h3>想い・背景</h3><p>なぜこの挑戦をするのか、誰に届けたいのかを整理します。</p></article>
        <article class="work-step todo"><span>商品</span><h3>商品案</h3><p>Tシャツ、トートバッグ、その他グッズなど、最初に展開したい商品を考えます。</p></article>
        <article class="work-step todo"><span>数字</span><h3>目標金額</h3><p>制作費、広報、次回展開を踏まえた目標金額を整理します。</p></article>
        <article class="work-step todo"><span>数字</span><h3>目標人数</h3><p>最初の応援者数、広げたい人数、達成後のファン募集目標人数を考えます。</p></article>
        <article class="work-step todo"><span>画像</span><h3>見出し画像</h3><p>プロジェクトの印象を決めるメイン画像を準備します。</p></article>
        <article class="work-step todo"><span>画像</span><h3>詳細説明に使う画像</h3><p>活動風景、商品案、制作途中、集合写真などを整理します。</p></article>
        <article class="work-step todo"><span>リンク</span><h3>公式サイト / SNS</h3><p>起案者の公式サイト、SNS、関連ページのURLをまとめます。</p></article>
        <article class="work-step review"><span>運営</span><h3>運営へのメモ</h3><p>相談したいこと、確認してほしいこと、BASE登録後に反映してほしい内容をまとめます。</p></article>
      </div>
    </section>

    <section class="section project-story-layout">
      <article class="project-story-body">
        <p class="eyebrow">How it works</p>
        <h2>申請後の流れ</h2>
        <p>Googleフォームの申請内容は、運営管理表に入り、Projectsシートに下書きとして作成されます。運営が内容を確認したあと、個別作業ページURLをお送りします。</p>
        <p>個別URLでは、あなたのプロジェクト内容を確認しながら、公開に必要な本文、画像、目標値、BASEリンクの反映状況を確認できます。</p>
      </article>
      <aside class="project-side-panel">
        <h2>Googleフォーム完了後に表示する文</h2>
        <p>申請ありがとうございます。続けて、本文・画像・商品案の準備をこちらから進めてください。</p>
        <p><strong>https://revofunding.onokun.com/project-work.html?from=form</strong></p>
        <p>運営確認後、個別の作業ページURLをお送りします。</p>
      </aside>
    </section>
  `;
}

function renderProjectWork(project, requestedId = "") {
  if (!projectWorkRoot) return;

  if (!project) {
    renderProjectWorkStart(requestedId);
    return;
  }

  const percent = progressPercent(project.currentAmount, project.targetAmount);
  const supportersPercent = progressPercent(project.currentSupporters, project.targetSupporters);
  const workSteps = [
    { title: "想い・本文を書く", body: "挑戦の背景、なぜ今やるのか、目指す未来を入力します。", required: ["detailDescription", "shortDescription"] },
    { title: "画像を提出する", body: "メイン画像、制作風景、商品イメージ、活動写真を提出します。", required: ["mainImageUrl"] },
    { title: "商品・目標を確認する", body: "商品種別、目標金額、目標人数、ファン目標を確認します。", required: ["productType", "targetAmount", "targetSupporters"] },
    { title: "BASEリンクを確認する", body: "購入ページが準備できたら、BASEの商品URLをProjectsに設定します。", required: ["baseProductUrl"] },
    { title: "運営確認へ進む", body: "内容が整ったら運営確認へ。問題なければpublishedで公開します。", required: ["publishedAt"] },
  ];

  const formButton = project.workFormUrl
    ? `<a class="button primary" href="${project.workFormUrl}" target="_blank" rel="noreferrer">詳細入力フォームを開く</a>`
    : '<span class="button primary disabled">詳細入力フォーム準備中</span>';

  document.title = `${project.title || "Project"} 作業ページ | レボファンディング`;
  projectWorkRoot.innerHTML = `
    <section class="project-work-hero">
      <div>
        <p class="eyebrow">Project Work Room</p>
        <h1>${project.title || "Project作業ページ"}</h1>
        <p class="lead">申請後に、起案者が記事・画像・商品情報を整えるための作業ページです。</p>
        <div class="project-status-row"><span class="status ${project.status === "published" ? "open" : "next"}">${project.statusLabel}</span><span>project_id: ${project.id}</span></div>
      </div>
      <div class="work-room-card">
        <span>次にやること</span>
        <strong>${project.status === "published" ? "公開済みです" : "入力内容を整えて運営確認へ"}</strong>
        <p>${project.workNote || "詳細本文、画像、目標値、BASEリンクを整えると公開準備に進めます。"}</p>
        <div class="project-cta-row">${formButton}<a class="button secondary" href="${projectDetailUrl(project)}">公開プレビューを見る</a></div>
      </div>
    </section>

    <section class="section project-number-section">
      <div class="section-head"><div><p class="eyebrow">Counters</p><h2>現在値と目標値</h2></div></div>
      <div class="project-number-grid work-number-grid">
        <div class="number-card spark"><span>目標金額</span><strong>${formatCurrency(project.targetAmount)}</strong><small>達成金額 ${formatCurrency(project.currentAmount)}</small>${progressBar(project.currentAmount, project.targetAmount, "金額の進行")}</div>
        <div class="number-card"><span>応援者の目標人数</span><strong>${formatCount(project.targetSupporters)}</strong><small>達成人数 ${formatCount(project.currentSupporters)} / ${supportersPercent}%</small>${progressBar(project.currentSupporters, project.targetSupporters, "応援人数の進行")}</div>
        <div class="number-card boost"><span>販売</span><strong>${salesProgressText(project)}</strong><small>${salesProgressNote(project)}</small></div>
        <div class="number-card amplify"><span>達成後ファン目標</span><strong>${formatCount(project.fanTargetAfterSuccess)}</strong><small>次の循環で広げる人数</small></div>
      </div>
    </section>

    <section class="section">
      <div class="section-head"><div><p class="eyebrow">Checklist</p><h2>公開までの作業</h2></div></div>
      <div class="work-checklist">
        ${workSteps.map((step) => {
          const state = workStepState(project, step);
          return `<article class="work-step ${state}"><span>${state === "done" ? "完了" : state === "review" ? "確認中" : "未完了"}</span><h3>${step.title}</h3><p>${step.body}</p></article>`;
        }).join("")}
      </div>
    </section>

    ${projectWorkForm(project)}

    <section class="section project-story-layout">
      <article class="project-story-body">
        <p class="eyebrow">Draft Preview</p>
        <h2>入力内容の確認</h2>
        <p><strong>短い説明:</strong> ${project.shortDescription || "未入力"}</p>
        <p><strong>詳細本文:</strong> ${project.detailDescription || "未入力"}</p>
        <p><strong>商品種別:</strong> ${project.productType || "未入力"}</p>
        <p><strong>BASE URL:</strong> ${project.baseProductUrl || "未設定"}</p>
      </article>
      <aside class="project-side-panel">
        <h2>画像</h2>
        ${project.mainImageUrl ? `<img class="creator-image" src="${project.mainImageUrl}" alt="${project.title}" />` : "<p>main_image_urlが未設定です。</p>"}
        <p>公開用画像は、運営確認後にProjectsの画像URLへ反映します。</p>
      </aside>
    </section>
  `;

  bindProjectWorkForm();
}

async function loadProjectWork() {
  if (!projectWorkRoot) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const fromForm = params.get("from") === "form";
  if (!id && !fromForm) {
    renderProjectWorkGate();
    return;
  }
  const projects = await loadProjectData({ renderList: false });
  renderProjectWork(id ? projects.find((project) => project.id === id) : null, id || "");
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
loadProjectWork();

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
