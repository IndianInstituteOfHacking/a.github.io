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
      position: fixed;
      inset: 0;
      background: #0d1210;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      font-family: 'Times New Roman', Times, serif;
      color: #111;
      box-sizing: border-box;
      overflow-y: auto;
    }

    .rc-letter-container {
      background: #ffffff;
      border: 2px solid #2b3a32;
      padding: 40px;
      width: 100%;
      max-width: 680px;
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.8);
      position: relative;
      box-sizing: border-box;
      margin: auto;
    }

    .rc-header {
      text-align: center;
      border-bottom: 3px double #2b3a32;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }

    .rc-org-title {
      font-size: 22px;
      font-weight: bold;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #0b2319;
    }

    .rc-org-subtitle {
      font-size: 12px;
      font-weight: bold;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #435b50;
      margin-top: 6px;
      font-family: Arial, sans-serif;
    }

    .rc-meta-table {
      width: 100%;
      margin-bottom: 20px;
      font-size: 12px;
      font-family: Arial, sans-serif;
      border-collapse: collapse;
    }

    .rc-meta-table td {
      padding: 3px 0;
      color: #333;
    }

    .rc-subject-line {
      font-weight: bold;
      text-align: center;
      font-size: 14px;
      text-decoration: underline;
      margin: 18px 0;
      text-transform: uppercase;
      color: #000;
    }

    .rc-body-content {
      font-size: 14px;
      text-align: justify;
      margin-bottom: 20px;
      color: #222;
      line-height: 1.6;
    }

    .rc-clause-box {
      background: #f1f5f3;
      border-left: 4px solid #c9302c;
      padding: 12px 16px;
      margin: 12px 0;
      font-family: Arial, sans-serif;
      font-size: 12.5px;
      color: #333;
    }

    .rc-clause-box.auth {
      border-left-color: #2e8b57;
    }

    .rc-checkbox-group {
      margin: 20px 0 15px 0;
      font-family: Arial, sans-serif;
      font-size: 13px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
      cursor: pointer;
      user-select: none;
      color: #222;
    }

    .rc-checkbox-group input {
      margin-top: 2px;
      width: 16px;
      height: 16px;
      cursor: pointer;
    }

    .rc-action-btn {
      font-family: Arial, sans-serif;
      width: 100%;
      padding: 13px;
      background: #1b3b2b;
      color: #ffffff;
      border: none;
      border-radius: 3px;
      font-size: 13px;
      font-weight: bold;
      letter-spacing: 1px;
      text-transform: uppercase;
      cursor: pointer;
      transition: background 0.2s;
    }

    .rc-action-btn:disabled {
      background: #8fa39a;
      cursor: not-allowed;
    }

    .rc-action-btn:not(:disabled):hover {
      background: #2b5640;
    }

    .rc-legal-footer {
      margin-top: 25px;
      border-top: 1px solid #ccc;
      padding-top: 12px;
      font-family: Arial, sans-serif;
      font-size: 11px;
      color: #666;
      display: flex;
      justify-content: space-between;
    }

    .rc-pass-card {
      max-width: 420px;
      text-align: center;
      padding: 35px;
    }

    .rc-pass-input {
      font-family: Arial, sans-serif;
      width: 100%;
      background: #f9f9f9;
      border: 1px solid #ccc;
      border-radius: 3px;
      padding: 12px;
      font-size: 13px;
      color: #000;
      outline: none;
      box-sizing: border-box;
      margin-top: 8px;
    }

    .rc-pass-input:focus {
      border-color: #1b3b2b;
    }

    .rc-pass-err {
      font-family: Arial, sans-serif;
      color: #c9302c;
      font-size: 11.5px;
      font-weight: bold;
      display: none;
      margin-top: 6px;
      text-align: left;
    }
  `;
  document.head.appendChild(style);

  // Hide Application Element by Default
  const appElement = document.getElementById('app');
  if (appElement) appElement.style.display = 'none';

  // Check Session Storage
  if (sessionStorage.getItem('rc_access_unlocked') === 'true') {
    if (appElement) appElement.style.display = '';
    return;
  }

  // 3. Step 1: Render Official Legal Letter with Mandatory Checkbox
  function renderLegalLetter() {
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
        sessionStorage.setItem('rc_access_unlocked', 'true');
        backdrop.remove();
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
    document.addEventListener('DOMContentLoaded', renderLegalLetter);
  } else {
    renderLegalLetter();
  }

})();
