
/* =========================================
   SHARMILA'S LITTLE WORLD
   THEME & SOUND SETTINGS
   UNIFIED SETTINGS READY ♡
   MOBILE MENU PRESERVED
========================================= */

(() => {
  "use strict";

  const THEME_KEY = "sharmila_world_theme";
  const SOUND_KEY = "sharmila_world_sound";
  const VOLUME_KEY = "sharmila_world_volume";

  const themes = [
    { id: "romantic-pink", name: "Romantic Pink", dot: "theme-pink" },
    { id: "dreamy-lavender", name: "Dreamy Lavender", dot: "theme-lavender" },
    { id: "calm-sage", name: "Calm Sage", dot: "theme-sage" },
    { id: "midnight-dark", name: "Midnight Dark", dot: "theme-dark" },
    { id: "soft-beige", name: "Soft Beige", dot: "theme-beige" },
    { id: "sky-blue", name: "Sky Blue", dot: "theme-blue" }
  ];

  let soundEnabled = localStorage.getItem(SOUND_KEY) !== "false";
  let volume = Number(localStorage.getItem(VOLUME_KEY) || 0.25);
  let audioContext = null;

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const create = (tag, className, text) => {
    const element = document.createElement(tag);

    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;

    return element;
  };

  /* ---------- AUDIO ---------- */

  function getAudioContext() {
    const AudioClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioClass) return null;

    if (!audioContext) {
      audioContext = new AudioClass();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }

    return audioContext;
  }

  function playTone(frequency, duration, type = "sine", delay = 0) {
    if (!soundEnabled || volume <= 0) return;

    const context = getAudioContext();
    if (!context) return;

    try {
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = type;

      oscillator.frequency.setValueAtTime(
        frequency,
        context.currentTime + delay
      );

      gain.gain.setValueAtTime(
        0,
        context.currentTime + delay
      );

      gain.gain.linearRampToValueAtTime(
        volume * 0.22,
        context.currentTime + delay + 0.015
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        context.currentTime + delay + duration
      );

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start(context.currentTime + delay);
      oscillator.stop(
        context.currentTime + delay + duration + 0.02
      );

    } catch (error) {
      console.warn("Sound could not play:", error);
    }
  }

  const sounds = {
    click() {
      playTone(650, 0.07);
    },

    tab() {
      playTone(520, 0.09);
      playTone(720, 0.12, "sine", 0.07);
    },

    save() {
      playTone(660, 0.12);
      playTone(880, 0.18, "sine", 0.12);
    },

    delete() {
      playTone(300, 0.16, "triangle");
      playTone(220, 0.18, "triangle", 0.12);
    },

    win() {
      playTone(523, 0.15);
      playTone(659, 0.15, "sine", 0.12);
      playTone(784, 0.25, "sine", 0.24);
    },

    surprise() {
      playTone(523, 0.15, "sine");
      playTone(784, 0.15, "sine", 0.10);
      playTone(1047, 0.25, "sine", 0.20);
    }
  };

  /* ---------- THEME ---------- */

  function applyTheme(themeId, shouldSave = true) {
    const validTheme = themes.some(
      theme => theme.id === themeId
    );

    const selected = validTheme
      ? themeId
      : "romantic-pink";

    document.body.dataset.theme = selected;

    if (shouldSave) {
      localStorage.setItem(THEME_KEY, selected);
    }

    document.querySelectorAll(".theme-option").forEach(button => {
      const active = button.dataset.theme === selected;

      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    document.dispatchEvent(
      new CustomEvent("world:themechange", {
        detail: { theme: selected }
      })
    );
  }

  /* ---------- TOAST ---------- */

  function showToast(message) {
    let toast = $("#worldToast");

    if (!toast) {
      toast = create("div", "world-toast");
      toast.id = "worldToast";
      toast.setAttribute("role", "status");

      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toast._hideTimer);

    toast._hideTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2300);
  }

  /* ---------- UNIFIED SETTINGS CONTENT ---------- */

  function buildSettingsContent() {
    const section = create("div", "world-settings-section");
    section.id = "worldSettingsSection";
    section.hidden = true;

    /* THEME AREA */

    const themeHeading = create(
      "h3",
      "world-settings-heading",
      "🎨 Choose your theme"
    );

    const themeDescription = create(
      "p",
      "world-settings-description",
      "Give your little world a different mood ♡"
    );

    const themeOptions = create(
      "div",
      "theme-options"
    );

    themes.forEach(theme => {
      const button = create("button", "theme-option");

      button.type = "button";
      button.dataset.theme = theme.id;

      const dot = create(
        "span",
        `theme-dot ${theme.dot}`
      );

      const label = create(
        "span",
        "",
        theme.name
      );

      button.append(dot, label);

      button.addEventListener("click", () => {
        applyTheme(theme.id);
        sounds.click();
        showToast(`${theme.name} theme applied ♡`);
      });

      themeOptions.appendChild(button);
    });

    /* DIVIDER */

    const divider = create(
      "div",
      "world-settings-divider"
    );

    /* SOUND AREA */

    const soundHeading = create(
      "h3",
      "world-settings-heading",
      "🔊 Sound effects"
    );

    const soundRow = create(
      "label",
      "world-settings-row"
    );

    const soundText = create(
      "span",
      "",
      "Website sounds"
    );

    const toggle = create("input");

    toggle.type = "checkbox";
    toggle.checked = soundEnabled;
    toggle.id = "worldSoundToggle";

    toggle.addEventListener("change", () => {
      soundEnabled = toggle.checked;

      localStorage.setItem(
        SOUND_KEY,
        String(soundEnabled)
      );

      if (soundEnabled) {
        sounds.save();
      }

      showToast(
        soundEnabled
          ? "Sounds enabled ♡"
          : "Sounds muted"
      );

      updateSoundSettings();
    });

    soundRow.append(soundText, toggle);

    /* VOLUME */

    const volumeRow = create(
      "div",
      "world-settings-volume"
    );

    const volumeTitle = create(
      "div",
      "world-settings-volume-title"
    );

    const volumeText = create(
      "span",
      "",
      "Volume"
    );

    const volumeValue = create(
      "span",
      "",
      `${Math.round(volume * 100)}%`
    );

    volumeValue.id = "worldVolumeValue";

    volumeTitle.append(volumeText, volumeValue);

    const slider = create("input");

    slider.type = "range";
    slider.id = "worldVolumeSlider";
    slider.min = "0";
    slider.max = "1";
    slider.step = "0.05";
    slider.value = String(volume);

    slider.setAttribute(
      "aria-label",
      "Sound effects volume"
    );

    slider.addEventListener("input", () => {
      volume = Number(slider.value);

      localStorage.setItem(
        VOLUME_KEY,
        String(volume)
      );

      volumeValue.textContent =
        `${Math.round(volume * 100)}%`;
    });

    volumeRow.append(volumeTitle, slider);

    section.append(
      themeHeading,
      themeDescription,
      themeOptions,
      divider,
      soundHeading,
      soundRow,
      volumeRow
    );

    document.body.appendChild(section);

    return section;
  }

  /* ---------- UPDATE SOUND SETTINGS ---------- */

  function updateSoundSettings() {
    const toggle = $("#worldSoundToggle");
    const slider = $("#worldVolumeSlider");
    const value = $("#worldVolumeValue");

    if (toggle) {
      toggle.checked = soundEnabled;
    }

    if (slider) {
      slider.value = String(volume);
    }

    if (value) {
      value.textContent = `${Math.round(volume * 100)}%`;
    }
  }

  /* ---------- MOBILE NAVIGATION ---------- */

  function setupNavigation() {
    const menuToggle =
      $(".menu-toggle") || $("#menuToggle");

    const nav = $(".nav");

    if (!menuToggle || !nav) {
      console.warn(
        "Mobile menu button or navigation was not found."
      );
      return;
    }

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute(
      "aria-label",
      "Open navigation menu"
    );

    menuToggle.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();

      const isOpen = nav.classList.toggle("open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      menuToggle.setAttribute(
        "aria-label",
        isOpen
          ? "Close navigation menu"
          : "Open navigation menu"
      );

      sounds.click();
    });

    nav.addEventListener("click", event => {
      const navButton = event.target.closest("[data-page]");

      if (navButton) {
        nav.classList.remove("open");

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

        menuToggle.setAttribute(
          "aria-label",
          "Open navigation menu"
        );
      }
    });

    document.addEventListener("click", event => {
      if (
        !nav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        nav.classList.remove("open");

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

        menuToggle.setAttribute(
          "aria-label",
          "Open navigation menu"
        );
      }
    });

    document.addEventListener("click", event => {
      const goButton = event.target.closest("[data-go]");
      const navButton = event.target.closest("[data-page]");

      if (goButton || navButton) {
        nav.classList.remove("open");

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

        menuToggle.setAttribute(
          "aria-label",
          "Open navigation menu"
        );
      }
    });
  }

  /* ---------- GLOBAL BUTTON SOUNDS ---------- */

  function setupGlobalSounds() {
    document.addEventListener("click", event => {
      const button = event.target.closest("button");

      if (!button || button.disabled) return;

      if (
        button.classList.contains("theme-option") ||
        button.id === "soundControl" ||
        button.id === "menuToggle" ||
        button.id === "settingsToggle" ||
        button.classList.contains("menu-toggle")
      ) {
        return;
      }

      if (
        button.id === "saveDiary" ||
        button.id === "saveMemory" ||
        button.id === "prepareShare"
      ) {
        sounds.save();
        return;
      }

      if (
        button.dataset.delete !== undefined ||
        button.classList.contains("delete-btn")
      ) {
        sounds.delete();
        return;
      }

      if (
        button.dataset.result ||
        button.classList.contains("game-win")
      ) {
        sounds.win();
        return;
      }

      if (button.dataset.surprise !== undefined) {
        sounds.surprise();
        return;
      }

      sounds.click();
    });
  }

  /* ---------- INITIALIZE ---------- */

  function initialize() {
    applyTheme(
      localStorage.getItem(THEME_KEY) || "romantic-pink",
      false
    );

    const settingsContent = buildSettingsContent();

    setupNavigation();
    setupGlobalSounds();

    window.WorldAppearance = {
      applyTheme,
      showToast,
      sounds,
      themes,

      get soundEnabled() {
        return soundEnabled;
      },

      get volume() {
        return volume;
      },

      updateSoundSettings
    };

    /* Let floating-controls.js receive the settings section */

    document.dispatchEvent(
      new CustomEvent("world:appearance-ready", {
        detail: {
          settingsContent
        }
      })
    );

    document.addEventListener("world:themechange", event => {
      console.info(
        "Theme changed:",
        event.detail.theme
      );
    });

    console.log(
      "Sharmila's Little World appearance ready ♡"
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialize
    );
  } else {
    initialize();
  }

})();
