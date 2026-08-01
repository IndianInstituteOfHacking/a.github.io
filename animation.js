(function () {
  // 1. Sleek Modern Profile Page CSS Injection
  const style = document.createElement('style');
  style.textContent = `
    .rc-profile-overlay-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(6, 10, 9, 0.85);
      backdrop-filter: blur(8px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.25s var(--ease, ease);
    }

    .rc-profile-page-card {
      background: var(--bg-1, #0f1513);
      border: 1px solid var(--line, #243330);
      border-radius: var(--radius-lg, 22px);
      width: 100%;
      max-width: 420px;
      padding: 28px 24px;
      box-shadow: var(--shadow-lg, 0 16px 48px rgba(0,0,0,0.5));
      animation: popIn 0.25s var(--ease, ease);
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      box-sizing: border-box;
    }

    .rc-profile-close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      background: var(--bg-2, #141c19);
      border: 1px solid var(--line, #243330);
      color: var(--text-2, #7e928a);
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .rc-profile-close-btn:hover {
      background: var(--bg-3, #1a2420);
      color: var(--text-0, #eaf2ee);
    }

    .rc-profile-avatar-large {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background: var(--mint, #3ee8a8);
      color: #06231a;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 32px;
      margin-bottom: 16px;
      box-shadow: 0 4px 20px rgba(62, 232, 168, 0.2);
    }

    .rc-profile-display-name {
      font-family: var(--font-display, serif);
      font-size: 22px;
      font-weight: 600;
      color: var(--text-0, #eaf2ee);
      margin-bottom: 4px;
    }

    .rc-profile-handle {
      font-size: 13.5px;
      color: var(--mint, #3ee8a8);
      font-weight: 500;
      margin-bottom: 12px;
    }

    .rc-profile-bio-box {
      font-size: 13.5px;
      color: var(--text-1, #b9c9c2);
      line-height: 1.5;
      background: var(--bg-2, #141c19);
      border: 1px solid var(--line-soft, #1a2420);
      border-radius: var(--radius-md, 16px);
      padding: 12px 16px;
      width: 100%;
      margin-bottom: 20px;
      box-sizing: border-box;
      word-break: break-word;
    }

    .rc-profile-action-btn {
      width: 100%;
      padding: 12px 20px;
      border-radius: var(--radius-pill, 999px);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: transform 0.15s, box-shadow 0.2s;
    }

    .rc-profile-btn-primary {
      background: var(--mint, #3ee8a8);
      color: #06231a;
      border: none;
    }

    .rc-profile-btn-primary:active {
      transform: scale(0.97);
    }
  `;
  document.head.appendChild(style);

  // Helper: Initials calculation
  function getInitials(name) {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  // 2. Main Function exposed on window
  window.showUserProfile = async function (uid) {
    if (!uid) return;

    const firebase = window.__rc_firebase;
    if (!firebase) {
      alert("Firebase module is not ready.");
      return;
    }

    // Existing popup clean up
    const existing = document.getElementById('rc-profile-popup-overlay');
    if (existing) existing.remove();

    // Show Loading Modal
    const backdrop = document.createElement('div');
    backdrop.id = 'rc-profile-popup-overlay';
    backdrop.className = 'rc-profile-overlay-backdrop';
    backdrop.innerHTML = `
      <div class="rc-profile-page-card">
        <div class="spinner" style="width:32px; height:32px; margin:20px 0;"></div>
      </div>
    `;
    document.body.appendChild(backdrop);

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.remove();
    });

    try {
      const { db, ref, get } = firebase;
      const snap = await get(ref(db, 'users/' + uid));

      if (!snap.exists()) {
        backdrop.querySelector('.rc-profile-page-card').innerHTML = `
          <button class="rc-profile-close-btn" id="rc-prof-close">✕</button>
          <div style="color:var(--coral); font-size:15px; margin:20px 0;">User profile not found.</div>
        `;
        document.getElementById('rc-prof-close')?.addEventListener('click', () => backdrop.remove());
        return;
      }

      const user = snap.val();
      const currentUid = firebase.auth.currentUser ? firebase.auth.currentUser.uid : null;
      const isSelf = currentUid === uid;

      const initials = getInitials(user.displayName || user.username);
      const bioText = user.bio && user.bio.trim() ? user.bio : "No bio added yet.";

      backdrop.innerHTML = `
        <div class="rc-profile-page-card">
          <button class="rc-profile-close-btn" id="rc-prof-close">✕</button>
          
          <div class="rc-profile-avatar-large" style="background:${user.color || 'var(--mint)'}">
            ${initials}
          </div>

          <div class="rc-profile-display-name">${escapeText(user.displayName || 'User')}</div>
          <div class="rc-profile-handle">@${escapeText(user.username || 'username')}</div>

          <div class="rc-profile-bio-box">
            ${escapeText(bioText)}
          </div>

          ${!isSelf ? `
            <button class="rc-profile-action-btn rc-profile-btn-primary" id="rc-prof-msg-btn">
              💬 Send Message
            </button>
          ` : `
            <div style="font-size:12px; color:var(--text-3);">This is your profile</div>
          `}
        </div>
      `;

      document.getElementById('rc-prof-close').addEventListener('click', () => backdrop.remove());

      const msgBtn = document.getElementById('rc-prof-msg-btn');
      if (msgBtn) {
        msgBtn.addEventListener('click', async () => {
          backdrop.remove();
          // Close Social overlay if open
          const socialOverlay = document.getElementById('rc-social-overlay');
          if (socialOverlay) socialOverlay.remove();

          // Switch to Chats view
          const railChats = document.getElementById('rail-chats');
          const mtabChats = document.getElementById('mtab-chats');
          if (railChats) railChats.click();
          if (mtabChats) mtabChats.click();

          // Search and open chat
          const globalSearch = document.getElementById('global-search');
          if (globalSearch) {
            globalSearch.value = user.username;
            globalSearch.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
      }

    } catch (err) {
      console.error(err);
      backdrop.remove();
      alert("Failed to load user profile.");
    }
  };

  function escapeText(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

})();