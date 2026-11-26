
/* =========================================
   SHARMILA'S LITTLE WORLD
   PLAY & DISCOVER — 25 MINI GAMES
   Separate module. Does not replace script.js.
========================================= */

(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const page = document.getElementById("play");
    if (!page || page.dataset.gamesReady === "true") return;
    page.dataset.gamesReady = "true";

    const oldCard = page.querySelector(".form-card");
    if (!oldCard) return;

    const oldShare = oldCard.querySelector('[data-share="play"]')?.closest("label");
    const oldResult = oldCard.querySelector("#playResult");

    oldCard.innerHTML = `
      <div class="pg-topline">
        <span class="pg-mini-label">A LITTLE FUN CORNER ♡</span>
        <span class="pg-count">25 little activities</span>
      </div>
      <div id="pgHome">
        <div class="pg-welcome">
          <div class="pg-welcome-icon">🎀</div>
          <h2>What shall we play today?</h2>
          <p>Pick a little game, have fun and discover something new about yourself.</p>
        </div>
        <div class="pg-tools">
          <input id="pgSearch" type="search" placeholder="Search games...">
          <select id="pgCategory">
            <option value="all">All activities</option>
            <option value="quiz">Quizzes</option>
            <option value="love">Love & friendship</option>
            <option value="puzzle">Puzzles</option>
            <option value="fun">Just for fun</option>
          </select>
        </div>
        <div class="pg-progress" id="pgProgress"></div>
        <div class="pg-grid" id="pgGrid"></div>
      </div>
      <div id="pgGame" class="pg-game-view" hidden></div>
      <div id="pgToast" class="pg-toast" role="status"></div>
      <div id="pgShareResult" hidden></div>
    `;

    if (oldShare) oldCard.appendChild(oldShare);
    if (oldResult) oldCard.appendChild(oldResult);

    const $ = id => document.getElementById(id);
    const home = $("pgHome");
    const gameView = $("pgGame");
    const grid = $("pgGrid");
    const search = $("pgSearch");
    const category = $("pgCategory");
    const progress = $("pgProgress");
    const toast = $("pgToast");

    const STORE = "sharmilaPlayGames_v1";
    let saved = {};

    try {
      saved = JSON.parse(localStorage.getItem(STORE) || "{}");
    } catch {
      saved = {};
    }

    let currentGame = null;
    let reactionTimer = null;
    let reactionStart = 0;
    let reactionReady = false;
    let memoryCards = [];
    let memoryOpen = [];
    let memoryMatched = [];
    let memoryMoves = 0;
    let quizAnswers = [];

    const games = [
      { id:"this-that", name:"This or That", icon:"💗", category:"fun", desc:"Choose between two lovely options." },
      { id:"would-rather", name:"Would You Rather", icon:"🤔", category:"fun", desc:"Make a difficult little choice." },
      { id:"truth-dare", name:"Truth or Dare", icon:"🎯", category:"fun", desc:"Pick truth or take a fun dare." },
      { id:"never-ever", name:"Never Have I Ever", icon:"🙈", category:"fun", desc:"Discover which experiences are yours." },
      { id:"lucky-spin", name:"Lucky Spin", icon:"🎡", category:"fun", desc:"Let a little wheel choose for you." },
      { id:"magic-ball", name:"Magic 8 Ball", icon:"🔮", category:"fun", desc:"Ask a question and reveal a little answer." },
      { id:"personality", name:"Personality Test", icon:"🌷", category:"quiz", desc:"Find your fun personality type." },
      { id:"know-me", name:"How Well Do You Know Me?", icon:"🫶", category:"love", desc:"A little quiz about your favourites." },
      { id:"love-quiz", name:"Love Compatibility Quiz", icon:"💕", category:"love", desc:"Explore your relationship style." },
      { id:"best-friend", name:"Best Friend Quiz", icon:"👯", category:"love", desc:"Test how well someone knows you." },
      { id:"introvert", name:"Introvert or Extrovert?", icon:"🌙", category:"quiz", desc:"Discover your social energy style." },
      { id:"mood", name:"Mood Quiz", icon:"☁️", category:"quiz", desc:"Find a little description of your mood." },
      { id:"memory", name:"Memory Match", icon:"🧠", category:"puzzle", desc:"Match all the hidden pairs." },
      { id:"emoji", name:"Guess the Emoji", icon:"😎", category:"puzzle", desc:"Decode the emoji clues." },
      { id:"movie", name:"Guess the Movie", icon:"🎬", category:"puzzle", desc:"Guess a movie from its clue." },
      { id:"song", name:"Guess the Song", icon:"🎵", category:"puzzle", desc:"Guess the song from its hint." },
      { id:"scramble", name:"Word Scramble", icon:"🔤", category:"puzzle", desc:"Unscramble the mixed-up word." },
      { id:"difference", name:"Find the Difference", icon:"🔍", category:"puzzle", desc:"Spot the different symbol." },
      { id:"reaction", name:"Reaction Speed Test", icon:"⚡", category:"puzzle", desc:"Test how quickly you can react." },
      { id:"calculator", name:"Love Calculator", icon:"💘", category:"love", desc:"A playful name-based love score." },
      { id:"challenge", name:"Daily Challenge", icon:"🌟", category:"fun", desc:"Get a tiny challenge for today." },
      { id:"compliment", name:"Random Compliment", icon:"🌸", category:"fun", desc:"Receive a little reminder of your worth." },
      { id:"destination", name:"Dream Destination Picker", icon:"✈️", category:"fun", desc:"Let fate choose your next dream trip." },
      { id:"rate-day", name:"Rate Your Day", icon:"☀️", category:"quiz", desc:"Give today a little rating." },
      { id:"crush", name:"Secret Crush Quiz", icon:"💌", category:"love", desc:"A playful quiz about your secret crush." }
    ];

    const choiceData = {
      "this-that": {
        title:"This or That?",
        questions:[
          ["Your perfect morning?",["Sunrise walk 🌅","Slow cozy morning ☕"]],
          ["Choose a holiday",["Beach escape 🏖️","Mountain getaway 🏔️"]],
          ["Your favourite date?",["Cute cafe date 🍰","Romantic dinner 🕯️"]],
          ["Pick a style",["Soft & elegant 🌷","Bold & confident 🖤"]],
          ["Your ideal evening?",["Movie & blanket 🎬","Night drive 🌃"]]
        ]
      },
      "would-rather": {
        title:"Would You Rather?",
        questions:[
          ["Would you rather...",["Travel the world 🌍","Live in your dream home 🏡"]],
          ["Choose one...",["Read someone's thoughts 🧠","See your own future 🔮"]],
          ["Which would you pick?",["A surprise date 💗","A surprise holiday ✈️"]],
          ["One special ability?",["Never get tired ⚡","Never feel stressed 🌿"]],
          ["Your dream day?",["Luxury shopping 🛍️","A peaceful island 🏝️"]]
        ]
      },
      "truth-dare": {
        title:"Truth or Dare",
        questions:[
          ["Choose your turn",["Truth 💬","Dare 🎯"]]
        ]
      },
      "never-ever": {
        title:"Never Have I Ever",
        questions:[
          ["Have you ever...",["Sent a message and regretted it 📱","Travelled alone ✈️"]],
          ["Have you ever...",["Had a secret crush 💗","Stayed awake all night 🌙"]],
          ["Have you ever...",["Cried during a movie 🎬","Danced when nobody watched 💃"]],
          ["Have you ever...",["Forgotten someone's birthday 🎂","Laughed at the wrong moment 🙈"]],
          ["Have you ever...",["Dreamed about a faraway country 🌍","Talked to yourself 🪞"]]
        ]
      },
      "love-quiz": {
        title:"Love Compatibility Quiz",
        questions:[
          ["What matters most in love?",["Trust 🤍","Romance 🌹","Communication 💬","Adventure ✨"]],
          ["Your ideal date?",["A quiet cafe ☕","A fancy dinner 🕯️","A fun adventure 🎡","A movie night 🎬"]],
          ["How do you show love?",["Thoughtful actions 🎁","Sweet words 💌","Quality time 🫶","Little surprises 🌷"]],
          ["What makes a relationship strong?",["Honesty 🤍","Respect 🌸","Patience 🌿","All of these 💗"]]
        ]
      },
      "best-friend": {
        title:"Best Friend Quiz",
        questions:[
          ["Your favourite kind of day?",["Going out 🛍️","Staying in 🏡","Travelling ✈️","Trying something new ✨"]],
          ["Your comfort food?",["Pizza 🍕","Noodles 🍜","Dessert 🍰","Home-cooked food 🍲"]],
          ["Your dream destination?",["Japan 🇯🇵","Korea 🇰🇷","Europe 🌍","Maldives 🏝️"]],
          ["What cheers you up?",["Music 🎵","Food 🍓","A good talk 💬","A little rest 🌙"]]
        ]
      },
      "personality": {
        title:"Personality Test",
        questions:[
          ["At a party, you usually...",["Talk to everyone 🎉","Stay with close friends 🫶","Find a quiet corner 🌙"]],
          ["When making plans, you...",["Plan every detail 📋","Keep it flexible 🌷","Decide at the last minute ✨"]],
          ["Your friends describe you as...",["Creative 🎨","Caring 💗","Adventurous 🌍","Thoughtful 🌿"]],
          ["When facing a problem, you...",["Think logically 🧠","Follow your heart 💕","Ask someone you trust 🤝"]]
        ]
      },
      "introvert": {
        title:"Introvert or Extrovert?",
        questions:[
          ["After a busy day, you want...",["Quiet time alone 🌙","Time with friends 🎉"]],
          ["At a gathering, you...",["Listen more than you speak 👀","Start conversations 💬"]],
          ["Your ideal weekend?",["Books, music and rest 📖","Meeting people and exploring 🌆"]],
          ["When something exciting happens...",["Tell one close person 💌","Tell everyone immediately 📣"]]
        ]
      },
      "mood": {
        title:"Mood Quiz",
        questions:[
          ["Your energy right now?",["Full of energy ⚡","Peaceful 🌿","A little tired 🌙","Somewhere in between ☁️"]],
          ["Pick a colour for today",["Pink 🌸","Blue 💙","Yellow ☀️","Lavender 💜"]],
          ["What would make today better?",["A little adventure ✈️","A warm hug 🫶","Some rest 🛏️","A sweet treat 🍰"]]
        ]
      },
      "crush": {
        title:"Secret Crush Quiz",
        questions:[
          ["What do you notice first?",["Their smile 😊","Their eyes 👀","Their kindness 💗","Their confidence ✨"]],
          ["Your dream conversation?",["Funny and playful 😂","Deep and meaningful 🌙","Sweet and romantic 💌","Easy and natural 🌿"]],
          ["Your favourite sign of interest?",["Remembering little details 🫶","Making time for you ⏰","Sending thoughtful messages 📱","Making you laugh 💕"]],
          ["Your ideal first date?",["Coffee ☕","Dinner 🕯️","A walk 🌸","An adventure 🎡"]]
        ]
      }
    };

    const truthDares = {
      Truth:[
        "What is one thing that always makes you smile?",
        "What is a dream you have never told anyone?",
        "What is your most embarrassing funny moment?",
        "Who was your first celebrity crush?",
        "What is one thing you wish people understood about you?"
      ],
      Dare:[
        "Send someone a genuine compliment 💌",
        "Dance for 20 seconds 💃",
        "Take a funny selfie 🤳",
        "Sing the chorus of your favourite song 🎵",
        "Say three nice things about yourself 🌷"
      ]
    };

    const emojiQuestions = [
      {q:"🦁👑",a:["The Lion King","Frozen","Moana"],correct:"The Lion King"},
      {q:"❄️👸",a:["Cinderella","Frozen","Tangled"],correct:"Frozen"},
      {q:"🐠🔍",a:["Finding Nemo","Shark Tale","Luca"],correct:"Finding Nemo"},
      {q:"🕷️🧑",a:["Batman","Spider-Man","Superman"],correct:"Spider-Man"},
      {q:"🚢💔",a:["Titanic","Avatar","The Notebook"],correct:"Titanic"},
      {q:"🧙‍♂️⚡",a:["Harry Potter","The Hobbit","Narnia"],correct:"Harry Potter"}
    ];

    const movieQuestions = [
      {q:"A young wizard attends a school of magic.",a:"Harry Potter"},
      {q:"A ship, an iceberg and a famous love story.",a:"Titanic"},
      {q:"A lion cub becomes king of the Pride Lands.",a:"The Lion King"},
      {q:"A princess with very long magical hair.",a:"Tangled"},
      {q:"A blue alien world called Pandora.",a:"Avatar"}
    ];

    const songQuestions = [
      {q:"A famous song about dancing through the night by ABBA.",a:"Dancing Queen"},
      {q:"A romantic Ed Sheeran song with the word 'Perfect'.",a:"Perfect"},
      {q:"A Taylor Swift song about a love story.",a:"Love Story"},
      {q:"A global hit by Luis Fonsi featuring Daddy Yankee.",a:"Despacito"},
      {q:"A BTS song with the words 'Dynamite' in its title.",a:"Dynamite"}
    ];

    const scrambleWords = ["FLOWER","SUNSHINE","BEAUTIFUL","DREAM","BUTTERFLY","ROMANCE","JOURNEY"];
    const compliments = [
      "Your smile can make an ordinary day feel special. ♡",
      "You are allowed to grow at your own pace. 🌷",
      "Your kindness is a beautiful strength. 💗",
      "You bring something unique into this world. ✨",
      "You deserve the same love you give others. 🤍",
      "You are doing better than you think. 🌸",
      "Your dreams are worth believing in. ⭐"
    ];
    const challenges = [
      "Take 10 minutes for yourself today. 🌿",
      "Tell someone one thing you appreciate about them. 💌",
      "Listen to your favourite song without doing anything else. 🎵",
      "Drink a glass of water and take a deep breath. 💧",
      "Write down one thing you are proud of. 📖",
      "Try something new, even if it is tiny. ✨",
      "Take a photo of something beautiful today. 📸"
    ];
    const destinations = [
      "Kyoto, Japan 🇯🇵","Seoul, South Korea 🇰🇷","Paris, France 🇫🇷",
      "Santorini, Greece 🇬🇷","Maldives 🏝️","Swiss Alps, Switzerland 🇨🇭",
      "Pokhara, Nepal 🇳🇵","Amalfi Coast, Italy 🇮🇹","Bali, Indonesia 🇮🇩"
    ];

    function random(items) {
      return items[Math.floor(Math.random() * items.length)];
    }

    function escapeHTML(value) {
      return String(value ?? "").replace(/[&<>"']/g, c => ({
        "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
      }[c]));
    }

    function persist() {
      try { localStorage.setItem(STORE, JSON.stringify(saved)); } catch {}
      updateProgress();
    }

    function updateProgress() {
      const completed = Object.keys(saved).filter(id => saved[id]?.done).length;
      progress.innerHTML = `
        <div class="pg-progress-copy">
          <span>Games explored</span>
          <strong>${completed} / 25</strong>
        </div>
        <div class="pg-progress-track"><span style="width:${completed / 25 * 100}%"></span></div>
      `;
    }

    function setResult(text) {
      const output = $("playResult");
      if (output) {
        output.textContent = text;
        output.classList.remove("hidden");
      }

      const shareOutput = $("pgShareResult");
      if (shareOutput) shareOutput.textContent = text;

      try {
        if (typeof state !== "undefined") {
          state.results.play = text;
          if (typeof saveState === "function") saveState();
        }
      } catch (error) {
        console.warn("Play result could not be synced:", error);
      }

      saved[currentGame.id] = {
        ...(saved[currentGame.id] || {}),
        done:true,
        lastResult:text
      };
      persist();
    }

    function showToast(message) {
      toast.textContent = message;
      toast.classList.add("show");
      clearTimeout(showToast.timer);
      showToast.timer = setTimeout(() => toast.classList.remove("show"), 2300);
    }

    function renderGrid() {
      const term = search.value.trim().toLowerCase();
      const filter = category.value;

      const filtered = games.filter(game =>
        (filter === "all" || game.category === filter) &&
        (game.name.toLowerCase().includes(term) ||
         game.desc.toLowerCase().includes(term))
      );

      grid.innerHTML = filtered.length ? filtered.map(game => `
        <button class="pg-game-card" type="button" data-open="${game.id}">
          <span class="pg-game-icon">${game.icon}</span>
          <span class="pg-game-name">${game.name}</span>
          <span class="pg-game-desc">${game.desc}</span>
          <span class="pg-game-bottom">
            ${saved[game.id]?.done ? "✓ Played" : "Play now"}
            <span>↗</span>
          </span>
        </button>
      `).join("") : `<p class="pg-empty">No games found. Try another search ♡</p>`;
    }

    function openGame(id) {
      const game = games.find(item => item.id === id);
      if (!game) return;

      currentGame = game;
      home.hidden = true;
      gameView.hidden = false;
      gameView.innerHTML = `
        <button type="button" class="pg-back" data-action="home">← All games</button>
        <div class="pg-game-heading">
          <span>${game.icon}</span>
          <div><p class="pg-mini-label">LET'S PLAY ♡</p><h2>${game.name}</h2><p>${game.desc}</p></div>
        </div>
        <div class="pg-play-area" id="pgPlayArea"></div>
      `;

      renderGame(id);
      gameView.scrollIntoView({behavior:"smooth",block:"start"});
    }

    function finish(message) {
      setResult(`${currentGame.name}: ${message}`);
      const area = $("pgPlayArea");
      if (!area) return;
      const result = document.createElement("div");
      result.className = "pg-result";
      result.innerHTML = `<span>✨</span><h3>That's your result!</h3><p>${escapeHTML(message)}</p>`;
      area.appendChild(result);
    }

    function renderGame(id) {
      const area = $("pgPlayArea");
      if (!area) return;

      if (choiceData[id]) return renderChoiceQuiz(id, area);
      if (id === "lucky-spin") return renderLuckySpin(area);
      if (id === "magic-ball") return renderMagicBall(area);
      if (id === "memory") return renderMemory(area);
      if (id === "emoji") return renderEmoji(area);
      if (id === "movie") return renderGuess(area, movieQuestions, "movie");
      if (id === "song") return renderGuess(area, songQuestions, "song");
      if (id === "scramble") return renderScramble(area);
      if (id === "difference") return renderDifference(area);
      if (id === "reaction") return renderReaction(area);
      if (id === "calculator") return renderCalculator(area);
      if (id === "challenge") return renderRandomReveal(area, "Your little challenge", challenges);
      if (id === "compliment") return renderRandomReveal(area, "A little reminder for you", compliments);
      if (id === "destination") return renderRandomReveal(area, "Your dream destination", destinations);
      if (id === "rate-day") return renderRateDay(area);
    }

    function renderChoiceQuiz(id, area) {
      const data = choiceData[id];
      let index = 0;
      let answers = [];

      area.innerHTML = `
        <div class="pg-question-count" id="pgQuestionCount"></div>
        <div class="pg-question-card">
          <h3 id="pgQuestion"></h3>
          <div class="pg-options" id="pgOptions"></div>
        </div>
        <p class="pg-hint">Choose the answer that feels right ♡</p>
      `;

      function next() {
        if (index >= data.questions.length) {
          const summary = answers.map((answer,i) => `${i+1}. ${answer}`).join(" · ");
          finish(id === "truth-dare" ? answers[0] : `Your choices: ${summary}`);
          return;
        }

        const [question, options] = data.questions[index];
        $("pgQuestionCount").textContent = `QUESTION ${index+1} OF ${data.questions.length}`;
        $("pgQuestion").textContent = question;
        $("pgOptions").innerHTML = options.map((option,i) => `
          <button type="button" class="pg-option" data-answer="${i}">${option}</button>
        `).join("");
      }

      $("pgOptions").addEventListener("click", event => {
        const button = event.target.closest("[data-answer]");
        if (!button) return;
        const answer = data.questions[index][1][Number(button.dataset.answer)];
        answers.push(answer);

        if (id === "truth-dare") {
          const type = answer.startsWith("Truth") ? "Truth" : "Dare";
          finish(`${type}: ${random(truthDares[type])}`);
          return;
        }

        if (id === "never-ever") {
          showToast("Your choice: " + answer);
        }

        index++;
        next();
      });

      next();
    }

    function renderLuckySpin(area) {
      const options = ["A little self-care 🌷","A sweet treat 🍰","A fun adventure ✈️","A relaxing evening 🌙","Call someone you love 💗","Try something new ✨","Take a beautiful photo 📸","Have a dance party 💃"];
      area.innerHTML = `
        <div class="pg-feature-emoji">🎡</div>
        <h3 class="pg-center">Let the lucky spin choose!</h3>
        <div class="pg-spin-wheel" id="pgWheel">♡</div>
        <button class="pg-primary" id="pgSpin">Spin the wheel ✨</button>
        <p class="pg-output" id="pgSpinResult"></p>
      `;
      $("pgSpin").addEventListener("click", () => {
        const result = random(options);
        $("pgWheel").classList.remove("pg-spinning");
        void $("pgWheel").offsetWidth;
        $("pgWheel").classList.add("pg-spinning");
        $("pgSpinResult").textContent = result;
        setResult(result);
      });
    }

    function renderMagicBall(area) {
      const answers = ["Absolutely yes! 💗","The signs look good ✨","Maybe, give it time 🌷","Ask again later 🔮","Trust your heart 🤍","Not right now, but keep smiling 🌈"];
      area.innerHTML = `
        <div class="pg-feature-emoji">🔮</div>
        <h3 class="pg-center">Ask the Magic 8 Ball</h3>
        <input class="pg-input" id="pgMagicQuestion" placeholder="Type your yes/no question...">
        <button class="pg-primary" id="pgAskMagic">Reveal my answer</button>
        <p class="pg-output" id="pgMagicResult"></p>
        <p class="pg-hint">Just for fun — the future is yours to shape.</p>
      `;
      $("pgAskMagic").addEventListener("click", () => {
        if (!$("pgMagicQuestion").value.trim()) return showToast("Write a question first ♡");
        const result = random(answers);
        $("pgMagicResult").textContent = result;
        setResult(result);
      });
    }

    function renderMemory(area) {
      const symbols = ["🌸","🍓","🎀","🌙","💗","🦋"];
      memoryCards = [...symbols,...symbols].sort(() => Math.random() - .5);
      memoryOpen = [];
      memoryMatched = [];
      memoryMoves = 0;

      area.innerHTML = `
        <h3 class="pg-center">Find all matching pairs</h3>
        <p class="pg-hint pg-center" id="pgMemoryStatus">Moves: 0</p>
        <div class="pg-memory-grid" id="pgMemoryGrid">
          ${memoryCards.map((symbol,i) => `
            <button type="button" class="pg-memory-card" data-card="${i}">?</button>
          `).join("")}
        </div>
      `;

      $("pgMemoryGrid").addEventListener("click", event => {
        const button = event.target.closest("[data-card]");
        if (!button) return;
        const index = Number(button.dataset.card);
        if (memoryMatched.includes(index) || memoryOpen.includes(index) || memoryOpen.length === 2) return;

        memoryOpen.push(index);
        button.textContent = memoryCards[index];
        button.classList.add("revealed");

        if (memoryOpen.length === 2) {
          memoryMoves++;
          $("pgMemoryStatus").textContent = `Moves: ${memoryMoves}`;
          const [a,b] = memoryOpen;

          if (memoryCards[a] === memoryCards[b]) {
            memoryMatched.push(a,b);
            memoryOpen = [];
            if (memoryMatched.length === memoryCards.length) {
              finish(`You matched every pair in ${memoryMoves} moves! 🧠`);
            }
          } else {
            setTimeout(() => {
              memoryOpen.forEach(i => {
                const card = $("pgMemoryGrid")?.querySelector(`[data-card="${i}"]`);
                if (card) {
                  card.textContent = "?";
                  card.classList.remove("revealed");
                }
              });
              memoryOpen = [];
            }, 750);
          }
        }
      });
    }

    function renderEmoji(area) {
      let index = 0;
      let score = 0;
      const questions = [...emojiQuestions].sort(() => Math.random() - .5);

      area.innerHTML = `
        <p class="pg-question-count" id="pgEmojiCount"></p>
        <div class="pg-emoji-clue" id="pgEmojiClue"></div>
        <div class="pg-options" id="pgEmojiOptions"></div>
        <p class="pg-output" id="pgEmojiScore"></p>
      `;

      function show() {
        if (index >= questions.length) {
          finish(`You got ${score} out of ${questions.length} correct!`);
          return;
        }
        const q = questions[index];
        $("pgEmojiCount").textContent = `QUESTION ${index+1} OF ${questions.length}`;
        $("pgEmojiClue").textContent = q.q;
        $("pgEmojiOptions").innerHTML = q.a.map(answer => `
          <button class="pg-option" type="button" data-emoji-answer="${escapeHTML(answer)}">${answer}</button>
        `).join("");
      }

      $("pgEmojiOptions").addEventListener("click", event => {
        const button = event.target.closest("[data-emoji-answer]");
        if (!button) return;
        if (button.dataset.emojiAnswer === questions[index].correct) score++;
        index++;
        show();
      });
      show();
    }

    function renderGuess(area, questions, type) {
      let index = 0;
      let score = 0;
      const list = [...questions].sort(() => Math.random() - .5);
      area.innerHTML = `
        <p class="pg-question-count" id="pgGuessCount"></p>
        <div class="pg-question-card">
          <h3 id="pgGuessClue"></h3>
          <input class="pg-input" id="pgGuessInput" placeholder="Your answer...">
          <button class="pg-primary" id="pgGuessSubmit">Check answer</button>
          <p class="pg-output" id="pgGuessFeedback"></p>
        </div>
      `;

      function show() {
        if (index >= list.length) {
          finish(`You guessed ${score} out of ${list.length} correctly!`);
          return;
        }
        $("pgGuessCount").textContent = `QUESTION ${index+1} OF ${list.length}`;
        $("pgGuessClue").textContent = list[index].q;
        $("pgGuessInput").value = "";
        $("pgGuessFeedback").textContent = "";
      }

      $("pgGuessSubmit").addEventListener("click", () => {
        const answer = $("pgGuessInput").value.trim().toLowerCase();
        if (!answer) return showToast("Type your answer first ♡");
        const correct = list[index].a.toLowerCase();
        if (answer.includes(correct) || correct.includes(answer)) {
          score++;
          $("pgGuessFeedback").textContent = "Correct! ✨";
        } else {
          $("pgGuessFeedback").textContent = `The answer was ${list[index].a}.`;
        }
        index++;
        setTimeout(show, 850);
      });
      show();
    }

    function renderScramble(area) {
      const word = random(scrambleWords);
      const mixed = word.split("").sort(() => Math.random() - .5).join("");
      area.innerHTML = `
        <div class="pg-feature-emoji">🔤</div>
        <p class="pg-question-count">UNSCRAMBLE THIS WORD</p>
        <div class="pg-scramble-word">${mixed}</div>
        <input class="pg-input" id="pgScrambleInput" placeholder="Type the correct word...">
        <button class="pg-primary" id="pgScrambleCheck">Check word</button>
        <p class="pg-output" id="pgScrambleResult"></p>
      `;
      $("pgScrambleCheck").addEventListener("click", () => {
        const answer = $("pgScrambleInput").value.trim().toUpperCase();
        if (!answer) return showToast("Enter a word first ♡");
        if (answer === word) {
          $("pgScrambleResult").textContent = "You got it! 🎉";
          finish(`You unscrambled ${word} correctly!`);
        } else {
          $("pgScrambleResult").textContent = "Not quite! Try again 💗";
        }
      });
    }

    function renderDifference(area) {
      const odd = Math.floor(Math.random() * 12);
      const symbols = Array.from({length:12},(_,i) => i === odd ? "🌺" : "🌸");
      area.innerHTML = `
        <h3 class="pg-center">Find the one different flower!</h3>
        <div class="pg-difference-grid">
          ${symbols.map((symbol,i) => `<button type="button" data-diff="${i}">${symbol}</button>`).join("")}
        </div>
        <p class="pg-output" id="pgDiffResult"></p>
      `;
      $("pgPlayArea").querySelector(".pg-difference-grid").addEventListener("click", event => {
        const button = event.target.closest("[data-diff]");
        if (!button) return;
        if (Number(button.dataset.diff) === odd) {
          $("pgDiffResult").textContent = "Amazing eyes! You found it. 👀";
          finish("You spotted the different flower!");
        } else {
          $("pgDiffResult").textContent = "Not that one! Look carefully ♡";
        }
      });
    }

    function renderReaction(area) {
      area.innerHTML = `
        <div class="pg-feature-emoji">⚡</div>
        <h3 class="pg-center">Test your reaction speed</h3>
        <p class="pg-hint pg-center">Press start, wait until the box turns green, then tap it as quickly as possible.</p>
        <button class="pg-reaction-box" id="pgReaction">Press Start</button>
        <p class="pg-output" id="pgReactionResult"></p>
      `;
      const button = $("pgReaction");
      button.addEventListener("click", () => {
        if (button.dataset.phase === "waiting") {
          clearTimeout(reactionTimer);
          button.dataset.phase = "";
          button.textContent = "Too soon! Try again.";
          button.classList.remove("ready");
          return;
        }
        if (button.dataset.phase === "ready") {
          const ms = Math.round(performance.now() - reactionStart);
          button.dataset.phase = "";
          button.textContent = "Try again";
          button.classList.remove("ready");
          $("pgReactionResult").textContent = `Your reaction time: ${ms} ms`;
          setResult(`Reaction speed: ${ms} milliseconds.`);
          return;
        }

        button.dataset.phase = "waiting";
        button.textContent = "Wait for green...";
        button.classList.remove("ready");
        reactionTimer = setTimeout(() => {
          button.dataset.phase = "ready";
          button.classList.add("ready");
          button.textContent = "CLICK NOW!";
          reactionStart = performance.now();
        }, 1200 + Math.random() * 2500);
      });
    }

    function renderCalculator(area) {
      area.innerHTML = `
        <div class="pg-feature-emoji">💘</div>
        <h3 class="pg-center">A playful name calculator</h3>
        <input class="pg-input" id="pgNameOne" placeholder="First name">
        <input class="pg-input" id="pgNameTwo" placeholder="Second name">
        <button class="pg-primary" id="pgCalculate">Calculate our fun score 💗</button>
        <div class="pg-love-score" id="pgLoveScore"></div>
        <p class="pg-hint">Just a fun random-style result, not a real compatibility test.</p>
      `;
      $("pgCalculate").addEventListener("click", () => {
        const a = $("pgNameOne").value.trim();
        const b = $("pgNameTwo").value.trim();
        if (!a || !b) return showToast("Enter both names first ♡");
        let seed = (a + b).toLowerCase().split("").reduce((n,c) => n + c.charCodeAt(0), 0);
        const score = (seed * 7 + a.length * 13 + b.length * 17) % 101;
        $("pgLoveScore").textContent = `${score}% 💕`;
        finish(`${a} + ${b}: ${score}% fun love score!`);
      });
    }

    function renderRandomReveal(area, title, list) {
      area.innerHTML = `
        <div class="pg-feature-emoji">${currentGame.icon}</div>
        <h3 class="pg-center">${title}</h3>
        <div class="pg-random-card" id="pgRandomResult">A little surprise is waiting...</div>
        <button class="pg-primary" id="pgRandomButton">Surprise me ✨</button>
      `;
      $("pgRandomButton").addEventListener("click", () => {
        const result = random(list);
        $("pgRandomResult").textContent = result;
        setResult(result);
      });
    }

    function renderRateDay(area) {
      area.innerHTML = `
        <div class="pg-feature-emoji">☀️</div>
        <h3 class="pg-center">How was your day?</h3>
        <p class="pg-center pg-hint">Move the slider to rate your day.</p>
        <div class="pg-rating-number" id="pgRatingNumber">5</div>
        <input class="pg-range" id="pgRating" type="range" min="1" max="10" value="5">
        <div class="pg-range-labels"><span>Not great</span><span>Amazing!</span></div>
        <button class="pg-primary" id="pgSaveRating">Save my rating ♡</button>
      `;
      $("pgRating").addEventListener("input", () => {
        $("pgRatingNumber").textContent = $("pgRating").value;
      });
      $("pgSaveRating").addEventListener("click", () => {
        const rating = $("pgRating").value;
        finish(`You rated your day ${rating}/10. Every day is a new page. 🌷`);
      });
    }

    function backHome() {
      clearTimeout(reactionTimer);
      gameView.hidden = true;
      home.hidden = false;
      renderGrid();
      home.scrollIntoView({behavior:"smooth",block:"start"});
    }

    grid.addEventListener("click", event => {
      const button = event.target.closest("[data-open]");
      if (button) openGame(button.dataset.open);
    });

    gameView.addEventListener("click", event => {
      if (event.target.closest('[data-action="home"]')) backHome();
    });

    search.addEventListener("input", renderGrid);
    category.addEventListener("change", renderGrid);

    updateProgress();
    renderGrid();

    console.log("Play & Discover: all 25 activities loaded ♡");
  });
})();
