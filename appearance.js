
/* =========================================
   SHARMILA'S LITTLE WORLD
   THEME, SOUND & FLOATING CONTROLS
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

  function getAudioContext() {
    const AudioClass = window.AudioContext || window.webkitAudioContext;

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

      gain.gain.setValueAtTime(0, context.currentTime + delay);
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
      oscillator.stop(context.currentTime + delay + duration + 0.02);
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

  function applyTheme(themeId, shouldSave = true) {
    const validTheme = themes.some(theme => theme.id === themeId);
    const selected = validTheme ? themeId : "romantic-pink";

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

  function buildThemePanel() {
    const panel = create("div", "theme-panel");
    panel.id = "themePanel";
    panel.hidden = true;

    const heading = create("h3", "", "Choose your mood");
    const description = create(
      "p",
      "",
      "Change the look of your little world."
    );

    const options = create("div", "theme-options");

    themes.forEach(theme => {
      const button = create("button", "theme-option");
      button.type = "button";
      button.dataset.theme = theme.id;

      const dot = create("span", `theme-dot ${theme.dot}`);
      const label = create("span", "", theme.name);

      button.append(dot, label);

      button.addEventListener("click", () => {
        applyTheme(theme.id);
        sounds.click();
        showToast(`${theme.name} theme applied ♡`);
      });

      options.appendChild(button);
    });

    panel.append(heading, description, options);
    document.body.appendChild(panel);

    return panel;
  }

  function buildSoundPanel() {
    const panel = create("div", "sound-panel");
    panel.id = "soundPanel";
    panel.hidden = true;

    const heading = create("h3", "", "Sound settings");

    const toggleLabel = create("label");
    toggleLabel.append(
      create("span", "", "Sound effects")
    );

    const toggle = create("input");
    toggle.type = "checkbox";
    toggle.checked = soundEnabled;
    toggle.id = "worldSoundToggle";

    toggle.addEventListener("change", () => {
      soundEnabled = toggle.checked;
      localStorage.setItem(SOUND_KEY, String(soundEnabled));

      if (soundEnabled) sounds.save();

      showToast(soundEnabled ? "Sounds enabled ♡" : "Sounds muted");
      updateSoundButton();
    });

    toggleLabel.append(toggle);

    const volumeLabel = create("label");
    volumeLabel.append(create("span", "", "Volume"));

    const volumeValue = create("span", "", `${Math.round(volume * 100)}%`);
    volumeValue.id = "worldVolumeValue";

    volumeLabel.append(volumeValue);

    const slider = create("input");
    slider.type = "range";
    slider.min = "0";
    slider.max = "1";
    slider.step = "0.05";
    slider.value = String(volume);
    slider.setAttribute("aria-label", "Sound volume");

    slider.addEventListener("input", () => {
      volume = Number(slider.value);
      localStorage.setItem(VOLUME_KEY, String(volume));
      volumeValue.textContent = `${Math.round(volume * 100)}%`;
    });

    panel.append(heading, toggleLabel, volumeLabel, slider);
    document.body.appendChild(panel);

    return panel;
  }

  function updateSoundButton() {
    const button = $("#soundControl");

    if (button) {
      button.textContent = soundEnabled ? "♫" : "🔇";
      button.title = soundEnabled ? "Sound settings" : "Sound is muted";
      button.setAttribute("aria-label", button.title);
    }

    const toggle = $("#worldSoundToggle");

    if (toggle) {
      toggle.checked = soundEnabled;
    }
  }

  function buildFloatingControls() {
    const controls = create("div", "world-controls");
    controls.id = "worldControls";

    const themeButton = create("button", "world-control-btn", "🎨");
    themeButton.type = "button";
    themeButton.title = "Change theme";
    themeButton.setAttribute("aria-label", "Change theme");

    const soundButton = create(
      "button",
      "world-control-btn",
      soundEnabled ? "♫" : "🔇"
    );

    soundButton.type = "button";
    soundButton.id = "soundControl";
    soundButton.title = "Sound settings";
    soundButton.setAttribute("aria-label", "Sound settings");

    const themePanel = buildThemePanel();
    const soundPanel = buildSoundPanel();

    themeButton.addEventListener("click", () => {
      const opening = themePanel.hidden;

      themePanel.hidden = !opening;
      soundPanel.hidden = true;

      sounds.click();
    });

    soundButton.addEventListener("click", () => {
      const opening = soundPanel.hidden;

      soundPanel.hidden = !opening;
      themePanel.hidden = true;

      sounds.click();
    });

    controls.append(themeButton, soundButton);
    document.body.appendChild(controls);

    document.addEventListener("click", event => {
      if (
        !themePanel.contains(event.target) &&
        !soundPanel.contains(event.target) &&
        !controls.contains(event.target)
      ) {
        themePanel.hidden = true;
        soundPanel.hidden = true;
      }
    });
  }

  function setupNavigation() {
    const menuToggle = $("#menuToggle");
    const nav = $(".nav");

    if (menuToggle && nav) {
      menuToggle.addEventListener("click", () => {
        nav.classList.toggle("open");
        sounds.click();
      });
    }

    document.addEventListener("click", event => {
      const navButton = event.target.closest("[data-page]");
      const goButton = event.target.closest("[data-go]");

      if (navButton || goButton) {
        const destination = navButton
          ? navButton.dataset.page
          : goButton.dataset.go;

        if (destination) {
          sounds.tab();

          if (nav) nav.classList.remove("open");
        }
      }
    });
  }

  function setupGlobalSounds() {
    document.addEventListener("click", event => {
      const button = event.target.closest("button");

      if (!button || button.disabled) return;

      if (
        button.classList.contains("theme-option") ||
        button.id === "soundControl" ||
        button.id === "menuToggle"
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

      if (
        button.dataset.surprise !== undefined
      ) {
        sounds.surprise();
        return;
      }

      sounds.click();
    });
  }

  function initialize() {
    applyTheme(localStorage.getItem(THEME_KEY) || "romantic-pink", false);

    buildFloatingControls();
    setupNavigation();
    setupGlobalSounds();

    document.addEventListener("world:themechange", event => {
      console.info("Theme changed:", event.detail.theme);
    });

    window.WorldAppearance = {
      applyTheme,
      showToast,
      sounds,
      get soundEnabled() {
        return soundEnabled;
      },
      get volume() {
        return volume;
      }
    };

    console.log("Sharmila's Little World appearance ready ♡");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

})();
