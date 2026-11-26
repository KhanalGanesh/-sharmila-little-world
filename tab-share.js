
/* =========================================
   SHARE WITH GANESH ♡
   SHARMILA'S LITTLE WORLD
   COMPACT URL REPORT SHARING
   NO FIREBASE / NO API
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const STORE_KEY = "sharmilaLittleWorld_v2";
  const MESSENGER_URL = "https://m.me/ohh.you.copy.my.profile.link";

  const tabs = [
    { id: "fashion", title: "Fashion" },
    { id: "hobbies", title: "Hobbies" },
    { id: "dreams", title: "Dreams" },
    { id: "moments", title: "Moments" },
    { id: "dating", title: "Dating" },
    { id: "play", title: "Play" },
    { id: "surprise", title: "Surprise" },
    { id: "music", title: "Music" },
    { id: "countries", title: "Explore the World" }
  ];

  function readState() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
    } catch {
      return {};
    }
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
        .filter(([, val]) => val !== null && val !== undefined && val !== "")
        .map(([key, val]) => `${key}: ${clean(val)}`)
        .join(", ");
    }

    return String(value).trim();
  }

  function addStyles() {
    if (document.getElementById("ganeshShareStyles")) return;

    const style = document.createElement("style");
    style.id = "ganeshShareStyles";

    style.textContent = `
      .tab-share-card {
        width: min(900px, calc(100% - 30px));
        margin: 38px auto 30px;
        padding: 25px;
        box-sizing: border-box;
        border: 1px solid #f1d5df;
        border-radius: 23px;
        background: linear-gradient(145deg,#fffafd,#fff0f5);
        box-shadow: 0 8px 25px rgba(201,104,137,.09);
        color: #46343d;
      }

      .tab-share-open,
      .tab-share-send,
      .tab-share-copy {
        width: 100%;
        padding: 15px 20px;
        border: 0;
        border-radius: 30px;
        background: linear-gradient(135deg,#e99bb5,#c96889);
        color: white;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        transition: .2s;
      }

      .tab-share-open:hover,
      .tab-share-send:hover,
      .tab-share-copy:hover {
        transform: translateY(-2px);
        box-shadow: 0 7px 18px rgba(201,104,137,.2);
      }

      .tab-share-content {
        display: none;
        margin-top: 23px;
      }

      .tab-share-content.open {
        display: block;
      }

      .tab-share-eyebrow {
        color: #c96889;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 2px;
        margin-bottom: 8px;
      }

      .tab-share-card h2 {
        color: #bd6484;
        font-size: 23px;
        margin: 0 0 8px;
      }

      .tab-share-description {
        color: #927d86;
        font-size: 14px;
        line-height: 1.7;
      }

      .tab-share-ready {
        color: #b85e80;
        font-size: 13px;
        font-weight: 600;
        margin: 18px 0 10px;
      }

      .tab-share-preview {
        width: 100%;
        min-height: 100px;
        max-height: 350px;
        overflow: auto;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        box-sizing: border-box;
        padding: 17px;
        border: 1px solid #f0d5df;
        border-radius: 15px;
        background: white;
        color: #59454e;
        font-size: 13px;
        line-height: 1.8;
      }

      .tab-share-link {
        display: none;
        width: 100%;
        box-sizing: border-box;
        margin-top: 14px;
        padding: 13px;
        border: 1px solid #e9b5c7;
        border-radius: 12px;
        background: white;
        color: #59454e;
        font-size: 12px;
        overflow-wrap: anywhere;
      }

      .tab-share-copy {
        display: none;
        margin-top: 10px;
        padding: 12px;
        font-size: 13px;
      }

      .tab-share-send {
        margin-top: 17px;
      }

      .tab-share-status {
        color: #a65b78;
        font-size: 13px;
        line-height: 1.6;
        margin-top: 12px;
        overflow-wrap: anywhere;
      }

      .tab-share-private {
        text-align: center;
        color: #927d86;
        font-size: 14px;
        line-height: 1.8;
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
        font-size: 15px;
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
        .tab-share-card {
          padding: 19px;
        }

        .tab-share-card h2 {
          font-size: 21px;
        }

        .shared-report-box {
          padding: 19px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function removeOldShareControls() {
    document.querySelectorAll("[data-share]").forEach(input => {
      const wrapper = input.closest("label") || input.parentElement;

      if (wrapper && !wrapper.closest(".tab-share-card")) {
        wrapper.remove();
      }
    });

    const oldSharePage = document.getElementById("share");

    if (oldSharePage) {
      oldSharePage.style.display = "none";
    }
  }

  // Compact report: only selected answers.
  function buildReport(tab) {
    const state = readState();
    const lines = [];

    lines.push(`♡SHARMILA'S LITTLE WORLD♡`);
    lines.push(`My ${tab.title} Report`);

    const answers = state.answers?.[tab.id];

    if (Array.isArray(answers)) {
      answers.forEach(answer => {
        const value = clean(answer);
        if (value) lines.push(value);
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

    // Moments: saved memories only.
    if (tab.id === "moments") {
      (state.memories || []).forEach(memory => {
        if (memory.title || memory.text) {
          lines.push(
            `${memory.title || "Memory"}${memory.date ? ` (${memory.date})` : ""}: ${memory.text || ""}`
          );
        }
      });
    }

    lines.push("Made with love ♡");

    return lines.join("\n");
  }

  // URL contains the report, no database needed.
  function generateReportLink(report) {
    const baseURL =
      window.location.origin +
      window.location.pathname;

    return baseURL + "#shared-report=" + encodeURIComponent(report);
  }

  function showSharedReport() {
    const hash = window.location.hash;

    if (!hash.startsWith("#shared-report=")) return false;

    let report = "";

    try {
      report = decodeURIComponent(
        hash.substring("#shared-report=".length)
      );
    } catch {
      report = "";
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
      window.location.hash = "";
      screen.remove();
    });

    box.appendChild(heading);
    box.appendChild(content);
    box.appendChild(close);
    screen.appendChild(box);
    document.body.appendChild(screen);

    return true;
  }

  async function copyText(text) {
    // Try modern clipboard first.
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        // Continue to fallback.
      }
    }

    // Fallback for supported browsers.
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";

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

  function createPanel(tab) {
    const page = document.getElementById(tab.id);

    if (!page || page.querySelector(".tab-share-card")) return;

    const panel = document.createElement("section");
    panel.className = "tab-share-card";

    panel.innerHTML = `
      <button type="button" class="tab-share-open">
        ♡ Share with Ganesh
      </button>

      <div class="tab-share-content">
        <p class="tab-share-eyebrow">
          A LITTLE MESSAGE FOR GANESH ♡
        </p>

        <h2>Share This with Ganesh</h2>

        <p class="tab-share-description">
          Here's what you've selected in this tab.
          Check your answers before sharing.
        </p>

        <p class="tab-share-ready">
          ✓ Your selected answers are ready ♡
        </p>

        <div class="tab-share-preview"></div>

        <input
          class="tab-share-link"
          type="text"
          readonly
          aria-label="Generated report link"
        >

        <button type="button" class="tab-share-copy">
          ♡ Copy Report Link
        </button>

        <button type="button" class="tab-share-send">
          ♡ Send to Ganesh
        </button>

        <p class="tab-share-status">
          Your report link will be generated automatically.
        </p>
      </div>
    `;

    const backButton = page.querySelector(".dynamic-back-wrap");

    if (backButton) {
      page.insertBefore(panel, backButton);
    } else {
      page.appendChild(panel);
    }

    const openButton = panel.querySelector(".tab-share-open");
    const content = panel.querySelector(".tab-share-content");
    const preview = panel.querySelector(".tab-share-preview");
    const linkBox = panel.querySelector(".tab-share-link");
    const copyButton = panel.querySelector(".tab-share-copy");
    const sendButton = panel.querySelector(".tab-share-send");
    const status = panel.querySelector(".tab-share-status");

    function updatePreview() {
      preview.textContent = buildReport(tab);
    }

    openButton.addEventListener("click", () => {
      const isOpen = content.classList.toggle("open");

      openButton.textContent = isOpen
        ? "♡ Close sharing preview"
        : "♡ Share with Ganesh";

      if (isOpen) updatePreview();
    });

    page.addEventListener("change", () => {
      if (content.classList.contains("open")) {
        updatePreview();
      }
    });

    copyButton.addEventListener("click", async () => {
      if (!linkBox.value) {
        status.textContent = "Generate your report link first. ♡";
        return;
      }

      const copied = await copyText(linkBox.value);

      status.textContent = copied
        ? "♡ Link copied! Paste it into Messenger."
        : "Please select and copy the link manually.";
    });

    sendButton.addEventListener("click", async () => {
      updatePreview();

      const report = preview.textContent.trim();

      if (!report) {
        status.textContent = "There is no report to share yet. ♡";
        return;
      }

      const reportLink = generateReportLink(report);

      linkBox.value = reportLink;
      linkBox.style.display = "block";
      copyButton.style.display = "block";

      // Open Messenger immediately.
      const messengerWindow = window.open(
        MESSENGER_URL,
        "_blank"
      );

      // Automatically try copying the link.
      const copied = await copyText(reportLink);

      status.textContent = copied
        ? "♡ Link copied! Paste it into Messenger and send."
        : "♡ Link ready! Copy it using the button above.";

      if (!messengerWindow) {
        status.textContent +=
          " Messenger popup was blocked. Please open Messenger manually.";
      }
    });
  }

  function createDiaryNote() {
    const page = document.getElementById("diary");

    if (!page || page.querySelector(".tab-share-card")) return;

    const panel = document.createElement("section");
    panel.className = "tab-share-card";

    panel.innerHTML = `
      <p class="tab-share-eyebrow">YOUR PRIVATE SPACE ♡</p>

      <h2>Always Just Yours</h2>

      <p class="tab-share-private">
        Your diary is completely private.<br>
        Nothing written here will be included in any report
        or shared with Ganesh. ♡
      </p>
    `;

    const backButton = page.querySelector(".dynamic-back-wrap");

    if (backButton) {
      page.insertBefore(panel, backButton);
    } else {
      page.appendChild(panel);
    }
  }

  function initialise() {
    addStyles();

    if (showSharedReport()) return;

    removeOldShareControls();

    tabs.forEach(createPanel);
    createDiaryNote();
  }

  initialise();

  // Support dynamically created tabs.
  const observer = new MutationObserver(() => {
    if (window.location.hash.startsWith("#shared-report=")) return;
    initialise();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});
