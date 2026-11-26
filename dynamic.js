
/* =========================================
   SHARMILA'S LITTLE WORLD
   NEPALI PREMIUM EXPERIENCE
   By Ganesh ♡
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const main = document.querySelector("main") || document.body;
  const nav = document.querySelector(".nav");

  if (!main || !nav) return;

  const $ = id => document.getElementById(id);

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;",
      '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  /* =====================================
     SOUND SYSTEM + DATING SONG
  ===================================== */

  let soundOn = localStorage.getItem("sharmilaSound") !== "off";

  const datingMusic = new Audio("music/dating-song.mp3");
  datingMusic.loop = true;
  datingMusic.volume = 0.35;

  let audioContext = null;
  let datingPrompt = null;

  function getAudio() {
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioClass) return null;

    if (!audioContext) audioContext = new AudioClass();

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    return audioContext;
  }

  function playTone(freq, duration = 0.35, volume = 0.045, type = "sine") {
    if (!soundOn) return;

    const ctx = getAudio();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration + 0.05);
  }

  function playClick() {
    playTone(587.33, 0.12, 0.025);
  }

  function playNepaliMelody() {
    if (!soundOn) return;

    const notes = [523.25, 587.33, 698.46, 783.99, 698.46, 587.33];

    notes.forEach((note, index) => {
      setTimeout(() => {
        if (soundOn) playTone(note, 0.65, 0.025, "sine");
      }, index * 350);
    });
  }

  function stopDateMusic() {
    datingMusic.pause();
    datingMusic.currentTime = 0;
  }

  function startDateMusic() {
    if (!soundOn) return;

    datingMusic.play().catch(() => {
      console.log("Click Sound ON to play dating music");
    });
  }

  function updateSoundButton() {
    const button = $("soundToggle");
    if (!button) return;

    button.textContent = soundOn ? "♫ Sound ON" : "♫ Muted";
    button.setAttribute("aria-pressed", String(soundOn));
  }

  /* =====================================
     DATING SOUND REMINDER POPUP
  ===================================== */

  function closeDatingPrompt() {
    if (datingPrompt) {
      datingPrompt.remove();
      datingPrompt = null;
    }
  }

  function showDatingPrompt() {

    if (soundOn || datingPrompt) return;

    datingPrompt = document.createElement("div");
    datingPrompt.id = "datingSoundPrompt";

    datingPrompt.innerHTML = `
      <div class="dating-sound-overlay">
        <div class="dating-sound-card">

          <div class="dating-sound-icon">🔇</div>

          <p class="dating-sound-eyebrow">
            A LITTLE MESSAGE ♡
          </p>

          <h2>Turn on the sound, babe!</h2>

          <p class="dating-sound-description">
            This little date is even sweeter with music.
            Would you like to turn the sound on? 💗
          </p>

          <button type="button" id="datingSoundOn">
            ♡ Turn On Sound
          </button>

          <button type="button" id="datingSoundLater">
            Maybe Later
          </button>

        </div>
      </div>
    `;

    const popupStyle = document.createElement("style");
    popupStyle.id = "datingSoundPromptStyle";

    popupStyle.textContent = `
      .dating-sound-overlay {
        position: fixed;
        inset: 0;
        z-index: 10000000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: rgba(65,35,48,.42);
        backdrop-filter: blur(5px);
      }

      .dating-sound-card {
        width: 100%;
        max-width: 380px;
        padding: 32px 24px;
        text-align: center;
        background: linear-gradient(145deg,#fffaf8,#fff0f5);
        border: 1px solid #f1cfda;
        border-radius: 25px;
        box-shadow: 0 15px 50px rgba(100,45,65,.2);
        animation: datingPopupIn .3s ease;
      }

      @keyframes datingPopupIn {
        from {
          opacity: 0;
          transform: translateY(15px) scale(.96);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .dating-sound-icon {
        font-size: 42px;
        margin-bottom: 12px;
      }

      .dating-sound-eyebrow {
        color: #c77c96;
        font-size: 10px;
        letter-spacing: 3px;
        font-weight: 700;
      }

      .dating-sound-card h2 {
        color: #75475a;
        font-family: 'Playfair Display',serif;
        font-size: 25px;
        margin: 13px 0;
      }

      .dating-sound-description {
        color: #987d87;
        font-size: 13px;
        line-height: 1.8;
        margin-bottom: 23px;
      }

      #datingSoundOn,
      #datingSoundLater {
        display: block;
        width: 100%;
        padding: 13px;
        border-radius: 25px;
        cursor: pointer;
        font-family: inherit;
        font-size: 13px;
        font-weight: 700;
      }

      #datingSoundOn {
        color: white;
        background: linear-gradient(135deg,#e89ab4,#c66f91);
        border: none;
        box-shadow: 0 5px 15px rgba(198,111,145,.2);
      }

      #datingSoundLater {
        margin-top: 10px;
        color: #a66b81;
        background: white;
        border: 1px solid #efd5df;
      }

      #datingSoundOn:hover,
      #datingSoundLater:hover {
        transform: translateY(-2px);
      }
    `;

    document.head.appendChild(popupStyle);
    document.body.appendChild(datingPrompt);

    datingPrompt.querySelector("#datingSoundOn")
      .addEventListener("click", () => {

        soundOn = true;
        localStorage.setItem("sharmilaSound", "on");

        updateSoundButton();
        closeDatingPrompt();

        if ($("dating")?.classList.contains("active")) {
          startDateMusic();
        }
      });

    datingPrompt.querySelector("#datingSoundLater")
      .addEventListener("click", closeDatingPrompt);
  }

  const soundButton = document.createElement("button");
  soundButton.id = "soundToggle";
  soundButton.className = "dynamic-sound-toggle";
  soundButton.type = "button";
  soundButton.textContent = soundOn ? "♫ Sound ON" : "♫ Muted";
  soundButton.setAttribute("aria-label", "Mute or unmute website sounds");

  document.body.appendChild(soundButton);

  soundButton.addEventListener("click", () => {

    soundOn = !soundOn;
    localStorage.setItem("sharmilaSound", soundOn ? "on" : "off");

    if (!soundOn) {
      stopDateMusic();

      if ($("dating")?.classList.contains("active")) {
        showDatingPrompt();
      }
    } else {
      closeDatingPrompt();
    }

    updateSoundButton();

    if (soundOn) {
      if ($("dating")?.classList.contains("active")) {
        startDateMusic();
      } else {
        playNepaliMelody();
      }
    }
  });

  /* =====================================
     CREATE MUSIC AND EXPLORE PAGES
  ===================================== */

  function createPage(id, title, subtitle) {
    let page = $(id);

    if (!page) {
      page = document.createElement("section");
      page.className = "page";
      page.id = id;

      page.innerHTML = `
        <div class="dynamic-section">
          <div class="dynamic-heading">
            <p class="eyebrow">A LITTLE WORLD OF YOUR OWN</p>
            <h2>${title}</h2>
            <p>${subtitle}</p>
          </div>
          <div id="${id}-content"></div>
        </div>
      `;

      main.appendChild(page);
    }

    return page;
  }

  const extraTabs = [
    { id: "music", label: "Music" },
    { id: "countries", label: "Explore" }
  ];

  extraTabs.forEach(tab => {
    if (nav.querySelector(`[data-dynamic-link="${tab.id}"]`)) return;

    const button = document.createElement("button");
    button.className = "nav-link dynamic-nav-link";
    button.type = "button";
    button.textContent = tab.label;
    button.dataset.page = tab.id;
    button.dataset.dynamicLink = tab.id;

    button.addEventListener("click", () => {
      if (typeof window.navigate === "function") {
        window.navigate(tab.id);
      }
    });

    nav.appendChild(button);
  });

  /* =====================================
     NAVIGATION HISTORY AND DATING MUSIC
  ===================================== */

  const originalNavigate = window.navigate;
  const history = [];

  function handleDatingSound() {

    if (!$("dating")?.classList.contains("active")) return;

    if (soundOn) {
      closeDatingPrompt();
      startDateMusic();
    } else {
      stopDateMusic();
      showDatingPrompt();
    }
  }

  if (typeof originalNavigate === "function") {
    window.navigate = function(id) {

      const current = document.querySelector(".page.active");

      if (current && current.id !== id) {
        history.push(current.id);
      }

      originalNavigate(id);

      if (id === "dating") {
        handleDatingSound();
      } else {
        closeDatingPrompt();
        stopDateMusic();
      }
    };
  }

  document.addEventListener("click", event => {

    const link = event.target.closest("[data-page]");
    if (!link || link.dataset.dynamicLink) return;

    const id = link.dataset.page;

    if (id === "dating") {
      setTimeout(handleDatingSound, 100);
    } else {
      closeDatingPrompt();
      stopDateMusic();
    }

  }, true);

  window.dynamicGoBack = function() {

    const previous = history.pop() || "home";

    if (typeof originalNavigate === "function") {
      originalNavigate(previous);
    }

    if (previous === "dating") {
      handleDatingSound();
    } else {
      closeDatingPrompt();
      stopDateMusic();
    }
  };

  /* =====================================
     BOTTOM BACK BUTTONS
  ===================================== */

  function addBackButtons() {

    document.querySelectorAll(".page").forEach(page => {

      if (page.id === "home") return;
      if (page.querySelector(".dynamic-back-wrap")) return;

      page.querySelectorAll("button, a").forEach(item => {
        if (/^(←\s*)?back(\s|$)/i.test(item.textContent.trim())) {
          item.remove();
        }
      });

      const wrap = document.createElement("div");
      wrap.className = "dynamic-back-wrap";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "dynamic-back-button";
      button.textContent = "← Back to previous page";

      button.addEventListener("click", () => {
        playClick();
        window.dynamicGoBack();
      });

      wrap.appendChild(button);
      page.appendChild(wrap);
    });
  }

  /* =====================================
     FASHION - NEPALI PREMIUM COLLECTIONS
  ===================================== */

  const fashionPage = $("fashion");

  if (fashionPage && !$("nepaliFashionStudio")) {

    const fashion = document.createElement("div");
    fashion.id = "nepaliFashionStudio";
    fashion.className = "dynamic-section";

    const nepaliBrands = [
      {
        name: "Traditional Alley",
        type: "Premium Nepali Ethnic Wear",
        description: "Kurtha, lehenga, saree sets, modern ethnic outfits and Dhaka collections.",
        url: "https://traditionalalley.com.np/",
        emoji: "🌸"
      },
      {
        name: "Kshitiza Fashion House",
        type: "Designer Couture",
        description: "Elegant traditional wear, bridal collections and special occasion outfits.",
        url: "https://kshitizafashion.com.np/",
        emoji: "👑"
      },
      {
        name: "PurbeliDhaka",
        type: "Authentic Dhaka Fashion",
        description: "Dhaka shawls, traditional dresses, Newari clothing and cultural designs.",
        url: "https://www.purbelidhaka.com/",
        emoji: "🧵"
      },
      {
        name: "PALASH",
        type: "Premium Boutique Fashion",
        description: "Saree sets, bridal couture, dresses and custom designs.",
        url: "https://palash.com.np/",
        emoji: "💗"
      },
      {
        name: "Nepali Heritage Wear",
        type: "Traditional Clothing",
        description: "Dhaka fabric, Haku Patasi, Gunyu Cholo and heritage-inspired outfits.",
        url: "https://www.nepalicultural-fashion.com/",
        emoji: "🇳🇵"
      }
    ];

    fashion.innerHTML = `
      <div class="dynamic-heading">
        <p class="eyebrow">MADE WITH NEPALI ELEGANCE</p>
        <h2>Her Nepali Fashion World 🇳🇵</h2>
        <p>Traditional beauty meets modern premium style.</p>
      </div>

      <div class="dynamic-card">
        <div class="dynamic-card-content">
          <h3>👗 Create Your Outfit</h3>
          <p>Choose a style and occasion for your outfit inspiration.</p>

          <label class="dynamic-label">Your style</label>
          <select class="dynamic-select" id="outfitMood">
            <option>Modern Nepali Elegance</option>
            <option>Traditional Newari Style</option>
            <option>Dhaka Modern Look</option>
            <option>Elegant Saree Style</option>
            <option>Soft Kurtha Look</option>
            <option>Premium Party Wear</option>
            <option>Minimal Ethnic Style</option>
          </select>

          <label class="dynamic-label">Occasion</label>
          <select class="dynamic-select" id="outfitOccasion">
            <option>Everyday</option>
            <option>Festival</option>
            <option>Wedding</option>
            <option>Date Night</option>
            <option>Party</option>
            <option>Family Celebration</option>
          </select>

          <button class="dynamic-btn" id="createOutfit" type="button">
            Create My Look ✨
          </button>

          <div id="outfitResult"></div>
        </div>
      </div>

      <div class="dynamic-heading">
        <h2>Premium Nepali Collections</h2>
        <p>Explore these Nepali fashion stores and designers.</p>
      </div>

      <div class="dynamic-grid">
        ${nepaliBrands.map(brand => `
          <article class="dynamic-card nepali-fashion-card">
            <div class="dynamic-card-content">
              <div class="nepali-fashion-emoji">${brand.emoji}</div>
              <h3>${brand.name}</h3>
              <p class="nepali-fashion-type">${brand.type}</p>
              <p>${brand.description}</p>
              <a class="dynamic-btn" href="${brand.url}"
                 target="_blank" rel="noopener">
                Explore Collection ↗
              </a>
            </div>
          </article>
        `).join("")}
      </div>
    `;

    fashionPage.appendChild(fashion);

    $("createOutfit").addEventListener("click", () => {

      const mood = $("outfitMood").value;
      const occasion = $("outfitOccasion").value;

      $("outfitResult").innerHTML = `
        <div class="dynamic-result">
          <p class="eyebrow">YOUR STYLE IDEA ♡</p>
          <h3>${esc(mood)}</h3>
          <p>A beautiful outfit idea for: ${esc(occasion)}</p>
          <a href="https://www.google.com/search?tbm=isch&q=${encodeURIComponent(mood + " " + occasion + " Nepali outfit")}"
             target="_blank" rel="noopener">
            See outfit inspiration ↗
          </a>
        </div>
      `;

      playNepaliMelody();
    });
  }

  /* =====================================
     MUSIC - APPLE SEARCH
  ===================================== */

  createPage(
    "music",
    "Her Music World ♫",
    "Discover songs, favourite artists and beautiful music."
  );

  const musicContent = $("music-content");

  function appleSearch(term, country) {
    return new Promise((resolve, reject) => {

      const callbackName =
        "sharmilaMusicCallback" + Date.now() + Math.floor(Math.random() * 1000);

      const script = document.createElement("script");

      const params = new URLSearchParams({
        term,
        entity: "song",
        limit: "16",
        country,
        callback: callbackName
      });

      script.src = "https://itunes.apple.com/search?" + params.toString();

      const cleanup = () => {
        delete window[callbackName];
        script.remove();
      };

      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error("Music search timed out"));
      }, 15000);

      window[callbackName] = data => {
        clearTimeout(timeout);
        cleanup();
        resolve(data);
      };

      script.onerror = () => {
        clearTimeout(timeout);
        cleanup();
        reject(new Error("Music service unavailable"));
      };

      document.body.appendChild(script);
    });
  }

  if (musicContent && !musicContent.dataset.ready) {

    musicContent.dataset.ready = "true";

    musicContent.innerHTML = `
      <div class="dynamic-card">
        <div class="dynamic-card-content">
          <h3>🎧 Find Your Favourite Music</h3>
          <p>Search song names, singers or bands.</p>

          <div class="dynamic-search-wrap">
            <input class="dynamic-search" id="musicSearch"
              placeholder="Taylor Swift, Arijit Singh...">
            <button class="dynamic-btn" id="searchMusic" type="button">
              Search ♡
            </button>
          </div>

          <div class="fashion-tag-list">
            ${["Taylor Swift", "Arijit Singh", "BTS", "Sushant KC", "Sajjan Raj Vaidya"].map(name => `
              <button class="fashion-tag music-quick" type="button"
                data-artist="${name}">${name}</button>
            `).join("")}
          </div>

          <div id="musicResults"></div>
          <p class="music-attribution">Song previews provided courtesy of iTunes.</p>
        </div>
      </div>
    `;

    async function searchMusic(queryValue) {

      const query = (queryValue || $("musicSearch").value).trim();
      const results = $("musicResults");

      if (!query) {
        results.innerHTML = '<p class="dynamic-empty">Enter a singer or song name ♡</p>';
        return;
      }

      $("musicSearch").value = query;
      results.innerHTML = '<p class="dynamic-loading">Finding your music ♫</p>';

      try {

        let data = await appleSearch(query, "us");

        if (!data.results?.length) {
          data = await appleSearch(query, "jp");
        }

        if (!data.results?.length) {
          results.innerHTML = `
            <p class="dynamic-empty">No preview found for this search.</p>
            <a class="dynamic-btn"
              href="https://www.youtube.com/results?search_query=${encodeURIComponent(query)}"
              target="_blank" rel="noopener">
              Find on YouTube ↗
            </a>
          `;
          return;
        }

        results.innerHTML = `
          <div class="music-results">
            ${data.results.map(song => {

              const artwork = (song.artworkUrl100 || "")
                .replace(/^http:/, "https:");

              const preview = (song.previewUrl || "")
                .replace(/^http:/, "https:");

              return `
                <article class="music-card">
                  <img src="${esc(artwork)}"
                    alt="Album cover" loading="lazy">

                  <div class="music-card-content">
                    <strong>${esc(song.trackName)}</strong>
                    <p>${esc(song.artistName)}</p>

                    ${preview ? `
                      <audio controls preload="none" src="${esc(preview)}"></audio>
                    ` : `<p>Preview unavailable.</p>`}

                    <a href="${esc(song.trackViewUrl || "https://www.youtube.com/results?search_query=" + encodeURIComponent(song.trackName + " " + song.artistName))}"
                      target="_blank" rel="noopener">
                      Open full song ↗
                    </a>
                  </div>
                </article>
              `;
            }).join("")}
          </div>
        `;

      } catch (error) {

        console.error(error);

        results.innerHTML = `
          <p class="dynamic-empty">
            Music service could not connect. You can still search directly:
          </p>
          <a class="dynamic-btn"
            href="https://www.youtube.com/results?search_query=${encodeURIComponent(query)}"
            target="_blank" rel="noopener">
            Search YouTube ↗
          </a>
        `;
      }
    }

    $("searchMusic").addEventListener("click", () => searchMusic());

    $("musicSearch").addEventListener("keydown", event => {
      if (event.key === "Enter") searchMusic();
    });

    musicContent.querySelectorAll(".music-quick").forEach(button => {
      button.addEventListener("click", () => {
        searchMusic(button.dataset.artist);
      });
    });
  }

  /* =====================================
     COUNTRY DATABASE
  ===================================== */

  createPage(
    "countries",
    "The World Is Yours 🌍",
    "Discover beautiful countries, their culture and dream destinations."
  );

  const countryContent = $("countries-content");

  const countryAliases = {
    "korea": "South Korea",
    "republic of korea": "South Korea",
    "korea republic of": "South Korea",
    "north korea": "North Korea",
    "usa": "United States",
    "us": "United States",
    "america": "United States",
    "united states of america": "United States",
    "uk": "United Kingdom",
    "britain": "United Kingdom",
    "great britain": "United Kingdom",
    "england": "United Kingdom",
    "uae": "United Arab Emirates",
    "holland": "Netherlands",
    "turkey": "Türkiye",
    "burma": "Myanmar",
    "czech republic": "Czechia",
    "ivory coast": "Côte d'Ivoire",
    "russia": "Russia",
    "laos": "Laos",
    "vietnam": "Vietnam",
    "iran": "Iran",
    "bolivia": "Bolivia",
    "tanzania": "Tanzania",
    "syria": "Syria",
    "moldova": "Moldova",
    "brunei": "Brunei",
    "cape verde": "Cape Verde",
    "swaziland": "Eswatini",
    "macedonia": "North Macedonia",
    "vatican": "Vatican City",
    "holy see": "Vatican City",
    "palestine": "Palestine"
  };

  function normalizeCountryName(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  }

  let countryDatabasePromise = null;

  async function loadCountryDatabase() {

    if (!countryDatabasePromise) {

      countryDatabasePromise = fetch(
        "https://cdn.jsdelivr.net/npm/world-countries@5.1.0/countries.json"
      )
        .then(response => {
          if (!response.ok) {
            throw new Error("Could not download country database");
          }
          return response.json();
        })
        .then(data => {
          if (!Array.isArray(data) || !data.length) {
            throw new Error("Country database is empty");
          }
          return data;
        })
        .catch(error => {
          countryDatabasePromise = null;
          throw error;
        });
    }

    return countryDatabasePromise;
  }

  function normalizeCountry(country) {

    const currencyList = Object.values(country.currencies || {})
      .map(item => {
        if (typeof item === "string") return item;
        return item.name || item.symbol || "";
      })
      .filter(Boolean);

    const languageList = Object.values(country.languages || {})
      .filter(Boolean);

    const countryCode = String(country.cca2 || "").toLowerCase();

    return {
      name: country.name?.common || "",
      official: country.name?.official || country.name?.common || "",
      capital: Array.isArray(country.capital)
        ? country.capital.join(", ")
        : country.capital || "",
      region: country.region || "",
      population: null,
      flag: countryCode
        ? `https://flagcdn.com/w320/${countryCode}.png`
        : "",
      flagEmoji: country.flag || "",
      currencies: currencyList,
      languages: languageList,
      altSpellings: country.altSpellings || [],
      code: country.cca2 || ""
    };
  }

  async function getCountry(query) {

    const input = query.trim();

    const alias = countryAliases[input.toLowerCase()];
    const searchName = alias || input;

    const allCountries = await loadCountryDatabase();

    const normal = normalizeCountryName(searchName);

    function getNames(country) {
      return [
        country.name?.common,
        country.name?.official,
        ...(country.altSpellings || [])
      ]
        .filter(Boolean)
        .map(normalizeCountryName);
    }

    let matches = allCountries.filter(country =>
      getNames(country).includes(normal)
    );

    if (!matches.length) {
      matches = allCountries.filter(country =>
        getNames(country).some(name =>
          name.startsWith(normal) || normal.startsWith(name)
        )
      );
    }

    if (!matches.length) {
      matches = allCountries.filter(country =>
        getNames(country).some(name => name.includes(normal))
      );
    }

    return matches.map(normalizeCountry);
  }

  /* =====================================
     COUNTRY PHOTOS
  ===================================== */

  async function getCountryPhotos(countryName) {

    const countryKey = normalizeCountryName(countryName);

    const destinationSearches = {
      southkorea: [
        "South Korea Jeju Island beautiful landscape",
        "South Korea N Seoul Tower night view",
        "South Korea Busan Haeundae beach",
        "South Korea Gyeongbokgung Palace",
        "South Korea scenic travel destination"
      ],
      japan: [
        "Japan Mount Fuji cherry blossoms",
        "Japan Kyoto Arashiyama beautiful scenery",
        "Japan Tokyo night skyline",
        "Japan Okinawa beautiful beach"
      ],
      nepal: [
        "Nepal Pokhara Phewa Lake mountains",
        "Nepal Himalayas beautiful landscape",
        "Nepal Kathmandu heritage architecture",
        "Nepal Mustang scenic landscape"
      ],
      italy: [
        "Italy Amalfi Coast beautiful scenery",
        "Italy Venice Grand Canal",
        "Italy Lake Como landscape",
        "Italy Florence city view"
      ],
      france: [
        "France Paris Eiffel Tower sunset",
        "France French Riviera beautiful coast",
        "France lavender fields Provence",
        "France Annecy lake scenery"
      ],
      switzerland: [
        "Switzerland Lauterbrunnen valley",
        "Switzerland Grindelwald mountain",
        "Switzerland Lake Brienz",
        "Switzerland Zermatt Matterhorn"
      ],
      maldives: [
        "Maldives tropical island aerial view",
        "Maldives turquoise water beach",
        "Maldives luxury overwater villas",
        "Maldives sunset beach"
      ],
      thailand: [
        "Thailand Phuket beautiful beach",
        "Thailand Krabi limestone cliffs",
        "Thailand Phi Phi islands",
        "Thailand Chiang Mai landscape"
      ]
    };

    const searches = destinationSearches[countryKey] || [
      countryName + " beautiful scenic landscape",
      countryName + " famous tourist attractions",
      countryName + " romantic sunset viewpoint",
      countryName + " beautiful beach nature",
      countryName + " city night view"
    ];

    const collected = [];
    const seen = new Set();

    for (const searchTerm of searches) {

      if (collected.length >= 8) break;

      try {

        const params = new URLSearchParams({
          action: "query",
          generator: "search",
          gsrsearch: searchTerm,
          gsrnamespace: "6",
          gsrlimit: "12",
          prop: "imageinfo",
          iiprop: "url|size|mime",
          iiurlwidth: "900",
          format: "json",
          origin: "*"
        });

        const response = await fetch(
          "https://commons.wikimedia.org/w/api.php?" + params.toString()
        );

        if (!response.ok) continue;

        const data = await response.json();
        const pages = Object.values(data.query?.pages || {});

        pages.forEach(page => {

          const info = page.imageinfo?.[0];
          if (!info) return;

          const imageUrl = info.thumburl || info.url;
          if (!imageUrl || seen.has(imageUrl)) return;

          const width = Number(info.width || 0);
          const height = Number(info.height || 0);
          const mime = info.mime || "";

          if (width < 700 || height < 400) return;
          if (width / height < 1.15) return;
          if (!["image/jpeg", "image/png", "image/webp"].includes(mime)) return;

          seen.add(imageUrl);

          collected.push({
            title: page.title
              .replace(/^File:/, "")
              .replace(/\.[^.]+$/, "")
              .replace(/_/g, " "),
            image: imageUrl
          });
        });

      } catch (error) {
        console.log("Photo search failed:", searchTerm, error);
      }
    }

    return collected.slice(0, 8);
  }

  /* =====================================
     COUNTRY SEARCH PAGE
  ===================================== */

  if (countryContent && !countryContent.dataset.ready) {

    countryContent.dataset.ready = "true";

    countryContent.innerHTML = `
      <div class="dynamic-card">
        <div class="dynamic-card-content">
          <h3>✈️ Choose Your Dream Destination</h3>
          <p>Search any country in the world to see its flag, information and beautiful places.</p>

          <div class="dynamic-search-wrap">
            <input class="dynamic-search" id="countrySearch"
              placeholder="Japan, Nepal, Italy, Korea...">
            <button class="dynamic-btn" id="searchCountry" type="button">
              Explore ♡
            </button>
          </div>

          <div class="fashion-tag-list">
            ${[
              "Japan", "South Korea", "Italy", "Switzerland",
              "France", "Nepal", "Australia", "Maldives",
              "United States", "United Kingdom", "Thailand",
              "Singapore", "Canada", "Germany", "India"
            ].map(country => `
              <button class="fashion-tag country-quick"
                type="button" data-country="${country}">
                ${country}
              </button>
            `).join("")}
          </div>

          <div id="countryResults"></div>
        </div>
      </div>
    `;

    async function searchCountry(queryValue) {

      const query = (queryValue || $("countrySearch").value).trim();
      const results = $("countryResults");

      if (!query) {
        results.innerHTML =
          '<p class="dynamic-empty">Enter a country name first ♡</p>';
        return;
      }

      $("countrySearch").value = query;

      results.innerHTML =
        '<p class="dynamic-loading">Exploring the world 🌍</p>';

      try {

        const countries = await getCountry(query);

        if (!countries.length) {
          results.innerHTML = `
            <p class="dynamic-empty">
              No country found for "${esc(query)}".
              Please check the spelling and try again.
            </p>
          `;
          return;
        }

        if (countries.length > 1) {

          results.innerHTML = `
            <div class="dynamic-result">
              <p class="eyebrow">COUNTRY SEARCH RESULTS ♡</p>
              <h3>Which country did you mean?</h3>
              <div class="fashion-tag-list">
                ${countries.slice(0, 20).map((country, index) => `
                  <button
                    class="fashion-tag country-choice"
                    type="button"
                    data-country-index="${index}">
                    ${esc(country.name)}
                  </button>
                `).join("")}
              </div>
            </div>
          `;

          results.querySelectorAll(".country-choice").forEach(button => {
            button.addEventListener("click", () => {
              const index = Number(button.dataset.countryIndex);
              showCountryDetail(countries[index]);
            });
          });

          return;
        }

        await showCountryDetail(countries[0]);

      } catch (error) {

        console.error("Country search error:", error);

        results.innerHTML = `
          <p class="dynamic-empty">
            We couldn't connect to the country database.
            Please check your internet connection and try again.
          </p>

          <a class="dynamic-btn"
            href="https://www.google.com/search?q=${encodeURIComponent(query + " country information")}"
            target="_blank" rel="noopener">
            Search country online ↗
          </a>
        `;
      }
    }

    async function showCountryDetail(country) {

      const results = $("countryResults");

      if (!results || !country) return;

      const name = country.name || "Unknown country";
      const official = country.official || name;
      const flag = country.flag || "";
      const capital = country.capital || "Not available";

      const languages = country.languages?.length
        ? country.languages.join(", ")
        : "Not available";

      const currency = country.currencies?.length
        ? country.currencies.join(", ")
        : "Not available";

      const population = country.population
        ? Number(country.population).toLocaleString()
        : "Not available";

      results.innerHTML = `
        <div class="country-banner">

          ${flag ? `
            <img class="country-flag-image"
              src="${esc(flag)}"
              alt="${esc(name)} flag"
              onerror="this.style.display='none'">
          ` : `
            <div style="font-size:55px">${esc(country.flagEmoji || "🌍")}</div>
          `}

          <h2>${esc(name)}</h2>
          <p>${esc(official)}</p>
        </div>

        <div class="country-info-grid">

          <div class="country-info">
            <small>🏙️ Capital</small>
            <strong>${esc(capital)}</strong>
          </div>

          <div class="country-info">
            <small>🌎 Region</small>
            <strong>${esc(country.region || "Not available")}</strong>
          </div>

          <div class="country-info">
            <small>👥 Population</small>
            <strong>${esc(population)}</strong>
          </div>

          <div class="country-info">
            <small>💰 Currency</small>
            <strong>${esc(currency)}</strong>
          </div>

          <div class="country-info">
            <small>🗣️ Languages</small>
            <strong>${esc(languages)}</strong>
          </div>

        </div>

        <div class="country-photo-heading">
          <h3>♡ Beautiful Places & Date Destinations</h3>
          <p>Dream views, romantic spots and beautiful places to visit together.</p>
        </div>

        <div id="countryPhotos" class="country-photo-grid">
          <p class="dynamic-loading">Finding beautiful photos...</p>
        </div>

        <a class="dynamic-btn"
          href="https://www.google.com/search?tbm=isch&q=${encodeURIComponent(name + " beautiful romantic places travel")}"
          target="_blank" rel="noopener">
          More beautiful places ↗
        </a>
      `;

      try {

        const photos = await getCountryPhotos(name);
        const photoHost = $("countryPhotos");

        if (!photoHost) return;

        if (photos.length) {

          photoHost.innerHTML = photos.map(photo => `
            <article class="country-photo">
              <img
                src="${esc(photo.image)}"
                alt="${esc(photo.title)}"
                loading="lazy"
                onerror="this.style.display='none'">

              <p>${esc(photo.title)}</p>
            </article>
          `).join("");

        } else {

          photoHost.innerHTML = `
            <p class="dynamic-empty">
              Photos are unavailable right now.
              Use the More beautiful places link.
            </p>
          `;
        }

      } catch (photoError) {

        console.log("Country photo error:", photoError);

        const photoHost = $("countryPhotos");

        if (photoHost) {
          photoHost.innerHTML = `
            <p class="dynamic-empty">
              Photo search is temporarily unavailable.
              Please try again later ♡
            </p>
          `;
        }
      }

      playNepaliMelody();
    }

    $("searchCountry").addEventListener("click", () => searchCountry());

    $("countrySearch").addEventListener("keydown", event => {
      if (event.key === "Enter") searchCountry();
    });

    countryContent.querySelectorAll(".country-quick").forEach(button => {
      button.addEventListener("click", () => {
        searchCountry(button.dataset.country);
      });
    });
  }

  /* =====================================
     DATING QUESTION - SPECIAL SURPRISE
  ===================================== */

  function createDatingQuestion() {

    const datingPage = $("dating");

    if (!datingPage || $("datingQuestion")) return;

    const box = document.createElement("div");
    box.id = "datingQuestion";

    box.innerHTML = `
      <div class="date-question-card">

        <p class="date-question-small">
          A LITTLE QUESTION FOR YOU ♡
        </p>

        <h2>Do you want to go on a date with me? 🥺</h2>

        <p class="date-question-sub">
          I have something special to ask you...
        </p>

        <div class="date-question-buttons">

          <button type="button" id="dateYes">
            1. YES ❤️
          </button>

          <button type="button" id="dateNo">
            2. NO 🙈
          </button>

        </div>

        <p id="dateAnswer"></p>

      </div>
    `;

    const style = document.createElement("style");

    style.textContent = `
      #datingQuestion {
        width: 100%;
        margin: 25px auto;
        padding: 15px;
        box-sizing: border-box;
      }

      .date-question-card {
        position: relative;
        overflow: hidden;
        text-align: center;
        padding: 35px 20px;
        border-radius: 22px;
        background: linear-gradient(135deg, #fff0f6, #fff9f2);
        border: 1px solid #f5c6d9;
        box-shadow: 0 10px 30px rgba(214, 90, 145, 0.12);
      }

      .date-question-small {
        color: #d65a91;
        letter-spacing: 3px;
        font-size: 11px;
        font-weight: bold;
      }

      .date-question-card h2 {
        color: #9d456e;
        font-size: clamp(22px, 4vw, 32px);
        margin: 15px 0;
      }

      .date-question-sub {
        color: #987487;
        font-size: 14px;
      }

      .date-question-buttons {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 18px;
        min-height: 110px;
        margin-top: 20px;
      }

      .date-question-buttons button {
        border: none;
        border-radius: 30px;
        padding: 14px 27px;
        font-size: 15px;
        font-weight: bold;
        cursor: pointer;
        transition: left 0.18s ease, top 0.18s ease,
                    transform 0.2s ease;
        touch-action: manipulation;
      }

      #dateYes {
        color: white;
        background: #e66b9d;
        box-shadow: 0 5px 15px #e66b9d55;
      }

      #dateYes:hover {
        transform: scale(1.08);
      }

      #dateNo {
        color: #a15d7b;
        background: white;
        border: 1px solid #edbfd2;
        position: relative;
        z-index: 2;
      }

      #dateAnswer {
        color: #d65a91;
        font-weight: bold;
        font-size: 18px;
        margin-top: 20px;
      }

      @media (max-width: 480px) {
        .date-question-card {
          padding: 28px 12px;
        }

        .date-question-buttons {
          gap: 10px;
          min-height: 120px;
        }

        .date-question-buttons button {
          padding: 12px 19px;
          font-size: 13px;
        }
      }
    `;

    document.head.appendChild(style);
    datingPage.prepend(box);

    const noButton = $("dateNo");
    const yesButton = $("dateYes");
    const answer = $("dateAnswer");
    const buttonArea = box.querySelector(".date-question-buttons");

    function moveNoButton() {

      const maxX = Math.max(
        0,
        buttonArea.clientWidth - noButton.offsetWidth
      );

      const maxY = Math.max(
        0,
        buttonArea.clientHeight - noButton.offsetHeight
      );

      noButton.style.position = "absolute";
      noButton.style.left = Math.random() * maxX + "px";
      noButton.style.top = Math.random() * maxY + "px";
    }

    noButton.addEventListener("pointerenter", moveNoButton);

    noButton.addEventListener("pointerdown", event => {
      event.preventDefault();
      moveNoButton();
    });

    noButton.addEventListener("click", event => {
      event.preventDefault();
      moveNoButton();
    });

    yesButton.addEventListener("click", () => {

      answer.innerHTML =
        "Yayyy! ❤️ I knew you would say YES! 🥰💕";

      playNepaliMelody();

      yesButton.textContent = "YES! ❤️";
      yesButton.disabled = true;
    });
  }

  createDatingQuestion();

  /* =====================================
     GENERAL BUTTON SOUNDS
  ===================================== */

  document.addEventListener("click", event => {

    const button = event.target.closest("button");

    if (!button ||
        button.id === "soundToggle" ||
        button.classList.contains("dynamic-back-button") ||
        button.id === "datingSoundOn" ||
        button.id === "datingSoundLater") return;

    if (button.hasAttribute("data-surprise")) {
      playNepaliMelody();
    } else {
      playClick();
    }
  });

  /* =====================================
     FINAL SETUP
  ===================================== */

  updateSoundButton();
  addBackButtons();

  console.log("Sharmila's Nepali Premium World loaded ♡");

});
