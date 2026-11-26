
/* =========================================
   SHARMILA'S LITTLE WORLD
   FLOATING SETTINGS ICONS
   MOBILE LOGOUT INSIDE NAV MENU
   DESKTOP LOGOUT INSIDE SETTINGS ♡
========================================= */

(() => {
  "use strict";

  const THEMES = [
    { id: "romantic-pink", color: "#d77c9e" },
    { id: "calm-sage", color: "#83a98c" },
    { id: "dreamy-lavender", color: "#a995d5" },
    { id: "midnight-dark", color: "#7885a8" },
    { id: "soft-beige", color: "#c4a77d" },
    { id: "sky-blue", color: "#72a9d8" }
  ];

  const SOUND_LEVELS = [0.25, 0.50, 0.75, 1, 0];

  let themeIndex = 0;
  let soundIndex = 0;
  let hideTimer = null;
  let stack;
  let menu;
  let reminderBox;
  let navObserver;

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  function makeButton(id, icon, label) {
    const button = document.createElement("button");
    button.type = "button";
    button.id = id;
    button.className = "world-float-button";
    button.textContent = icon;
    button.title = label;
    button.setAttribute("aria-label", label);
    return button;
  }

  function addStyles() {
    if ($("#worldFloatingStyles")) return;

    const style = document.createElement("style");
    style.id = "worldFloatingStyles";

    style.textContent = `
      #pinkIconStack {
        position: fixed !important;
        right: 12px !important;
        top: 50% !important;
        bottom: auto !important;
        transform: translateY(-50%) !important;
        z-index: 99990 !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 9px !important;
      }

      .world-float-button {
        width: 43px !important;
        height: 43px !important;
        min-width: 43px !important;
        min-height: 43px !important;
        border: 1px solid rgba(215,124,158,.35) !important;
        border-radius: 50% !important;
        background: #fff8fb !important;
        color: #b9577d !important;
        box-shadow: 0 3px 12px rgba(100,50,70,.13) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 19px !important;
        cursor: pointer !important;
        padding: 0 !important;
        transition: transform .2s, background .2s, color .2s !important;
      }

      .world-float-button:hover {
        transform: scale(1.08);
      }

      #pinkIconStack #ganeshFloatingChat {
        position: relative !important;
        inset: auto !important;
        width: 43px !important;
        height: 43px !important;
        min-width: 43px !important;
        min-height: 43px !important;
        margin: 0 !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        z-index: 99991 !important;
      }

      #worldSettingsMenu {
        display: none;
        flex-direction: column;
        align-items: center;
        gap: 9px;
      }

      #worldSettingsMenu.open {
        display: flex;
        animation: worldIconsIn .22s ease;
      }

      @keyframes worldIconsIn {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      #soundToggle {
        display: none !important;
      }

      #worldSettingsLogout {
        border-color: #f0c9d7 !important;
        background: #fff0f5 !important;
        color: #bd6485 !important;
        font-size: 17px !important;
      }

      #worldSettingsLogout:hover {
        background: #d77e9e !important;
        color: #ffffff !important;
      }

      #worldSettingsMenu .world-settings-divider {
        width: 32px;
        height: 1px;
        background: #efcfdb;
        margin: 2px 0;
      }

      #mobileMenuLogout {
        display: none !important;
      }

      #worldReminderBox {
        display: none;
        position: fixed !important;
        top: 18px !important;
        left: 50% !important;
        right: auto !important;
        bottom: auto !important;
        transform: translateX(-50%) !important;
        width: min(340px, calc(100vw - 30px)) !important;
        max-height: 75vh !important;
        overflow-y: auto !important;
        z-index: 99995 !important;
        padding: 12px !important;
        border-radius: 15px !important;
        background: #fff8fb !important;
        border: 1px solid #f0d2df !important;
        box-shadow: 0 8px 28px rgba(70,35,50,.18) !important;
        color: #493640 !important;
      }

      #worldReminderBox.open {
        display: block !important;
        animation: reminderTopIn .25s ease;
      }

      @keyframes reminderTopIn {
        from {
          opacity: 0;
          transform: translate(-50%, -10px);
        }
        to {
          opacity: 1;
          transform: translate(-50%, 0);
        }
      }

      #worldReminderBox #grPanel {
        display: block !important;
        position: static !important;
        inset: auto !important;
        width: 100% !important;
        max-height: none !important;
        overflow: visible !important;
        box-shadow: none !important;
        border: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        background: transparent !important;
      }

      #worldReminderBox #grPanel[hidden] {
        display: block !important;
      }

      #worldReminderBox #grPanel button,
      #worldReminderBox #grPanel input,
      #worldReminderBox #grPanel select {
        max-width: 100%;
      }

      #worldReminderClose {
        display: block;
        margin: 0 0 8px auto;
        border: 0;
        background: transparent;
        color: #b9577d;
        font-size: 18px;
        cursor: pointer;
      }

      #ganeshReminder #grBell {
        display: none !important;
      }

      #ganeshReminder {
        position: static !important;
      }

      @media (max-width: 650px) {
        #pinkIconStack {
          right: 10px !important;
          top: 50% !important;
          bottom: auto !important;
          transform: translateY(-50%) !important;
          gap: 8px !important;
        }

        .world-float-button {
          width: 40px !important;
          height: 40px !important;
          min-width: 40px !important;
          min-height: 40px !important;
          font-size: 18px !important;
        }

        #pinkIconStack #ganeshFloatingChat {
          width: 40px !important;
          height: 40px !important;
          min-width: 40px !important;
          min-height: 40px !important;
        }

        #worldSettingsLogout,
        #worldSettingsMenu .world-settings-divider {
          display: none !important;
        }

        #mobileMenuLogout {
          display: block !important;
          width: 100% !important;
          box-sizing: border-box !important;
          margin-top: 10px !important;
          padding: 13px 16px !important;
          border: 1px solid #f0c9d7 !important;
          border-radius: 12px !important;
          background: #fff0f5 !important;
          color: #bd6485 !important;
          font-family: inherit !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          text-align: left !important;
          cursor: pointer !important;
        }

        #mobileMenuLogout:hover {
          background: #d77e9e !important;
          color: #ffffff !important;
        }

        #worldReminderBox {
          top: 12px !important;
          left: 50% !important;
          right: auto !important;
          bottom: auto !important;
          transform: translateX(-50%) !important;
          width: calc(100vw - 24px) !important;
          max-height: 75vh !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function logout() {
    closeMenu();
    document.dispatchEvent(new CustomEvent("world:logout"));
  }

  function setupMobileLogout() {
    const nav = $(".nav");
    if (!nav) return;

    const oldLogout = $("#accessLogout", nav);
    if (oldLogout) oldLogout.remove();

    let button = $("#mobileMenuLogout", nav);

    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.id = "mobileMenuLogout";
      button.textContent = "♡ Logout";
      button.setAttribute("aria-label", "Logout");

      button.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        nav.classList.remove("open");

        const menuToggle = $("#menuToggle");

        if (menuToggle) {
          menuToggle.setAttribute("aria-expanded", "false");
          menuToggle.setAttribute("aria-label", "Open navigation menu");
        }

        logout();
      });
    }

    /* Always keep Logout as the final navigation item */
    if (nav.lastElementChild !== button) {
      nav.appendChild(button);
    }
  }

  function watchNavigation() {
    const nav = $(".nav");
    if (!nav || navObserver) return;

    navObserver = new MutationObserver(() => {
      setupMobileLogout();
    });

    navObserver.observe(nav, {
      childList: true
    });

    setupMobileLogout();
  }

  function resetHideTimer() {
    clearTimeout(hideTimer);

    hideTimer = setTimeout(() => {
      if (menu) menu.classList.remove("open");
      if (reminderBox) reminderBox.classList.remove("open");
      updateSettingsButton(false);
    }, 5000);
  }

  function updateSettingsButton(open) {
    const button = $("#settingsToggle");
    if (!button) return;

    button.textContent = open ? "✕" : "⚙";
    button.setAttribute(
      "aria-label",
      open ? "Close settings" : "Open settings"
    );
  }

  function openMenu() {
    menu.classList.add("open");
    updateSettingsButton(true);
    resetHideTimer();
  }

  function closeMenu() {
    if (menu) menu.classList.remove("open");
    if (reminderBox) reminderBox.classList.remove("open");
    updateSettingsButton(false);
    clearTimeout(hideTimer);
  }

  function setupMusic(button) {
    button.addEventListener("click", () => {
      const original = $("#soundToggle");

      if (original) {
        original.click();

        setTimeout(() => {
          const isOn = /ON/i.test(original.textContent);
          button.textContent = isOn ? "🎵" : "🎼";
          button.style.opacity = isOn ? "1" : ".55";
        }, 50);
      }

      resetHideTimer();
    });
  }

  function setupTheme(button) {
    const saved = localStorage.getItem("sharmila_world_theme");

    const savedIndex = THEMES.findIndex(theme => theme.id === saved);
    themeIndex = savedIndex >= 0 ? savedIndex : 0;

    function paintIcon() {
      const theme = THEMES[themeIndex];
      button.style.background = theme.color;
      button.style.color = "#ffffff";
      button.style.borderColor = theme.color;
    }

    paintIcon();

    button.addEventListener("click", () => {
      themeIndex = (themeIndex + 1) % THEMES.length;
      const theme = THEMES[themeIndex];

      if (window.WorldAppearance) {
        window.WorldAppearance.applyTheme(theme.id);
      } else {
        document.body.dataset.theme = theme.id;
        localStorage.setItem("sharmila_world_theme", theme.id);
      }

      paintIcon();
      resetHideTimer();
    });
  }

  function setupSound(button) {
    function readCurrentLevel() {
      const toggle = $("#worldSoundToggle");
      const slider = $("#worldVolumeSlider");

      if (toggle && !toggle.checked) return 4;

      const current = slider ? Number(slider.value) : 0.25;

      let nearest = 0;
      let difference = Infinity;

      SOUND_LEVELS.slice(0, 4).forEach((level, index) => {
        const diff = Math.abs(level - current);

        if (diff < difference) {
          difference = diff;
          nearest = index;
        }
      });

      return nearest;
    }

    soundIndex = readCurrentLevel();

    function updateIcon() {
      const icons = ["🔈", "🔉", "🔊", "🔊", "🔇"];

      button.textContent = icons[soundIndex];
      button.style.opacity = soundIndex === 4 ? ".55" : "1";
      button.title = soundIndex === 4
        ? "Sound OFF"
        : `Sound ${SOUND_LEVELS[soundIndex] * 100}%`;
    }

    updateIcon();

    button.addEventListener("click", () => {
      soundIndex = (soundIndex + 1) % SOUND_LEVELS.length;

      const level = SOUND_LEVELS[soundIndex];
      const currentToggle = $("#worldSoundToggle");
      const currentSlider = $("#worldVolumeSlider");

      if (currentToggle) {
        currentToggle.checked = soundIndex !== 4;
        currentToggle.dispatchEvent(
          new Event("change", { bubbles: true })
        );
      }

      if (currentSlider) {
        currentSlider.value = String(level);
        currentSlider.dispatchEvent(
          new Event("input", { bubbles: true })
        );
      }

      updateIcon();
      resetHideTimer();
    });
  }

  function setupReminder(button) {
    const panel = $("#grPanel");

    if (!panel) {
      console.warn("Reminder panel #grPanel was not found.");
      button.addEventListener("click", resetHideTimer);
      return;
    }

    reminderBox = document.createElement("div");
    reminderBox.id = "worldReminderBox";

    const close = document.createElement("button");
    close.id = "worldReminderClose";
    close.type = "button";
    close.textContent = "✕";
    close.setAttribute("aria-label", "Close reminder settings");

    close.addEventListener("click", () => {
      reminderBox.classList.remove("open");
      resetHideTimer();
    });

    reminderBox.appendChild(close);
    document.body.appendChild(reminderBox);
    reminderBox.appendChild(panel);

    button.addEventListener("click", () => {
      reminderBox.classList.toggle("open");
      resetHideTimer();
    });

    reminderBox.addEventListener("click", resetHideTimer);
    reminderBox.addEventListener("input", resetHideTimer);
    reminderBox.addEventListener("change", resetHideTimer);
  }

  function setupChat() {
    const chat = $("#ganeshFloatingChat");

    if (!chat) {
      console.warn("Chat button #ganeshFloatingChat not found.");
      return null;
    }

    return chat;
  }

  function setupLogout(button) {
    button.addEventListener("click", logout);
  }

  function initialize() {
    if ($("#pinkIconStack")) return;

    addStyles();

    stack = document.createElement("div");
    stack.id = "pinkIconStack";

    const chat = setupChat();

    const settingsButton = makeButton(
      "settingsToggle",
      "⚙",
      "Settings"
    );

    menu = document.createElement("div");
    menu.id = "worldSettingsMenu";

    const musicButton = makeButton(
      "worldMusicIcon",
      "🎵",
      "Music ON/OFF"
    );

    const themeButton = makeButton(
      "worldThemeIcon",
      "🎨",
      "Change theme"
    );

    const reminderButton = makeButton(
      "worldReminderIcon",
      "🔔",
      "Reminder settings"
    );

    const soundButton = makeButton(
      "worldSoundIcon",
      "🔈",
      "Change sound volume"
    );

    const divider = document.createElement("div");
    divider.className = "world-settings-divider";

    const logoutButton = makeButton(
      "worldSettingsLogout",
      "♡",
      "Logout"
    );

    menu.append(
      musicButton,
      themeButton,
      reminderButton,
      soundButton,
      divider,
      logoutButton
    );

    if (chat) stack.appendChild(chat);

    stack.appendChild(settingsButton);
    stack.appendChild(menu);
    document.body.appendChild(stack);

    setupMusic(musicButton);
    setupTheme(themeButton);
    setupReminder(reminderButton);
    setupSound(soundButton);
    setupLogout(logoutButton);

    watchNavigation();

    settingsButton.addEventListener("click", () => {
      if (menu.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    menu.addEventListener("click", resetHideTimer);
    menu.addEventListener("pointerdown", resetHideTimer);

    document.addEventListener("pointerdown", event => {
      const clickedInsideStack = stack.contains(event.target);
      const clickedReminder =
        reminderBox && reminderBox.contains(event.target);

      if (!clickedInsideStack && !clickedReminder) {
        closeMenu();
      }
    });

    console.log("Floating settings and mobile logout ready ♡");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

})();
