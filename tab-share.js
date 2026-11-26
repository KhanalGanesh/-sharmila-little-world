
/* =========================================
   CENTRAL SHARE CENTER ♡
   SHARMILA'S LITTLE WORLD
   MULTI-TAB REPORT SHARING
   NO FIREBASE / NO API
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const STORE_KEY = "sharmilaLittleWorld_v2";
  const MESSENGER_URL = "https://m.me/ohh.you.copy.my.profile.link";

  const tabs = [
    { id: "fashion", title: "Fashion", emoji: "👗" },
    { id: "hobbies", title: "Hobbies", emoji: "🎨" },
    { id: "dreams", title: "Dreams", emoji: "🌷" },
    { id: "moments", title: "Moments", emoji: "📸" },
    { id: "dating", title: "Dating", emoji: "💗" },
    { id: "play", title: "Play", emoji: "✨" },
    { id: "surprise", title: "Surprise", emoji: "🎁" },
    { id: "music", title: "Music", emoji: "🎵" },
    { id: "countries", title: "Explore", emoji: "🌍" }
  ];

  const topicNames = {
    fashion: [
      "Your style mood",
      "Favourite colours",
      "Clothing you love",
      "Shoes & accessories",
      "Beauty interests"
    ],
    hobbies: [
      "Music",
      "Screen & stories",
      "Creative hobbies",
      "Free-time mood"
    ],
    dreams: [
      "Places to explore",
      "Dream lifestyle",
      "Personal goals",
      "Dream experiences"
    ],
    dating: [
      "Your ideal first date",
      "Your date atmosphere",
      "What matters most",
      "Little things you love"
    ],
    play: [
      "Choose your perfect day",
      "Pick a little treat",
      "Your evening mood",
      "Choose a getaway",
      "Your happy place"
    ]
  };

  const selectedTabs = new Set();

  function readState() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function clean(value) {
    if (value === null || value === undefined || value === "") {
      return "";
    }

    if (Array.isArray(value)) {
      return value.map(clean).filter(Boolean).join(", ");
    }

    if (typeof value === "object") {
      return Object.entries(value)
        .filter(([, item]) =>
          item !== null &&
          item !== undefined &&
          item !== ""
        )
        .map(([key, item]) => `${key}: ${clean(item)}`)
        .join("\n");
    }

    return String(value).trim();
  }

  function addStyles() {
    if (document.getElementById("centralShareStyles")) return;

    const style = document.createElement("style");
    style.id = "centralShareStyles";

    style.textContent = `
      #share .back-btn {
        display: inline-block;
        margin-bottom: 18px;
      }

      .central-share-card {
        width: min(900px, calc(100% - 30px));
        margin: 25px auto 35px;
        padding: 26px;
        box-sizing: border-box;
        border: 1px solid #f1d5df;
        border-radius: 23px;
        background: linear-gradient(145deg,#fffafd,#fff0f5);
        box-shadow: 0 8px 25px rgba(201,104,137,.09);
        color: #46343d;
      }

      .central-share-card h2 {
        color: #bd6484;
        font-size: 23px;
        margin: 0 0 8px;
      }

      .central-share-description {
        color: #927d86;
        font-size: 14px;
        line-height: 1.7;
        margin-bottom: 20px;
      }

      .central-share-label {
        display: block;
        margin: 22px 0 12px;
        color: #bd6484;
        font-size: 13px;
        font-weight: 700;
      }

      .central-share-grid {
        display: grid;
        grid-template-columns: repeat(2,minmax(0,1fr));
        gap: 11px;
      }

      .central-share-option {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px;
        border: 1px solid #f0d5df;
        border-radius: 13px;
        background: white;
        color: #59454e;
        cursor: pointer;
        transition: .2s;
        font-size: 14px;
      }

      .central-share-option:has(input:checked) {
        border-color: #d783a1;
        background: #fff0f5;
        box-shadow: 0 3px 12px rgba(201,104,137,.09);
      }

      .central-share-option input {
        accent-color: #c96889;
        width: 17px;
        height: 17px;
        flex-shrink: 0;
      }

      .central-share-private {
        margin-top: 18px;
        padding: 13px 15px;
        border: 1px dashed #e6b7c8;
        border-radius: 12px;
        color: #927d86;
        background: #fffafd;
        font-size: 13px;
        line-height: 1.7;
      }

      .central-share-preview {
        min-height: 100px;
        max-height: 390px;
        overflow-y: auto;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        box-sizing: border-box;
        padding: 18px;
        border: 1px solid #f0d5df;
        border-radius: 15px;
        background: white;
        color: #59454e;
        font-size: 13px;
        line-height: 1.8;
      }

      .central-share-preview:empty::before {
        content: "Select the tabs you want to share. Your preview will appear here ♡";
        color: #b49da6;
      }

      .central-share-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 18px;
      }

      .central-share-button {
        flex: 1;
        min-width: 180px;
        padding: 14px 18px;
        border: 0;
        border-radius: 30px;
        background: linear-gradient(135deg,#e99bb5,#c96889);
        color: white;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        transition: .2s;
      }

      .central-share-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 7px 18px rgba(201,104,137,.2);
      }

      .central-share-button.secondary {
        background: #fff;
        color: #bd6484;
        border: 1px solid #e9b5c7;
      }

      .central-share-link {
        display: none;
        width: 100%;
        box-sizing: border-box;
        margin-top: 15px;
        padding: 13px;
        border: 1px solid #e9b5c7;
        border-radius: 12px;
        background: white;
        color: #59454e;
        font-size: 12px;
        overflow-wrap: anywhere;
      }

      .central-share-status {
        min-height: 22px;
        margin-top: 12px;
        color: #a65b78;
        font-size: 13px;
        line-height: 1.7;
        overflow-wrap: anywhere;
      }

      .central-share-eyebrow {
        color: #c96889;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 2px;
        margin-bottom: 9px;
      }

      .shared-report-screen {
        position: fixed;
        inset: 0;
        z-index: 999999;
        overflow-y: auto;
        background: linear-gradient(145deg,#fffafd,#fff0f5);
        padding: 35px 16px;
        box-sizing: border-box;
      }

      .shared-report-box {
        width: min(650px,100%);
        margin: 35px auto;
        padding: 28px;
        box-sizing: border-box;
        border: 1px solid #f1d5df;
        border-radius: 24px;
        background: white;
        box-shadow: 0 10px 35px rgba(201,104,137,.12);
      }

      .shared-report-box h1 {
        color: #bd6484;
        text-align: center;
        font-size: 25px;
      }

      .shared-report-text {
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        color: #59454e;
        font-size: 14px;
        line-height: 2;
        padding: 20px;
        background: #fff7fa;
        border: 1px solid #f1d5df;
        border-radius: 15px;
      }

      .shared-report-close {
        width: 100%;
        margin-top: 20px;
        padding: 13px;
        border: 0;
        border-radius: 30px;
        color: white;
        background: linear-gradient(135deg,#e99bb5,#c96889);
        font-weight: 700;
        cursor: pointer;
      }

      @media(max-width:600px) {
        .central-share-card {
          padding: 19px;
        }

        .central-share-grid {
          grid-template-columns: 1fr;
        }

        .shared-report-box {
          padding: 19px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function showSharedReport() {
    if (!window.location.hash.startsWith("#shared-report=")) {
      return false;
    }

    let report = "";

    try {
      report = decodeURIComponent(
        window.location.hash.substring("#shared-report=".length)
      );
    } catch {
      return false;
    }

    if (!report) return false;

    const screen = document.createElement("div");
    screen.className = "shared-report-screen";

    const box = document.createElement("div");
    box.className = "shared-report-box";

    const heading = document.createElement("h1");
    heading.textContent = "♡ A Little Message for Ganesh ♡";

    const content = document.createElement("div");
    content.className = "shared-report-text";
    content.textContent = report;

    const close = document.createElement("button");
    close.className = "shared-report-close";
    close.textContent = "♡ Back to Website";

    close.addEventListener("click", () => {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
      screen.remove();
    });

    box.append(heading, content, close);
    screen.appendChild(box);
    document.body.appendChild(screen);

    return true;
  }

  function getTabContent(tab) {
    const state = readState();
    const lines = [];

    if (tab.id === "moments") {
      const memories = Array.isArray(state.memories)
        ? state.memories
        : [];

      memories.forEach(memory => {
        if (memory.title || memory.text) {
          let line = `♡ ${memory.title || "Memory"}`;

          if (memory.date) {
            line += ` (${memory.date})`;
          }

          if (memory.text) {
            line += `\n${memory.text}`;
          }

          lines.push(line);
        }
      });

      return lines.length
        ? lines.join("\n\n")
        : "No saved memories yet.";
    }

    if (tab.id === "surprise") {
      const title = document.getElementById("surpriseTitle")?.textContent?.trim();
      const message = document.getElementById("surpriseMessage")?.textContent?.trim();

      if (
        title &&
        message &&
        !title.includes("waiting") &&
        !message.includes("pick a box")
      ) {
        return `${title}\n${message}`;
      }

      return "No surprise has been opened yet.";
    }

    const answers = state.answers?.[tab.id];

    if (Array.isArray(answers)) {
      answers.forEach((answer, index) => {
        const value = clean(answer);

        if (value) {
          const topic = topicNames[tab.id]?.[index];

          lines.push(
            topic ? `${topic}: ${value}` : value
          );
        }
      });
    } else if (answers && typeof answers === "object") {
      Object.entries(answers).forEach(([topic, answer]) => {
        const value = clean(answer);
        if (value) lines.push(`${topic}: ${value}`);
      });
    } else if (answers) {
      const value = clean(answers);
      if (value) lines.push(value);
    }

    // Include saved result details, such as the Dating date plan.
    const result = state.results?.[tab.id];

    if (result && tab.id === "dating") {
      if (result.date) lines.push(`Date: ${result.date}`);
      if (result.time) lines.push(`Time: ${result.time}`);
      if (result.place) lines.push(`Place: ${result.place}`);
    }

    // Also check whether dynamic tabs save their data directly in state.
    if (
      lines.length === 0 &&
      (tab.id === "music" || tab.id === "countries")
    ) {
      const dynamicData =
        state[tab.id] ??
        state.dynamic?.[tab.id] ??
        state.results?.[tab.id];

      const value = clean(dynamicData);

      if (value) lines.push(value);
    }

    return lines.length
      ? lines.join("\n")
      : "No saved selections yet.";
  }

  function buildReport() {
    const lines = [
      "♡ SHARMILA'S LITTLE WORLD ♡",
      "A LITTLE REPORT FOR GANESH",
      ""
    ];

    tabs.forEach(tab => {
      if (!selectedTabs.has(tab.id)) return;

      lines.push(`${tab.emoji} ${tab.title.toUpperCase()}`);
      lines.push("--------------------------------");

      const content = getTabContent(tab);
      lines.push(content);
      lines.push("");
    });

    lines.push("Made with love ♡");

    return lines.join("\n");
  }

  function updatePreview(preview) {
    if (selectedTabs.size === 0) {
      preview.textContent = "";
      return;
    }

    preview.textContent = buildReport();
  }

  function generateReportLink(report) {
    const baseURL =
      window.location.origin +
      window.location.pathname;

    return baseURL + "#shared-report=" + encodeURIComponent(report);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // Use fallback below.
      }
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    let copied = false;

    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    }

    textarea.remove();
    return copied;
  }

  function removeOldShareControls() {
    document.querySelectorAll("[data-share]").forEach(input => {
      const wrapper = input.closest(".share-choice") ||
        input.closest("label") ||
        input.parentElement;

      if (wrapper) wrapper.remove();
    });

    document.querySelectorAll(".tab-share-card").forEach(panel => {
      panel.remove();
    });
  }

  function createCentralShareCenter() {
    const page = document.getElementById("share");
    if (!page) return;

    const oldCard = page.querySelector(".form-card");
    if (!oldCard) return;

    const card = document.createElement("div");
    card.className = "central-share-card";

    card.innerHTML = `
      <p class="central-share-eyebrow">A LITTLE MESSAGE FOR GANESH ♡</p>

      <h2>Choose What You Want to Share</h2>

      <p class="central-share-description">
        Select one or more tabs. Only the information from your selected
        tabs will be included in your report.
      </p>

      <span class="central-share-label">SELECT YOUR TABS ♡</span>

      <div class="central-share-grid">
        ${tabs.map(tab => `
          <label class="central-share-option">
            <input
              type="checkbox"
              value="${tab.id}"
              class="central-share-checkbox"
            >
            <span>${tab.emoji} ${tab.title}</span>
          </label>
        `).join("")}
      </div>

      <div class="central-share-private">
        🔒 Diary is private and cannot be shared.
        Your diary entries will never be included in this report.
      </div>

      <span class="central-share-label">YOUR REPORT PREVIEW ♡</span>

      <div class="central-share-preview"></div>

      <div class="central-share-actions">
        <button type="button" class="central-share-button generate-report">
          ♡ Generate One Report Link
        </button>

        <button type="button" class="central-share-button secondary copy-report">
          ♡ Copy Link
        </button>
      </div>

      <input
        class="central-share-link"
        type="text"
        readonly
        aria-label="Generated report link"
      >

      <p class="central-share-status">
        Select your tabs to see the preview here ♡
      </p>
    `;

    oldCard.replaceWith(card);

    const preview = card.querySelector(".central-share-preview");
    const linkBox = card.querySelector(".central-share-link");
    const generateButton = card.querySelector(".generate-report");
    const copyButton = card.querySelector(".copy-report");
    const status = card.querySelector(".central-share-status");

    copyButton.style.display = "none";

    card.querySelectorAll(".central-share-checkbox").forEach(input => {
      input.addEventListener("change", () => {
        if (input.checked) {
          selectedTabs.add(input.value);
        } else {
          selectedTabs.delete(input.value);
        }

        linkBox.style.display = "none";
        copyButton.style.display = "none";
        linkBox.value = "";

        updatePreview(preview);

        status.textContent = selectedTabs.size
          ? `${selectedTabs.size} tab(s) selected. Check your preview ♡`
          : "Select your tabs to see the preview here ♡";
      });
    });

    generateButton.addEventListener("click", async () => {
      if (selectedTabs.size === 0) {
        status.textContent = "Please select at least one tab first. ♡";
        return;
      }

      const report = buildReport();
      const reportLink = generateReportLink(report);

      linkBox.value = reportLink;
      linkBox.style.display = "block";
      copyButton.style.display = "block";

      const copied = await copyText(reportLink);

      status.textContent = copied
        ? "♡ Your report link is ready and copied! Open Messenger and paste it."
        : "♡ Your report link is ready. Use the Copy Link button below.";

      window.open(MESSENGER_URL, "_blank");
    });

    copyButton.addEventListener("click", async () => {
      if (!linkBox.value) {
        status.textContent = "Generate your report link first. ♡";
        return;
      }

      const copied = await copyText(linkBox.value);

      status.textContent = copied
        ? "♡ Link copied! Now paste it into Messenger."
        : "Please select and copy the link manually.";
    });
  }

  function initialise() {
    addStyles();

    if (showSharedReport()) return;

    removeOldShareControls();
    createCentralShareCenter();
  }

  initialise();
});
