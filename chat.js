
/* =========================================
   CHAT WITH GANESH ♡
   API-FREE SMART CHAT + SOCIAL LINKS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const surprise = document.getElementById("surprise");
  if (!surprise) return;
  if (document.getElementById("ganeshChatSection")) return;

  const messengerLink = "https://m.me/ohh.you.copy.my.profile.link";
  const instagramLink = "https://www.instagram.com/mrkhanal12/";

  // =========================================
  // STYLE
  // =========================================

  const style = document.createElement("style");

  style.textContent = `
    .ganesh-chat-section {
      max-width: 850px;
      margin: 65px auto 35px;
      padding: 35px 22px;
      background: linear-gradient(145deg,#fffaf8,#fff0f3);
      border: 1px solid #f2dce2;
      border-radius: 24px;
      text-align: center;
      box-shadow: 0 12px 35px rgba(120,60,75,.07);
    }

    .ganesh-chat-section .chat-eyebrow {
      color: #bd8293;
      font-size: 11px;
      letter-spacing: 3px;
      font-weight: 700;
    }

    .ganesh-chat-section h2 {
      font-family: 'Playfair Display',serif;
      font-size: 32px;
      color: #49343b;
      margin: 12px 0;
    }

    .ganesh-chat-subtitle {
      color: #987d85;
      font-size: 14px;
      margin-bottom: 25px;
    }

    .ganesh-social-options {
      display: flex;
      justify-content: center;
      gap: 13px;
      flex-wrap: wrap;
    }

    .ganesh-social-card {
      flex: 1 1 190px;
      max-width: 230px;
      min-height: 135px;
      padding: 20px 13px;
      border: 1px solid #efd9e0;
      background: white;
      border-radius: 18px;
      color: #654653 !important;
      text-decoration: none !important;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      transition: .25s;
      font-family: inherit;
    }

    .ganesh-social-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(120,60,75,.12);
    }

    .ganesh-social-card .social-icon {
      font-size: 32px;
    }

    .ganesh-social-card strong {
      font-size: 15px;
    }

    .ganesh-social-card small {
      color: #a48a92;
      font-size: 11px;
    }

    .ganesh-ai-panel {
      display: none;
      margin-top: 24px;
      background: white;
      border: 1px solid #f0dfe4;
      border-radius: 18px;
      overflow: hidden;
      text-align: left;
    }

    .ganesh-ai-panel.open {
      display: block;
    }

    .ganesh-ai-header {
      background: #fff5f7;
      padding: 15px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid #f3e3e8;
    }

    .ganesh-ai-avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: #f4dce4;
      display: grid;
      place-items: center;
      font-size: 22px;
    }

    .ganesh-ai-header strong {
      display: block;
      color: #654653;
    }

    .ganesh-ai-header small {
      color: #a48a92;
      font-size: 11px;
    }

    .ganesh-ai-messages {
      height: 300px;
      overflow-y: auto;
      padding: 17px;
      background: #fffdfd;
    }

    .ganesh-ai-message {
      width: fit-content;
      max-width: 85%;
      padding: 11px 14px;
      margin: 9px 0;
      border-radius: 15px;
      font-size: 13px;
      line-height: 1.6;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .ganesh-ai-message.bot {
      background: #f8edf1;
      color: #654c55;
      border-bottom-left-radius: 4px;
    }

    .ganesh-ai-message.user {
      background: #b9798e;
      color: white;
      margin-left: auto;
      border-bottom-right-radius: 4px;
    }

    .ganesh-ai-input-area {
      display: flex;
      gap: 8px;
      padding: 12px;
      border-top: 1px solid #f2e4e8;
    }

    .ganesh-ai-input-area input {
      flex: 1;
      min-width: 0;
      border: 1px solid #ead8de;
      border-radius: 25px;
      padding: 12px 15px;
      outline: none;
      font-size: 14px;
    }

    .ganesh-ai-input-area button {
      width: 44px;
      height: 44px;
      flex-shrink: 0;
      border: none;
      border-radius: 50%;
      background: #b9798e;
      color: white;
      font-size: 18px;
      cursor: pointer;
    }

    .ganesh-ai-note {
      padding: 10px;
      color: #aa9299;
      text-align: center;
      font-size: 10px;
      margin: 0;
    }

    .ganesh-chat-footer {
      color: #b28c98;
      font-size: 12px;
      margin-top: 25px;
    }

    /* FLOATING CHAT */

    .ganesh-floating-chat {
      position: fixed;
      right: 23px;
      bottom: 23px;
      width: 57px;
      height: 57px;
      border-radius: 50%;
      background: linear-gradient(145deg,#d995aa,#b9798e);
      color: white;
      border: 2px solid white;
      box-shadow: 0 6px 22px rgba(120,60,75,.25);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 25px;
      cursor: pointer;
      z-index: 9998;
    }

    .ganesh-chat-popup {
      position: fixed;
      right: 24px;
      bottom: 92px;
      width: 290px;
      max-width: calc(100vw - 35px);
      background: #fffaf9;
      border: 1px solid #efd9e0;
      border-radius: 20px;
      box-shadow: 0 12px 40px rgba(80,40,55,.18);
      padding: 18px;
      z-index: 9999;
      opacity: 0;
      visibility: hidden;
      transform: translateY(12px);
      transition: .25s;
    }

    .ganesh-chat-popup.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .ganesh-popup-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #654653;
      font-family: 'Playfair Display',serif;
      font-size: 18px;
    }

    .ganesh-popup-close {
      border: none;
      background: none;
      color: #a17d89;
      font-size: 23px;
      cursor: pointer;
    }

    .ganesh-popup-option {
      display: flex;
      align-items: center;
      gap: 11px;
      width: 100%;
      margin-top: 11px;
      padding: 12px;
      background: white;
      border: 1px solid #f0dfe4;
      border-radius: 12px;
      text-decoration: none !important;
      color: #654653 !important;
      text-align: left;
      cursor: pointer;
      font-family: inherit;
    }

    .ganesh-popup-option:hover {
      background: #fff0f4;
    }

    .ganesh-popup-option span {
      font-size: 23px;
    }

    .ganesh-popup-option strong {
      font-size: 13px;
    }

    @media(max-width:600px) {
      .ganesh-chat-section {
        padding: 27px 14px;
        margin: 40px 10px 25px;
      }

      .ganesh-chat-section h2 {
        font-size: 26px;
      }

      .ganesh-social-options {
        flex-direction: column;
        align-items: center;
      }

      .ganesh-social-card {
        width: 100%;
        max-width: 280px;
      }

      .ganesh-floating-chat {
        width: 52px;
        height: 52px;
        right: 15px;
        bottom: 17px;
      }

      .ganesh-chat-popup {
        right: 14px;
        bottom: 80px;
      }
    }
  `;

  document.head.appendChild(style);

  // =========================================
  // MAIN CHAT SECTION
  // =========================================

  const section = document.createElement("section");
  section.id = "ganeshChatSection";
  section.className = "ganesh-chat-section";

  section.innerHTML = `
    <p class="chat-eyebrow">A LITTLE PLACE FOR US</p>
    <h2>Chat with Ganesh ♡</h2>
    <p class="ganesh-chat-subtitle">
      A little conversation, a little smile, anytime you want.
    </p>

    <div class="ganesh-social-options">

      <button type="button" class="ganesh-social-card" id="ganeshOpenAI">
        <span class="social-icon">✨</span>
        <strong>Chat with Ganesh AI</strong>
        <small>Let's have a little conversation ♡</small>
      </button>

      <a class="ganesh-social-card"
         href="${messengerLink}"
         target="_blank" rel="noopener noreferrer">
        <span class="social-icon">💬</span>
        <strong>Messenger</strong>
        <small>Talk to the real Ganesh ♡</small>
      </a>

      <a class="ganesh-social-card"
         href="${instagramLink}"
         target="_blank" rel="noopener noreferrer">
        <span class="social-icon">📸</span>
        <strong>Instagram</strong>
        <small>Send me a DM</small>
      </a>

    </div>

    <div class="ganesh-ai-panel" id="ganeshAIPanel">

      <div class="ganesh-ai-header">
        <div class="ganesh-ai-avatar">♡</div>
        <div>
          <strong>Ganesh's Little Chat</strong>
          <small>Here to make you smile ✨</small>
        </div>
      </div>

      <div class="ganesh-ai-messages" id="ganeshAIMessages">
        <div class="ganesh-ai-message bot">
          Hey babe! ♡ How was your day?
          I'm here whenever you want to talk. 🌷
        </div>
      </div>

      <div class="ganesh-ai-input-area">
        <input id="ganeshAIInput"
          type="text"
          placeholder="Write something sweet..."
          autocomplete="off">
        <button id="ganeshAISend" type="button">➤</button>
      </div>

      <p class="ganesh-ai-note">
        This is an API-free scripted chat, not a real AI.
      </p>
    </div>

    <p class="ganesh-chat-footer">
      Made with love, just for you ♡<br>BY GANESH
    </p>
  `;

  const surpriseWrap = surprise.querySelector(".surprise-wrap");

  if (surpriseWrap) {
    surpriseWrap.insertAdjacentElement("afterend", section);
  } else {
    surprise.appendChild(section);
  }

  // =========================================
  // API-FREE SMART REPLY ENGINE
  // =========================================

  const messages = document.getElementById("ganeshAIMessages");
  const input = document.getElementById("ganeshAIInput");
  const sendButton = document.getElementById("ganeshAISend");
  const aiPanel = document.getElementById("ganeshAIPanel");

  let conversationCount = 0;

  const replies = {
    greeting: [
      "Hey babe! ♡ Timro message dekhda mero mood nai ramro bhayo. K gardai chau?",
      "Hello my favourite person! 🌷 Aaja ko din kasto bhairacha?",
      "Hiii babe! ❤️ Aaja malai ke sunaune?"
    ],
    how: [
      "Ma ta thik chu babe! Timro din chai kasto bhayo? ❤️",
      "Timi sanga kura garna paye pachi ramailo lagcha. Timi kasto chau?",
      "I'm doing good! But tell me, how are YOU feeling today? ♡"
    ],
    love: [
      "Aww babe! ❤️ Timro kura kati sweet cha ni!",
      "Love is all about little moments, care and understanding. ♡",
      "Timi aaja dherai romantic mood ma chau jasto cha! 😄💕"
    ],
    miss: [
      "Aww! Kasailai miss garnu pani kati sweet feeling ho hai. ❤️",
      "Sometimes distance makes little conversations even more special. ♡",
      "Timro man ma aaja dherai feelings haru cha jasto cha."
    ],
    sad: [
      "Oh babe, ke bhayo? Man ma bhako kura bhana na. Ma sunirachu. ❤️",
      "It's okay to have a difficult day. Take a little breath. You don't have to be happy all the time. ♡",
      "Aaja ali garo bhairacha jasto cha. Aafno care gara hai."
    ],
    happy: [
      "Yayyy! That's lovely! 😍 Timro happiness sunera ramailo lagyo.",
      "Keep that beautiful smile, babe! ❤️",
      "Aaja ta celebration garnuparcha ni! 🎉"
    ],
    food: [
      "Aaja ke khayau babe? Khana chai time ma khanu hai! 🍓",
      "If I could choose, I'd suggest something delicious and warm. 😋",
      "Food mood! Aaja timro favourite dish ke ho?"
    ],
    sleep: [
      "Good night babe! Sweet dreams. 🌙❤️",
      "Phone ali side ma rakhera ramrari rest gara hai.",
      "Sleep well! Bholi naya din, naya smile. ♡"
    ],
    morning: [
      "Good morning babe! ☀️ Aaja ko din beautiful hos!",
      "Uthyou? Have a lovely day, my favourite human! 🌷",
      "Morning! Aaja ko first smile timro lagi. ❤️"
    ],
    thanks: [
      "Aww, you're always welcome babe! ♡",
      "No need to say thank you. Happy to chat!",
      "Anytime! Timi khusi bhaye pugyo. ❤️"
    ],
    study: [
      "Bistarai padha babe. Small progress is still progress! 📚",
      "You can do it! Ekchin break liyera feri continue gara.",
      "Don't put too much pressure on yourself. One step at a time. ♡"
    ],
    bored: [
      "Bored? Let's play a little game! Tell me one thing you would do if you could travel anywhere. 🌍",
      "Let's talk about dreams, travel, food or something funny! 😄",
      "Hmm, what if we ask each other random questions? First question: beach or mountains?"
    ],
    japanese: [
      "そうなんだ！今日はどんな一日だった？♡",
      "話してくれてありがとう。もっと聞かせてね！",
      "いいね！今日はゆっくりできてる？🌷"
    ],
    random: [
      "Hmm, interesting! Tell me a little more babe. ♡",
      "I want to hear the whole story! What happened next?",
      "Aww, timro kura sunna ramailo lagcha. Ani?",
      "That's something to think about! What do you feel about it?",
      "Haha! Babe, timi pani kati interesting kura garchau. 😄",
      "If today had a colour, what colour would it be? 🎨",
      "One random question: if you could travel anywhere tomorrow, where would you go? 🌍"
    ]
  };

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function getReply(message) {
    const m = message.toLowerCase().trim();

    conversationCount++;

    const has = (...words) => words.some(word => m.includes(word));

    if (has("こんにちは", "元気", "ありがとう", "おはよう", "こんばんは")) {
      return pick(replies.japanese);
    }

    if (has("good morning", "morning", "शुभ प्रभात")) {
      return pick(replies.morning);
    }

    if (has("good night", "gn", "शुभ रात्री", "sleep", "sutna", "sutchu")) {
      return pick(replies.sleep);
    }

    if (has("how are you", "how r u", "kasto xa", "kasto chha",
            "kasto chau", "तिमीलाई कस्तो", "कैसे हो", "kaisa hai")) {
      return pick(replies.how);
    }

    if (has("hello", "hii", "hey", "namaste", "नमस्ते", "hi babe")) {
      return pick(replies.greeting);
    }

    if (has("love", "maya", "माया", "प्यार", "i love you")) {
      return pick(replies.love);
    }

    if (has("miss", "yaad", "सम्झे", "सम्झना", "याद")) {
      return pick(replies.miss);
    }

    if (has("sad", "dukhi", "दुखी", "रुन", "cry", "upset", "tension")) {
      return pick(replies.sad);
    }

    if (has("happy", "khusi", "खुसी", "ramailo", "excited")) {
      return pick(replies.happy);
    }

    if (has("food", "khana", "भोक", "खाना", "eat", "hungry")) {
      return pick(replies.food);
    }

    if (has("study", "exam", "पढाइ", "पढ्दै", "school", "college")) {
      return pick(replies.study);
    }

    if (has("bored", "bore", "दिक्क", "boring")) {
      return pick(replies.bored);
    }

    if (has("thank", "धन्यवाद", "thanks")) {
      return pick(replies.thanks);
    }

    if (has("who are you", "timi ko hau", "तिमी को हौ")) {
      return "I'm Ganesh's little API-free chat companion made for this website. ♡ I can chat using prepared replies, but I'm not the real Ganesh or a live AI.";
    }

    if (has("your name", "naam ke", "नाम के")) {
      return "You can call me Ganesh's Little Chat! ♡";
    }

    if (has("joke", "jokes", "funny", "हसाऊ")) {
      return "Why did the phone wear glasses? Because it lost its contacts! 😂💕";
    }

    if (has("question", "ask me", "sodha", "प्रश्न")) {
      return "Okay babe! ❤️ If you could spend one whole day anywhere in the world, where would you go?";
    }

    if (conversationCount % 4 === 0) {
      return "Babe, timro euta kura sodhum? Aaja timro sabai bhanda ramro moment ke thiyo? ♡";
    }

    return pick(replies.random);
  }

  function addMessage(text, type) {
    const item = document.createElement("div");
    item.className = "ganesh-ai-message " + type;
    item.textContent = text;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
  }

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";
    sendButton.disabled = true;

    const reply = getReply(text);

    setTimeout(() => {
      addMessage(reply, "bot");
      sendButton.disabled = false;
      input.focus();
    }, 550 + Math.random() * 700);
  }

  sendButton.addEventListener("click", sendMessage);

  input.addEventListener("keydown", event => {
    if (event.key === "Enter") sendMessage();
  });

  // Open AI panel inside Surprise tab
  document.getElementById("ganeshOpenAI").addEventListener("click", () => {
    aiPanel.classList.toggle("open");

    if (aiPanel.classList.contains("open")) {
      aiPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      setTimeout(() => input.focus(), 300);
    }
  });

  // =========================================
  // FLOATING CHAT BUTTON
  // =========================================

  const floating = document.createElement("button");
  floating.type = "button";
  floating.className = "ganesh-floating-chat";
  floating.id = "ganeshFloatingChat";
  floating.setAttribute("aria-label", "Open Chat with Ganesh");
  floating.setAttribute("aria-expanded", "false");
  floating.innerHTML = "♡";

  document.body.appendChild(floating);

  // =========================================
  // FLOATING POPUP
  // Messenger + Instagram ONLY
  // =========================================

  const popup = document.createElement("div");
  popup.className = "ganesh-chat-popup";
  popup.id = "ganeshChatPopup";

  popup.innerHTML = `
    <div class="ganesh-popup-title">
      <strong>Chat with Ganesh ♡</strong>
      <button type="button" class="ganesh-popup-close"
        id="ganeshPopupClose">×</button>
    </div>

    <a href="${messengerLink}" target="_blank"
      rel="noopener noreferrer" class="ganesh-popup-option">
      <span>💬</span>
      <strong>Messenger</strong>
    </a>

    <a href="${instagramLink}" target="_blank"
      rel="noopener noreferrer" class="ganesh-popup-option">
      <span>📸</span>
      <strong>Instagram</strong>
    </a>
  `;

  document.body.appendChild(popup);

  function closePopup() {
    popup.classList.remove("open");
    floating.innerHTML = "♡";
    floating.setAttribute("aria-expanded", "false");
  }

  floating.addEventListener("click", () => {
    const open = popup.classList.toggle("open");
    floating.innerHTML = open ? "×" : "♡";
    floating.setAttribute("aria-expanded", String(open));
  });

  document.getElementById("ganeshPopupClose")
    .addEventListener("click", closePopup);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closePopup();
  });

  document.addEventListener("click", event => {
    if (
      popup.classList.contains("open") &&
      !popup.contains(event.target) &&
      !floating.contains(event.target)
    ) {
      closePopup();
    }
  });

  console.log("Ganesh Chat loaded successfully ♡");

});
