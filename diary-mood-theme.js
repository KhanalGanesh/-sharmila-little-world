
/* =========================================
   MY LITTLE DIARY - MOOD THEMES
   Changes Diary appearance based on mood
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const diary = document.getElementById("diary");
  if (!diary) return;

  const moods = {
    happy: {
      background: "linear-gradient(145deg,#fff8d9,#ffedb5,#fff4d9)",
      card: "#fffdf3",
      text: "#94652e",
      accent: "#e6a83e",
      border: "#f5dda5",
      glow: "rgba(239,183,75,.16)"
    },

    calm: {
      background: "linear-gradient(145deg,#eff9f0,#dcefe2,#edf8ef)",
      card: "#fafffa",
      text: "#47765a",
      accent: "#75a987",
      border: "#d0e7d6",
      glow: "rgba(99,166,121,.14)"
    },

    tired: {
      background: "linear-gradient(145deg,#f2efff,#e5e2f8,#f5f0ff)",
      card: "#fcfbff",
      text: "#6d6795",
      accent: "#9990c9",
      border: "#ded9f2",
      glow: "rgba(143,132,195,.15)"
    },

    sad: {
      background: "linear-gradient(145deg,#edf5ff,#dceafa,#eaf2fc)",
      card: "#fafdff",
      text: "#527397",
      accent: "#789fc9",
      border: "#d1e1f2",
      glow: "rgba(104,151,199,.16)"
    },

    excited: {
      background: "linear-gradient(145deg,#fff0f5,#ffe0eb,#fff0f7)",
      card: "#fffafd",
      text: "#a95278",
      accent: "#df83a8",
      border: "#f5d1e0",
      glow: "rgba(222,119,163,.16)"
    }
  };

  const style = document.createElement("style");
  style.id = "diaryMoodThemeStyles";

  style.textContent = `
    #diary {
      transition: background  .45s ease,
                  color .45s ease,
                  border-color .45s ease;
      border-radius: 22px;
      padding: 18px;
    }

    #diary[data-diary-mood] {
      background: var(--diary-bg);
    }

    #diary[data-diary-mood] h1,
    #diary[data-diary-mood] h2,
    #diary[data-diary-mood] h3,
    #diary[data-diary-mood] p,
    #diary[data-diary-mood] label {
      transition: color .4s ease;
    }

    #diary[data-diary-mood] h1,
    #diary[data-diary-mood] h2,
    #diary[data-diary-mood] h3,
    #diary[data-diary-mood] p {
      color: var(--diary-text);
    }

    #diary[data-diary-mood] input,
    #diary[data-diary-mood] textarea,
    #diary[data-diary-mood] .form-card,
    #diary[data-diary-mood] .result-box,
    #diary[data-diary-mood] .diary-entry {
      background: var(--diary-card);
      border-color: var(--diary-border);
      transition: all .4s ease;
    }

    #diary [data-mood] {
      transition: all .25s ease;
      border-radius: 18px;
    }

    #diary [data-mood].diary-mood-active {
      background: var(--diary-accent) !important;
      color: white !important;
      border-color: var(--diary-accent) !important;
      box-shadow: 0 5px 16px var(--diary-glow);
      transform: translateY(-2px) scale(1.04);
    }

    #diary .diary-theme-message {
      margin: 12px 0;
      padding: 10px 14px;
      border-radius: 14px;
      background: var(--diary-card);
      color: var(--diary-text);
      border: 1px solid var(--diary-border);
      font-size: 12px;
      text-align: center;
      animation: diaryMoodAppear .4s ease;
    }

    @keyframes diaryMoodAppear {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

  document.head.appendChild(style);

  const messages = {
    happy: "A little sunshine for your beautiful day ☀️",
    calm: "Take a breath. Enjoy your peaceful moment 🌿",
    tired: "Rest is productive too. Take it easy tonight 🌙",
    sad: "It's okay to have rainy days. Be gentle with yourself 🌧️",
    excited: "Your happiness deserves a little sparkle ✨"
  };

  let message = diary.querySelector(".diary-theme-message");

  if (!message) {
    message = document.createElement("div");
    message.className = "diary-theme-message";

    const moodButtons = diary.querySelector("[data-mood]");

    if (moodButtons) {
      moodButtons.parentElement.insertBefore(
        message,
        moodButtons
      );
    }
  }

  function applyMoodTheme(mood) {
    const theme = moods[mood];
    if (!theme) return;

    diary.dataset.diaryMood = mood;

    diary.style.setProperty("--diary-bg", theme.background);
    diary.style.setProperty("--diary-card", theme.card);
    diary.style.setProperty("--diary-text", theme.text);
    diary.style.setProperty("--diary-accent", theme.accent);
    diary.style.setProperty("--diary-border", theme.border);
    diary.style.setProperty("--diary-glow", theme.glow);

    diary.querySelectorAll("[data-mood]").forEach(button => {
      const selected = button.dataset.mood.toLowerCase() === mood;

      button.classList.toggle("diary-mood-active", selected);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    });

    message.textContent = messages[mood];
  }

  diary.addEventListener("click", event => {
    const button = event.target.closest("[data-mood]");
    if (!button || !diary.contains(button)) return;

    const mood = button.dataset.mood.toLowerCase();

    applyMoodTheme(mood);
  });

  // Restore today's selected mood if it is already saved.
  const savedMood = localStorage.getItem("sharmilaDiaryMood");

  if (savedMood && moods[savedMood]) {
    applyMoodTheme(savedMood);
  }

  diary.addEventListener("click", event => {
    const button = event.target.closest("[data-mood]");
    if (!button || !diary.contains(button)) return;

    const mood = button.dataset.mood.toLowerCase();

    if (moods[mood]) {
      localStorage.setItem("sharmilaDiaryMood", mood);
    }
  });
});
