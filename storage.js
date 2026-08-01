(function () {
  // Safe Initialization: Jab tak Firebase ready na ho, execution check loop me rakhein
  if (window.__rc_firebase_ready) {
    initStorageSubsystem();
  } else {
    window.addEventListener('__rc_firebase_ready', initStorageSubsystem, { once: true });
  }

  function initStorageSubsystem() {
    // 1. Dynamic Fullscreen UI Layout Styles Injection
    const style = document.createElement('style');
    style.textContent = `
      .rail-btn.storage-active {
        background: var(--mint-glow);
        color: var(--mint);
      }
      .rail-btn.storage-active::before {
        content: ''; position: absolute; left: -20px; top: 50%; transform: translateY(-50%);
        width: 3px; height: 20px; background: var(--mint); border-radius: 2px;
      }
      
      /* Dedicated Fullscreen Layout Canvas Context */
      .storage-fullscreen-backdrop {
        position: fixed; inset: 0; background: var(--bg-0); z-index: 99;
        display: flex; flex-direction: column; animation: fadeIn 0.22s var(--ease);
      }
      .storage-fullscreen-backdrop.hidden {
        display: none !important;
      }
      
      .storage-header {
        display: flex; align-items: center; justify-content: space-between; padding: 20px 24px;
        border-bottom: 1px solid var(--line); flex-shrink: 0; background: var(--bg-1);
        padding-top: calc(20px + var(--safe-top));
      }
      .storage-meta-box {
        flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px;
      }
      .storage-title-row {
        display: flex; align-items: center; gap: 12px;
      }
      .storage-title {
        font-family: var(--font-display); font-size: 24px; font-weight: 600;
      }
      
      /* Progress Tracker Space Bar */
      .storage-progress-container {
        width: 100%; max-width: 360px; margin-top: 4px;
      }
      .storage-bar-bg {
        width: 100%; height: 7px; background: var(--bg-3); border-radius: 99px; overflow: hidden; position: relative;
      }
      .storage-bar-fill {
        height: 100%; width: 0%; background: var(--mint); transition: width 0.4s cubic-bezier(.22,.9,.28,1);
      }
      .storage-bar-fill.uploading {
        background: #5eb1ff !important;
      }
      .storage-stats-text {
        font-size: 12px; color: var(--text-2); margin-top: 5px; display: inline-block; font-weight: 500;
      }
      
      /* Grid Viewport Controls */
      .storage-actions-row {
        display: flex; gap: 12px; align-items: center;
      }
      .storage-body-scroll {
        flex: 1; overflow-y: auto; padding: 24px; display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px; align-content: start;
      }
      
      /* Element Cards Visual Graphic Box */
      .storage-item-card {
        background: var(--bg-1); border: 1.5px solid var(--line); border-radius: var(--radius-md);
        padding: 16px 12px; display: flex; flex-direction: column; align-items: center; text-align: center;
        position: relative; transition: border-color 0.2s, transform 0.15s, box-shadow 0.2s; cursor: pointer;
        box-shadow: var(--shadow-sm);
      }
      .storage-item-card:hover {
        border-color: var(--mint); transform: translateY(-3px); box-shadow: var(--shadow-md);
      }
      .storage-card-icon {
        width: 52px; height: 52px; border-radius: 14px; background: var(--bg-2);
        display: flex; align-items: center; justify-content: center; color: var(--text-1); margin-bottom: 12px;
      }
      .storage-item-card:hover .storage-card-icon {
        color: var(--mint); background: var(--bg-3);
      }
      .storage-card-title {
        font-size: 13.5px; font-weight: 600; width: 100%; white-space: nowrap;
        overflow: hidden; text-overflow: ellipsis; color: var(--text-0);
      }
      .storage-card-size {
        font-size: 11.5px; color: var(--text-3); margin-top: 4px;
      }
      .storage-card-delete {
        position: absolute; top: 8px; right: 8px; width: 28px; height: 28px;
        border-radius: 50%; display: flex; align-items: center; justify-content: center;
        color: var(--text-3); background: transparent; opacity: 0; transition: opacity 0.15s, color 0.15s, background 0.15s;
      }
      .storage-item-card:hover .storage-card-delete {
        opacity: 1;
      }
      .storage-card-delete:hover {
        color: var(--coral); background: rgba(255,107,94,0.12);
      }
      
      /* Note Creation Section UI Component */
      .storage-text-input-wrap {
        width: 100%; max-width: 460px; background: var(--bg-1); border: 1.5px solid var(--line);
        border-radius: var(--radius-md); padding: 16px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 12px;
        animation: fadeUp 0.3s var(--ease);
      }
      .storage-textarea {
        width: 100%; background: var(--bg-2); border: 1.5px solid var(--line); border-radius: var(--radius-sm);
        padding: 12px; font-size: 14px; color: var(--text-0); resize: none; min-height: 100px; outline: none;
        font-family: inherit;
      }
      .storage-textarea:focus { border-color: var(--mint); background: var(--bg-3); }
      
      @media (max-width: 860px) {
        .storage-header { padding: 16px; padding-top: calc(16px + var(--safe-top)); }
        .storage-body-scroll { padding: 16px; padding-bottom: calc(30px + var(--safe-bottom)); }
        .storage-actions-row .btn { padding: 8px 10px; font-size: 12px; }
      }
    `;
    document.head.appendChild(style);

    const HARD_LIMIT = 100 * 1024 * 1024; // 100 MB Allocation Quota
    const CLOUD_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-.09A6 6 0 0 0 6 5.66A7 7 0 0 0 7 19h11a5 5 0 0 0 5-5v-4a5 5 0 0 0-5-5z"/></svg>`;
    const FILE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
    const DELETE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>`;
    const BACK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`;
    const TEXT_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M16 13H8M16 17H8M10 9H8"/></svg>`;

    let userStorageCache = [];
    let isUploading = false;

    // 2. MutationObserver injection triggers hook
    const shellObserver = new MutationObserver(() => {
      const railNav = document.querySelector('.nav-rail'); //
      const mTabBar = document.querySelector('.mobile-tabbar'); //

      if (railNav && !document.getElementById('rail-storage-btn')) { //
        const storageBtn = document.createElement('button');
        storageBtn.className = 'rail-btn'; //
        storageBtn.id = 'rail-storage-btn';
        storageBtn.title = 'Personal Cloud Storage';
        storageBtn.innerHTML = CLOUD_ICON; //
        
        const settingsBtn = document.getElementById('rail-settings'); //
        if (settingsBtn) railNav.insertBefore(storageBtn, settingsBtn); //
        else railNav.appendChild(storageBtn); //
        
        storageBtn.addEventListener('click', launchDedicatedStoragePage);
      }

      if (mTabBar && !document.getElementById('mtab-storage-btn')) { //
        const mobBtn = document.createElement('button');
        mobBtn.className = 'mtab-btn'; //
        mobBtn.id = 'mtab-storage-btn';
        mobBtn.innerHTML = `${CLOUD_ICON}<span>Storage</span>`; //
        
        const mSettingsBtn = document.getElementById('mtab-settings'); //
        if (mSettingsBtn) mTabBar.insertBefore(mobBtn, mSettingsBtn); //
        else mTabBar.appendChild(mobBtn); //
        
        mobBtn.addEventListener('click', launchDedicatedStoragePage);
      }
    });

    shellObserver.observe(document.body, { childList: true, subtree: true }); //

    // 3. Launch Screen Controller Canvas routing
    function launchDedicatedStoragePage() {
      document.querySelectorAll('.rail-btn, .mtab-btn').forEach(b => b.classList.remove('active', 'storage-active')); //
      document.querySelectorAll('.chat-item').forEach(item => item.classList.remove('selected')); //
      
      const dBtn = document.getElementById('rail-storage-btn'); //
      const mBtn = document.getElementById('mtab-storage-btn'); //
      if (dBtn) dBtn.classList.add('storage-active'); //
      if (mBtn) mBtn.classList.add('active'); //

      let workspace = document.getElementById('rc-dedicated-storage-page');
      if (!workspace) {
        workspace = document.createElement('div');
        workspace.id = 'rc-dedicated-storage-page';
        workspace.className = 'storage-fullscreen-backdrop';
        document.body.appendChild(workspace);
      }
      
      workspace.classList.remove('hidden');
      buildPageSkeleton(workspace);
      bindLiveDatabaseStream();
    }

    function buildPageSkeleton(canvas) {
      canvas.innerHTML = `
        <div class="storage-header">
          <div class="storage-meta-box">
            <div class="storage-title-row">
              <button class="btn-icon" id="storage-close-canvas-btn" title="Back to main shell">${BACK_ICON}</button>
              <div class="storage-title">Personal Storage</div>
            </div>
            <div class="storage-progress-container">
              <div class="storage-bar-bg"><div class="storage-bar-fill" id="live-storage-indicator"></div></div>
              <span class="storage-stats-text" id="live-storage-metrics">Initializing workspace sync...</span>
            </div>
          </div>
          <div class="storage-actions-row">
            <button class="btn btn-ghost" id="storage-upload-text">+ Save Note</button>
            <button class="btn btn-primary" id="storage-upload-trigger-btn">Upload File</button>
            <button class="btn btn-ghost" id="storage-wipe-action">Wipe Storage</button>
          </div>
        </div>
        <div class="storage-body-scroll" id="storage-grid-viewport"></div>
        <input type="file" id="storage-hidden-file-input" style="display:none !important;" />
      `; //

      canvas.querySelector('#storage-close-canvas-btn').addEventListener('click', () => {
        canvas.classList.add('hidden');
        const dBtn = document.getElementById('rail-storage-btn'); //
        if (dBtn) dBtn.classList.remove('storage-active'); //
        
        const chatTab = document.getElementById('rail-chats'); //
        const mChatTab = document.getElementById('mtab-chats'); //
        if (chatTab) chatTab.classList.add('active'); //
        if (mChatTab) mChatTab.classList.add('active'); //
        
        document.getElementById('sidebar')?.classList.remove('view-hidden-mobile'); //
        document.getElementById('chat-panel')?.classList.remove('view-hidden-mobile'); //
      });

      canvas.querySelector('#storage-upload-trigger-btn').addEventListener('click', () => { //
        if (isUploading) return;
        canvas.querySelector('#storage-hidden-file-input').click(); //
      });
      
      canvas.querySelector('#storage-hidden-file-input').addEventListener('change', handleStorageFileUpload); //
      canvas.querySelector('#storage-upload-text').addEventListener('click', injectNoteCreationBox); //
      canvas.querySelector('#storage-wipe-action').addEventListener('click', performCompleteStorageWipe); //
    }

    // 4. Strong Network Stream Sync Layer Fix
    function bindLiveDatabaseStream() {
      const firebase = window.__rc_firebase; //
      const appState = window.S; //

      // Agar context user object load ho chuka hai to direct link karein, varna interval lagayein
      let activeUid = (firebase && firebase.auth && firebase.auth.currentUser && firebase.auth.currentUser.uid) || (appState && appState.user && appState.user.uid);

      if (!activeUid) {
        setTimeout(bindLiveDatabaseStream, 300);
        return;
      }

      const storageRef = firebase.ref(firebase.db, `userPersonalStorage/${activeUid}`); //

      firebase.onValue(storageRef, (snap) => { //
        const val = snap.val() || {}; //
        userStorageCache = Object.keys(val).map(id => ({ id, ...val[id] })).sort((a,b) => b.timestamp - a.timestamp); //
        if (!isUploading) {
          refreshStorageDisplayGrid(); //
        }
      });
    }

    function refreshStorageDisplayGrid() { //
      const grid = document.getElementById('storage-grid-viewport'); //
      if (!grid) return; //

      let totalBytesUsed = 0; //
      userStorageCache.forEach(item => { //
        totalBytesUsed += (item.size || 0); //
      });

      const percentUsed = Math.min((totalBytesUsed / HARD_LIMIT) * 100, 100); //
      const fillBar = document.getElementById('live-storage-indicator'); //
      const statsText = document.getElementById('live-storage-metrics'); //
      
      if (fillBar) {
        fillBar.classList.remove('uploading');
        fillBar.style.width = `${percentUsed}%`; //
      }
      if (statsText) { //
        statsText.textContent = `${formatBytes(totalBytesUsed)} used out of 100.00 MB (${percentUsed.toFixed(2)}%)`; //
        if (totalBytesUsed >= HARD_LIMIT) statsText.style.color = 'var(--coral)'; //
        else statsText.style.color = 'var(--text-2)'; //
      }

      if (!userStorageCache.length) { //
        grid.innerHTML = `
          <div style="grid-column: 1/-1; padding: 80px 20px; text-align:center; color: var(--text-3);">
            ${CLOUD_ICON}
            <h3 style="margin-top:14px; color: var(--text-2); font-size:18px;">Your Cloud Storage is Empty</h3>
            <p style="font-size:13.5px; max-width:300px; margin: 8px auto 0; line-height:1.5;">Upload files, text notes, documents or charts safely.</p>
          </div>
        `; //
        return; //
      }

      grid.innerHTML = userStorageCache.map(file => { //
        let icon = FILE_ICON; //
        if (file.type === 'note') icon = TEXT_ICON; //
        
        return `
          <div class="storage-item-card" data-id="${file.id}">
            <button class="storage-card-delete" title="Delete permanently">${DELETE_ICON}</button>
            <div class="storage-card-icon">${icon}</div>
            <div class="storage-card-title" title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</div>
            <div class="storage-card-size">${formatBytes(file.size)}</div>
          </div>
        `; //
      }).join(''); //

      grid.querySelectorAll('.storage-item-card').forEach(card => { //
        card.addEventListener('click', (e) => { //
          if (e.target.closest('.storage-card-delete')) { //
            e.stopPropagation(); //
            deleteIndividualStorageElement(card.getAttribute('data-id')); //
            return; //
          }
          openStoredElementResource(card.getAttribute('data-id')); //
        });
      });
    }

    // Live Loading Bar Simulator Handler for uploads
    function animateUploadProgress(callback) {
      isUploading = true;
      const fillBar = document.getElementById('live-storage-indicator');
      const statsText = document.getElementById('live-storage-metrics');
      
      if (fillBar) {
        fillBar.classList.add('uploading');
        fillBar.style.width = '0%';
      }

      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 15) + 5;
        if (currentProgress >= 95) {
          currentProgress = 95;
          clearInterval(progressInterval);
        }
        if (fillBar) fillBar.style.width = `${currentProgress}%`;
        if (statsText) statsText.textContent = `Uploading transaction data... ${currentProgress}%`;
      }, 150);

      return {
        complete: async () => {
          clearInterval(progressInterval);
          if (fillBar) fillBar.style.width = '100%';
          if (statsText) statsText.textContent = `Sync complete! Writing cloud database logs... 100%`;
          
          await callback();
          
          setTimeout(() => {
            isUploading = false;
            refreshStorageDisplayGrid(); //
          }, 600);
        }
      };
    }

    // 5. Operations Implementation Layer with Live Trackers
    async function handleStorageFileUpload(e) { //
      const file = e.target.files[0]; //
      if (!file || isUploading) return;

      let currentSize = 0; //
      userStorageCache.forEach(i => currentSize += i.size); //
      if (currentSize + file.size > HARD_LIMIT) { //
        alert("Quota limit hit! Please delete old data blocks before uploading.");
        e.target.value = '';
        return; //
      }

      const reader = new FileReader(); //
      reader.onload = function (evt) { //
        const base64Data = evt.target.result; //
        
        // Trigger live loader tracker
        const uploadTracker = animateUploadProgress(async () => {
          await commitAssetToCloudStorage(file.name, file.size, base64Data, 'file'); //
        });
        
        uploadTracker.complete();
        e.target.value = ''; //
      };
      reader.readAsDataURL(file); //
    }

    function injectNoteCreationBox() { //
      if (isUploading) return;
      const grid = document.getElementById('storage-grid-viewport'); //
      if (!grid) return; //

      let inputWrap = document.getElementById('rc-note-composer-box'); //
      if (inputWrap) { inputWrap.querySelector('.storage-textarea').focus(); return; } //

      inputWrap = document.createElement('div'); //
      inputWrap.id = 'rc-note-composer-box'; //
      inputWrap.className = 'storage-text-input-wrap'; //
      inputWrap.style.gridColumn = '1 / -1'; //
      inputWrap.innerHTML = `
        <textarea class="storage-textarea" placeholder="Type or paste your logs/notes details here..."></textarea>
        <div style="display:flex; gap:8px; justify-content: flex-end;">
          <button class="btn btn-ghost" id="note-cancel" style="padding:6px 12px; font-size:12.5px;">Cancel</button>
          <button class="btn btn-primary" id="note-save" style="padding:6px 12px; font-size:12.5px;">Save Note</button>
        </div>
      `; //

      grid.parentNode.insertBefore(inputWrap, grid); //
      inputWrap.querySelector('.storage-textarea').focus();
      
      inputWrap.querySelector('#note-cancel').addEventListener('click', () => inputWrap.remove()); //
      inputWrap.querySelector('#note-save').addEventListener('click', async () => { //
        const txt = inputWrap.querySelector('.storage-textarea').value.trim(); //
        if (!txt) return; //

        const sizeInBytes = new Blob([txt]).size; //
        const firstLine = txt.split('\n')[0].substring(0, 24) || "Untitled Note"; //
        const name = firstLine + (txt.length > 24 ? "..." : ""); //

        let currentSize = 0; //
        userStorageCache.forEach(i => currentSize += i.size); //
        if (currentSize + sizeInBytes > HARD_LIMIT) { //
          alert("Storage space capacity reached!");
          return; //
        }

        inputWrap.remove(); //
        
        const uploadTracker = animateUploadProgress(async () => {
          await commitAssetToCloudStorage(name, sizeInBytes, txt, 'note'); //
        });
        uploadTracker.complete();
      });
    }

    async function commitAssetToCloudStorage(name, size, rawPayload, type) { //
      const firebase = window.__rc_firebase; //
      const appState = window.S; //
      const activeUid = (firebase.auth.currentUser && firebase.auth.currentUser.uid) || (appState && appState.user && appState.user.uid);
      
      const dbRef = firebase.ref(firebase.db, `userPersonalStorage/${activeUid}`); //
      const itemRef = firebase.push(dbRef); //

      await firebase.set(itemRef, { //
        name,
        size,
        payload: rawPayload,
        type,
        timestamp: Date.now()
      });
      if (window.showToast) window.showToast("Saved to cluster partition", "ok"); //
    }

    async function deleteIndividualStorageElement(itemId) { //
      if (isUploading) return;
      const firebase = window.__rc_firebase; //
      const appState = window.S; //
      const activeUid = (firebase.auth.currentUser && firebase.auth.currentUser.uid) || (appState && appState.user && appState.user.uid);
      
      const recordRef = firebase.ref(firebase.db, `userPersonalStorage/${activeUid}/${itemId}`); //
      await firebase.remove(recordRef); //
      if (window.showToast) window.showToast("Item deleted from cloud", "ok"); //
    }

    async function performCompleteStorageWipe() { //
      if (isUploading) return;
      const confirmation = confirm("CRITICAL COMMAND EXECUTION WARNING!\n\nAre you sure you want to completely clear your Personal Storage dashboard? Every single document and logs entity will be completely dropped from server records."); //
      if (!confirmation) return; //

      const firebase = window.__rc_firebase; //
      const appState = window.S; //
      const activeUid = (firebase.auth.currentUser && firebase.auth.currentUser.uid) || (appState && appState.user && appState.user.uid);
      
      const storageRef = firebase.ref(firebase.db, `userPersonalStorage/${activeUid}`); //
      await firebase.remove(storageRef); //
      if (window.showToast) window.showToast("Cloud profile environment reset!", "ok"); //
    }

    function openStoredElementResource(itemId) { //
      if (isUploading) return;
      const target = userStorageCache.find(i => i.id === itemId); //
      if (!target) return; //

      if (target.type === 'note') { //
        if (window.openOverlay) { //
          const suicide = `
            <div class="overlay-panel">
              <div class="overlay-panel-header">
                <div class="overlay-panel-title">Stored Payload Logs</div>
                <button class="btn-icon" onclick="this.closest('.overlay-backdrop').remove()">${DELETE_ICON}</button>
              </div>
              <div class="overlay-panel-body">
                <pre style="white-space: pre-wrap; font-family:var(--font-mono); font-size:13.5px; background:var(--bg-2); padding:14px; border-radius:8px; border:1px solid var(--line); overflow-x:auto; max-height: 60vh;">${escapeHtml(target.payload)}</pre>
              </div>
            </div>
          `;
          window.openOverlay(suicide, true); //
        } else {
          alert(target.payload); //
        }
      } else {
        const dlLink = document.createElement('a'); //
        dlLink.href = target.payload; //
        dlLink.download = target.name; //
        dlLink.target = '_blank'; //
        document.body.appendChild(dlLink); //
        dlLink.click(); //
        dlLink.remove(); //
      }
    }

    // Mathematical calculations format context utilities
    function formatBytes(bytes, decimals = 2) { //
      if (bytes === 0) return '0 Bytes'; //
      const k = 1024; //
      const dm = decimals < 0 ? 0 : decimals; //
      const sizes = ['Bytes', 'KB', 'MB', 'GB']; //
      const i = Math.floor(Math.log(bytes) / Math.log(k)); //
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]; //
    }

    function escapeHtml(str) { //
      const div = document.createElement('div'); //
      div.textContent = str == null ? '' : String(str); //
      return div.innerHTML; //
    }
  }
})();