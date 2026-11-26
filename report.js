
/* =========================================
   SHARMILA'S LITTLE WORLD
   COMPLETE SHARE REPORT
   By Ganesh ♡
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const STORE_KEY = "sharmilaLittleWorld_v2";

  // Existing Messenger link from chat.js
  const MESSENGER_URL = "https://m.me/ohh.you.copy.my.profile.link";

  const $ = id => document.getElementById(id);

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
    } catch (error) {
      return {};
    }
  }

  function saveState(state) {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function getState() {
    const state = loadState();

    state.answers ||= {};
    state.results ||= {};
    state.shares ||= {};
    state.memories ||= [];
    state.diary ||= [];
    state.dynamic ||= {};
    state.reportShares ||= {};

    return state;
  }

  /* =====================================
     SAVE DYNAMIC WEBSITE ACTIVITIES
  ===================================== */

  function saveDynamic(key, value) {
    const state = getState();
    state.dynamic[key] = value;
    saveState(state);
  }

  function addCountry(country) {
    if (!country || !country.name) return;

    const state = getState();

    const countries = state.dynamic.countries || [];

    const exists = countries.some(item =>
      item.name.toLowerCase() === country.name.toLowerCase()
    );

    if (!exists) {
      countries.push(country);
    }

    state.dynamic.countries = countries;
    saveState(state);
  }

  function captureOutfit() {
    const mood = $("outfitMood")?.value;
    const occasion = $("outfitOccasion")?.value;

    if (!mood || !occasion) return;

    saveDynamic("outfit", {
      mood,
      occasion,
      updated: new Date().toISOString()
    });
  }

  function captureMusic() {
    const host = $("musicResults");
    if (!host) return;

    const cards = [...host.querySelectorAll(".music-card")];

    if (!cards.length) return;

    const songs = cards.map(card => ({
      title: card.querySelector("strong")?.textContent.trim() || "",
      artist: card.querySelector("p")?.textContent.trim() || ""
    })).filter(song => song.title);

    const state = getState();

    state.dynamic.music ||= {};
    state.dynamic.music.songs = songs;
    state.dynamic.music.updated = new Date().toISOString();

    saveState(state);
  }

  function captureCountry() {
    const host = $("countryResults");
    if (!host) return;

    const name = host.querySelector(".country-banner h2")?.textContent.trim();

    if (!name) return;

    const info = [...host.querySelectorAll(".country-info")];

    const details = {};

    info.forEach(item => {
      const label = item.querySelector("small")?.textContent.trim();
      const value = item.querySelector("strong")?.textContent.trim();

      if (label && value) {
        details[label] = value;
      }
    });

    addCountry({
      name,
      details,
      updated: new Date().toISOString()
    });
  }

  function captureSurprise() {
    const title = $("surpriseTitle")?.textContent.trim();
    const message = $("surpriseMessage")?.textContent.trim();
    const emoji = $("surpriseBox")?.textContent.trim();

    if (!title || !message) return;

    const state = getState();

    state.dynamic.surprises ||= [];

    const entry = {
      title,
      message,
      emoji,
      updated: new Date().toISOString()
    };

    const last = state.dynamic.surprises[
      state.dynamic.surprises.length - 1
    ];

    if (!last || last.title !== title) {
      state.dynamic.surprises.push(entry);
    }

    saveState(state);
  }

  function captureDatingAnswer() {
    saveDynamic("datingAnswer", {
      answer: "YES",
      message: "She said YES to the date! ❤️",
      updated: new Date().toISOString()
    });
  }

  /* =====================================
     LISTEN TO DYNAMIC WEBSITE ACTIONS
  ===================================== */

  document.addEventListener("click", event => {

    const target = event.target;

    if (target.closest("#createOutfit")) {
      captureOutfit();
    }

    if (
      target.closest("#searchMusic") ||
      target.closest(".music-quick")
    ) {
      const query =
        target.closest(".music-quick")?.dataset.artist ||
        $("musicSearch")?.value.trim() ||
        "";

      const state = getState();

      state.dynamic.music ||= {};
      state.dynamic.music.lastSearch = query;
      state.dynamic.music.updated = new Date().toISOString();

      saveState(state);
    }

    if (
      target.closest("#searchCountry") ||
      target.closest(".country-quick")
    ) {
      const query =
        target.closest(".country-quick")?.dataset.country ||
        $("countrySearch")?.value.trim() ||
        "";

      const state = getState();

      state.dynamic.lastCountrySearch = query;
      saveState(state);
    }

    if (target.closest("[data-surprise]")) {
      setTimeout(captureSurprise, 100);
    }

    if (target.closest("#dateYes")) {
      captureDatingAnswer();
    }

  });

  /* =====================================
     WATCH MUSIC AND COUNTRY RESULTS
  ===================================== */

  const observer = new MutationObserver(() => {
    captureMusic();
    captureCountry();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  /* =====================================
     EXTRA SHARE OPTIONS
  ===================================== */

  const sharePreview = $("sharePreview");

  if (sharePreview && !$("extraReportOptions")) {

    const options = document.createElement("div");

    options.id = "extraReportOptions";
    options.className = "form-card";

    options.style.marginTop = "20px";

    options.innerHTML = `
      <h3>More things to share ♡</h3>

      <p class="muted">
        Select which extra activities you want to include in your report.
      </p>

      <label class="choice">
        <input type="checkbox" data-extra-share="music">
        <span>🎧 My Music Searches</span>
      </label>

      <label class="choice">
        <input type="checkbox" data-extra-share="countries">
        <span>🌍 Countries I Explored</span>
      </label>

      <label class="choice">
        <input type="checkbox" data-extra-share="surprises">
        <span>💌 Surprise Messages I Opened</span>
      </label>
    `;

    sharePreview.insertAdjacentElement("afterend", options);

    options.querySelectorAll("[data-extra-share]").forEach(input => {

      const state = getState();

      input.checked = !!state.reportShares[input.dataset.extraShare];

      input.addEventListener("change", () => {

        const latest = getState();

        latest.reportShares[input.dataset.extraShare] = input.checked;

        saveState(latest);
      });

    });
  }

  /* =====================================
     REPORT GENERATOR
  ===================================== */

  function formatChoices(state, key) {

    const answers = state.answers[key] || [];
    const choices = answers.flat().filter(Boolean);

    if (!choices.length) {
      return "No selections saved.";
    }

    return choices.map(item => "• " + item).join("\n");
  }

  function addSection(lines, title, content) {
    lines.push("");
    lines.push("━━━━━━━━━━━━━━━━━━━━");
    lines.push(title);
    lines.push("━━━━━━━━━━━━━━━━━━━━");
    lines.push(content);
  }

  function createReport() {

    const state = getState();

    const selectedSections = [
      ...document.querySelectorAll("[data-share]:checked")
    ].map(input => input.dataset.share);

    const extra = state.reportShares || {};

    const hasExtra =
      extra.music ||
      extra.countries ||
      extra.surprises;

    if (!selectedSections.length && !hasExtra) {
      return null;
    }

    const lines = [];

    lines.push("♡ SHARMILA'S LITTLE WORLD ♡");
    lines.push("A little collection of her world");
    lines.push("");
    lines.push("Prepared for Ganesh ♡");
    lines.push("Date: " + new Date().toLocaleString());

    /* FASHION */

    if (selectedSections.includes("fashion")) {

      addSection(
        lines,
        "👗 HER FASHION WORLD",
        formatChoices(state, "fashion")
      );

      const outfit = state.dynamic.outfit;

      if (outfit) {
        lines.push("");
        lines.push("Her custom outfit:");
        lines.push("Style: " + outfit.mood);
        lines.push("Occasion: " + outfit.occasion);
      }
    }

    /* HOBBIES */

    if (selectedSections.includes("hobbies")) {
      addSection(
        lines,
        "🎨 HER HOBBIES & INTERESTS",
        formatChoices(state, "hobbies")
      );
    }

    /* DREAMS */

    if (selectedSections.includes("dreams")) {
      addSection(
        lines,
        "✨ HER DREAMS",
        formatChoices(state, "dreams")
      );
    }

    /* DATING */

    if (selectedSections.includes("dating")) {

      const result = state.results.dating || {};

      let content = formatChoices(state, "dating");

      const date = $("datePlan")?.value || result.date || "";
      const time = $("dateTime")?.value || result.time || "";
      const place = $("datePlace")?.value || result.place || "";

      if (date) content += "\nDate: " + date;
      if (time) content += "\nTime: " + time;
      if (place) content += "\nPlace: " + place;

      if (state.dynamic.datingAnswer) {
        content += "\n\n" + state.dynamic.datingAnswer.message;
      }

      addSection(lines, "❤️ HER IDEAL DATE", content);
    }

    /* PLAY */

    if (selectedSections.includes("play")) {
      addSection(
        lines,
        "🎀 HER LITTLE VIBE",
        formatChoices(state, "play")
      );
    }

    /* SAVED MOMENTS */

    if (selectedSections.includes("moments")) {

      const memories = state.memories || [];

      const content = memories.length
        ? memories.map(memory =>
            "♡ " + memory.title +
            "\nDate: " + (memory.date || "Not set") +
            "\n" + memory.text
          ).join("\n\n")
        : "No saved moments yet.";

      addSection(lines, "📸 HER SAVED MOMENTS", content);
    }

    /* MUSIC */

    if (extra.music) {

      const music = state.dynamic.music || {};

      let content = "Last search: " + (music.lastSearch || "Not available");

      if (music.songs?.length) {
        content += "\n\nSongs found:\n";

        content += music.songs.map(song =>
          "• " + song.title + " — " + song.artist
        ).join("\n");
      }

      addSection(lines, "🎧 HER MUSIC WORLD", content);
    }

    /* COUNTRIES */

    if (extra.countries) {

      const countries = state.dynamic.countries || [];

      const content = countries.length
        ? countries.map(country => {

            const details = Object.entries(country.details || {})
              .map(([key, value]) => key + ": " + value)
              .join("\n");

            return "🌍 " + country.name +
              (details ? "\n" + details : "");

          }).join("\n\n")
        : "No country details saved yet.";

      addSection(lines, "✈️ COUNTRIES SHE EXPLORED", content);
    }

    /* SURPRISE BOX */

    if (extra.surprises) {

      const surprises = state.dynamic.surprises || [];

      const content = surprises.length
        ? surprises.map(item =>
            item.emoji + " " + item.title +
            "\n" + item.message
          ).join("\n\n")
        : "No surprise messages opened yet.";

      addSection(lines, "💌 HER SURPRISE BOX", content);
    }

    /* PRIVACY */

    lines.push("");
    lines.push("━━━━━━━━━━━━━━━━━━━━");
    lines.push("♡ A LITTLE PRIVACY NOTE");
    lines.push("Her private diary is never included.");
    lines.push("━━━━━━━━━━━━━━━━━━━━");
    lines.push("");
    lines.push("Made with love ♡");

    return lines.join("\n");
  }

  /* =====================================
     SHARE REPORT THROUGH MESSENGER
  ===================================== */

  function showStatus(message, report = "") {

    const box = $("shareStatus");

    if (!box) return;

    box.classList.remove("hidden");

    box.innerHTML = `
      <h3>♡ Your report is ready!</h3>
      <p>${esc(message)}</p>

      ${report ? `
        <textarea
          id="generatedShareReport"
          readonly
          rows="12"
          style="
            width:100%;
            margin-top:12px;
            padding:12px;
            box-sizing:border-box;
            border:1px solid #edcbd8;
            border-radius:12px;
            background:#fffafc;
            color:#684653;
            font-size:12px;
            line-height:1.7;
          "
        >${esc(report)}</textarea>

        <button
          type="button"
          class="primary-btn"
          id="copyShareReport"
          style="margin-top:10px"
        >
          Copy Report ♡
        </button>
      ` : ""}
    `;

    $("copyShareReport")?.addEventListener("click", async () => {

      const textarea = $("generatedShareReport");

      try {
        await navigator.clipboard.writeText(textarea.value);
        alert("Report copied! ♡");
      } catch (error) {
        textarea.focus();
        textarea.select();
        alert("Please copy the selected report.");
      }

    });
  }

  async function shareReport() {

    const report = createReport();

    if (!report) {
      showStatus("Please select at least one section to share first.");
      return;
    }

    if (navigator.share) {

      try {

        await navigator.share({
          title: "Sharmila's Little World ♡",
          text: report
        });

        showStatus(
          "Choose Messenger from your sharing options and send the report to Ganesh."
        );

        return;

      } catch (error) {

        if (error.name === "AbortError") return;

      }
    }

    try {

      await navigator.clipboard.writeText(report);

      window.open(MESSENGER_URL, "_blank", "noopener");

      showStatus(
        "Your report has been copied. Messenger is opening. Paste the report into the chat and press Send.",
        report
      );

    } catch (error) {

      showStatus(
        "Copy the report below and paste it into your Messenger chat.",
        report
      );

    }
  }

  /* =====================================
     REPLACE OLD DOWNLOAD BUTTON ACTION
  ===================================== */

  const oldButton = $("prepareShare");

  if (oldButton) {

    const newButton = oldButton.cloneNode(true);

    oldButton.replaceWith(newButton);

    newButton.addEventListener("click", shareReport);

    newButton.textContent = "Share My Report with Ganesh ♡";
  }

  console.log("Sharmila report system ready ♡");

});
