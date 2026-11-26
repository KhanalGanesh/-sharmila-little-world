
/* =========================================
   SHARMILA'S LITTLE WORLD
   ONE STRAIGHT PINK ICON STACK
   Sound → Reminder → Chat
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const sound = document.getElementById("soundToggle");
  const reminder = document.getElementById("ganeshReminder");
  const chat = document.getElementById("ganeshFloatingChat");

  if (!sound || !reminder || !chat) {
    console.warn("Floating icons: one or more buttons not found.");
    return;
  }

  /* REMOVE OLD STACK IF PRESENT */

  document.getElementById("pinkIconStack")?.remove();

  /* CREATE ONE COMMON CONTAINER */

  const stack = document.createElement("div");
  stack.id = "pinkIconStack";

  /* MOVE ALL THREE INTO THE SAME CONTAINER */

  stack.appendChild(sound);
  stack.appendChild(reminder);
  stack.appendChild(chat);

  document.body.appendChild(stack);

  /* ADD STYLE */

  const oldStyle = document.getElementById("pinkIconStackStyle");
  if (oldStyle) oldStyle.remove();

  const style = document.createElement("style");
  style.id = "pinkIconStackStyle";

  style.textContent = `

    #pinkIconStack {
      position: fixed !important;
      right: 16px !important;
      top: 50% !important;
      bottom: auto !important;
      left: auto !important;
      transform: translateY(-50%) !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 14px !important;
      width: 52px !important;
      height: auto !important;
      padding: 0 !important;
      margin: 0 !important;
      z-index: 999999 !important;
      overflow: visible !important;
    }

    #pinkIconStack .dynamic-sound-toggle,
    #pinkIconStack #grBell,
    #pinkIconStack .ganesh-floating-chat {
      position: relative !important;
      top: auto !important;
      right: auto !important;
      bottom: auto !important;
      left: auto !important;
      transform: none !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex: 0 0 52px !important;
      width: 52px !important;
      height: 52px !important;
      min-width: 52px !important;
      min-height: 52px !important;
      margin: 0 !important;
      padding: 0 !important;
      border-radius: 50% !important;
      background: linear-gradient(145deg,#ffc4d9,#df78a1) !important;
      color: white !important;
      border: 2px solid #fff0f5 !important;
      box-shadow: 0 5px 18px rgba(201,104,137,.30) !important;
      cursor: pointer !important;
      box-sizing: border-box !important;
    }

    #pinkIconStack .dynamic-sound-toggle {
      font-size: 0 !important;
    }

    #pinkIconStack .dynamic-sound-toggle::before {
      font-size: 21px !important;
    }

    #pinkIconStack .dynamic-sound-toggle[aria-pressed="true"]::before {
      content: "🎵" !important;
    }

    #pinkIconStack .dynamic-sound-toggle[aria-pressed="false"]::before {
      content: "🔇" !important;
    }

    #pinkIconStack #ganeshReminder {
      position: relative !important;
      top: auto !important;
      right: auto !important;
      bottom: auto !important;
      left: auto !important;
      transform: none !important;
      width: 52px !important;
      height: 52px !important;
      min-width: 52px !important;
      min-height: 52px !important;
      margin: 0 !important;
      padding: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      overflow: visible !important;
    }

    #pinkIconStack #grBell {
      font-size: 0 !important;
    }

    #pinkIconStack #grBell::before {
      content: "🔔" !important;
      font-size: 21px !important;
    }

    #pinkIconStack .ganesh-floating-chat {
      font-size: 0 !important;
    }

    #pinkIconStack .ganesh-floating-chat::before {
      content: "♡" !important;
      font-size: 29px !important;
      color: white !important;
    }

    #pinkIconStack .ganesh-floating-chat[aria-expanded="true"]::before {
      content: "×" !important;
      font-size: 30px !important;
    }

    #pinkIconStack button:hover {
      filter: brightness(1.05) !important;
      box-shadow: 0 7px 22px rgba(201,104,137,.42) !important;
    }

    #grPanel {
      position: fixed !important;
      right: 80px !important;
      top: 50% !important;
      bottom: auto !important;
      transform: translateY(-50%) !important;
      z-index: 1000000 !important;
    }

    .ganesh-chat-popup {
      position: fixed !important;
      right: 80px !important;
      top: 50% !important;
      bottom: auto !important;
      z-index: 1000000 !important;
    }

    @media(max-width:600px) {

      #pinkIconStack {
        right: 10px !important;
        gap: 12px !important;
      }

      #pinkIconStack .dynamic-sound-toggle,
      #pinkIconStack #grBell,
      #pinkIconStack .ganesh-floating-chat,
      #pinkIconStack #ganeshReminder {
        width: 46px !important;
        height: 46px !important;
        min-width: 46px !important;
        min-height: 46px !important;
        flex-basis: 46px !important;
      }

      #grPanel,
      .ganesh-chat-popup {
        right: 66px !important;
        max-width: calc(100vw - 85px) !important;
      }

    }

  `;

  document.head.appendChild(style);


  /* =========================================
     AUTO CLOSE OTHER POPUPS
  ========================================= */

  const closeReminder = () => {
    const panel = document.getElementById("grPanel");
    const bell = document.getElementById("grBell");

    if (!panel || !bell) return;

    const isVisible =
      panel.getClientRects().length > 0 &&
      getComputedStyle(panel).display !== "none" &&
      getComputedStyle(panel).visibility !== "hidden";

    if (isVisible) {
      bell.click();
    }
  };

  const closeChat = () => {
    const popup = document.getElementById("ganeshChatPopup");

    if (popup) {
      popup.classList.remove("open", "active");
    }
  };

  /* BELL CLICK → CLOSE CHAT */

  const bell = document.getElementById("grBell");

  if (bell) {
    bell.addEventListener("click", closeChat, true);
  }

  /* CHAT CLICK → CLOSE REMINDER */

  chat.addEventListener("click", closeReminder, true);

  console.log("Popup auto-close enabled ♡");

});
