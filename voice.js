(function () {
  // 1. Sleek Combined CSS Injection
  const style = document.createElement('style');
  style.textContent = `
    /* Fullscreen Overlay Container */
    .rc-social-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 60px; /* Space for Mobile Tab Bar */
      background: var(--bg-0);
      z-index: 80;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding: 16px;
      gap: 16px;
      box-sizing: border-box;
      transition: background 0.25s ease, color 0.25s ease;
    }

    @media (min-width: 861px) {
      .rc-social-overlay {
        left: 76px; /* Space for Desktop Navigation Rail */
        bottom: 0;
        padding: 24px;
      }
    }

    /* Eye-Relax Soft Grey Theme Overrides */
    .rc-social-overlay.light-mode {
      background: #232d29 !important;
      color: #e4ebe7 !important;
    }

    .rc-social-overlay.light-mode .create-post-card,
    .rc-social-overlay.light-mode .post-card,
    .rc-social-overlay.light-mode .social-empty-feed {
      background: #2c3833 !important;
      border-color: #3b4943 !important;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.25) !important;
    }

    .rc-social-overlay.light-mode .post-textarea,
    .rc-social-overlay.light-mode .comment-input,
    .rc-social-overlay.light-mode .single-comment,
    .rc-social-overlay.light-mode .post-image-container {
      background: #1d2522 !important;
      border-color: #384742 !important;
      color: #eaf2ee !important;
    }

    .rc-social-overlay.light-mode .post-author {
      color: #ffffff !important;
    }

    .social-wrapper {
      max-width: 620px;
      margin: 0 auto;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* Sub-menu Selector Modal */
    .social-selector-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(6, 10, 9, 0.78);
      backdrop-filter: blur(5px);
      z-index: 99990;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.2s var(--ease, ease);
    }

    .social-selector-card {
      background: var(--bg-1);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg, 16px);
      width: 100%;
      max-width: 380px;
      padding: 22px;
      box-shadow: var(--shadow-lg);
      display: flex;
      flex-direction: column;
      gap: 14px;
      animation: popIn 0.25s var(--ease, ease);
    }

    .social-selector-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .social-selector-title {
      font-family: var(--font-display, serif);
      font-size: 18px;
      font-weight: 600;
      color: var(--text-0);
    }

    .social-option-btn {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      background: var(--bg-2);
      border: 1px solid var(--line);
      border-radius: var(--radius-md, 12px);
      color: var(--text-0);
      cursor: pointer;
      text-align: left;
      transition: all 0.2s ease;
      width: 100%;
      box-sizing: border-box;
    }

    .social-option-btn:hover {
      background: var(--bg-3);
      border-color: var(--mint);
      transform: translateY(-2px);
    }

    .social-option-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: rgba(62, 232, 168, 0.12);
      color: var(--mint);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .social-option-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .social-option-name {
      font-size: 14.5px;
      font-weight: 600;
      color: var(--text-0);
    }

    .social-option-sub {
      font-size: 12px;
      color: var(--text-2);
    }

    /* Top Bar */
    .social-top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 2px;
    }

    .social-feed-title {
      font-family: var(--font-display, serif);
      font-size: 18px;
      font-weight: 600;
      color: var(--text-0);
    }

    .theme-toggle-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: var(--radius-pill, 999px);
      background: var(--bg-1);
      border: 1px solid var(--line);
      color: var(--text-1);
      font-size: 12.5px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .theme-toggle-btn:hover {
      border-color: var(--mint);
    }

    /* Post Creation Box */
    .create-post-card {
      background: var(--bg-1);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      padding: 16px;
      box-shadow: var(--shadow-md);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .post-textarea {
      width: 100%;
      background: var(--bg-2);
      border: 1px solid var(--line);
      border-radius: var(--radius-md);
      padding: 12px 14px;
      color: var(--text-0);
      resize: none;
      outline: none;
      font-family: inherit;
      font-size: 14px;
      line-height: 1.5;
      box-sizing: border-box;
    }

    .post-actions-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }

    .filter-pills-bar {
      display: flex;
      gap: 8px;
    }

    /* Post Cards */
    .post-card {
      background: var(--bg-1);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      padding: 16px;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      gap: 12px;
      animation: popIn 0.25s var(--ease);
      transition: outline 0.3s ease, transform 0.3s ease;
    }

    .post-card.highlighted-post {
      outline: 2px solid var(--mint);
      transform: scale(1.01);
    }

    .post-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .post-author-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      border-radius: var(--radius-sm);
      padding: 2px 6px 2px 2px;
      transition: background 0.15s;
    }

    .post-author-wrap:hover {
      background: var(--bg-2);
    }

    .post-author-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: var(--mint);
      color: #06231a;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      flex-shrink: 0;
    }

    .post-author-info {
      display: flex;
      flex-direction: column;
    }

    .post-author {
      font-weight: 600;
      font-size: 14px;
      color: var(--text-0);
    }

    .post-time {
      font-size: 11px;
      color: var(--text-3);
    }

    .btn-delete-post {
      background: transparent;
      border: none;
      color: var(--text-3);
      cursor: pointer;
      padding: 6px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s, background 0.2s;
    }

    .btn-delete-post:hover {
      color: var(--coral);
      background: rgba(255, 107, 94, 0.1);
    }

    .post-text {
      font-size: 14px;
      color: var(--text-1);
      white-space: pre-wrap;
      line-height: 1.5;
      word-break: break-word;
    }

    .post-image-container {
      border-radius: var(--radius-md);
      overflow: hidden;
      border: 1px solid var(--line);
      background: var(--bg-2);
      max-height: 350px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .post-image-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .post-footer {
      display: flex;
      align-items: center;
      gap: 16px;
      border-top: 1px solid var(--line-soft);
      padding-top: 10px;
      font-size: 13px;
    }

    .post-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      background: none;
      border: none;
      color: var(--text-2);
      font-weight: 500;
      padding: 4px 8px;
      border-radius: var(--radius-sm);
      transition: background 0.15s;
    }

    .post-btn:hover {
      background: var(--bg-2);
      color: var(--text-0);
    }

    .post-btn.active {
      color: var(--mint);
    }

    .post-btn.active.btn-like {
      color: var(--coral);
    }

    /* Comments Section */
    .comments-section {
      margin-top: 4px;
      padding-top: 10px;
      border-top: 1px dashed var(--line);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .comments-section.hidden {
      display: none !important;
    }

    .single-comment {
      font-size: 12.5px;
      background: var(--bg-2);
      padding: 8px 12px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--line-soft);
      color: var(--text-1);
    }

    .comment-author {
      font-weight: 600;
      color: var(--mint);
      margin-right: 6px;
      cursor: pointer;
    }

    .comment-input-wrap {
      display: flex;
      gap: 8px;
    }

    .comment-input {
      flex: 1;
      background: var(--bg-2);
      border: 1px solid var(--line);
      border-radius: var(--radius-pill);
      padding: 8px 14px;
      font-size: 12.5px;
      color: var(--text-0);
      outline: none;
      box-sizing: border-box;
    }

    .social-empty-feed {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 50px 20px;
      text-align: center;
      gap: 12px;
      color: var(--text-2);
      background: var(--bg-1);
      border: 1.5px dashed var(--line);
      border-radius: var(--radius-lg);
    }

    .social-empty-title {
      font-family: var(--font-display);
      font-size: 16px;
      font-weight: 600;
      color: var(--text-1);
    }

    /* Share Modal Styling */
    .share-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(6, 10, 9, 0.82);
      backdrop-filter: blur(6px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .share-modal-card {
      background: var(--bg-1);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 380px;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      padding: 20px;
      box-shadow: var(--shadow-lg);
      gap: 14px;
      box-sizing: border-box;
    }

    .share-modal-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-0);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .share-chat-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow-y: auto;
      max-height: 280px;
      padding-right: 4px;
    }

    .share-chat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: var(--radius-md);
      background: var(--bg-2);
      border: 1px solid var(--line-soft);
      cursor: pointer;
      transition: background 0.15s;
    }

    .share-chat-item.selected {
      border-color: var(--mint);
      background: rgba(62, 232, 168, 0.1);
    }

    .share-chat-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: var(--mint);
      color: #06231a;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 13px;
    }

    .share-chat-name {
      font-size: 13.5px;
      font-weight: 500;
      color: var(--text-0);
      flex: 1;
    }

    .share-checkbox {
      width: 18px;
      height: 18px;
      border-radius: 4px;
      border: 1.5px solid var(--line);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #06231a;
    }

    .share-chat-item.selected .share-checkbox {
      background: var(--mint);
      border-color: var(--mint);
    }

    /* RootChat News & Info Section */
    .news-search-card {
      background: var(--bg-1);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      padding: 16px;
      box-shadow: var(--shadow-md);
      display: flex;
      gap: 10px;
    }

    .news-search-input {
      flex: 1;
      background: var(--bg-2);
      border: 1px solid var(--line);
      border-radius: var(--radius-pill);
      padding: 10px 16px;
      color: var(--text-0);
      outline: none;
      font-size: 14px;
    }

    .news-card {
      background: var(--bg-1);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      padding: 18px;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .news-card-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--mint);
      cursor: pointer;
    }

    .news-card-title:hover {
      text-decoration: underline;
    }

    .news-card-snippet {
      font-size: 13.5px;
      color: var(--text-1);
      line-height: 1.5;
    }

    .article-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(6, 10, 9, 0.85);
      backdrop-filter: blur(6px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .article-modal-card {
      background: var(--bg-1);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 600px;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      padding: 22px;
      box-shadow: var(--shadow-lg);
      gap: 14px;
      box-sizing: border-box;
      overflow-y: auto;
    }

    .article-modal-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-0);
    }

    .article-modal-content {
      font-size: 14px;
      color: var(--text-1);
      line-height: 1.6;
    }
  `;
  document.head.appendChild(style);

  let isFeedOpen = false;
  let activeTabMode = 'social'; // 'social' | 'news'
  let savedPostsOnly = false;
  let isSocialLightMode = false;
  let feedUnsub = null;
  let openCommentPosts = new Set();
  let pendingHighlightPostId = null;

  // 2. Navigation Tab Buttons Injector
  function injectNavButtons() {
    const railChatsBtn = document.getElementById('rail-chats');
    const mtabChatsBtn = document.getElementById('mtab-chats');

    // Desktop Navigation Rail
    if (railChatsBtn && !document.getElementById('rail-feed')) {
      const feedRailBtn = document.createElement('button');
      feedRailBtn.className = 'rail-btn';
      feedRailBtn.id = 'rail-feed';
      feedRailBtn.title = 'Social Hub';
      feedRailBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>`;

      railChatsBtn.parentNode.insertBefore(feedRailBtn, railChatsBtn.nextSibling);

      feedRailBtn.addEventListener('click', openSocialHubModal);
      railChatsBtn.addEventListener('click', closeSocialOverlay);
    }

    // Mobile Bottom Navigation Bar
    if (mtabChatsBtn && !document.getElementById('mtab-feed')) {
      const mtabFeedBtn = document.createElement('button');
      mtabFeedBtn.className = 'mtab-btn';
      mtabFeedBtn.id = 'mtab-feed';
      mtabFeedBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg><span>Social</span>`;

      mtabChatsBtn.parentNode.insertBefore(mtabFeedBtn, mtabChatsBtn.nextSibling);

      mtabFeedBtn.addEventListener('click', openSocialHubModal);
      mtabChatsBtn.addEventListener('click', closeSocialOverlay);
    }
  }

  // 3. Open Sub-menu Modal Selector
  function openSocialHubModal() {
    const old = document.getElementById('social-hub-selector-modal');
    if (old) old.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'social-hub-selector-modal';
    backdrop.className = 'social-selector-backdrop';

    backdrop.innerHTML = `
      <div class="social-selector-card">
        <div class="social-selector-header">
          <div class="social-selector-title">Select Section</div>
          <button style="background:none; border:none; color:var(--text-2); cursor:pointer; font-size:16px;" id="social-selector-close">✕</button>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px;">
          <button class="social-option-btn" id="btn-open-inbuilt-social">
            <div class="social-option-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px; height:20px;"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </div>
            <div class="social-option-info">
              <div class="social-option-name">Inbuilt Social Media</div>
              <div class="social-option-sub">Posts, Text Feed, Likes & Comments</div>
            </div>
          </button>

          <button class="social-option-btn" id="btn-open-rootchat-news">
            <div class="social-option-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px; height:20px;"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M18 18h-8"/><path d="M18 6h-8"/></svg>
            </div>
            <div class="social-option-info">
              <div class="social-option-name">RootChat News & Info</div>
              <div class="social-option-sub">Read live topics & search articles</div>
            </div>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.remove();
    });

    backdrop.querySelector('#social-selector-close').addEventListener('click', () => backdrop.remove());

    backdrop.querySelector('#btn-open-inbuilt-social').addEventListener('click', () => {
      backdrop.remove();
      activeTabMode = 'social';
      openSocialOverlay();
    });

    backdrop.querySelector('#btn-open-rootchat-news').addEventListener('click', () => {
      backdrop.remove();
      activeTabMode = 'news';
      openSocialOverlay();
    });
  }

  // 4. Open Main Overlay
  function openSocialOverlay() {
    isFeedOpen = true;

    document.querySelectorAll('.rail-btn, .mtab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('rail-feed')?.classList.add('active');
    document.getElementById('mtab-feed')?.classList.add('active');

    let overlay = document.getElementById('rc-social-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'rc-social-overlay';
      overlay.className = 'rc-social-overlay' + (isSocialLightMode ? ' light-mode' : '');
      document.body.appendChild(overlay);
    }

    if (activeTabMode === 'social') {
      renderSocialFeedUI(overlay);
    } else {
      renderNewsUI(overlay);
    }
  }

  function closeSocialOverlay() {
    if (!isFeedOpen) return;
    isFeedOpen = false;

    if (feedUnsub) { feedUnsub(); feedUnsub = null; }

    const overlay = document.getElementById('rc-social-overlay');
    if (overlay) overlay.remove();

    document.querySelectorAll('.rail-btn, .mtab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('rail-chats')?.classList.add('active');
    document.getElementById('mtab-chats')?.classList.add('active');
  }

  // Helper to open author profile using dedicated profile.js
  function openAuthorProfile(uid) {
    if (!uid) return;
    if (typeof window.showUserProfile === 'function') {
      window.showUserProfile(uid);
    } else {
      alert("profile.js file is missing or not loaded.");
    }
  }

  // 5. Render Inbuilt Social Media Feed UI
  function renderSocialFeedUI(overlay) {
    overlay.innerHTML = `
      <div class="social-wrapper fade-in">
        <div class="social-top-bar">
          <div class="social-feed-title">Social Feed</div>
          <div style="display:flex; gap:8px;">
            <button class="theme-toggle-btn" id="social-theme-toggle">
              ${isSocialLightMode ? '🌙 Dark Mode' : '👁️ Soft Grey Mode'}
            </button>
            <button class="btn btn-ghost" id="social-switch-menu" style="width:auto; padding:6px 12px; font-size:12px;">Switch Menu ↗</button>
          </div>
        </div>

        <div class="create-post-card">
          <textarea id="post-caption" class="post-textarea" rows="2" placeholder="What's on your mind? Share a post..."></textarea>
          <div class="post-actions-bar">
            <div style="display:flex; align-items:center; gap:8px;">
              <input type="file" id="post-img-input" accept="image/*" style="display:none;" />
              <button class="btn btn-ghost" id="post-img-btn" style="width:auto; padding:6px 12px; font-size:12px; border-radius:var(--radius-pill);">
                🖼️ Add Photo
              </button>
              <span id="post-img-name" style="font-size:11px; color:var(--mint); max-width:110px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;"></span>
            </div>
            <button class="btn btn-primary" id="publish-post-btn" style="width:auto; padding:6px 18px; font-size:13px;">Post</button>
          </div>
        </div>

        <div class="filter-pills-bar">
          <button class="tab-chip ${!savedPostsOnly ? 'active' : ''}" id="filter-all-posts">All Posts</button>
          <button class="tab-chip ${savedPostsOnly ? 'active' : ''}" id="filter-saved-posts">Saved Posts</button>
        </div>

        <div id="posts-stream-list" style="display:flex; flex-direction:column; gap:14px; min-height:100px;">
          <div style="display:flex; justify-content:center; align-items:center; padding:30px;"><div class="spinner"></div></div>
        </div>
      </div>
    `;

    overlay.querySelector('#social-switch-menu').addEventListener('click', openSocialHubModal);

    const themeBtn = overlay.querySelector('#social-theme-toggle');
    themeBtn.addEventListener('click', () => {
      isSocialLightMode = !isSocialLightMode;
      if (isSocialLightMode) {
        overlay.classList.add('light-mode');
        themeBtn.textContent = '🌙 Dark Mode';
      } else {
        overlay.classList.remove('light-mode');
        themeBtn.textContent = '👁️ Soft Grey Mode';
      }
    });

    let selectedBase64Image = "";

    const imgBtn = overlay.querySelector('#post-img-btn');
    const imgInput = overlay.querySelector('#post-img-input');
    const imgName = overlay.querySelector('#post-img-name');
    const publishBtn = overlay.querySelector('#publish-post-btn');

    imgBtn.addEventListener('click', () => imgInput.click());

    imgInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 1 * 1024 * 1024) {
        alert("Image size limit exceeded! File must be smaller than 1MB.");
        imgInput.value = '';
        return;
      }
      imgName.textContent = file.name;
      const reader = new FileReader();
      reader.onload = (event) => { selectedBase64Image = event.target.result; };
      reader.readAsDataURL(file);
    });

    publishBtn.addEventListener('click', async () => {
      const caption = overlay.querySelector('#post-caption').value.trim();
      if (!caption && !selectedBase64Image) {
        alert("Please write some text or attach an image!");
        return;
      }

      const firebase = window.__rc_firebase;
      if (!firebase || !firebase.auth.currentUser) return;

      publishBtn.disabled = true;

      try {
        const { db, ref, push, set } = firebase;
        const newPostRef = push(ref(db, 'social_posts'));

        await set(newPostRef, {
          authorUid: firebase.auth.currentUser.uid,
          authorName: firebase.auth.currentUser.displayName || 'User',
          caption: caption,
          image: selectedBase64Image || null,
          createdAt: Date.now(),
          likes: {},
          comments: {},
          savedBy: {}
        });

        overlay.querySelector('#post-caption').value = '';
        imgInput.value = '';
        imgName.textContent = '';
        selectedBase64Image = "";
      } catch (e) {
        alert("Posting failed: Please verify Realtime Database rules/permissions.");
      } finally {
        publishBtn.disabled = false;
      }
    });

    overlay.querySelector('#filter-all-posts').addEventListener('click', () => {
      savedPostsOnly = false;
      renderSocialFeedUI(overlay);
    });
    overlay.querySelector('#filter-saved-posts').addEventListener('click', () => {
      savedPostsOnly = true;
      renderSocialFeedUI(overlay);
    });

    listenToPosts(overlay);
  }

  // 6. Firebase Live Data Sync
  function listenToPosts(overlay) {
    const firebase = window.__rc_firebase;
    if (!firebase || !firebase.auth.currentUser) return;

    const { db, ref, onValue, off } = firebase;
    const postsRef = ref(db, 'social_posts');

    if (feedUnsub) { feedUnsub(); feedUnsub = null; }

    const handler = (snapshot) => {
      const streamList = overlay.querySelector('#posts-stream-list');
      if (!streamList) return;

      const data = snapshot.val();
      const myUid = firebase.auth.currentUser.uid;

      if (!data) {
        renderEmptyState(streamList);
        return;
      }

      let postsArray = Object.keys(data).map(id => ({ id, ...data[id] }));
      postsArray.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      if (savedPostsOnly) {
        postsArray = postsArray.filter(p => p.savedBy && p.savedBy[myUid]);
      }

      if (postsArray.length === 0) {
        renderEmptyState(streamList);
        return;
      }

      let html = '';
      for (let post of postsArray) {
        const likesCount = post.likes ? Object.keys(post.likes).length : 0;
        const isLiked = post.likes && post.likes[myUid];
        const isSaved = post.savedBy && post.savedBy[myUid];
        const commentsArray = post.comments ? Object.values(post.comments) : [];
        const authorInitial = (post.authorName || 'U').charAt(0).toUpperCase();

        const isMyPost = post.authorUid === myUid;
        const isCommentSectionOpen = openCommentPosts.has(post.id);

        html += `
          <div class="post-card" data-post-id="${post.id}">
            <div class="post-header">
              <div class="post-author-wrap" data-author-uid="${post.authorUid || ''}">
                <div class="post-author-avatar">${authorInitial}</div>
                <div class="post-author-info">
                  <div class="post-author">${escapeHtml(post.authorName || 'User')}</div>
                  <div class="post-time">${formatPostTime(post.createdAt)}</div>
                </div>
              </div>

              ${isMyPost ? `
                <button class="btn-delete-post" title="Delete Post">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6"/></svg>
                </button>
              ` : ''}
            </div>

            ${post.caption ? `<div class="post-text">${escapeHtml(post.caption)}</div>` : ''}
            ${post.image ? `<div class="post-image-container"><img src="${post.image}" alt="Post Image" /></div>` : ''}

            <div class="post-footer">
              <button class="post-btn btn-like ${isLiked ? 'active' : ''}">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                <span>${likesCount}</span>
              </button>
              <button class="post-btn btn-toggle-comments ${isCommentSectionOpen ? 'active' : ''}">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                <span>${commentsArray.length}</span>
              </button>
              <button class="post-btn btn-save ${isSaved ? 'active' : ''}">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                <span>${isSaved ? 'Saved' : 'Save'}</span>
              </button>
              <button class="post-btn btn-share-post" data-author-name="${escapeHtml(post.authorName || 'User')}">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                <span>Share</span>
              </button>
            </div>

            <div class="comments-section ${isCommentSectionOpen ? '' : 'hidden'}">
              ${commentsArray.map(c => `
                <div class="single-comment">
                  <span class="comment-author" data-author-uid="${c.authorUid || ''}">${escapeHtml(c.authorName)}</span>
                  <span>${escapeHtml(c.text)}</span>
                </div>
              `).join('')}
              <div class="comment-input-wrap">
                <input type="text" class="comment-input" placeholder="Write a comment..." />
                <button class="btn btn-primary btn-send-comment" style="padding:6px 12px; font-size:11.5px; width:auto; border-radius:var(--radius-pill);">Send</button>
              </div>
            </div>
          </div>
        `;
      }

      streamList.innerHTML = html;
      bindActions(overlay);

      if (pendingHighlightPostId) {
        const targetPost = streamList.querySelector(`[data-post-id="${pendingHighlightPostId}"]`);
        if (targetPost) {
          targetPost.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetPost.classList.add('highlighted-post');
          setTimeout(() => targetPost.classList.remove('highlighted-post'), 2500);
        }
        pendingHighlightPostId = null;
      }
    };

    onValue(postsRef, handler, (err) => {
      const streamList = overlay.querySelector('#posts-stream-list');
      if (streamList) {
        streamList.innerHTML = `
          <div class="social-empty-feed">
            <div class="social-empty-title" style="color:var(--coral);">Permission Error</div>
            <p style="font-size:12.5px;">Please update Realtime Database rules.</p>
          </div>`;
      }
    });

    feedUnsub = () => off(postsRef, 'value', handler);
  }

  function renderEmptyState(container) {
    container.innerHTML = `
      <div class="social-empty-feed fade-in">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="width:40px; height:40px;"><path d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10"/></svg>
        <div class="social-empty-title">${savedPostsOnly ? 'No saved posts' : 'No posts yet'}</div>
        <p style="font-size:12.5px;">${savedPostsOnly ? 'Saved posts will appear here.' : 'Be the first person to create a post!'}</p>
      </div>
    `;
  }

  function formatPostTime(ts) {
    if (!ts) return '';
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' • ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // 7. Share Post Modal
  async function openShareModal(postId, authorName) {
    const firebase = window.__rc_firebase;
    if (!firebase || !firebase.auth.currentUser) return;

    const myUid = firebase.auth.currentUser.uid;
    const { db, ref, get, push, set } = firebase;

    const existing = document.getElementById('share-post-modal');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'share-post-modal';
    backdrop.className = 'share-modal-backdrop';
    backdrop.innerHTML = `
      <div class="share-modal-card">
        <div class="share-modal-title">
          <span>Share Post</span>
          <button style="background:none; border:none; color:var(--text-2); cursor:pointer; font-size:16px;" id="share-modal-close">✕</button>
        </div>
        <div class="share-chat-list" id="share-chat-list">
          <div style="text-align:center; padding:20px;"><div class="spinner"></div></div>
        </div>
        <button class="btn btn-primary" id="share-send-btn" disabled style="width:100%; padding:10px;">Send Link</button>
      </div>
    `;

    document.body.appendChild(backdrop);

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.remove();
    });
    backdrop.querySelector('#share-modal-close').addEventListener('click', () => backdrop.remove());

    try {
      const chatListEl = backdrop.querySelector('#share-chat-list');
      const sendBtn = backdrop.querySelector('#share-send-btn');

      let userListToDisplay = [];
      const userChatsSnap = await get(ref(db, `userChats/${myUid}`));

      if (userChatsSnap.exists()) {
        const chatsData = userChatsSnap.val();
        const chatIds = Object.keys(chatsData);

        for (let chatId of chatIds) {
          const otherUid = chatsData[chatId];
          if (!otherUid || typeof otherUid !== 'string') continue;

          const userSnap = await get(ref(db, `users/${otherUid}`));
          if (userSnap.exists()) {
            userListToDisplay.push({ chatId, user: userSnap.val() });
          }
        }
      }

      if (userListToDisplay.length === 0) {
        chatListEl.innerHTML = `<div style="text-align:center; color:var(--text-3); font-size:13px; padding:20px;">No active chats found. Start a chat first to share!</div>`;
        return;
      }

      let chatItemsHtml = '';
      userListToDisplay.forEach(item => {
        const userVal = item.user;
        const initial = (userVal.displayName || userVal.username || 'U').charAt(0).toUpperCase();

        chatItemsHtml += `
          <div class="share-chat-item" data-chat-id="${item.chatId}">
            <div class="share-chat-avatar">${initial}</div>
            <div class="share-chat-name">${escapeHtml(userVal.displayName || userVal.username)}</div>
            <div class="share-checkbox">✓</div>
          </div>
        `;
      });

      chatListEl.innerHTML = chatItemsHtml;
      const selectedChats = new Set();

      chatListEl.querySelectorAll('.share-chat-item').forEach(item => {
        item.addEventListener('click', () => {
          const cId = item.getAttribute('data-chat-id');
          if (selectedChats.has(cId)) {
            selectedChats.delete(cId);
            item.classList.remove('selected');
          } else {
            selectedChats.add(cId);
            item.classList.add('selected');
          }

          sendBtn.disabled = selectedChats.size === 0;
        });
      });

      sendBtn.addEventListener('click', async () => {
        sendBtn.disabled = true;
        sendBtn.textContent = "Sending...";

        const postLink = `rootchat/usr/${authorName.replace(/\s+/g, '')}/Post/${postId}`;
        const promises = [];

        selectedChats.forEach(cId => {
          const msgRef = push(ref(db, `chats/${cId}/messages`));
          promises.push(set(msgRef, {
            senderId: myUid,
            text: postLink,
            createdAt: Date.now(),
            seen: false
          }));

          promises.push(ref(db, `chats/${cId}/meta`).update ? ref(db, `chats/${cId}/meta`).update({
            lastMessageText: postLink,
            lastMessageAt: Date.now(),
            lastMessageSender: myUid
          }) : Promise.resolve());
        });

        await Promise.all(promises);
        backdrop.remove();
        alert("Post link shared successfully!");
      });

    } catch (err) {
      console.error(err);
      backdrop.remove();
      alert("Failed to load chat users.");
    }
  }

  // 8. Action Listeners
  function bindActions(overlay) {
    const firebase = window.__rc_firebase;
    if (!firebase || !firebase.auth.currentUser) return;
    const { db, ref, set, push, remove } = firebase;
    const myUid = firebase.auth.currentUser.uid;

    overlay.querySelectorAll('.post-card').forEach(card => {
      const postId = card.getAttribute('data-post-id');

      const authorWrap = card.querySelector('.post-author-wrap');
      if (authorWrap) {
        authorWrap.addEventListener('click', () => {
          const uid = authorWrap.getAttribute('data-author-uid');
          openAuthorProfile(uid);
        });
      }

      card.querySelectorAll('.comment-author').forEach(commentAuthorEl => {
        commentAuthorEl.addEventListener('click', () => {
          const uid = commentAuthorEl.getAttribute('data-author-uid');
          openAuthorProfile(uid);
        });
      });

      const shareBtn = card.querySelector('.btn-share-post');
      if (shareBtn) {
        shareBtn.addEventListener('click', () => {
          const authorName = shareBtn.getAttribute('data-author-name') || 'User';
          openShareModal(postId, authorName);
        });
      }

      const commentToggleBtn = card.querySelector('.btn-toggle-comments');
      const commentsSection = card.querySelector('.comments-section');

      if (commentToggleBtn && commentsSection) {
        commentToggleBtn.addEventListener('click', () => {
          const isHidden = commentsSection.classList.contains('hidden');
          if (isHidden) {
            commentsSection.classList.remove('hidden');
            commentToggleBtn.classList.add('active');
            openCommentPosts.add(postId);
            const input = commentsSection.querySelector('.comment-input');
            if (input) input.focus();
          } else {
            commentsSection.classList.add('hidden');
            commentToggleBtn.classList.remove('active');
            openCommentPosts.delete(postId);
          }
        });
      }

      const deleteBtn = card.querySelector('.btn-delete-post');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
          if (confirm("Are you sure you want to delete this post?")) {
            try {
              openCommentPosts.delete(postId);
              const postRef = ref(db, `social_posts/${postId}`);
              await remove(postRef);
            } catch (err) {
              alert("An error occurred while deleting the post.");
            }
          }
        });
      }

      const likeBtn = card.querySelector('.btn-like');
      if (likeBtn) {
        likeBtn.addEventListener('click', async () => {
          const likeRef = ref(db, `social_posts/${postId}/likes/${myUid}`);
          if (likeBtn.classList.contains('active')) {
            await remove(likeRef);
          } else {
            await set(likeRef, true);
          }
        });
      }

      const saveBtn = card.querySelector('.btn-save');
      if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
          const saveRef = ref(db, `social_posts/${postId}/savedBy/${myUid}`);
          if (saveBtn.classList.contains('active')) {
            await remove(saveRef);
          } else {
            await set(saveRef, true);
          }
        });
      }

      const sendCommentBtn = card.querySelector('.btn-send-comment');
      if (sendCommentBtn) {
        sendCommentBtn.addEventListener('click', async () => {
          const input = card.querySelector('.comment-input');
          const text = input.value.trim();
          if (!text) return;

          const commentsRef = push(ref(db, `social_posts/${postId}/comments`));
          await set(commentsRef, {
            authorUid: myUid,
            authorName: firebase.auth.currentUser.displayName || 'User',
            text: text,
            createdAt: Date.now()
          });
          input.value = '';
        });
      }
    });
  }

  // 9. Render RootChat News & Info UI
  function renderNewsUI(overlay) {
    overlay.innerHTML = `
      <div class="social-wrapper fade-in">
        <div class="social-top-bar">
          <div class="social-feed-title">🌐 RootChat News & Info</div>
          <button class="btn btn-ghost" id="wiki-switch-menu" style="width:auto; padding:6px 12px; font-size:12px;">Switch Menu ↗</button>
        </div>

        <div class="news-search-card">
          <input type="text" id="wiki-search-input" class="news-search-input" placeholder="Search any topic on RootChat News..." />
          <button class="btn btn-primary" id="wiki-search-btn" style="width:auto; padding:8px 18px;">Search</button>
        </div>

        <div id="wiki-results-list">
          <div class="news-empty-state">
            <div style="font-size:15px; font-weight:600; color:var(--text-1);">Search RootChat News & Info</div>
            <p style="font-size:12.5px;">Type any topic (e.g. Technology, India, Science, AI) to read inside RootChat.</p>
          </div>
        </div>
      </div>
    `;

    const input = overlay.querySelector('#wiki-search-input');
    const searchBtn = overlay.querySelector('#wiki-search-btn');
    const list = overlay.querySelector('#wiki-results-list');
    const switchBtn = overlay.querySelector('#wiki-switch-menu');

    switchBtn.addEventListener('click', openSocialHubModal);

    const executeWikiSearch = async () => {
      const query = input.value.trim();
      if (!query) return;

      list.innerHTML = `<div style="display:flex; justify-content:center; padding:40px;"><div class="spinner"></div></div>`;

      try {
        const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${encodeURIComponent(query)}`);
        const data = await res.json();

        const searchResults = data.query ? data.query.search : [];

        if (searchResults.length === 0) {
          list.innerHTML = `
            <div class="news-empty-state">
              <div style="font-size:15px; font-weight:600; color:var(--coral);">No results found</div>
              <p style="font-size:12.5px;">Try searching with different keywords.</p>
            </div>`;
          return;
        }

        let html = '';
        searchResults.forEach(item => {
          html += `
            <div class="news-card">
              <div class="news-card-title" data-pageid="${item.pageid}">${item.title}</div>
              <div class="news-card-snippet">${item.snippet}...</div>
            </div>
          `;
        });

        list.innerHTML = html;

        list.querySelectorAll('.news-card-title').forEach(titleEl => {
          titleEl.addEventListener('click', () => {
            const pageId = titleEl.getAttribute('data-pageid');
            openArticleModal(pageId);
          });
        });

      } catch (err) {
        list.innerHTML = `
          <div class="news-empty-state">
            <div style="font-size:15px; font-weight:600; color:var(--coral);">Fetch Error</div>
            <p style="font-size:12.5px;">Failed to fetch articles. Check internet connection.</p>
          </div>`;
      }
    };

    searchBtn.addEventListener('click', executeWikiSearch);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') executeWikiSearch();
    });
  }

  // 10. Article Modal Reader
  async function openArticleModal(pageId) {
    const backdrop = document.createElement('div');
    backdrop.className = 'article-modal-backdrop';
    backdrop.innerHTML = `
      <div class="article-modal-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div class="article-modal-title">Loading...</div>
          <button style="background:none; border:none; color:var(--text-2); cursor:pointer; font-size:16px;" id="article-modal-close">✕</button>
        </div>
        <div class="article-modal-content">
          <div style="display:flex; justify-content:center; padding:30px;"><div class="spinner"></div></div>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.remove();
    });
    backdrop.querySelector('#article-modal-close').addEventListener('click', () => backdrop.remove());

    try {
      const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&origin=*&pageids=${pageId}`);
      const data = await res.json();

      const page = data.query.pages[pageId];
      backdrop.querySelector('.article-modal-title').textContent = page.title;
      backdrop.querySelector('.article-modal-content').textContent = page.extract || 'No detailed content available.';
    } catch (e) {
      backdrop.querySelector('.article-modal-content').textContent = 'Failed to load full article.';
    }
  }

  // 11. Strict Interceptor: Triggers Feed ONLY on clicking message bubble containing the link
  document.addEventListener('click', (e) => {
    const bubble = e.target.closest('.msg-bubble');
    if (!bubble) return;

    const content = bubble.textContent || '';
    const match = content.match(/rootchat\/usr\/[^\/]+\/Post\/([a-zA-Z0-9_\-]+)/);

    if (match && match[1]) {
      e.preventDefault();
      e.stopPropagation();
      const postId = match[1];
      pendingHighlightPostId = postId;
      activeTabMode = 'social';
      openSocialOverlay();
    }
  });

  // Global window functions
  window.toggleSocialFeed = openSocialOverlay;
  window.closeSocialFeed = closeSocialOverlay;

  // Observer to keep tab buttons in sync
  const observer = new MutationObserver(() => {
    injectNavButtons();
  });
  observer.observe(document.body, { childList: true, subtree: true });

})();