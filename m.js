(function () {
  // 1. Dropdown Menu aur Bulk Selection ke CSS Styles
  const style = document.createElement('style');
  style.textContent = `
    .rc-dropdown {
      position: absolute;
      top: 50px;
      right: 18px;
      background: var(--bg-elevated);
      border: 1px solid var(--line);
      border-radius: var(--radius-sm);
      box-shadow: var(--shadow-md);
      z-index: 1000; /* Ultra High Priority */
      display: flex;
      flex-direction: column;
      padding: 6px;
      min-width: 140px;
      animation: popIn .2s var(--ease);
    }
    .rc-dropdown-item {
      padding: 10px 12px;
      font-size: 13.5px;
      text-align: left;
      border-radius: 6px;
      cursor: pointer;
      transition: background .15s;
      background: none;
      color: var(--text-0);
      width: 100%;
    }
    .rc-dropdown-item:hover {
      background: var(--bg-3);
    }
    .rc-dropdown-item.danger {
      color: var(--coral);
    }
    .rc-dropdown-item.danger:hover {
      background: rgba(255, 107, 94, 0.1);
    }
    /* Blocked View Overlay */
    .blocked-notice-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 16px;
      border-top: 1px solid var(--line);
      background: var(--bg-1);
    }
    .blocked-notice-text {
      font-size: 13px;
      color: var(--text-2);
    }
    .blocked-btn-group {
      display: flex;
      gap: 10px;
    }
    /* Whatsapp Style Selection Overlay indicator */
    .chat-item.selectable-mode {
      position: relative;
    }
    .chat-item.selected-for-delete {
      background: var(--bg-3) !important;
    }
    .chat-item.selected-for-delete::after {
      content: '✓';
      position: absolute;
      right: 12px;
      top: 12px;
      background: var(--mint);
      color: #06231a;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: bold;
    }
    /* Bulk Delete Action Bar */
    .bulk-delete-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--bg-elevated);
      border-top: 1px solid var(--line);
      padding: 12px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 30;
      animation: fadeUp .25s var(--ease);
    }
  `;
  document.head.appendChild(style);

  let isSelectionMode = false;
  let selectedChats = new Set();
  let blockedUsers = new Set();

  // LocalStorage se blocked users load karna
  try {
    const saved = localStorage.getItem('rc_blocked_users');
    if (saved) blockedUsers = new Set(JSON.parse(saved));
  } catch(e){}

  // 2. Click Handler at Capturing Phase (Highest priority to block default profile popup)
  document.addEventListener('click', function (e) {
    const moreBtn = e.target.closest('#chat-more-btn');
    const existingDropdown = document.getElementById('rc-chat-dropdown');

    if (moreBtn) {
      // Dono commands lagayi taaki main application ka handleProfile popup load hi na ho sake!
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation(); 

      if (existingDropdown) {
        existingDropdown.remove();
        return;
      }
      showDropdown(moreBtn);
    } else if (existingDropdown && !e.target.closest('#rc-chat-dropdown')) {
      existingDropdown.remove();
    }
  }, true); // 'true' parameter lagane se event capture state me hi check ho jata hai

  function showDropdown(anchor) {
    const selectedChatItem = document.querySelector('.chat-item.selected');
    if (!selectedChatItem) return;

    const chatId = selectedChatItem.getAttribute('data-chat-id');
    const otherUid = selectedChatItem.getAttribute('data-other-uid');

    const dropdown = document.createElement('div');
    dropdown.id = 'rc-chat-dropdown';
    dropdown.className = 'rc-dropdown';

    const isBlocked = blockedUsers.has(otherUid);

    dropdown.innerHTML = `
      <button class="rc-dropdown-item" id="opt-block">${isBlocked ? 'Unblock User' : 'Block User'}</button>
      <button class="rc-dropdown-item" id="opt-select">Select Chats</button>
      <button class="rc-dropdown-item danger" id="opt-delete-this">Delete Chat</button>
    `;

    anchor.parentNode.appendChild(dropdown);

    // Dropdown Actions
    document.getElementById('opt-block').addEventListener('click', () => {
      if (isBlocked) {
        unblockUser(otherUid);
      } else {
        blockUser(otherUid);
      }
      dropdown.remove();
    });

    document.getElementById('opt-select').addEventListener('click', () => {
      enableSelectionMode();
      dropdown.remove();
    });

    document.getElementById('opt-delete-this').addEventListener('click', async () => {
      if (confirm("Kya aap is chat ko delete karna chahte hain?")) {
        await deleteSingleChat(chatId);
      }
      dropdown.remove();
    });
  }

  // 3. Block / Unblock Controls
  function blockUser(uid) {
    blockedUsers.add(uid);
    localStorage.setItem('rc_blocked_users', JSON.stringify([...blockedUsers]));
    alert("User ko block kar diya gaya hai.");
    applyBlockUI();
  }

  function unblockUser(uid) {
    blockedUsers.delete(uid);
    localStorage.setItem('rc_blocked_users', JSON.stringify([...blockedUsers]));
    alert("User ko unblock kar diya gaya hai.");
    applyBlockUI();
  }

  function removeUser(uid) {
    if (confirm("Kya aap is user ko chat list se hatana chahte hain?")) {
      const selectedChatItem = document.querySelector('.chat-item.selected');
      if (selectedChatItem) {
        const chatId = selectedChatItem.getAttribute('data-chat-id');
        deleteSingleChat(chatId);
      }
    }
  }

  function applyBlockUI() {
    const selectedChatItem = document.querySelector('.chat-item.selected');
    const composer = document.querySelector('.composer');
    const msgScroll = document.getElementById('messages-scroll');
    const noticeArea = document.getElementById('blocked-notice-area');

    if (!selectedChatItem) return;
    const otherUid = selectedChatItem.getAttribute('data-other-uid');

    if (blockedUsers.has(otherUid)) {
      if (composer) composer.style.setProperty('display', 'none', 'important');
      if (msgScroll) msgScroll.style.setProperty('display', 'none', 'important');

      if (!noticeArea) {
        const notice = document.createElement('div');
        notice.id = 'blocked-notice-area';
        notice.className = 'blocked-notice-area';
        notice.innerHTML = `
          <div class="blocked-notice-text">Aapne is user ko block kiya hua hai</div>
          <div class="blocked-btn-group">
            <button class="btn btn-ghost" id="btn-unblock-trigger" style="padding: 8px 16px; font-size:13px;">Unblock</button>
            <button class="btn btn-ghost" id="btn-remove-trigger" style="padding: 8px 16px; font-size:13px; color:var(--coral);">Delete User</button>
          </div>
        `;
        document.getElementById('chat-panel').appendChild(notice);

        document.getElementById('btn-unblock-trigger').addEventListener('click', () => unblockUser(otherUid));
        document.getElementById('btn-remove-trigger').addEventListener('click', () => removeUser(otherUid));
      }
    } else {
      if (composer) composer.style.removeProperty('display');
      if (msgScroll) msgScroll.style.removeProperty('display');
      if (noticeArea) noticeArea.remove();
    }
  }

  // 4. Whatsapp Style Selection Mode logic
  function enableSelectionMode() {
    isSelectionMode = true;
    selectedChats.clear();
    
    document.querySelectorAll('.chat-list .chat-item').forEach(item => {
      item.classList.add('selectable-mode');
    });

    let actionBar = document.getElementById('bulk-delete-bar');
    if (!actionBar) {
      actionBar = document.createElement('div');
      actionBar.id = 'bulk-delete-bar';
      actionBar.className = 'bulk-delete-bar';
      actionBar.innerHTML = `
        <button class="btn btn-ghost" id="bulk-cancel-btn" style="padding:8px 14px; font-size:13px;">Cancel</button>
        <span id="bulk-select-count" style="font-size:13.5px; font-weight:600;">0 Selected</span>
        <button class="btn btn-primary" id="bulk-delete-btn" style="background:var(--coral); color:white; padding:8px 14px; font-size:13px; box-shadow:none;" disabled>Delete Chats</button>
      `;
      
      const sidebar = document.getElementById('sidebar');
      sidebar.appendChild(actionBar);

      document.getElementById('bulk-cancel-btn').addEventListener('click', disableSelectionMode);
      document.getElementById('bulk-delete-btn').addEventListener('click', handleBulkDelete);
    }
  }

  function disableSelectionMode() {
    isSelectionMode = false;
    selectedChats.clear();
    document.querySelectorAll('.chat-list .chat-item').forEach(item => {
      item.classList.remove('selectable-mode', 'selected-for-delete');
    });
    const actionBar = document.getElementById('bulk-delete-bar');
    if (actionBar) actionBar.remove();
  }

  document.addEventListener('click', function(e) {
    if (!isSelectionMode) return;
    
    const chatItem = e.target.closest('.chat-list .chat-item');
    if (!chatItem) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const chatId = chatItem.getAttribute('data-chat-id');

    if (selectedChats.has(chatId)) {
      selectedChats.delete(chatId);
      chatItem.classList.remove('selected-for-delete');
    } else {
      selectedChats.add(chatId);
      chatItem.classList.add('selected-for-delete');
    }

    const countLabel = document.getElementById('bulk-select-count');
    const deleteBtn = document.getElementById('bulk-delete-btn');
    if (countLabel) countLabel.textContent = `${selectedChats.size} Selected`;
    if (deleteBtn) deleteBtn.disabled = selectedChats.size === 0;
  }, true);

  // 5. Firebase deletion integration
  async function deleteSingleChat(chatId) {
    const firebase = window.__rc_firebase;
    if (!firebase) return;

    const myUid = firebase.auth.currentUser.uid;
    const { db, ref, remove } = firebase;

    try {
      await remove(ref(db, `userChats/${myUid}/${chatId}`));
      await remove(ref(db, `chats/${chatId}`));
      alert("Chat delete ho gayi.");
      location.reload();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleBulkDelete() {
    const firebase = window.__rc_firebase;
    if (!firebase || selectedChats.size === 0) return;

    if (confirm(`Kya aap in sabhi (${selectedChats.size}) selected chats ko delete karna chahte hain?`)) {
      const myUid = firebase.auth.currentUser.uid;
      const { db, ref, remove } = firebase;

      const promises = [];
      selectedChats.forEach(chatId => {
        promises.push(remove(ref(db, `userChats/${myUid}/${chatId}`)));
        promises.push(remove(ref(db, `chats/${chatId}`)));
      });

      try {
        await Promise.all(promises);
        alert("Selected chats ko kamyabi se delete kar diya gaya.");
        disableSelectionMode();
        location.reload();
      } catch (err) {
        alert("Kuch chats delete nahi ho payin.");
      }
    }
  }

  const blockUIObserver = new MutationObserver(() => {
    applyBlockUI();
  });
  blockUIObserver.observe(document.body, { childList: true, subtree: true });

})();