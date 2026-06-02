/** 支援 GitHub Pages 子路徑（例如 /repo-name/） */
function assetUrl(path) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.replace(/^\//, "");
  return new URL(normalized, document.baseURI).href;
}

const DATA_URL = assetUrl("content/portfolio.json");

const grid = document.getElementById("portfolio-grid");
const filterBar = document.querySelector(".filter-bar");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxDesc = document.getElementById("lightbox-desc");
const lightboxLink = document.getElementById("lightbox-link");

let allItems = [];
let activeFilter = "all";

function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  return tags
    .map((t) => (typeof t === "string" ? t : t?.tag ?? ""))
    .filter(Boolean);
}

function sortItems(items) {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function collectTags(items) {
  const set = new Set();
  for (const item of items) {
    for (const tag of normalizeTags(item.tags)) {
      set.add(tag);
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

function renderFilters(tags) {
  const existing = filterBar.querySelectorAll(".filter-btn:not([data-filter='all'])");
  existing.forEach((el) => el.remove());

  for (const tag of tags) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filter-btn";
    btn.dataset.filter = tag;
    btn.textContent = tag;
    btn.setAttribute("aria-pressed", "false");
    filterBar.appendChild(btn);
  }
}

function getFilteredItems() {
  if (activeFilter === "all") return allItems;
  return allItems.filter((item) =>
    normalizeTags(item.tags).includes(activeFilter)
  );
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function renderGrid() {
  const items = getFilteredItems();

  if (items.length === 0) {
    grid.innerHTML =
      '<p class="portfolio-empty">此分類尚無作品，請至管理後台新增。</p>';
    return;
  }

  grid.innerHTML = items
    .map((item) => {
      const tags = normalizeTags(item.tags);
      const tagsHtml = tags
        .map((t) => `<span>${escapeHtml(t)}</span>`)
        .join("");
      const featured = item.featured
        ? '<span class="card-badge">精選</span>'
        : "";
      const hasUrl = item.url && item.url.trim() !== "";
      const linkHtml = hasUrl
        ? `<a class="card-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">查看專案 →</a>`
        : "";

      return `
        <article class="portfolio-card" role="listitem" data-id="${escapeHtml(item.title)}">
          <div class="card-inner">
            <button
              type="button"
              class="card-thumb"
              data-lightbox
              data-title="${escapeHtml(item.title)}"
              data-desc="${escapeHtml(item.description)}"
              data-image="${escapeHtml(assetUrl(item.image))}"
              data-url="${escapeHtml(item.url || "")}"
              aria-label="放大檢視：${escapeHtml(item.title)}"
            >
              ${featured}
              <img src="${escapeHtml(assetUrl(item.image))}" alt="${escapeHtml(item.title)}" loading="lazy" width="800" height="600" />
            </button>
            <div class="card-body">
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.description)}</p>
              ${tagsHtml ? `<div class="card-tags">${tagsHtml}</div>` : ""}
              ${linkHtml}
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function setActiveFilter(filter) {
  activeFilter = filter;
  filterBar.querySelectorAll(".filter-btn").forEach((btn) => {
    const isActive = btn.dataset.filter === filter;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
  renderGrid();
}

function openLightbox({ title, desc, image, url }) {
  lightboxImg.src = image;
  lightboxImg.alt = title;
  lightboxTitle.textContent = title;
  lightboxDesc.textContent = desc || "";

  if (url && url.trim()) {
    lightboxLink.href = url;
    lightboxLink.hidden = false;
  } else {
    lightboxLink.hidden = true;
  }

  lightbox.showModal();
}

async function loadPortfolio() {
  try {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    allItems = sortItems(data.items ?? []);
    renderFilters(collectTags(allItems));
    renderGrid();
  } catch (err) {
    console.error(err);
    grid.innerHTML =
      '<p class="portfolio-error">無法載入作品資料。若為本機預覽，請使用本地伺服器開啟（見 README）。</p>';
  }
}

filterBar.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  setActiveFilter(btn.dataset.filter);
});

grid.addEventListener("click", (e) => {
  const thumb = e.target.closest("[data-lightbox]");
  if (!thumb) return;
  openLightbox({
    title: thumb.dataset.title,
    desc: thumb.dataset.desc,
    image: thumb.dataset.image,
    url: thumb.dataset.url,
  });
});

document.querySelector(".lightbox-close")?.addEventListener("click", () => {
  lightbox.close();
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.close();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.open) lightbox.close();
});

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.getElementById("site-nav");

navToggle?.addEventListener("click", () => {
  const open = siteNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent = String(new Date().getFullYear());

loadPortfolio();
