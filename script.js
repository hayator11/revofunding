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
const publicBaseUrl = "https://hayator11.github.io/revofunding/";
const revoIntegrations = window.REVO_INTEGRATIONS || {
  forms: {
    revoArt: "https://docs.google.com/forms/d/e/1FAIpQLSesxTpGbfAfXhHmIljMGknEFKWp0TfWR1n2R0NuPxt4rGdjKw/viewform?usp=dialog",
    challenger: "https://docs.google.com/forms/d/e/1FAIpQLSdtm4PpMVwWIRXsKLtSahzwWjCu2N4Qi14N-nHQh_ZF6UQzOg/viewform?usp=dialog",
    supporter: "https://docs.google.com/forms/d/e/1FAIpQLSezDrOpfyY4sj9ShlTu1OzptzqOOGFHL-nl8yCX8_jTADhUcg/viewform?usp=dialog",
    artist: "https://docs.google.com/forms/d/e/1FAIpQLSf5NE0ZPj3e3nK_73pUNLz_09j7BS3jK2uGLvLaktCU01OMaQ/viewform?usp=dialog",
    fan: "https://docs.google.com/forms/d/e/1FAIpQLScPbj0Pa-CVw6X06duPbxZk6YU9nildlAjzrFTa6Wu75wWhWw/viewform?usp=dialog",
    license: "https://docs.google.com/forms/d/e/1FAIpQLSfbpc3VAFMKqkPO_JfOoPQ91uJZ-UGZSdBje3jpztW0yFiP5Q/viewform?usp=dialog",
  },
  base: {
    bousaiProduct: "https://onokun.shop.socialimagine.com/items/145050232",
  },
  sheets: {
    publicCountersCsv: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRcKmEgg9vkR0RHr8i1dbqnjOCZS7Julyl54k9tqUEBGxEejykf3X5eS4iZOKnsowGrtwiGZ7b7vRBN/pub?gid=403200930&single=true&output=csv",
    receivedSheets: [
      "https://docs.google.com/spreadsheets/d/11x5gBvQcis6t2xKtD5NlnnzBWI0ywaQKgXUJOZqOuNo/edit?usp=sharing",
      "https://docs.google.com/spreadsheets/d/1uSPieEo9-W9VCBp-FVG_4lwMJ4ireC217dT1HEliPCs/edit?gid=149106504#gid=149106504",
      "https://docs.google.com/spreadsheets/d/1znlaaylwX1pydYJlbeEqMULnVU8Ybww0kwFH6YvvWp0/edit",
      "https://docs.google.com/spreadsheets/d/1AbtWF5BB3X5XriN-emSFZIiYToCNgS-6wR7mZCefAMM/edit?gid=424815998#gid=424815998",
      "https://docs.google.com/spreadsheets/d/1AKVgptl_E89qoDyEx0LGQAbD9PMqKQaYkvAkzhrwaFg/edit?gid=0#gid=0",
      "https://docs.google.com/spreadsheets/d/1CuwE7XB1GEmDCyql3LTznVNLdH6kCeI-kL79FtRDyaQ/edit",
      "https://docs.google.com/spreadsheets/d/1XfS0yNh7TIMbimt8PtoHed9mFAyf0DS1guH6z1JInb8/edit?gid=531798815#gid=531798815",
      "https://docs.google.com/spreadsheets/d/12Uj0RBGDy1dJFCgXxNMkXPKW4Uz0rRvdGsCAph_gsNc/edit?gid=1487671474#gid=1487671474",
    ],
  },
};
const counterDataUrl = window.REVO_COUNTER_DATA_URL || revoIntegrations.sheets.publicCountersCsv;
const projectsDataUrl = window.REVO_PROJECTS_DATA_URL || "projects-data.json";
let activeStatusFilter = "all";
let activeSort = "active";
let activeCategory = "all";

function pageUrl(path = window.location.pathname.split("/").pop() || "index.html") {
  return new URL(path, publicBaseUrl).href;
}

function currentPublicPageUrl() {
  const fileName = window.location.pathname.split("/").pop() || "index.html";
  return pageUrl(fileName);
}

function applyIntegrationLinks() {
  document.querySelectorAll("[data-revo-form]").forEach((link) => {
    const url = revoIntegrations.forms[link.dataset.revoForm];
    if (url) {
      link.href = url;
      link.target = "_blank";
      link.rel = "noreferrer";
    }
  });

  document.querySelectorAll("[data-revo-base]").forEach((link) => {
    const url = revoIntegrations.base[link.dataset.revoBase];
    if (url) {
      link.href = url;
      link.target = "_blank";
      link.rel = "noreferrer";
    }
  });
}

applyIntegrationLinks();

function setupExternalFormGates() {
  document.querySelectorAll("[data-revo-form-gate]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      const url = revoIntegrations.forms[form.dataset.revoFormGate];
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    });
  });
}

setupExternalFormGates();

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

  if (mergedCounters.soldCount && !mergedCounters.buyerCount) {
    mergedCounters.buyerCount = `${numberOnly(mergedCounters.soldCount)}人`;
  }

  if (mergedCounters.totalFunds && !mergedCounters.hopeAmount) {
    mergedCounters.hopeAmount = mergedCounters.totalFunds;
  }

  if (mergedCounters.productionCost && mergedCounters.operationCost && !mergedCounters.usedAmount) {
    const production = Number(numberOnly(mergedCounters.productionCost).replace(/,/g, ""));
    const operation = Number(numberOnly(mergedCounters.operationCost).replace(/,/g, ""));
    if (!Number.isNaN(production) && !Number.isNaN(operation)) {
      mergedCounters.usedAmount = `${(production + operation).toLocaleString("ja-JP")}円`;
    }
  }

  if (mergedCounters.nextStock && !mergedCounters.operatingAmount) {
    mergedCounters.operatingAmount = mergedCounters.nextStock;
  }

  if (mergedCounters.hopeAmount && mergedCounters.usedAmount && mergedCounters.operatingAmount && !mergedCounters.remainingBudget) {
    const hope = Number(numberOnly(mergedCounters.hopeAmount).replace(/,/g, ""));
    const used = Number(numberOnly(mergedCounters.usedAmount).replace(/,/g, ""));
    const operating = Number(numberOnly(mergedCounters.operatingAmount).replace(/,/g, ""));
    if (!Number.isNaN(hope) && !Number.isNaN(used) && !Number.isNaN(operating)) {
      mergedCounters.remainingBudget = `${(hope - used - operating).toLocaleString("ja-JP")}円`;
    }
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
