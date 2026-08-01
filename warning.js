(function () {
  "use strict";

  const CORRECT_PASSWORD = "indiandevelopersandhackers9823";

  // 1. Right-Click & Inspect Shortcuts Protection
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  }, true);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      return false;
    }
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
      e.preventDefault();
      return false;
    }
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.key === 'S' || e.key === 's')) {
      e.preventDefault();
      return false;
    }
  }, true);

  // 2. CSS Styles for Legal Letter & Password Gate
  const style = document.createElement('style');
  style.textContent = `
    #rc-legal-backdrop {
      position: fixed !important;
      inset: 0 !important;
      background: #0d1210 !important;
      z-index: 99999999 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 20px !important;
      font-family: 'Times New Roman', Times, serif !important;
      color: #111 !important;
      box-sizing: border-box !important;
      overflow-y: auto !important;
    }

    .rc-letter-container {
      background: #ffffff !important;
      border: 2px solid #2b3a32 !important;
      padding: 40px !important;
      width: 100% !important;
      max-width: 680px !important;
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.8) !important;
      position: relative !important;
      box-sizing: border-box !important;
      margin: auto !important;
    }

    .rc-header {
      text-align: center !important;
      border-bottom: 3px double #2b3a32 !important;
      padding-bottom: 20px !important;
      margin-bottom: 20px !important;
    }

    .rc-org-title {
      font-size: 22px !important;
      font-weight: bold !important;
      letter-spacing: 2px !important;
      text-transform: uppercase !important;
      color: #0b2319 !important;
    }

    .rc-org-subtitle {
      font-size: 12px !important;
      font-weight: bold !important;
      letter-spacing: 1.5px !important;
      text-transform: uppercase !important;
      color: #435b50 !important;
      margin-top: 6px !important;
      font-family: Arial, sans-serif !important;
    }

    .rc-meta-table {
      width: 100% !important;
      margin-bottom: 20px !important;
      font-size: 12px !important;
      font-family: Arial, sans-serif !important;
      border-collapse: collapse !important;
    }

    .rc-meta-table td {
      padding: 3px 0 !important;
      color: #333 !important;
    }

    .rc-subject-line {
      font-weight: bold !important;
      text-align: center !important;
      font-size: 14px !important;
      text-decoration: underline !important;
      margin: 18px 0 !important;
      text-transform: uppercase !important;
      color: #000 !important;
    }

    .rc-body-content {
      font-size: 14px !important;
      text-align: justify !important;
      margin-bottom: 20px !important;
      color: #222 !important;
      line-height: 1.6 !important;
    }

    .rc-clause-box {
      background: #f1f5f3 !important;
      border-left: 4px solid #c9302c !important;
      padding: 12px 16px !important;
      margin: 12px 0 !important;
      font-family: Arial, sans-serif !important;
      font-size: 12.5px !important;
      color: #333 !important;
    }

    .rc-clause-box.auth {
      border-left-color: #2e8b57 !important;
    }

    .rc-checkbox-group {
      margin: 20px 0 15px 0 !important;
      font-family: Arial, sans-serif !important;
      font-size: 13px !important;
      display: flex !important;
      align-items: flex-start !important;
      gap: 10px !important;
      cursor: pointer !important;
      user-select: none !important;
      color: #222 !important;
    }

    .rc-checkbox-group input {
      margin-top: 2px !important;
      width: 16px !important;
      height: 16px !important;
      cursor: pointer !important;
    }

    .rc-action-btn {
      font-family: Arial, sans-serif !important;
      width: 100% !important;
      padding: 13px !important;
      background: #1b3b2b !important;
      color: #ffffff !important;
      border: none !important;
      border-radius: 3px !important;
      font-size: 13px !important;
      font-weight: bold !important;
      letter-spacing: 1px !important;
      text-transform: uppercase !important;
      cursor: pointer !important;
      transition: background 0.2s !important;
    }

    .rc-action-btn:disabled {
      background: #8fa39a !important;
      cursor: not-allowed !important;
    }

    .rc-action-btn:not(:disabled):hover {
      background: #2b5640 !important;
    }

    .rc-legal-footer {
      margin-top: 25px !important;
      border-top: 1px solid #ccc !important;
      padding-top: 12px !important;
      font-family: Arial, sans-serif !important;
      font-size: 11px !important;
      color: #666 !important;
      display: flex !important;
      justify-content: space-between !important;
    }

    .rc-pass-card {
      max-width: 420px !important;
      text-align: center !important;
      padding: 35px !important;
    }

    .rc-pass-input {
      font-family: Arial, sans-serif !important;
      width: 100% !important;
      background: #f9f9f9 !important;
      border: 1px solid #ccc !important;
      border-radius: 3px !important;
      padding: 12px !important;
      font-size: 13px !important;
      color: #000 !important;
      outline: none !important;
      box-sizing: border-box !important;
      margin-top: 8px !important;
    }

    .rc-pass-input:focus {
      border-color: #1b3b2b !important;
    }

    .rc-pass-err {
      font-family: Arial, sans-serif !important;
      color: #c9302c !important;
      font-size: 11.5px !important;
      font-weight: bold !important;
      display: none !important;
      margin-top: 6px !important;
      text-align: left !important;
    }
  `;
  document.head.appendChild(style);

  let isUnlocked = false;

  // Strict enforcement: Continuously lock app element until verified
  function enforceLockdown() {
    const appElement = document.getElementById('app');
    if (appElement && !isUnlocked) {
      appElement.style.setProperty('display', 'none', 'important');
    }
  }

  setInterval(enforceLockdown, 50);

  // 3. Step 1: Render Official Legal Letter with Mandatory Checkbox
  function renderLegalLetter() {
    if (document.getElementById('rc-legal-backdrop')) return;

    const backdrop = document.createElement('div');
    backdrop.id = 'rc-legal-backdrop';

    backdrop.innerHTML = `
      <div class="rc-letter-container">
        <div class="rc-header">
          <div class="rc-org-title">Indian Institute Of Hacking</div>
          <div class="rc-org-subtitle">Legal & Regulatory Compliance Directorate</div>
        </div>

        <table class="rc-meta-table">
          <tr>
            <td><strong>DOCUMENT REF:</strong> IIH/LEG/2026/094</td>
            <td style="text-align: right;"><strong>CLASSIFICATION:</strong> STRICTLY RESTRICTED</td>
          </tr>
          <tr>
            <td><strong>SUBJECT:</strong> Platform Access Authorization & Legal Compliance</td>
            <td style="text-align: right;"><strong>DATE:</strong> ACTIVE DIRECTIVE</td>
          </tr>
        </table>

        <div class="rc-subject-line">NOTICE OF BINDING TERMS & MANDATORY COMPLIANCE</div>

        <div class="rc-body-content">
          <p>This official legal document establishes the binding terms of governance, security protocols, and operational restrictions for accessing and interacting with this digital architecture. All network activities, traffic routes, and user inputs are subject to continuous logging, surveillance, and automated auditing.</p>

          <div class="rc-clause-box">
            <strong>SECTION I: PROHIBITED CONDUCT & ZERO TOLERANCE POLICY</strong><br/>
            Any attempts to execute malicious scripts, bypass security barriers, extract unauthorized payload data, conduct unauthorized penetration testing, or engage in any form of cyber misconduct or illegal operations are strictly prohibited. Non-compliance shall trigger an immediate administrative ban, permanent host revocation, and forfeiture of all system privileges.
          </div>

          <div class="rc-clause-box auth">
            <strong>SECTION II: AUTHORIZED ADMINISTRATION & PRIVILEGES</strong><br/>
            Operational control, root-level governance, and full execution permissions for this environment are legally and exclusively vested in the designated system maintainers:<br/><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;• <strong>PRIMARY ADMINISTRATOR:</strong> ARYAN<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;• <strong>SECONDARY ADMINISTRATOR:</strong> PAVAN
          </div>

          <p>By proceeding past this legal gateway and providing the required authentication credentials, you explicitly acknowledge, accept, and agree to abide by all statutory terms and compliance guidelines set forth in this directive.</p>
        </div>

        <label class="rc-checkbox-group">
          <input type="checkbox" id="rc-agree-checkbox" />
          <span>I have carefully read, understood, and accept all legal terms, zero-tolerance policies, and restrictions stated in this directive.</span>
        </label>

        <button id="rc-proceed-btn" class="rc-action-btn" disabled>
          Acknowledge & Proceed To Authentication
        </button>

        <div class="rc-legal-footer">
          <span>Authorized by Directorate of Compliance</span>
          <span>Digital Seal Verification: SECURED-IIH-9823</span>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    const checkbox = backdrop.querySelector('#rc-agree-checkbox');
    const proceedBtn = backdrop.querySelector('#rc-proceed-btn');

    checkbox.addEventListener('change', () => {
      proceedBtn.disabled = !checkbox.checked;
    });

    proceedBtn.addEventListener('click', () => {
      if (!checkbox.checked) return;
      backdrop.remove();
      renderPasswordGate();
    });
  }

  // 4. Step 2: Render Password Gate
  function renderPasswordGate() {
    if (document.getElementById('rc-legal-backdrop')) return;

    const backdrop = document.createElement('div');
    backdrop.id = 'rc-legal-backdrop';

    backdrop.innerHTML = `
      <div class="rc-letter-container rc-pass-card">
        <div class="rc-header" style="border-bottom: 1px solid #ccc; padding-bottom: 15px; margin-bottom: 15px;">
          <div class="rc-org-title" style="font-size: 18px;">Security Authentication</div>
          <div class="rc-org-subtitle">Credential Verification Required</div>
        </div>

        <div style="text-align: left; margin: 15px 0;">
          <label style="font-family: Arial, sans-serif; font-size: 11.5px; font-weight: bold; color: #444; text-transform: uppercase;">Enter Authorization Passcode</label>
          <input type="password" id="rc-gate-pass" class="rc-pass-input" placeholder="Enter key..." autocomplete="off" />
          <div id="rc-gate-err" class="rc-pass-err">AUTHENTICATION FAILED: INVALID CREDENTIALS</div>
        </div>

        <button id="rc-gate-submit" class="rc-action-btn">
          Verify & Unlock System
        </button>
      </div>
    `;

    document.body.appendChild(backdrop);

    const input = backdrop.querySelector('#rc-gate-pass');
    const submitBtn = backdrop.querySelector('#rc-gate-submit');
    const errText = backdrop.querySelector('#rc-gate-err');

    const verifyPassword = () => {
      const entered = input.value.trim();
      if (entered === CORRECT_PASSWORD) {
        isUnlocked = true;
        backdrop.remove();
        const appElement = document.getElementById('app');
        if (appElement) appElement.style.removeProperty('display');
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
    document.addEventListener('DOMContentLoaded', renderLegalLetter);
  } else {
    renderLegalLetter();
  }

})();
