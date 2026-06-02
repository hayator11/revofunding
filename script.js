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

function normalizeProject(project) {
  return {
    id: project.id || project.projectId || "",
    status: project.status || "open",
    category: project.category || "",
    supporters: Number(project.supporters || 0),
    fans: Number(project.fans || 0),
    sales: Number(project.sales || 0),
    money: Number(project.money || 0),
    updated: String(project.updated || "").replaceAll("-", ""),
  };
}

function applyProjectData(projects) {
  projects.forEach((project) => {
    const normalized = normalizeProject(project);
    if (!normalized.id) return;

    const card = document.querySelector(`[data-project="${normalized.id}"]`);
    if (!card) return;

    card.dataset.status = normalized.status;
    card.dataset.category = normalized.category;
    card.dataset.supporters = String(normalized.supporters);
    card.dataset.fans = String(normalized.fans);
    card.dataset.sales = String(normalized.sales);
    card.dataset.money = String(normalized.money);
    card.dataset.updated = normalized.updated;
  });

  updateRanking();
}

async function loadProjectData() {
  if (!rankingList) return;

  try {
    const response = await fetch(projectsDataUrl, { cache: "no-store" });
    if (!response.ok) return;

    const contentType = response.headers.get("content-type") || "";
    const isCsv = projectsDataUrl.endsWith(".csv") || projectsDataUrl.includes("output=csv") || contentType.includes("text/csv");
    const projects = isCsv ? parseProjectCsv(await response.text()) : (await response.json()).projects;
    applyProjectData(projects || []);
  } catch (error) {
    updateRanking();
  }
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
