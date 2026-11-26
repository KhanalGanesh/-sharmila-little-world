
/* =========================================
   TIME TO TALK WITH GANESH ♡
   Romantic Reminder System
   By Ganesh
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  if (document.getElementById("ganeshReminder")) return;

  const STORAGE_KEY = "ganeshRomanticReminder";

  const style = document.createElement("style");
  style.textContent = `
    #ganeshReminder, #ganeshReminder * {
      box-sizing: border-box;
    }

    #ganeshReminder {
      position: fixed;
      z-index: 999999;
      right: 22px;
      bottom: 24px;
      font-family: inherit;
    }

    #grBell {
      width: 57px;
      height: 57px;
      border: none;
      border-radius: 50%;
      background: linear-gradient(135deg,#f7a8c8,#d86b9c);
      color: white;
      font-size: 24px;
      cursor: pointer;
      box-shadow: 0 7px 25px #d86b9c55;
      transition: .3s;
    }

    #grBell:hover {
      transform: scale(1.1) rotate(-8deg);
    }

    #grPanel {
      display: none;
      position: absolute;
      right: 0;
      bottom: 70px;
      width: min(340px, calc(100vw - 32px));
      padding: 22px;
      border-radius: 22px;
      background: #fff8fb;
      color: #75465d;
      box-shadow: 0 12px 45px #8e466a35;
      border: 1px solid #f5d5e3;
      animation: grPop .35s ease;
    }

    #grPanel.gr-show {
      display: block;
    }

    #grPanel h3 {
      margin: 0 0 7px;
      color: #b65380;
      font-size: 19px;
    }

    #grPanel p {
      font-size: 13px;
      line-height: 1.6;
      margin: 0 0 16px;
      color: #966b80;
    }

    #grPanel label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      margin: 12px 0 6px;
    }

    #grPanel input,
    #grPanel select {
      width: 100%;
      padding: 11px;
      border: 1px solid #edc7d8;
      border-radius: 11px;
      background: white;
      color: #75465d;
      font-size: 15px;
      outline: none;
    }

    #grSave {
      width: 100%;
      margin-top: 17px;
      padding: 12px;
      border: none;
      border-radius: 30px;
      background: linear-gradient(135deg,#ee9cbe,#d86b9c);
      color: white;
      font-weight: 700;
      cursor: pointer;
    }

    #grCancel {
      width: 100%;
      margin-top: 8px;
      padding: 9px;
      border: 1px solid #edc7d8;
      border-radius: 30px;
      background: transparent;
      color: #a65c7e;
      cursor: pointer;
    }

    #grStatus {
      font-size: 12px;
      margin-top: 12px;
      color: #a65c7e;
      line-height: 1.5;
    }

    #grPopup {
      display: none;
      position: fixed;
      z-index: 1000000;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      width: min(370px, calc(100vw - 20px));
      padding: 23px;
      background: linear-gradient(145deg,#fff8fc,#ffe9f2);
      color: #75465d;
      border: 1px solid #f3c7da;
      border-radius: 23px 0 0 23px;
      box-shadow: 0 10px 45px #9c52754d;
    }

    #grPopup.gr-active {
      display: block;
      animation: grSlide .65s cubic-bezier(.2,.8,.2,1);
    }

    #grPopup .gr-heart {
      font-size: 32px;
      margin-bottom: 8px;
      animation: grBeat 1.2s infinite;
    }

    #grPopup h2 {
      font-size: 20px;
      line-height: 1.4;
      color: #bd5d89;
      margin: 5px 0 9px;
    }

    #grPopup p {
      font-size: 14px;
      line-height: 1.7;
      color: #91677d;
      margin: 0 0 17px;
    }

    .gr-actions {
      display: flex;
      gap: 9px;
    }

    .gr-actions button {
      flex: 1;
      padding: 11px 8px;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 700;
    }

    #grTalk {
      background: #dc80a7;
      color: white;
    }

    #grLater {
      background: #f5dce8;
      color: #9c5677;
    }

    @keyframes grSlide {
      from { right: -400px; opacity: 0; }
      to { right: 0; opacity: 1; }
    }

    @keyframes grPop {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes grBeat {
      0%,100% { transform: scale(1); }
      50% { transform: scale(1.18); }
    }

    @media(max-width:480px) {
      #ganeshReminder {
        right: 14px;
        bottom: 17px;
      }

      #grPopup {
        top: auto;
        bottom: 85px;
        right: 10px;
        transform: none;
        border-radius: 22px;
      }
    }
  `;
  document.head.appendChild(style);

  const wrapper = document.createElement("div");
  wrapper.id = "ganeshReminder";

  wrapper.innerHTML = `
    <div id="grPanel">
      <h3>Our Little Reminder ♡</h3>
      <p>Set a special time to talk with Ganesh. I'll be waiting! 💗</p>

      <label for="grTime">Choose your time</label>
      <input type="time" id="grTime" value="20:00">

      <label for="grRepeat">Reminder type</label>
      <select id="grRepeat">
        <option value="daily">Every day ♡</option>
        <option value="once">One time only</option>
      </select>

      <button id="grSave">Save My Reminder ♡</button>
      <button id="grCancel">Turn Off Reminder</button>

      <div id="grStatus">No reminder set yet.</div>
    </div>

    <button id="grBell" title="Set a reminder">♡</button>
  `;

  document.body.appendChild(wrapper);

  const popup = document.createElement("div");
  popup.id = "grPopup";

  popup.innerHTML = `
    <div class="gr-heart">💗</div>
    <h2>It's time to talk with Ganesh!</h2>
    <p>
      Hey babe, someone is waiting to hear your voice.
      Aba ali ber kura garne hoina? 🥺💕
    </p>
    <div class="gr-actions">
      <button id="grTalk">Let's Talk ❤️</button>
      <button id="grLater">Later ♡</button>
    </div>
  `;

  document.body.appendChild(popup);

  const bell = document.getElementById("grBell");
  const panel = document.getElementById("grPanel");
  const timeInput = document.getElementById("grTime");
  const repeatInput = document.getElementById("grRepeat");
  const status = document.getElementById("grStatus");

  let reminder = null;

  try {
    reminder = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    reminder = null;
  }

  function nextTime(time) {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();

    date.setHours(hours, minutes, 0, 0);

    if (date.getTime() <= Date.now()) {
      date.setDate(date.getDate() + 1);
    }

    return date.getTime();
  }

  function updateStatus() {
    if (!reminder || !reminder.active) {
      status.textContent = "No reminder set yet.";
      return;
    }

    const date = new Date(reminder.nextAt);

    status.textContent =
      "♡ Reminder set for " +
      date.toLocaleString([], {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit"
      }) +
      (reminder.repeat === "daily" ? " · Every day" : " · One time");
  }

  function saveReminder() {
    const time = timeInput.value;

    if (!time) {
      status.textContent = "Please choose a time first ♡";
      return;
    }

    reminder = {
      active: true,
      time,
      repeat: repeatInput.value,
      nextAt: nextTime(time)
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminder));

    updateStatus();
    panel.classList.remove("gr-show");

    // Ask permission for browser notifications.
    if ("Notification" in window &&
        Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }

  function turnOff() {
    reminder = null;
    localStorage.removeItem(STORAGE_KEY);
    updateStatus();
  }

  function showReminder() {
    popup.classList.add("gr-active");

    // Browser notification, if permission was granted.
    if ("Notification" in window &&
        Notification.permission === "granted") {
      try {
        new Notification("It's time to talk with Ganesh! 💗", {
          body: "Sharmila, Ganesh is waiting for you ♡"
        });
      } catch (error) {
        console.log("Notification unavailable:", error);
      }
    }

    // Gentle chime (may be blocked by browser autoplay settings).
    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (AudioContextClass) {
        const audio = new AudioContextClass();
        [523.25, 659.25, 783.99].forEach((frequency, index) => {
          const oscillator = audio.createOscillator();
          const gain = audio.createGain();

          oscillator.frequency.value = frequency;
          oscillator.type = "sine";
          gain.gain.value = 0.07;

          oscillator.connect(gain);
          gain.connect(audio.destination);

          const start = audio.currentTime + index * 0.22;
          oscillator.start(start);
          gain.gain.setValueAtTime(0.07, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
          oscillator.stop(start + 0.36);
        });
      }
    } catch (error) {
      console.log("Sound unavailable:", error);
    }
  }

  function checkReminder() {
    if (!reminder || !reminder.active) return;

    if (Date.now() >= reminder.nextAt) {
      showReminder();

      if (reminder.repeat === "daily") {
        reminder.nextAt = nextTime(reminder.time);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reminder));
        updateStatus();
      } else {
        reminder = null;
        localStorage.removeItem(STORAGE_KEY);
        updateStatus();
      }
    }
  }

  bell.addEventListener("click", () => {
    panel.classList.toggle("gr-show");
  });

  document.getElementById("grSave")
    .addEventListener("click", saveReminder);

  document.getElementById("grCancel")
    .addEventListener("click", turnOff);

  document.getElementById("grLater")
    .addEventListener("click", () => {
      popup.classList.remove("gr-active");
    });

  document.getElementById("grTalk")
    .addEventListener("click", () => {
      popup.classList.remove("gr-active");

      const chatSection =
        document.getElementById("ganeshChatSection");

      if (chatSection) {
        chatSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      } else {
        const surprise = document.getElementById("surprise");
        if (surprise) {
          surprise.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    });

  // Restore previously saved reminder.
  if (reminder && reminder.active) {
    timeInput.value = reminder.time || "20:00";
    repeatInput.value = reminder.repeat || "daily";

    // If an alarm time passed while the website was closed,
    // move it to the next suitable day instead of firing late.
    if (reminder.nextAt <= Date.now()) {
      reminder.nextAt = nextTime(reminder.time);

      if (reminder.repeat === "once") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reminder));
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reminder));
      }
    }
  }

  updateStatus();

  // Check every 10 seconds while the page is open.
  setInterval(checkReminder, 10000);

});
