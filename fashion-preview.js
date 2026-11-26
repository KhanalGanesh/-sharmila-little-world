
/* =========================================
   SHARMILA'S LITTLE WORLD
   PEXELS FASHION LOOKBOOK
   CURATED PHOTOS - RANDOM LOOKS
========================================= */

(() => {
  "use strict";

  const BASE = "https://images.pexels.com/photos/";
  const recent = [];
  let requestId = 0;

  // Curated Pexels fashion photo collection
  const photos = [
    { id: 31094911, type: ["clothing", "skirt", "colour", "style"], label: "Elegant skirt look" },
    { id: 34346694, type: ["clothing", "skirt", "colour", "style"], label: "Modern outfit" },
    { id: 7540228, type: ["clothing", "skirt", "style"], label: "Minimal dress style" },
    { id: 30479365, type: ["clothing", "skirt", "blazer", "style"], label: "Blazer fashion" },
    { id: 20029552, type: ["clothing", "skirt", "blazer", "style"], label: "Chic white outfit" },
    { id: 27949874, type: ["clothing", "skirt", "colour"], label: "Casual feminine look" },
    { id: 40605377, type: ["clothing", "skirt", "style"], label: "Creative skirt style" },
    { id: 21837380, type: ["clothing", "dress", "bag", "style"], label: "Chic dress look" },
    { id: 12324554, type: ["clothing", "dress", "style", "colour"], label: "Fashion editorial" },
    { id: 1957154, type: ["clothing", "jeans", "sneakers", "style"], label: "Street fashion" },
    { id: 40818930, type: ["clothing", "bag", "style"], label: "Urban fashion" },

    { id: 8412738, type: ["shoes", "sneakers", "bag"], label: "Sneakers and handbag" },
    { id: 36868180, type: ["shoes", "heels", "style"], label: "Elegant heels look" },
    { id: 37137762, type: ["shoes", "heels", "clothing"], label: "Black outfit and heels" },
    { id: 27035625, type: ["shoes", "heels", "bag"], label: "Heels and handbag" },
    { id: 27081017, type: ["shoes", "heels", "bag"], label: "Elegant accessories" },
    { id: 27008317, type: ["shoes", "heels", "bag"], label: "Brown bag styling" },
    { id: 27127412, type: ["shoes", "heels", "bag"], label: "Chic handbag look" },
    { id: 4254146, type: ["shoes", "sneakers"], label: "Sneakers versus heels" },

    { id: 6833806, type: ["beauty", "makeup", "clothing"], label: "Bold makeup look" },
    { id: 15530610, type: ["beauty", "makeup", "dress"], label: "Makeup and fashion" }
  ];

  const optionTypes = {
    "dresses": ["dress", "clothing"],
    "jeans": ["jeans", "clothing"],
    "skirts": ["skirt", "clothing"],
    "wide-leg trousers": ["clothing"],
    "oversized tops": ["clothing"],
    "traditional outfits": ["clothing"],
    "crop tops": ["clothing"],
    "cardigans": ["clothing"],
    "blazers": ["blazer", "clothing"],
    "jumpsuits": ["clothing"],

    "sneakers": ["sneakers", "shoes"],
    "heels": ["heels", "shoes"],
    "flats": ["shoes"],
    "boots": ["shoes"],
    "handbags": ["bag", "shoes"],
    "minimal jewellery": ["bag", "shoes"],
    "hair accessories": ["beauty"],
    "sunglasses": ["bag", "shoes"],
    "watches": ["bag", "shoes"],
    "cute bags": ["bag", "shoes"],

    "natural makeup": ["makeup", "beauty"],
    "bold makeup": ["makeup", "beauty"],
    "skincare": ["beauty"],
    "haircare": ["beauty"],
    "perfume": ["beauty"],
    "simple everyday look": ["makeup", "beauty"],
    "lip gloss": ["makeup", "beauty"],
    "nail art": ["beauty"],
    "soft glam": ["makeup", "beauty"]
  };

  const styleOptions = [
    "quiet minimal", "soft elegance", "modern street",
    "soft romantic", "classic chic", "cute & playful",
    "vintage", "streetwear", "korean style",
    "old money", "bohemian"
  ];

  const colourOptions = [
    "pink", "white", "black", "beige", "blue",
    "pastel shades", "earth tones", "lavender",
    "red", "green", "brown"
  ];

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;",
      '"': "&quot;", "'": "&#39;"
    })[c]);
  }

  function addStyles() {
    if (document.getElementById("pexelsLookbookCSS")) return;

    const style = document.createElement("style");
    style.id = "pexelsLookbookCSS";

    style.textContent = `
      #fashionFields > #fashionAutoPreview {
        box-sizing: border-box;
        width: 100%;
        min-width: 0;
        margin: 0;
        padding: 10px;
        border: 1px solid #f0dce5;
        border-radius: 12px;
        background: #fff9fc;
      }

      #fashionAutoPreview .fp-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 5px;
        margin-bottom: 5px;
      }

      #fashionAutoPreview .fp-title {
        margin: 0;
        font-size: 13px;
        color: #98516d;
      }

      #fashionAutoPreview .fp-subtitle {
        margin: 0 0 9px;
        font-size: 10px;
        color: #987f8b;
      }

      #fashionAutoPreview .fp-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 7px;
      }

      #fashionAutoPreview .fp-card {
        display: block;
        min-width: 0;
        overflow: hidden;
        border-radius: 8px;
        background: #f8edf2;
        text-decoration: none;
        color: #704d5d;
      }

      #fashionAutoPreview .fp-card img {
        display: block;
        width: 100%;
        height: 78px;
        object-fit: cover;
      }

      #fashionAutoPreview .fp-caption {
        display: block;
        padding: 5px 3px;
        text-align: center;
        font-size: 9px;
      }

      #fashionAutoPreview .fp-empty {
        min-height: 105px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        border-radius: 9px;
        background: #fff2f7;
        color: #987487;
        text-align: center;
        font-size: 11px;
      }

      #fashionAutoPreview .fp-refresh {
        border: 0;
        border-radius: 20px;
        background: #f6e3ec;
        color: #98516d;
        padding: 5px 8px;
        font-size: 9px;
        cursor: pointer;
      }
    `;

    document.head.appendChild(style);
  }

  function getHost() {
    const grid = document.getElementById("fashionFields");
    if (!grid) return null;

    let host = document.getElementById("fashionAutoPreview");

    if (!host) {
      host = document.createElement("div");
      host.id = "fashionAutoPreview";
      grid.appendChild(host);
    }

    return host;
  }

  function getSelections() {
    const grid = document.getElementById("fashionFields");
    if (!grid) return [];

    const selected = [];

    grid.querySelectorAll(".field-group").forEach(group => {
      const heading = group.querySelector("h3");
      const category = heading
        ? heading.textContent.toLowerCase()
        : "";

      group.querySelectorAll("input:checked").forEach(input => {
        selected.push({
          value: input.value.toLowerCase(),
          category
        });
      });
    });

    return selected;
  }

  function getMatchingTypes(selections) {
    const types = new Set();

    selections.forEach(item => {
      const value = item.value;

      if (optionTypes[value]) {
        optionTypes[value].forEach(type => types.add(type));
      }

      if (styleOptions.includes(value)) {
        types.add("style");
        types.add("clothing");
      }

      if (colourOptions.includes(value)) {
        types.add("colour");
        types.add("clothing");
      }

      if (item.category.includes("beauty")) {
        types.add("beauty");
        types.add("makeup");
      }

      if (item.category.includes("shoes")) {
        types.add("shoes");
      }

      if (item.category.includes("clothing")) {
        types.add("clothing");
      }

      if (item.category.includes("style mood")) {
        types.add("style");
      }

      if (item.category.includes("colour")) {
        types.add("colour");
      }
    });

    return types;
  }

  function shuffle(array) {
    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
  }

  function imageURL(id) {
    return `${BASE}${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=500`;
  }

  function renderEmpty(host, message) {
    host.innerHTML = `
      <h3 class="fp-title">Style Preview ♡</h3>
      <p class="fp-subtitle">Your personal fashion inspiration</p>
      <div class="fp-empty">${escapeHTML(message)}</div>
    `;
  }

  function renderLoading(host) {
    host.innerHTML = `
      <div class="fp-heading">
        <h3 class="fp-title">Style Preview ♡</h3>
      </div>
      <p class="fp-subtitle">Creating a fresh look for you...</p>
      <div class="fp-empty">Loading fashion photos ♡</div>
    `;
  }

  function generate() {
    const host = getHost();
    if (!host) return;

    const id = ++requestId;
    const selections = getSelections();

    if (!selections.length) {
      renderEmpty(host, "Choose your favourite options to see fashion photos ✨");
      return;
    }

    renderLoading(host);

    const types = getMatchingTypes(selections);

    let pool = photos.filter(photo =>
      photo.type.some(type => types.has(type))
    );

    if (pool.length < 4) {
      pool = photos;
    }

    let fresh = pool.filter(photo =>
      !recent.includes(photo.id)
    );

    if (fresh.length < 4) {
      recent.length = 0;
      fresh = pool;
    }

    const chosen = shuffle(fresh).slice(0, 4);

    if (!chosen.length) {
      renderEmpty(host, "No fashion photos available.");
      return;
    }

    chosen.forEach(photo => recent.push(photo.id));
    recent.splice(0, Math.max(0, recent.length - 12));

    const images = chosen.map(photo => ({
      ...photo,
      url: imageURL(photo.id)
    }));

    // Render immediately; browser loads the images directly.
    if (id !== requestId) return;

    host.innerHTML = `
      <div class="fp-heading">
        <h3 class="fp-title">Style Preview ♡</h3>
        <button type="button" class="fp-refresh" id="fpRefresh">
          ↻ New Looks
        </button>
      </div>

      <p class="fp-subtitle">Fresh looks based on your choices</p>

      <div class="fp-grid">
        ${images.map(photo => `
          <a class="fp-card"
             href="https://www.pexels.com/search/${encodeURIComponent(photo.label)}/"
             target="_blank"
             rel="noopener noreferrer">
            <img
              src="${escapeHTML(photo.url)}"
              alt="${escapeHTML(photo.label)}"
              loading="lazy"
              onerror="this.style.display='none'"
            >
            <span class="fp-caption">
              ${escapeHTML(photo.label)}
            </span>
          </a>
        `).join("")}
      </div>
    `;
  }

  function initialize() {
    addStyles();

    const grid = document.getElementById("fashionFields");
    if (!grid) return;

    getHost();

    grid.addEventListener("change", event => {
      if (event.target.matches("input")) generate();
    });

    grid.addEventListener("click", event => {
      if (event.target.closest("#fpRefresh")) {
        generate();
      }
    });

    document.addEventListener("click", event => {
      const button = event.target.closest("button");
      if (!button) return;

      if (button.textContent.toLowerCase().includes("generate my style")) {
        generate();
      }
    });

    generate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
