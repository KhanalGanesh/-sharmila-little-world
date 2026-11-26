
/* =========================================
   SHARMILA'S LITTLE WORLD
   OUR LITTLE REMINDER ♡
   UNIFIED SETTINGS VERSION
   AUTOMATIC + CHOOSE A TIME
   MESSENGER + INSTAGRAM
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("ganeshReminder")) return;

  const MODE_KEY = "ganeshReminderMode";
  const TIME_KEY = "ganeshRomanticReminder";
  const NEXT_KEY = "ganeshAutoReminderNextAt";

  const MESSENGER_URL = "https://m.me/ohh.you.copy.my.profile.link";
  const INSTAGRAM_URL = "https://www.instagram.com/mrkhanal12/";

  const messages = [
    "How was your day today? ♡",
    "Have you eaten something?",
    "Are you smiling right now? 😊",
    "Don't forget to take a little rest.",
    "What made you happy today?",
    "Missing someone? 🤭",
    "You deserve a beautiful day!",
    "Time to chat with Ganesh ♡",
    "He wants to talk to you, babe ❤️"
  ];

  let popupTimer = null;
  let autoTimer = null;

  let mode = localStorage.getItem(MODE_KEY) || "auto";

  /* ---------- STYLES ---------- */

  const style = document.createElement("style");

  style.id = "ganeshReminderStyle";

  style.textContent = `
    #ganeshReminder {
      position: static !important;
      display: contents !important;
      font-family: Arial, sans-serif;
    }

    #grBell {
      display: none !important;
    }

    #grPanel {
      display: block;
      position: static !important;
      width: 100% !important;
      max-width: 100% !important;
      padding: 14px 0 0 !important;
      margin: 12px 0 0 !important;
      border: 0 !important;
      border-top: 1px solid #f3c5d8 !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      color: #70445a;
      box-sizing: border-box;
    }

    #grPanel h3 {
      margin: 0 0 8px;
      font-size: 15px;
      color: #d65b91;
    }

    #grPanel p {
      font-size: 12px;
      line-height: 1.5;
      margin: 0 0 10px;
    }

    .gr-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px;
      margin: 7px 0;
      border-radius: 10px;
      background: white;
      font-size: 13px;
      cursor: pointer;
    }

    .gr-option input {
      accent-color: #e779a7;
    }

    #grTimeBox {
      display: none;
      margin-top: 10px;
      padding: 10px;
      border-radius: 12px;
      background: #fff;
    }

    #grTimeBox.gr-visible {
      display: block;
    }

    #grTimeBox label {
      display: block;
      margin: 8px 0 4px;
      font-size: 12px;
    }

    #grTimeBox input,
    #grTimeBox select {
      width: 100%;
      padding: 8px;
      border: 1px solid #edc4d6;
      border-radius: 8px;
      box-sizing: border-box;
      background: white;
      color: #70445a;
    }

    .gr-save,
    .gr-off {
      width: 100%;
      border: 0;
      border-radius: 20px;
      padding: 10px;
      margin-top: 9px;
      cursor: pointer;
      font-weight: bold;
    }

    .gr-save {
      background: #e779a7;
      color: white;
    }

    .gr-off {
      background: #f4e5ec;
      color: #a15c7b;
    }

    #grPopup {
      display: none;
      position: fixed;
      right: 82px;
      bottom: 95px;
      width: 270px;
      padding: 16px;
      border-radius: 18px;
      background: #fff7fb;
      border: 1px solid #f2bfd4;
      box-shadow: 0 8px 30px rgba(160,70,110,.2);
      z-index: 1000001;
      color: #70445a;
      text-align: center;
      box-sizing: border-box;
    }

    #grPopup.gr-show {
      display: block;
      animation: grAppear .25s ease;
    }

    #grPopup .gr-heart {
      font-size: 25px;
      margin-bottom: 5px;
    }

    #grPopup .gr-message {
      font-size: 14px;
      line-height: 1.5;
      margin: 5px 0 13px;
      font-weight: bold;
    }

    .gr-social-links {
      display: flex;
      gap: 9px;
      margin-top: 8px;
    }

    .gr-social-link {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      padding: 10px 5px;
      border-radius: 20px;
      text-decoration: none;
      font-size: 12px;
      font-weight: bold;
      background: white;
      border: 1px solid #f0c5d8;
      color: #70445a;
      transition: transform .2s, box-shadow .2s;
    }

    .gr-social-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(160,70,110,.15);
    }

    .gr-social-link img {
      width: 20px;
      height: 20px;
      object-fit: contain;
    }

    #grLater {
      width: 100%;
      padding: 9px;
      border: 0;
      border-radius: 20px;
      margin-top: 9px;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
      background: #f4e5ec;
      color: #a15c7b;
    }

    @keyframes grAppear {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media(max-width: 600px) {
      #grPopup {
        width: min(250px, calc(100vw - 85px));
        right: 66px;
        bottom: 90px;
      }
    }
  `;

  document.head.appendChild(style);

  /* ---------- CREATE REMINDER UI ---------- */

  const wrapper = document.createElement("div");
  wrapper.id = "ganeshReminder";

  wrapper.innerHTML = `
    <div id="grPanel">

      <h3>🔔 Our Little Reminder ♡</h3>
      <p>A little reminder to make her smile 💗</p>

      <label class="gr-option">
        <input type="radio" name="grMode" value="auto">
        Automatic reminders
      </label>

      <label class="gr-option">
        <input type="radio" name="grMode" value="time">
        Choose a time
      </label>

      <div id="grTimeBox">

        <label>Reminder type</label>
        <select id="grRepeat">
          <option value="daily">Every day</option>
          <option value="once">One time</option>
        </select>

        <label>Date</label>
        <input type="date" id="grDate">

        <label>Time</label>
        <input type="time" id="grTime">

        <button class="gr-save" id="grSaveTime">
          Save Reminder ♡
        </button>

      </div>

      <button class="gr-off" id="grTurnOff">
        Turn Off Reminders
      </button>

    </div>

    <div id="grPopup">

      <div class="gr-heart">💗</div>

      <div class="gr-message" id="grMessage"></div>

      <div class="gr-social-links">

        <a
          class="gr-social-link"
          href="${MESSENGER_URL}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://cdn.simpleicons.org/messenger/0084FF"
            alt="Messenger"
          >
          Messenger
        </a>

        <a
          class="gr-social-link"
          href="${INSTAGRAM_URL}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://cdn.simpleicons.org/instagram/E4405F"
            alt="Instagram"
          >
          Instagram
        </a>

      </div>

      <button id="grLater">Later ♡</button>

    </div>
  `;

  document.body.appendChild(wrapper);

  const panel = document.getElementById("grPanel");
  const popup = document.getElementById("grPopup");
  const timeBox = document.getElementById("grTimeBox");

  /* ---------- SOUND ---------- */

  function playReminderSound() {
    try {
      const AudioClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioClass) return;

      const audio = new AudioClass();

      [523.25, 659.25, 783.99].forEach((frequency, index) => {
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;

        gain.gain.setValueAtTime(0.001, audio.currentTime);

        gain.gain.exponentialRampToValueAtTime(
          0.12,
          audio.currentTime + 0.05 + index * 0.02
        );

        gain.gain.exponentialRampToValueAtTime(
          0.001,
          audio.currentTime + 0.45 + index * 0.02
        );

        oscillator.connect(gain);
        gain.connect(audio.destination);

        oscillator.start(audio.currentTime + index * 0.12);
        oscillator.stop(
          audio.currentTime + 0.6 + index * 0.12
        );
      });

      setTimeout(() => audio.close(), 1500);

    } catch (error) {
      console.log("Reminder sound unavailable.");
    }
  }

  /* ---------- NOTIFICATION POPUP ---------- */

  function closePopup() {
    popup.classList.remove("gr-show");

    if (popupTimer) {
      clearTimeout(popupTimer);
      popupTimer = null;
    }
  }

  function showReminder() {
    closePopup();

    const randomMessage =
      messages[Math.floor(Math.random() * messages.length)];

    document.getElementById("grMessage").textContent =
      randomMessage;

    popup.classList.add("gr-show");

    playReminderSound();

    popupTimer = setTimeout(() => {
      closePopup();
    }, 5000);
  }

  /* ---------- MODE UI ---------- */

  function updateModeUI() {
    document.querySelectorAll(
      'input[name="grMode"]'
    ).forEach(input => {
      input.checked = input.value === mode;
    });

    timeBox.classList.toggle(
      "gr-visible",
      mode === "time"
    );
  }

  /* ---------- AUTOMATIC REMINDERS ---------- */

  function clearAutoTimer() {
    if (autoTimer) {
      clearTimeout(autoTimer);
      autoTimer = null;
    }
  }

  function scheduleAutomaticReminder() {
    clearAutoTimer();

    if (mode !== "auto") return;

    const savedNext = Number(
      localStorage.getItem(NEXT_KEY)
    );

    const now = Date.now();

    let nextTime = savedNext;

    if (!nextTime || nextTime <= now) {
      nextTime = now + (2 + Math.random()) * 60 * 1000;

      localStorage.setItem(
        NEXT_KEY,
        String(nextTime)
      );
    }

    autoTimer = setTimeout(() => {
      if (mode !== "auto") return;

      showReminder();

      const nextDelay =
        (2 + Math.random()) * 60 * 1000;

      localStorage.setItem(
        NEXT_KEY,
        String(Date.now() + nextDelay)
      );

      scheduleAutomaticReminder();

    }, Math.max(1000, nextTime - now));
  }

  /* ---------- TIME REMINDER ---------- */

  function checkScheduledReminder() {
    if (mode !== "time") return;

    const saved = localStorage.getItem(TIME_KEY);

    if (!saved) return;

    let reminder;

    try {
      reminder = JSON.parse(saved);
    } catch (error) {
      return;
    }

    if (!reminder.date || !reminder.time) return;

    const now = new Date();

    const target = new Date(
      reminder.date + "T" + reminder.time
    );

    if (now < target) return;

    showReminder();

    if (reminder.repeat === "daily") {
      const tomorrow = new Date(target);

      tomorrow.setDate(
        tomorrow.getDate() + 1
      );

      reminder.date = [
        tomorrow.getFullYear(),
        String(tomorrow.getMonth() + 1).padStart(2, "0"),
        String(tomorrow.getDate()).padStart(2, "0")
      ].join("-");

      localStorage.setItem(
        TIME_KEY,
        JSON.stringify(reminder)
      );

    } else {
      localStorage.removeItem(TIME_KEY);

      mode = "off";

      localStorage.setItem(MODE_KEY, mode);

      updateModeUI();
    }
  }

  /* ---------- MODE CHANGE ---------- */

  document.querySelectorAll(
    'input[name="grMode"]'
  ).forEach(input => {
    input.addEventListener("change", () => {
      mode = input.value;

      localStorage.setItem(MODE_KEY, mode);

      if (mode === "auto") {
        localStorage.removeItem(TIME_KEY);
        scheduleAutomaticReminder();

      } else {
        clearAutoTimer();
        localStorage.removeItem(NEXT_KEY);
      }

      updateModeUI();
    });
  });

  /* ---------- SAVE TIME ---------- */

  document.getElementById("grSaveTime")
    .addEventListener("click", () => {

      const repeat =
        document.getElementById("grRepeat").value;

      const date =
        document.getElementById("grDate").value;

      const time =
        document.getElementById("grTime").value;

      if (!date || !time) {
        alert("Please choose a date and time ♡");
        return;
      }

      const target = new Date(date + "T" + time);

      if (target <= new Date()) {
        alert("Please choose a future date and time ♡");
        return;
      }

      localStorage.setItem(
        TIME_KEY,
        JSON.stringify({ repeat, date, time })
      );

      mode = "time";

      localStorage.setItem(MODE_KEY, mode);

      clearAutoTimer();

      localStorage.removeItem(NEXT_KEY);

      updateModeUI();

      if (window.WorldAppearance) {
        window.WorldAppearance.showToast(
          "Your reminder has been saved! ♡"
        );
      } else {
        alert("Your reminder has been saved! ♡");
      }
    });

  /* ---------- TURN OFF ---------- */

  document.getElementById("grTurnOff")
    .addEventListener("click", () => {

      mode = "off";

      localStorage.setItem(MODE_KEY, mode);

      localStorage.removeItem(TIME_KEY);
      localStorage.removeItem(NEXT_KEY);

      clearAutoTimer();
      closePopup();

      updateModeUI();

      if (window.WorldAppearance) {
        window.WorldAppearance.showToast(
          "Reminders turned off ♡"
        );
      }
    });

  /* ---------- LATER ---------- */

  document.getElementById("grLater")
    .addEventListener("click", closePopup);

  /* ---------- REMINDER SETTINGS API ---------- */

  window.WorldReminder = {
    panel,

    showReminder,
    closePopup,

    get mode() {
      return mode;
    }
  };

  document.dispatchEvent(
    new CustomEvent("world:reminder-ready", {
      detail: {
        panel
      }
    })
  );

  /* ---------- RESTORE SAVED SETTINGS ---------- */

  if (!localStorage.getItem(MODE_KEY)) {
    mode = "auto";

    localStorage.setItem(MODE_KEY, mode);
  }

  updateModeUI();

  if (mode === "auto") {
    scheduleAutomaticReminder();
  }

  if (mode === "time") {
    const saved = localStorage.getItem(TIME_KEY);

    if (saved) {
      try {
        const reminder = JSON.parse(saved);

        document.getElementById("grRepeat").value =
          reminder.repeat || "daily";

        document.getElementById("grDate").value =
          reminder.date || "";

        document.getElementById("grTime").value =
          reminder.time || "";

      } catch (error) {}
    }
  }

  /* Check scheduled reminders every 10 seconds */

  setInterval(checkScheduledReminder, 10000);

  console.log("Unified reminder settings ready ♡");

});
