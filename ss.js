(function () {
  "use strict";

  const CORRECT_PASSWORD = "indiandevelopersandhackers9823";
 
  // 1. Right-Click & Inspect Shortcuts Protection
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  }, true);

  document.addEventListener('keydown', function (e) {
    // Disable F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      return false;
    }
    // Disable Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
      e.preventDefault();
      return false;
    }
    // Disable Ctrl+U (View Source) and Ctrl+S (Save Page)
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.key === 'S' || e.key === 's')) {
      e.preventDefault();
      return false;
    }
  }, true);

  // 2. Inject Security Password & Terms Overlay CSS
  const style = document.createElement('style');
  style.textContent = `
    #rc-security-gate {
      position: fixed;
      inset: 0;
      background: #060a09;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      font-family: 'Inter', -apple-system, sans-serif;
      color: #eaf2ee;
    }

    .rc-security-card {
      background: #0f1513;
      border: 1px solid #243330;
      border-radius: 20px;
      width: 100%;
      max-width: 420px;
      padding: 30px 24px;
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.7);
      display: flex;
      flex-direction: column;
      gap: 16px;
      text-align: center;
    }

    .rc-security-title {
      font-size: 20px;
      font-weight: 700;
      color: #3ee8a8;
      letter-spacing: -0.01em;
    }

    .rc-terms-box {
      background: #141c19;
      border: 1px solid #1a2420;
      border-radius: 12px;
      padding: 12px 14px;
      font-size: 12px;
      color: #7e928a;
      line-height: 1.5;
      text-align: left;
    }

    .rc-terms-highlight {
      color: #ff6b5e;
      font-weight: 600;
    }

    .rc-security-input {
      width: 100%;
      background: #141c19;
      border: 1.5px solid #243330;
      border-radius: 10px;
      padding: 12px 14px;
      font-size: 14px;
      color: #eaf2ee;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }

    .rc-security-input:focus {
      border-color: #3ee8a8;
    }

    .rc-security-btn {
      width: 100%;
      padding: 12px;
      background: #3ee8a8;
      color: #06231a;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .rc-security-btn:hover {
      opacity: 0.9;
    }

    .rc-security-err {
      color: #ff6b5e;
      font-size: 12px;
      font-weight: 600;
      display: none;
    }
  `;
  document.head.appendChild(style);

  // Hide root app shell until authenticated
  const appElement = document.getElementById('app');
  if (appElement) appElement.style.display = 'none';

  // Check if session is already unlocked in current browser tab session
  if (sessionStorage.getItem('rc_access_unlocked') === 'true') {
    if (appElement) appElement.style.display = '';
    return;
  }

  // 3. Render Gatekeeper Prompt
  function renderSecurityGate() {
    const gate = document.createElement('div');
    gate.id = 'rc-security-gate';
    gate.innerHTML = `
      <div class="rc-security-card">
        <div class="rc-security-title">🔒 RootChat Security Gate</div>
        
        <div class="rc-terms-box">
          <span class="rc-terms-highlight">TERMS & CONDITIONS:</span><br/>
          This application is strictly restricted. Only <b style="color:#eaf2ee;">Aryan</b> and <b style="color:#eaf2ee;">Pavan</b> are authorized to access and use this system. Unauthorized attempts are strictly prohibited.
        </div>

        <div style="display:flex; flex-direction:column; gap:8px;">
          <input type="password" id="rc-gate-pass" class="rc-security-input" placeholder="Enter Access Password..." autocomplete="off" />
          <div id="rc-gate-err" class="rc-security-err">Incorrect Password! Access Denied.</div>
        </div>

        <button id="rc-gate-submit" class="rc-security-btn">Authenticate & Access</button>
      </div>
    `;

    document.body.appendChild(gate);

    const input = gate.querySelector('#rc-gate-pass');
    const submitBtn = gate.querySelector('#rc-gate-submit');
    const errText = gate.querySelector('#rc-gate-err');

    const verifyPassword = () => {
      const entered = input.value.trim();
      if (entered === CORRECT_PASSWORD) {
        sessionStorage.setItem('rc_access_unlocked', 'true');
        gate.remove();
        if (appElement) appElement.style.display = '';
      } else {
        errText.style.display = 'block';
        input.value = '';
        input.focus();
      }
    };

    submitBtn.addEventListener('click', verifyPassword);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') verifyPassword();
    });

    input.focus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderSecurityGate);
  } else {
    renderSecurityGate();
  }
})();
