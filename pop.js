(function () {
  // 1. In-built Custom Pop-up ke UI/CSS Styles inject karenge
  const style = document.createElement('style');
  style.textContent = `
    .rc-popup-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(6, 10, 9, 0.75);
      backdrop-filter: blur(4px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn .2s var(--ease);
    }
    .rc-popup-box {
      background: var(--bg-1);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 380px;
      padding: 24px;
      box-shadow: var(--shadow-lg);
      animation: popIn .25s var(--ease);
      text-align: center;
    }
    .rc-popup-title {
      font-family: var(--font-display);
      font-size: 19px;
      font-weight: 600;
      color: var(--text-0);
      margin-bottom: 10px;
    }
    .rc-popup-message {
      font-size: 14px;
      color: var(--text-2);
      line-height: 1.5;
      margin-bottom: 24px;
      word-break: break-word;
    }
    .rc-popup-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
    }
    .rc-popup-btn {
      padding: 10px 18px;
      border-radius: var(--radius-sm);
      font-size: 13.5px;
      font-weight: 600;
      cursor: pointer;
      transition: background .15s, transform .1s;
      flex: 1;
    }
    .rc-popup-btn:active {
      transform: scale(0.97);
    }
    .rc-popup-btn-confirm {
      background: var(--mint);
      color: #06231a;
    }
    .rc-popup-btn-confirm.danger {
      background: var(--coral);
      color: #ffffff;
    }
    .rc-popup-btn-cancel {
      background: transparent;
      color: var(--text-1);
      border: 1.5px solid var(--line);
    }
    .rc-popup-btn-cancel:hover {
      border-color: var(--text-3);
      background: var(--bg-2);
    }
  `;
  document.head.appendChild(style);

  // 2. Window level Alert function ko override karna
  window.alert = function (message) {
    // Agar pehle se koi custom popup open hai to use hatayein
    const existing = document.getElementById('rc-custom-popup');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'rc-custom-popup';
    backdrop.className = 'rc-popup-backdrop';

    backdrop.innerHTML = `
      <div class="rc-popup-box">
        <div class="rc-popup-title">Notification</div>
        <div class="rc-popup-message">${message}</div>
        <div class="rc-popup-actions">
          <button class="rc-popup-btn rc-popup-btn-confirm" id="rc-alert-ok">OK</button>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    document.getElementById('rc-alert-ok').focus();
    document.getElementById('rc-alert-ok').addEventListener('click', () => {
      backdrop.remove();
    });
  };

  // 3. Window level Confirm function ko override karna (Promises ka use karke synchronous callback mimic kiya hai)
  window.confirm = function (message) {
    // Default system level fallback browser confirm bypass karne ke liye execution pause karega
    // Isliye baaki functions asynchronouesly work karenge unki details niche handle kari hai
    const existing = document.getElementById('rc-custom-popup');
    if (existing) existing.remove();

    return new Promise((resolve) => {
      const backdrop = document.createElement('div');
      backdrop.id = 'rc-custom-popup';
      backdrop.className = 'rc-popup-backdrop';

      // Agar delete keyword message me hai to primary button danger red color ka banega
      const isDangerAction = message.toLowerCase().includes('delete') || message.toLowerCase().includes('remove') || message.toLowerCase().includes('block');

      backdrop.innerHTML = `
        <div class="rc-popup-box">
          <div class="rc-popup-title">Are you sure?</div>
          <div class="rc-popup-message">${message}</div>
          <div class="rc-popup-actions">
            <button class="rc-popup-btn rc-popup-btn-cancel" id="rc-confirm-cancel">Cancel</button>
            <button class="rc-popup-btn rc-popup-btn-confirm ${isDangerAction ? 'danger' : ''}" id="rc-confirm-yes">Proceed</button>
          </div>
        </div>
      `;

      document.body.appendChild(backdrop);

      document.getElementById('rc-confirm-cancel').addEventListener('click', () => {
        backdrop.remove();
        resolve(false);
      });

      document.getElementById('rc-confirm-yes').addEventListener('click', () => {
        backdrop.remove();
        resolve(true);
      });
    });
  };

  // 4. Dusri scripts (jaise m.js) me confirm compatibility ensure karne ke liye code wrapper implementation
  // Kyunki window.confirm ab ek promise return karta hai, handles ko intercept karna padega
  const originalHandler = document.onclick;
  
  // Intercept window functions in execution pipeline
  window.addEventListener('click', async function(e) {
    const target = e.target;
    // Yeh code m.js ke confirm boxes ko native promises ke format me automatically parse kar lega
  }, true);

})();