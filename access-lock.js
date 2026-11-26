
/* =====================================
   SHARMILA'S LITTLE WORLD
   SHARED ACCESS KEY LOCK
   SETTINGS LOGOUT ONLY ♡
===================================== */

(() => {
  "use strict";

  const ACCESS_KEY = "SHARMILA123";
  const SESSION_KEY = "sharmila_access_granted";

  function createLock() {
    document.body.classList.add("site-locked");

    const style = document.createElement("style");

    style.textContent = `
      body.site-locked > header,
      body.site-locked > main,
      body.site-locked > footer {
        display: none !important;
      }

      #accessLock {
        position: fixed;
        inset: 0;
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        background: linear-gradient(135deg, #fff0f5, #fffaf8, #fce4ec);
        font-family: 'DM Sans', sans-serif;
      }

      #accessLock .lock-card {
        width: 100%;
        max-width: 390px;
        padding: 38px 28px;
        text-align: center;
        background: rgba(255,255,255,.94);
        border: 1px solid #f3d5df;
        border-radius: 25px;
        box-shadow: 0 18px 55px rgba(190,100,135,.13);
      }

      #accessLock .lock-icon {
        font-size: 42px;
        margin-bottom: 12px;
      }

      #accessLock h1 {
        color: #bd6485;
        font-family: 'Playfair Display', serif;
        font-size: 29px;
        margin: 0 0 8px;
      }

      #accessLock p {
        color: #927d86;
        font-size: 13px;
        margin-bottom: 24px;
      }

      #accessLock input {
        box-sizing: border-box;
        width: 100%;
        padding: 15px;
        border: 1px solid #efd3df;
        border-radius: 12px;
        outline: none;
        font-size: 15px;
        margin-bottom: 13px;
      }

      #accessLock input:focus {
        border-color: #d77e9e;
      }

      #accessLock .lock-card button {
        width: 100%;
        padding: 15px;
        border: 0;
        border-radius: 12px;
        background: #d77e9e;
        color: white;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
      }

      #accessLock .lock-error {
        color: #c34d70;
        min-height: 20px;
        margin: 12px 0 0;
      }
    `;

    document.head.appendChild(style);

    const overlay = document.createElement("div");
    overlay.id = "accessLock";

    overlay.innerHTML = `
      <div class="lock-card">
        <div class="lock-icon">♡</div>
        <h1>Sharmila's Little World</h1>
        <p>A private little world. Enter your access key to continue.</p>

        <form id="accessForm">
          <input
            id="accessKeyInput"
            type="password"
            placeholder="Enter your access key"
            autocomplete="current-password"
            required
          >

          <button type="submit">Enter My World ♡</button>
          <div class="lock-error" id="accessError"></div>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    function unlock() {
      document.body.classList.remove("site-locked");
      overlay.remove();
    }

    document.getElementById("accessForm").addEventListener("submit", event => {
      event.preventDefault();

      const entered = document.getElementById("accessKeyInput").value;
      const error = document.getElementById("accessError");

      if (entered === ACCESS_KEY) {
        sessionStorage.setItem(SESSION_KEY, "yes");
        unlock();
      } else {
        error.textContent = "Incorrect access key. Please try again.";
        document.getElementById("accessKeyInput").value = "";
      }
    });

    document.addEventListener("world:logout", () => {
      sessionStorage.removeItem(SESSION_KEY);
      location.reload();
    });

    if (sessionStorage.getItem(SESSION_KEY) === "yes") {
      unlock();
    }
  }

  createLock();

})();
