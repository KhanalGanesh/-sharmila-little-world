
document.addEventListener("DOMContentLoaded", () => {
  const page = document.getElementById("dreams");
  if (!page || document.getElementById("dreamManSurprise")) return;

  const section = document.createElement("section");
  section.id = "dreamManSurprise";

  section.innerHTML = `
    <div class="dm-card">
      <div class="dm-top">💌 A LITTLE SECRET <span>♡</span></div>

      <div class="dm-intro">
        <div class="dm-flower">🌷</div>
        <h2>Just a Little Question...</h2>
        <p>Something special is waiting for you.</p>
      </div>

      <div class="dm-question" id="dmQuestion">
        <span class="dm-label">A LITTLE SURPRISE</span>
        <h3>Do you want to know where your dream man is? 🤭</h3>
        <div class="dm-buttons">
          <button id="dmYes" type="button">YES 💗</button>
          <button id="dmNo" type="button" disabled>NO 🙈</button>
        </div>
        <p class="dm-hint">Choose wisely... ♡</p>
      </div>

      <div class="dm-answer" id="dmAnswer" hidden>
        <div class="dm-heart">💗</div>
        <p>Guess what...</p>
        <h2>He is currently in</h2>
        <div class="dm-tokyo">🇯🇵 TOKYO, JAPAN</div>
        <p class="dm-small">Maybe your next beautiful story starts here...</p>
        <button id="dmHow" class="dm-button" type="button">
          How to get to him? ✈️
        </button>
      </div>

      <div class="dm-journey" id="dmJourney" hidden>
        <span class="dm-label">YOUR LITTLE JOURNEY</span>
        <h3>Let's go to Tokyo! 💕</h3>

        <div class="dm-scene">
          <div class="dm-sky">
            <span class="dm-sun">☀️</span>
            <span class="dm-cloud dm-cloud1">☁️</span>
            <span class="dm-cloud dm-cloud2">☁️</span>
            <span class="dm-cloud dm-cloud3">☁️</span>
          </div>

          <div class="dm-city">
            <span>🏠</span><span>🏢</span><span>🏬</span>
          </div>

          <div class="dm-terminal" id="dmAirport">
            <div class="dm-terminal-roof">✈ INTERNATIONAL AIRPORT</div>
            <div class="dm-terminal-building">
              <span class="dm-terminal-window">▥</span>
              <span class="dm-terminal-door">🚪</span>
              <span class="dm-terminal-window">▥</span>
            </div>
            <div class="dm-terminal-sign">DEPARTURES · AIRPORT</div>
          </div>

          <div class="dm-road">
            <div class="dm-road-lines"></div>
            <div class="dm-car" id="dmCar">🚙</div>
          </div>

          <div class="dm-plane" id="dmPlane">✈️</div>
          <div class="dm-destination" id="dmDestination">🇯🇵 TOKYO</div>
        </div>

        <div class="dm-status" id="dmStatus">
          Ready for the journey? 💗
        </div>

        <button id="dmStart" class="dm-button" type="button">
          Start our journey 🚙
        </button>

        <div class="dm-ending" id="dmEnding" hidden>
          <div class="dm-ending-hearts">💕 💗 💕</div>
          <h2>Welcome to Tokyo! 🇯🇵</h2>
          <p>Maybe the best adventures begin with one little YES. 🌷</p>
          <button id="dmReplay" class="dm-button" type="button">
            Replay our journey ↻
          </button>
        </div>
      </div>

      <div class="dm-footer">A little imagination, a little romance ♡</div>
    </div>
  `;

  const css = document.createElement("style");
  css.textContent = `
    #dreamManSurprise { margin:25px 0; width:100%; }
    #dreamManSurprise * { box-sizing:border-box; }

    .dm-card {
      padding:20px;
      border-radius:22px;
      border:1px solid #f1d8e5;
      background:linear-gradient(145deg,#fff8fc,#ffedf5,#fffafd);
      box-shadow:0 8px 25px rgba(165,95,130,.08);
      color:#965b77;
      text-align:center;
      overflow:hidden;
    }

    .dm-top { display:flex; justify-content:space-between; font-size:10px; letter-spacing:1.5px; font-weight:800; color:#c0809e; }
    .dm-intro { padding:18px 0; }
    .dm-flower { font-size:38px; animation:dmFlower 3s ease-in-out infinite; }
    .dm-intro h2 { font-size:20px; color:#a6537c; margin:8px 0; }
    .dm-intro p,.dm-small { font-size:11px; color:#a78696; line-height:1.7; }

    .dm-question,.dm-answer,.dm-journey {
      padding:19px 13px;
      border-radius:17px;
      border:1px solid #f3dce7;
      background:rgba(255,255,255,.8);
      animation:dmReveal .5s ease;
    }

    .dm-label { font-size:9px; letter-spacing:2px; color:#c27b9b; font-weight:800; }
    .dm-question h3,.dm-journey h3 { font-size:16px; line-height:1.5; color:#92516f; margin:13px 0 18px; }

    .dm-buttons { display:flex; justify-content:center; gap:12px; }
    .dm-buttons button {
      width:115px; padding:12px; border-radius:25px;
      border:1px solid #edcbdc; background:#fce9f1;
      color:#a4567a; font-weight:800; font-size:12px;
    }
    .dm-buttons #dmYes {
      cursor:pointer; background:linear-gradient(110deg,#e99bb9,#c8739a);
      border:0; color:white; box-shadow:0 5px 14px rgba(190,105,145,.2);
    }
    .dm-buttons #dmNo { opacity:.55; cursor:not-allowed; }
    .dm-hint { margin-top:13px; font-size:10px; color:#bd91a5; }

    .dm-answer { margin-top:15px; background:#fff0f6; }
    .dm-answer[hidden],.dm-journey[hidden],.dm-ending[hidden] { display:none !important; }
    .dm-heart { font-size:37px; animation:dmBeat 1.1s infinite; }
    .dm-answer p { font-size:12px; color:#a77b91; }
    .dm-answer h2 { font-size:18px; color:#a6537c; }
    .dm-tokyo { font-size:22px; font-weight:900; color:#c45e8b; margin:12px 0; }

    .dm-button {
      border:0; border-radius:25px; padding:12px 20px; margin-top:12px;
      color:white; background:linear-gradient(110deg,#dc8eaf,#bd6d96);
      font-size:12px; font-weight:800; cursor:pointer;
      box-shadow:0 5px 14px rgba(190,105,145,.2);
    }
    .dm-button:disabled { opacity:.6; cursor:wait; }

    .dm-journey { margin-top:15px; }
    .dm-scene {
      height:230px; position:relative; overflow:hidden;
      margin:16px 0; border-radius:16px;
      background:linear-gradient(#bfe4ff 0%,#eaf6ff 65%,#a8cf92 65%,#a8cf92 100%);
    }

    .dm-sky { position:absolute; inset:0; }
    .dm-sun { position:absolute; top:12px; right:12%; font-size:29px; }
    .dm-cloud { position:absolute; font-size:27px; }
    .dm-cloud1 { top:25px; left:12%; animation:dmCloud 7s infinite; }
    .dm-cloud2 { top:65px; left:48%; animation:dmCloud 9s infinite reverse; }
    .dm-cloud3 { top:20px; right:30%; animation:dmCloud 8s infinite; }

    .dm-city { position:absolute; bottom:35%; left:5%; display:flex; gap:8px; font-size:25px; opacity:.8; }

    /* CLEAR AIRPORT TERMINAL */
    .dm-terminal {
      position:absolute; z-index:2;
      right:5%; bottom:35%;
      width:48%; height:95px;
      transition:filter .5s;
    }
    .dm-terminal-roof {
      height:25px; border-radius:7px 7px 0 0;
      background:#7896b4; color:white;
      font-size:8px; font-weight:900;
      display:flex; align-items:center; justify-content:center;
      letter-spacing:.5px;
    }
    .dm-terminal-building {
      height:48px; display:flex; justify-content:space-around;
      align-items:center; background:#f8fbff;
      border:2px solid #8da9c5; border-top:0;
    }
    .dm-terminal-window {
      color:#6596c0; background:#d8edff;
      border:2px solid #a9c7e1; padding:5px;
      font-size:13px;
    }
    .dm-terminal-door { font-size:20px; }
    .dm-terminal-sign {
      background:#58799c; color:white;
      padding:4px; font-size:8px; font-weight:900;
    }

    /* CAR ALWAYS TRAVELS LEFT TO RIGHT */
    .dm-road {
      position:absolute; bottom:0; left:0; right:0;
      height:35%; background:#777d88;
      border-top:5px solid #d9dfd1;
    }
    .dm-road-lines {
      position:absolute; top:50%; left:0; right:0;
      border-top:3px dashed white;
    }
    .dm-car {
      position:absolute; z-index:5;
      left:4%; top:-29px; font-size:39px;
      transform:scaleX(-1);
      transition:left 3.5s cubic-bezier(.2,.7,.2,1);
    }
    .dm-car.drive { left:62%; }

    .dm-plane {
      position:absolute; z-index:6;
      left:60%; bottom:38%; font-size:43px;
      opacity:0; transform:rotate(-8deg);
    }
    .dm-plane.fly {
      opacity:1;
      animation:dmFlight 5s ease-in-out forwards;
    }
    .dm-destination {
      position:absolute; top:12px; right:12px;
      z-index:7; color:#426f99; font-size:12px;
      font-weight:900; opacity:0; transition:opacity .5s;
    }
    .dm-destination.show { opacity:1; }

    .dm-status {
      padding:11px; min-height:38px; border-radius:12px;
      background:#fff0f6; color:#a65f80; font-size:12px;
    }
    .dm-ending { margin-top:15px; padding:20px 10px; border-radius:15px; background:#fff0f6; animation:dmReveal .7s ease; }
    .dm-ending-hearts { font-size:25px; animation:dmBeat 1.2s infinite; }
    .dm-ending h2 { color:#b6537d; font-size:21px; }
    .dm-ending p { font-size:12px; line-height:1.7; color:#9c7488; }
    .dm-footer { margin-top:15px; color:#c28ba5; font-size:9px; }

    @keyframes dmFlight {
      0% { left:60%; bottom:38%; transform:rotate(-8deg); }
      35% { bottom:65%; }
      100% { left:115%; bottom:85%; transform:rotate(-8deg); }
    }
    @keyframes dmFlower { 0%,100% { transform:rotate(-7deg) scale(1); } 50% { transform:rotate(7deg) scale(1.1); } }
    @keyframes dmBeat { 0%,100% { transform:scale(1); } 50% { transform:scale(1.18); } }
    @keyframes dmReveal { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
    @keyframes dmCloud { 0%,100% { transform:translateX(-5px); } 50% { transform:translateX(15px); } }

    @media(max-width:420px) {
      .dm-card { padding:13px; }
      .dm-scene { height:205px; }
      .dm-terminal { width:52%; right:3%; }
      .dm-terminal-roof { font-size:7px; }
    }
    @media(prefers-reduced-motion:reduce) {
      #dreamManSurprise * { animation-duration:.01ms !important; transition-duration:.01ms !important; }
    }
  `;

  document.head.appendChild(css);

  const host = document.getElementById("dreamsExtras") || page;
  host.appendChild(section);

  const $ = id => document.getElementById(id);
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  let running = false;

  $("dmYes").addEventListener("click", () => {
    $("dmAnswer").hidden = false;
    $("dmQuestion").querySelector(".dm-hint").textContent =
      "You said YES! Here's your little surprise ♡";
    $("dmYes").disabled = true;
    $("dmYes").textContent = "YES! 💗";
    $("dmAnswer").scrollIntoView({ behavior:"smooth", block:"center" });
  });

  $("dmHow").addEventListener("click", () => {
    $("dmJourney").hidden = false;
    $("dmJourney").scrollIntoView({ behavior:"smooth", block:"center" });
  });

  async function startJourney() {
    if (running) return;
    running = true;

    const car = $("dmCar");
    const airport = $("dmAirport");
    const plane = $("dmPlane");
    const destination = $("dmDestination");
    const ending = $("dmEnding");
    const start = $("dmStart");
    const status = $("dmStatus");

    start.disabled = true;
    ending.hidden = true;
    car.classList.remove("drive");
    airport.style.filter = "";
    plane.classList.remove("fly");
    destination.classList.remove("show");

    status.textContent = "🚙 Driving towards the airport...";
    await wait(300);
    car.classList.add("drive");

    await wait(3700);
    status.textContent = "🏢 We have arrived at the airport! Let's board the plane.";
    airport.style.filter = "drop-shadow(0 0 9px #fff)";

    await wait(2000);
    status.textContent = "✈️ Boarding complete! Our flight to Tokyo is taking off...";
    plane.classList.add("fly");
    destination.classList.add("show");

    await wait(5200);
    status.textContent = "🇯🇵 Welcome to Tokyo!";
    ending.hidden = false;
    ending.scrollIntoView({ behavior:"smooth", block:"center" });

    start.textContent = "Journey completed ♡";
    start.disabled = false;
    running = false;
  }

  $("dmStart").addEventListener("click", startJourney);

  $("dmReplay").addEventListener("click", () => {
    $("dmCar").classList.remove("drive");
    $("dmPlane").classList.remove("fly");
    $("dmDestination").classList.remove("show");
    $("dmEnding").hidden = true;
    $("dmStatus").textContent = "Ready for the journey? 💗";
    $("dmStart").textContent = "Start our journey 🚙";
  });
});
