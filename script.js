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
const publicBaseUrl = "https://hayator11.github.io/revofunding/";
const counterDataUrl = window.REVO_COUNTER_DATA_URL || "https://docs.google.com/spreadsheets/d/e/2PACX-1vRcKmEgg9vkR0RHr8i1dbqnjOCZS7Julyl54k9tqUEBGxEejykf3X5eS4iZOKnsowGrtwiGZ7b7vRBN/pub?gid=403200930&single=true&output=csv";

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
    const selected = filter.dataset.filter;

    filters.forEach((item) => item.classList.remove("active"));
    filter.classList.add("active");

    cards.forEach((card) => {
      const shouldShow = selected === "all" || card.dataset.status === selected;
      card.classList.toggle("hidden", !shouldShow);
    });
  });
});

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
