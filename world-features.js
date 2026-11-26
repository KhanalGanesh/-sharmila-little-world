
/* =====================================================
   SHARMILA'S LITTLE WORLD
   EXTRA FEATURES ENGINE
   Local storage only - No API - No backend
   Diary data is NEVER shared
===================================================== */

(() => {
  "use strict";

  const STORAGE_KEY = "sharmila_world_features_v1";

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const readData = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  };

  const saveData = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  let database = readData();

  const uid = () =>
    Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  const escapeHTML = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);

  const notify = (message) => {
    if (window.WorldAppearance?.showToast) {
      window.WorldAppearance.showToast(message);
    } else {
      alert(message);
    }
  };

  const playSound = (name) => {
    window.WorldAppearance?.sounds?.[name]?.();
  };

  const ensureArray = (key) => {
    if (!Array.isArray(database[key])) database[key] = [];
    return database[key];
  };

  const addItem = (key, item) => {
    const list = ensureArray(key);
    list.unshift({
      id: uid(),
      createdAt: new Date().toISOString(),
      ...item
    });
    saveData(database);
    playSound("save");
  };

  const removeItem = (key, id) => {
    database[key] = ensureArray(key).filter(item => item.id !== id);
    saveData(database);
    playSound("delete");
    renderAll();
  };

  /* -----------------------------------------------------
     FEATURE DEFINITIONS
  ----------------------------------------------------- */

  const featureGroups = {
    fashion: {
      title: "Fashion Studio",
      subtitle: "Create your own little style world",
      tools: [
        ["closet", "👗", "Digital Closet", "Save clothes you own"],
        ["outfit", "✨", "Outfit Planner", "Plan your next outfit"],
        ["moodboard", "🎨", "Fashion Moodboard", "Collect your style ideas"],
        ["beauty", "💄", "Beauty Inspiration", "Save makeup and beauty ideas"],
        ["brands", "👜", "Favourite Brands", "Keep your favourite brands"],
        ["stylequiz", "💗", "Style Quiz", "Discover your fashion mood"]
      ]
    },

    hobbies: {
      title: "Creative Corner",
      subtitle: "A place for all your little interests",
      tools: [
        ["photos", "📸", "Photo Gallery", "Save photo links and captions"],
        ["scrapbook", "📔", "Personal Scrapbook", "Collect your favourite moments"],
        ["wallpaper", "🌷", "Wallpaper Collection", "Save wallpaper links"],
        ["music", "🎵", "Music Collection", "Keep your favourite song links"],
        ["challenge", "🧩", "Creative Challenges", "Try a random creative activity"],
        ["drawing", "🖌️", "Drawing Pad", "Draw and save your artwork"]
      ]
    },

    dreams: {
      title: "Dream Garden",
      subtitle: "Small steps towards beautiful dreams",
      tools: [
        ["dreamboard", "🌙", "Dream Board", "Write down your dreams"],
        ["bucket", "🪣", "Bucket List", "Things you want to experience"],
        ["destination", "✈️", "Dream Destinations", "Places you want to visit"],
        ["goals", "🎯", "Goal Tracker", "Track your personal goals"],
        ["planner", "📅", "Daily Planner", "Organise your day"],
        ["countdown", "⏳", "Countdown Events", "Count down to special days"]
      ]
    },

    moments: {
      title: "Memory Lane",
      subtitle: "Little moments worth remembering",
      tools: [
        ["timeline", "🕰️", "Memory Timeline", "Save memorable moments"],
        ["gallery", "🖼️", "Memory Gallery", "Keep photo links together"],
        ["specialdates", "🎂", "Special Dates", "Remember important dates"],
        ["moodtracker", "🌈", "Mood Tracker", "Record your daily mood"],
        ["daily", "☀️", "Daily Memories", "Save a little daily memory"],
        ["letters", "💌", "Secret Letters", "Write personal letters"]
      ]
    },

    dating: {
      title: "Our Little Love Space",
      subtitle: "Sweet things, memories and moments",
      tools: [
        ["compatibility", "💕", "Love Compatibility", "A fun compatibility game"],
        ["questions", "💬", "Our Questions", "Save questions to ask each other"],
        ["lovecalc", "💘", "Love Calculator", "A fun random love score"],
        ["loveCountdown", "⏰", "Relationship Countdown", "Count down to a special date"],
        ["messages", "💌", "Surprise Messages", "Save sweet messages"],
        ["specialnotes", "📝", "Special Notes", "Keep little notes"]
      ]
    },

    play: {
      title: "Fun & Games",
      subtitle: "A little fun whenever you need it",
      tools: [
        ["memorygame", "🧠", "Memory Match", "Find matching emoji pairs"],
        ["reaction", "⚡", "Reaction Test", "Test your reaction speed"],
        ["wouldyourather", "🤔", "Would You Rather", "Choose between two options"],
        ["emoji", "😆", "Guess the Emoji", "Guess the hidden phrase"],
        ["video", "🎬", "Video Collection", "Save public video links"],
        ["randomchallenge", "🎲", "Random Challenge", "Try something unexpected"]
      ]
    },

    surprise: {
      title: "Surprise Box",
      subtitle: "A little happiness for today",
      tools: [
        ["compliment", "🌸", "Random Compliment", "Get a sweet compliment"],
        ["mystery", "🎁", "Mystery Message", "Open a mystery message"],
        ["surprisebox", "💝", "Surprise Box", "Discover a little surprise"],
        ["randomtask", "🌟", "Random Challenge", "Try a small challenge"]
      ]
    }
  };

  /* -----------------------------------------------------
     MODAL
  ----------------------------------------------------- */

  let modalBackdrop = null;

  function closeModal() {
    modalBackdrop?.remove();
    modalBackdrop = null;
  }

  function openModal(title, content) {
    closeModal();

    modalBackdrop = document.createElement("div");
    modalBackdrop.className = "world-modal-backdrop";

    modalBackdrop.innerHTML = `
      <div class="world-modal" role="dialog" aria-modal="true">
        <button class="world-modal-close" type="button"
          aria-label="Close">×</button>
        <h2>${escapeHTML(title)}</h2>
        <div class="world-modal-content">${content}</div>
      </div>
    `;

    document.body.appendChild(modalBackdrop);

    $(".world-modal-close", modalBackdrop).addEventListener("click", closeModal);

    modalBackdrop.addEventListener("click", event => {
      if (event.target === modalBackdrop) closeModal();
    });

    document.addEventListener("keydown", handleEscape, { once: true });

    function handleEscape(event) {
      if (event.key === "Escape") closeModal();
    }
  }

  function inputField(label, name, placeholder = "", type = "text") {
    return `
      <label class="world-form-label">
        ${escapeHTML(label)}
        <input class="world-form-input" name="${escapeHTML(name)}"
          type="${escapeHTML(type)}"
          placeholder="${escapeHTML(placeholder)}">
      </label>
    `;
  }

  function textField(label, name, placeholder = "") {
    return `
      <label class="world-form-label">
        ${escapeHTML(label)}
        <textarea class="world-form-input" name="${escapeHTML(name)}"
          rows="3" placeholder="${escapeHTML(placeholder)}"></textarea>
      </label>
    `;
  }

  function submitForm(title, fields, callback, buttonText = "Save ♡") {
    openModal(title, `
      <form class="world-feature-form">
        ${fields}
        <button class="world-feature-submit" type="submit">
          ${escapeHTML(buttonText)}
        </button>
      </form>
    `);

    $(".world-feature-form", modalBackdrop).addEventListener("submit", event => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const values = Object.fromEntries(formData.entries());

      callback(values);
      closeModal();
      renderAll();
      notify("Saved successfully ♡");
    });
  }

  /* -----------------------------------------------------
     TOOL DATA
  ----------------------------------------------------- */

  const toolConfigs = {
    closet: {
      title: "Add to Digital Closet",
      fields: inputField("Clothing name", "name", "e.g. White dress") +
        inputField("Category", "category", "Top, dress, shoes...") +
        inputField("Colour", "colour", "Favourite colour") +
        inputField("Photo link (optional)", "photo", "https://..."),
      key: "closet",
      render: item => `
        <strong>${escapeHTML(item.name)}</strong>
        <p>${escapeHTML(item.category)} · ${escapeHTML(item.colour)}</p>
        ${item.photo ? `<a href="${escapeHTML(item.photo)}" target="_blank" rel="noopener">View photo</a>` : ""}
      `
    },

    outfit: {
      title: "Plan an Outfit",
      fields: inputField("Outfit name", "name", "My weekend look") +
        inputField("Occasion", "occasion", "Party, casual, date...") +
        textField("Outfit details", "details", "Describe the outfit..."),
      key: "outfits",
      render: item => `
        <strong>${escapeHTML(item.name)}</strong>
        <p>${escapeHTML(item.occasion)}</p>
        <p>${escapeHTML(item.details)}</p>
      `
    },

    moodboard: {
      title: "Add Moodboard Idea",
      fields: inputField("Idea title", "name", "Soft pink aesthetic") +
        inputField("Image link", "photo", "https://...") +
        textField("Notes", "details", "Why do you like this?"),
      key: "moodboard",
      render: item => `
        <strong>${escapeHTML(item.name)}</strong>
        <p>${escapeHTML(item.details)}</p>
        ${item.photo ? `<a href="${escapeHTML(item.photo)}" target="_blank" rel="noopener">Open image</a>` : ""}
      `
    },

    beauty: {
      title: "Beauty Inspiration",
      fields: inputField("Look name", "name", "Natural makeup") +
        inputField("Product or brand", "brand", "Optional") +
        inputField("Reference link", "photo", "https://...") +
        textField("Notes", "details", "Your beauty ideas..."),
      key: "beauty",
      render: item => `
        <strong>${escapeHTML(item.name)}</strong>
        <p>${escapeHTML(item.brand)}</p>
        <p>${escapeHTML(item.details)}</p>
        ${item.photo ? `<a href="${escapeHTML(item.photo)}" target="_blank" rel="noopener">View reference</a>` : ""}
      `
    },

    brands: {
      title: "Favourite Brand",
      fields: inputField("Brand name", "name", "Brand name") +
        inputField("Website", "link", "https://...") +
        textField("Why you like it", "details", "Your thoughts..."),
      key: "brands",
      render: item => `
        <strong>${escapeHTML(item.name)}</strong>
        <p>${escapeHTML(item.details)}</p>
        ${item.link ? `<a href="${escapeHTML(item.link)}" target="_blank" rel="noopener">Visit website</a>` : ""}
      `
    },

    photos: {
      title: "Add Photo",
      fields: inputField("Photo title", "name", "A beautiful day") +
        inputField("Photo URL", "photo", "https://...") +
        textField("Caption", "details", "Write a caption..."),
      key: "photos",
      render: item => `
        <strong>${escapeHTML(item.name)}</strong>
        <p>${escapeHTML(item.details)}</p>
        ${item.photo ? `<a href="${escapeHTML(item.photo)}" target="_blank" rel="noopener">Open photo</a>` : ""}
      `
    },

    scrapbook: {
      title: "Add Scrapbook Page",
      fields: inputField("Page title", "name", "My favourite memory") +
        inputField("Image link", "photo", "https://...") +
        textField("Your story", "details", "Write something special..."),
      key: "scrapbook",
      render: item => `
        <strong>${escapeHTML(item.name)}</strong>
        <p>${escapeHTML(item.details)}</p>
        ${item.photo ? `<a href="${escapeHTML(item.photo)}" target="_blank" rel="noopener">View image</a>` : ""}
      `
    },

    wallpaper: {
      title: "Save Wallpaper",
      fields: inputField("Wallpaper name", "name", "My favourite wallpaper") +
        inputField("Image URL", "photo", "https://...") +
        textField("Notes", "details", "Optional notes"),
      key: "wallpapers",
      render: item => `
        <strong>${escapeHTML(item.name)}</strong>
        <p>${escapeHTML(item.details)}</p>
        ${item.photo ? `<a href="${escapeHTML(item.photo)}" target="_blank" rel="noopener">Open wallpaper</a>` : ""}
      `
    },

    music: {
      title: "Add Favourite Song",
      fields: inputField("Song name", "name", "Song title") +
        inputField("Artist", "artist", "Artist name") +
        inputField("Song link", "link", "https://..."),
      key: "music",
      render: item => `
        <strong>${escapeHTML(item.name)}</strong>
        <p>${escapeHTML(item.artist)}</p>
        ${item.link ? `<a href="${escapeHTML(item.link)}" target="_blank" rel="noopener">Open song</a>` : ""}
      `
    },

    dreamboard: {
      title: "Add a Dream",
      fields: inputField("Dream title", "name", "My dream") +
        textField("Why is it important?", "details", "Write your dream...") +
        inputField("Inspiration link (optional)", "link", "https://..."),
      key: "dreams",
      render: item => `
        <strong>${escapeHTML(item.name)}</strong>
        <p>${escapeHTML(item.details)}</p>
        ${item.link ? `<a href="${escapeHTML(item.link)}" target="_blank" rel="noopener">Inspiration</a>` : ""}
      `
    },

    bucket: {
      title: "Add to Bucket List",
      fields: inputField("What do you want to do?", "name", "Visit Japan's beautiful places") +
        inputField("Target date (optional)", "date", "", "date"),
      key: "bucket",
      render: item => `
        <strong>${escapeHTML(item.name)}</strong>
        <p>${item.date ? escapeHTML(item.date) : "No date set"}</p>
      `
    },

    destination: {
      title: "Dream Destination",
      fields: inputField("Place name", "name", "Paris, Korea, Switzerland...") +
        inputField("Country", "country", "Country name") +
        textField("Why do you want to visit?", "details", "Your travel dream..."),
      key: "destinations",
      render: item => `
        <strong>${escapeHTML(item.name)}</strong>
        <p>${escapeHTML(item.country)}</p>
        <p>${escapeHTML(item.details)}</p>
      `
    },

    goals: {
      title: "Add a Goal",
      fields: inputField("Goal", "name", "My goal") +
        inputField("Target date", "date", "", "date") +
        textField("First step", "details", "What will you do first?"),
      key: "goals",
      render: item => `
        <strong>${escapeHTML(item.name)}</strong>
        <p>${escapeHTML(item.details)}</p>
        <p>${item.date ? escapeHTML(item.date) : "No target date"}</p>
        <button class="world-small-action" data-complete="${escapeHTML(item.id)}">
          ${item.completed ? "Completed ✓" : "Mark completed"}
        </button>
      `
    },

    planner: {
      title: "Add Daily Plan",
      fields: inputField("Task", "name", "What do you need to do?") +
        inputField("Date", "date", "", "date") +
        inputField("Time", "time", "", "time"),
      key: "planner",
      render: item => `
        <strong>${escapeHTML(item.name)}</strong>
        <p>${escapeHTML(item.date)} ${escapeHTML(item.time)}</p>
        <button class="world-small-action" data-complete="${escapeHTML(item.id)}">
          ${item.completed ? "Done ✓" : "Mark done"}
        </button>
      `
    },

    timeline: {
      title: "Add Memory",
      fields: inputField("Memory title", "name", "A day to remember") +
        inputField("Date", "date", "", "date") +
        textField("What happened?", "details", "Write your memory..."),
      key: "timeline",
      render: item => `
        <strong>${escapeHTML(item.name)}</strong>
        <p>${escapeHTML(item.date)}</p>
        <p>${escapeHTML(item.details)}</p>
      `
    },

    gallery: {
      title: "Add Gallery Item",
      fields: inputField("Photo title", "name", "My favourite photo") +
        inputField("Photo URL", "photo", "https://...") +
        textField("Caption", "details", "A little description..."),
      key: "gallery",
      render: item => `
        <strong>${escapeHTML(item.name)}</strong>
        <p>${escapeHTML(item.details)}</p>
        ${item.photo ? `<a href="${escapeHTML(item.photo)}" target="_blank" rel="noopener">Open photo</a>` : ""}
      `
    },

    specialdates: {
      title: "Save Special Date",
      fields: inputField("Event name", "name", "Birthday, anniversary...") +
        inputField("Date", "date", "", "date") +
        textField("Details", "details", "A little reminder..."),
      key: "specialdates",
      render: item => `
        <strong>${escapeHTML(item.name)}</strong>
        <p>${escapeHTML(item.date)}</p>
        <p>${escapeHTML(item.details)}</p>
      `
    },

    daily: {
      title: "Daily Memory",
      fields: inputField("Today's title", "name", "Today was...") +
        textField("Your memory", "details", "Write about your day..."),
      key: "daily",
      render: item => `
        <strong>${escapeHTML(item.name)}</strong>
        <p>${escapeHTML(item.details)}</p>
      `
    },

    letters: {
      title: "Write a Secret Letter",
      fields: inputField("Letter title", "name", "A letter to...") +
        textField("Your letter", "details", "Write your personal letter..."),
      key: "letters",
      render: item => `
        <strong>${escapeHTML(item.name)}</strong>
        <p>${escapeHTML(item.details)}</p>
      `
    },

    questions: {
      title: "Add a Question",
      fields: textField("Question", "name", "What is your favourite memory with me?"),
      key: "questions",
      render: item => `<strong>${escapeHTML(item.name)}</strong>`
    },

    messages: {
      title: "Save a Sweet Message",
      fields: inputField("Message title", "name", "A little message") +
        textField("Message", "details", "Write something sweet..."),
      key: "messages",
      render: item => `
        <strong>${escapeHTML(item.name)}</strong>
        <p>${escapeHTML(item.details)}</p>
      `
    },

    specialnotes: {
      title: "Add a Special Note",
      fields: inputField("Title", "name", "A little note") +
        textField("Note", "details", "Write your note..."),
      key: "specialnotes",
      render: item => `
        <strong>${escapeHTML(item.name)}</strong>
        <p>${escapeHTML(item.details)}</p>
      `
    },

    video: {
      title: "Save a Video Link",
      fields: inputField("Video title", "name", "My favourite video") +
        inputField("Public video URL", "link", "https://...") +
        textField("Caption", "details", "Why do you like it?"),
      key: "videos",
      render: item => `
        <strong>${escapeHTML(item.name)}</strong>
        <p>${escapeHTML(item.details)}</p>
        ${item.link ? `<a href="${escapeHTML(item.link)}" target="_blank" rel="noopener">Open video</a>` : ""}
      `
    }
  };

  /* -----------------------------------------------------
     SAVED ITEM DISPLAY
  ----------------------------------------------------- */

  function renderSavedItems(container, key, renderer) {
    const items = ensureArray(key);

    if (!items.length) {
      container.innerHTML = `
        <div class="world-empty">
          <span>🌷</span>
          <p>Nothing here yet. Add your first one ♡</p>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(item => `
      <article class="world-saved-item">
        ${renderer(item)}
        <button class="world-delete-item" type="button"
          data-delete="${escapeHTML(item.id)}"
          data-key="${escapeHTML(key)}"
          aria-label="Delete">×</button>
      </article>
    `).join("");
  }

  function openSavedTool(toolId) {
    const config = toolConfigs[toolId];

    if (!config) {
      runSpecialTool(toolId);
      return;
    }

    submitForm(
      config.title,
      config.fields,
      values => {
        addItem(config.key, values);
      }
    );
  }

  function renderToolStorage(toolId, container) {
    const config = toolConfigs[toolId];
    if (!config) return;

    const key = config.key;

    renderSavedItems(container, key, config.render);
  }

  /* -----------------------------------------------------
     SPECIAL TOOLS
  ----------------------------------------------------- */

  const compliments = [
    "Your smile makes ordinary days feel special. ♡",
    "You have your own beautiful kind of magic. ✨",
    "You deserve all the happiness in the world.",
    "Never forget how special you are. 🌷",
    "Your little efforts matter more than you think.",
    "You make the world a little brighter.",
    "Keep being your lovely self. 💗"
  ];

  const mysteryMessages = [
    "Someone is lucky to have you in their life. 💌",
    "A beautiful surprise may be waiting for you.",
    "Take a moment to appreciate yourself today.",
    "Your next chapter can be your favourite one.",
    "A little kindness can change someone's day."
  ];

  const challenges = [
    "Take a photo of something beautiful today.",
    "Listen to a song you have never heard before.",
    "Write down three things that made you smile.",
    "Try a new outfit combination.",
    "Spend ten minutes doing something creative.",
    "Send someone a sweet message.",
    "Learn one new word today.",
    "Take a little break and enjoy the moment."
  ];

  const wouldYouRather = [
    ["Travel around the world", "Live in your dream city"],
    ["Receive flowers every week", "Receive handwritten letters"],
    ["A romantic dinner", "A surprise trip"],
    ["A beach holiday", "A mountain holiday"],
    ["Read minds", "See the future"],
    ["A big house", "A beautiful garden"],
    ["Always be early", "Never have to wait"],
    ["Explore a new country", "Return to your favourite place"]
  ];

  const emojiQuestions = [
    ["🌧️☕📖", "Rainy day"],
    ["🌙⭐💤", "Good night"],
    ["🍕🎬❤️", "Movie night"],
    ["🌸💐🎁", "Flowers and gifts"],
    ["✈️🌍🧳", "World travel"],
    ["🍰🎂🎉", "Birthday party"]
  ];

  function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function runSpecialTool(toolId) {
    switch (toolId) {
      case "stylequiz":
        openModal("Discover Your Style ♡", `
          <p>Choose the style that feels most like you.</p>
          <div class="world-choice-list">
            ${["Quiet minimal", "Soft romantic", "Modern street", "Classic chic", "Cute & playful", "Old money"].map(option => `
              <button class="world-choice" data-style="${escapeHTML(option)}">
                ${escapeHTML(option)}
              </button>
            `).join("")}
          </div>
        `);

        $$(".world-choice", modalBackdrop).forEach(button => {
          button.addEventListener("click", () => {
            const result = button.dataset.style;
            closeModal();
            notify("Your style mood: " + result + " ♡");
          });
        });
        break;

      case "challenge":
      case "randomchallenge":
      case "randomtask":
        openModal("Your Little Challenge 🌟", `
          <div class="world-surprise-message">
            ${escapeHTML(randomItem(challenges))}
          </div>
          <button class="world-feature-submit" id="newChallenge">
            Give me another one ♡
          </button>
        `);

        $("#newChallenge", modalBackdrop).addEventListener("click", () => {
          $(".world-surprise-message", modalBackdrop).textContent = randomItem(challenges);
          playSound("surprise");
        });
        break;

      case "compliment":
        openModal("A Little Compliment 🌸", `
          <div class="world-surprise-message">
            ${escapeHTML(randomItem(compliments))}
          </div>
          <button class="world-feature-submit" id="anotherCompliment">
            Another compliment ♡
          </button>
        `);

        $("#anotherCompliment", modalBackdrop).addEventListener("click", () => {
          $(".world-surprise-message", modalBackdrop).textContent = randomItem(compliments);
          playSound("surprise");
        });
        break;

      case "mystery":
      case "surprisebox":
        openModal("Your Mystery Surprise 🎁", `
          <div class="world-surprise-message">
            ${escapeHTML(randomItem(mysteryMessages))}
          </div>
          <button class="world-feature-submit" id="openAgain">
            Open another ♡
          </button>
        `);

        $("#openAgain", modalBackdrop).addEventListener("click", () => {
          $(".world-surprise-message", modalBackdrop).textContent = randomItem(mysteryMessages);
          playSound("surprise");
        });
        break;

      case "compatibility":
        submitForm("Love Compatibility 💕",
          inputField("Your name", "one", "Name") +
          inputField("Their name", "two", "Name"),
          values => {
            const combined = (values.one + values.two).toLowerCase();
            let number = 0;
            for (const char of combined) number += char.charCodeAt(0);
            const score = (number % 51) + 50;
            openModal("Your Fun Love Score 💗", `
              <div class="world-surprise-message">
                <strong>${score}%</strong>
                <p>This is just a fun game, not a real compatibility test. ♡</p>
              </div>
            `);
          },
          "Calculate ♡"
        );
        break;

      case "lovecalc":
        submitForm("Love Calculator 💘",
          inputField("First name", "one", "Your name") +
          inputField("Second name", "two", "Their name"),
          values => {
            let number = 0;
            for (const char of (values.one + values.two).toLowerCase()) {
              number += char.charCodeAt(0);
            }
            const score = (number % 51) + 50;

            openModal("Your Love Result 💗", `
              <div class="world-surprise-message">
                <strong>${score}%</strong>
                <p>Just for fun. Real relationships are about care and communication. ♡</p>
              </div>
            `);
          },
          "Calculate ♡"
        );
        break;

      case "wouldyourather":
        showWouldYouRather();
        break;

      case "emoji":
        showEmojiGame();
        break;

      case "reaction":
        showReactionGame();
        break;

      case "memorygame":
        showMemoryGame();
        break;

      case "drawing":
        showDrawingPad();
        break;

      case "moodtracker":
        showMoodTracker();
        break;

      case "countdown":
      case "loveCountdown":
        submitForm("Countdown ⏳",
          inputField("Event name", "name", "Special day") +
          inputField("Event date", "date", "", "date"),
          values => {
            const target = new Date(values.date + "T00:00:00");
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const days = Math.ceil((target - today) / 86400000);

            openModal("Your Countdown ♡", `
              <div class="world-surprise-message">
                <strong>${days >= 0 ? days : 0}</strong>
                <p>days until ${escapeHTML(values.name)}</p>
              </div>
            `);
          },
          "Calculate ♡"
        );
        break;

      default:
        notify("This feature is coming soon ♡");
    }
  }

  /* -----------------------------------------------------
     MINI GAMES
  ----------------------------------------------------- */

  function showWouldYouRather() {
    const question = randomItem(wouldYouRather);

    openModal("Would You Rather? 🤔", `
      <p>Choose one!</p>
      <div class="world-choice-list">
        <button class="world-choice" data-answer="0">${escapeHTML(question[0])}</button>
        <button class="world-choice" data-answer="1">${escapeHTML(question[1])}</button>
      </div>
      <p class="world-game-result" id="ratherResult"></p>
      <button class="world-feature-submit" id="nextRather">Next question</button>
    `);

    $$(".world-choice", modalBackdrop).forEach(button => {
      button.addEventListener("click", () => {
        $("#ratherResult", modalBackdrop).textContent =
          "Your choice: " + question[Number(button.dataset.answer)] + " ♡";
        playSound("save");
      });
    });

    $("#nextRather", modalBackdrop).addEventListener("click", showWouldYouRather);
  }

  function showEmojiGame() {
    const question = randomItem(emojiQuestions);

    openModal("Guess the Emoji 😆", `
      <div class="world-surprise-message">${escapeHTML(question[0])}</div>
      <form id="emojiAnswer" class="world-feature-form">
        ${inputField("Your answer", "answer", "Guess the phrase")}
        <button class="world-feature-submit">Check answer</button>
      </form>
      <p id="emojiResult" class="world-game-result"></p>
      <button class="world-small-action" id="newEmoji">New question</button>
    `);

    $("#emojiAnswer", modalBackdrop).addEventListener("submit", event => {
      event.preventDefault();
      const answer = new FormData(event.currentTarget).get("answer").trim().toLowerCase();
      const correct = question[1].toLowerCase();

      $("#emojiResult", modalBackdrop).textContent =
        answer === correct ? "Correct! Well done! 🎉" : "Not quite! Answer: " + question[1];

      playSound(answer === correct ? "win" : "click");
    });

    $("#newEmoji", modalBackdrop).addEventListener("click", showEmojiGame);
  }

  function showReactionGame() {
    openModal("Reaction Test ⚡", `
      <p id="reactionMessage">Press start and wait for green.</p>
      <button class="world-feature-submit" id="reactionStart">Start</button>
      <div class="world-reaction-area" id="reactionArea">Ready?</div>
      <p id="reactionResult" class="world-game-result"></p>
    `);

    const start = $("#reactionStart", modalBackdrop);
    const area = $("#reactionArea", modalBackdrop);
    const message = $("#reactionMessage", modalBackdrop);
    const result = $("#reactionResult", modalBackdrop);

    let timer = null;
    let startedAt = 0;
    let waiting = false;
    let finished = false;

    start.addEventListener("click", () => {
      clearTimeout(timer);
      result.textContent = "";
      finished = false;
      waiting = true;
      area.textContent = "Wait for green...";
      area.classList.remove("is-ready");
      message.textContent = "Don't click too early!";

      timer = setTimeout(() => {
        if (!modalBackdrop) return;
        area.textContent = "CLICK NOW!";
        area.classList.add("is-ready");
        startedAt = performance.now();
        waiting = false;
      }, 1200 + Math.random() * 3000);
    });

    area.addEventListener("click", () => {
      if (finished) return;

      if (waiting) {
        clearTimeout(timer);
        waiting = false;
        finished = true;
        result.textContent = "Too early! Try again.";
        area.textContent = "Try again";
        return;
      }

      if (startedAt) {
        finished = true;
        const score = Math.round(performance.now() - startedAt);
        result.textContent = "Your reaction time: " + score + " ms";
        playSound("win");
      }
    });
  }

  function showMemoryGame() {
    const emojis = ["🌸", "🌙", "🍓", "🦋", "🌈", "💗"];
    const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

    openModal("Memory Match 🧠", `
      <p>Find all matching pairs.</p>
      <div class="world-memory-grid">
        ${cards.map((emoji, index) => `
          <button class="world-memory-card" data-index="${index}" data-emoji="${emoji}">?</button>
        `).join("")}
      </div>
      <p id="memoryResult" class="world-game-result">Matched: 0 / 6</p>
    `);

    let first = null;
    let lock = false;
    let matched = 0;

    $$(".world-memory-card", modalBackdrop).forEach(card => {
      card.addEventListener("click", () => {
        if (lock || card.classList.contains("matched") || card === first) return;

        card.textContent = card.dataset.emoji;
        card.classList.add("flipped");

        if (!first) {
          first = card;
          return;
        }

        if (first.dataset.emoji === card.dataset.emoji) {
          first.classList.add("matched");
          card.classList.add("matched");
          first = null;
          matched++;

          $("#memoryResult", modalBackdrop).textContent = `Matched: ${matched} / 6`;

          if (matched === 6) {
            $("#memoryResult", modalBackdrop).textContent = "You won! 🎉";
            playSound("win");
          }
        } else {
          lock = true;
          const previous = first;
          first = null;

          setTimeout(() => {
            if (!modalBackdrop) return;
            previous.textContent = "?";
            card.textContent = "?";
            previous.classList.remove("flipped");
            card.classList.remove("flipped");
            lock = false;
          }, 750);
        }
      });
    });
  }

  /* -----------------------------------------------------
     DRAWING PAD
  ----------------------------------------------------- */

  function showDrawingPad() {
    openModal("Drawing Pad 🖌️", `
      <p>Draw something beautiful.</p>
      <div class="world-drawing-tools">
        <input type="color" id="drawingColor" value="#e879a7">
        <input type="range" id="drawingSize" min="1" max="25" value="4">
        <button class="world-small-action" id="clearDrawing">Clear</button>
        <button class="world-small-action" id="saveDrawing">Save drawing</button>
      </div>
      <div class="world-canvas-wrap">
        <canvas id="worldDrawingCanvas" width="650" height="360"></canvas>
      </div>
      <p class="world-muted">Saved drawing downloads as an image.</p>
    `);

    const canvas = $("#worldDrawingCanvas", modalBackdrop);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    let drawing = false;

    const position = event => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (event.clientX - rect.left) * (canvas.width / rect.width),
        y: (event.clientY - rect.top) * (canvas.height / rect.height)
      };
    };

    canvas.addEventListener("pointerdown", event => {
      drawing = true;
      canvas.setPointerCapture(event.pointerId);
      const point = position(event);
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    });

    canvas.addEventListener("pointermove", event => {
      if (!drawing) return;

      const point = position(event);
      ctx.strokeStyle = $("#drawingColor", modalBackdrop).value;
      ctx.lineWidth = $("#drawingSize", modalBackdrop).value;
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    });

    canvas.addEventListener("pointerup", () => drawing = false);
    canvas.addEventListener("pointercancel", () => drawing = false);

    $("#clearDrawing", modalBackdrop).addEventListener("click", () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    $("#saveDrawing", modalBackdrop).addEventListener("click", () => {
      const link = document.createElement("a");
      link.download = "sharmila-drawing.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      notify("Your drawing is ready ♡");
    });
  }

  /* -----------------------------------------------------
     MOOD TRACKER
  ----------------------------------------------------- */

  function showMoodTracker() {
    const moods = [
      ["😊", "Happy"],
      ["🥰", "Loved"],
      ["😌", "Calm"],
      ["😴", "Tired"],
      ["😢", "Sad"],
      ["😤", "Frustrated"]
    ];

    openModal("How are you feeling today? 🌈", `
      <div class="world-mood-options">
        ${moods.map(([emoji, name]) => `
          <button class="world-mood-option" data-mood="${escapeHTML(name)}">
            <span>${emoji}</span>
            ${escapeHTML(name)}
          </button>
        `).join("")}
      </div>
      <p id="moodResult" class="world-game-result"></p>
    `);

    $$(".world-mood-option", modalBackdrop).forEach(button => {
      button.addEventListener("click", () => {
        const mood = button.dataset.mood;
        addItem("moodHistory", { mood, date: new Date().toLocaleDateString() });
        $("#moodResult", modalBackdrop).textContent = "Mood saved: " + mood + " ♡";
        playSound("save");
      });
    });
  }

  /* -----------------------------------------------------
     RENDER FEATURE GROUPS
  ----------------------------------------------------- */

  function renderGroup(groupId, container) {
    const group = featureGroups[groupId];
    if (!group || !container) return;

    container.innerHTML = `
      <section class="extra-section">
        <div class="extra-heading">
          <div>
            <h2>${escapeHTML(group.title)}</h2>
            <p>${escapeHTML(group.subtitle)}</p>
          </div>
        </div>

        <div class="tool-grid">
          ${group.tools.map(([id, emoji, title, description]) => `
            <button class="tool-card" type="button" data-world-tool="${escapeHTML(id)}">
              <span class="tool-card-icon">${emoji}</span>
              <strong>${escapeHTML(title)}</strong>
              <small>${escapeHTML(description)}</small>
              <span class="tool-card-arrow">Open →</span>
            </button>
          `).join("")}
        </div>

        <div class="world-feature-storage" id="storage-${escapeHTML(groupId)}"></div>
      </section>
    `;

    group.tools.forEach(([id]) => {
      const config = toolConfigs[id];
      if (!config) return;

      const saved = ensureArray(config.key);
      if (!saved.length) return;

      const storage = $(`#storage-${groupId}`, container);
      if (!storage) return;

      const section = document.createElement("section");
      section.className = "world-storage-section";
      section.innerHTML = `
        <h3>${escapeHTML(config.title)}</h3>
        <div class="world-storage-list"></div>
      `;

      storage.appendChild(section);

      renderSavedItems(
        $(".world-storage-list", section),
        config.key,
        config.render
      );
    });
  }

  function renderAll() {
    const destinations = {
      fashion: "#fashionExtras",
      hobbies: "#hobbiesExtras",
      dreams: "#dreamsExtras",
      moments: "#momentsExtras",
      dating: "#datingExtras",
      play: "#playExtras"
    };

    Object.entries(destinations).forEach(([group, selector]) => {
      const container = $(selector);
      if (container) renderGroup(group, container);
    });

    const surprise = $("#surprise");
    if (surprise && !$("#surpriseExtras", surprise)) {
      const extra = document.createElement("div");
      extra.id = "surpriseExtras";
      surprise.appendChild(extra);
    }

    const surpriseContainer = $("#surpriseExtras");
    if (surpriseContainer) renderGroup("surprise", surpriseContainer);
  }

  /* -----------------------------------------------------
     EVENT HANDLERS
  ----------------------------------------------------- */

  document.addEventListener("click", event => {
    const toolButton = event.target.closest("[data-world-tool]");

    if (toolButton) {
      const toolId = toolButton.dataset.worldTool;
      openSavedTool(toolId);
      return;
    }

    const deleteButton = event.target.closest("[data-delete]");

    if (deleteButton) {
      const key = deleteButton.dataset.key;
      const id = deleteButton.dataset.delete;

      if (confirm("Delete this item?")) {
        removeItem(key, id);
        notify("Item deleted.");
      }
      return;
    }

    const completeButton = event.target.closest("[data-complete]");

    if (completeButton) {
      const id = completeButton.dataset.complete;

      Object.keys(database).forEach(key => {
        if (!Array.isArray(database[key])) return;

        const item = database[key].find(entry => entry.id === id);
        if (item) item.completed = !item.completed;
      });

      saveData(database);
      renderAll();
      notify("Updated ♡");
    }
  });

  /* -----------------------------------------------------
     INITIALIZATION
  ----------------------------------------------------- */

  function initialize() {
    renderAll();

    window.addEventListener("storage", event => {
      if (event.key === STORAGE_KEY) {
        database = readData();
        renderAll();
      }
    });

    window.WorldFeatures = {
      render: renderAll,
      addItem,
      getData: () => readData(),
      closeModal
    };

    console.log("Sharmila's Little World features loaded ♡");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

})();
