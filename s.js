(function () {
  // 1. File Input, Attach Button aur Gallery Styles head me inject karenge
  const style = document.createElement('style');
  style.textContent = `
    .file-upload-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-2);
      flex-shrink: 0;
      transition: background .15s;
    }
    .file-upload-btn:hover {
      background: var(--bg-3);
      color: var(--text-0);
    }
    .file-upload-btn svg {
      width: 20px;
      height: 20px;
    }
    /* Hidden native file input */
    #hidden-file-input {
      display: none !important;
    }
    /* Normal Neat Box Styles for File Bubble */
    .file-bubble-container {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 4px 2px;
      min-width: 180px;
      max-width: 240px;
    }
    .file-icon-wrapper {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    /* Mine (Sent) vs Theirs (Received) icon background contrast */
    .msg-row.mine .file-icon-wrapper {
      background: rgba(6, 35, 26, 0.15);
    }
    .file-info-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }
    .file-name-label {
      font-size: 13.5px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .file-download-action {
      text-decoration: none;
      color: inherit;
    }
    .file-download-action:hover .file-name-label {
      text-decoration: underline;
    }

    /* Media Preview Styles */
    .media-preview-container {
      max-width: 260px;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      margin: 2px 0;
      transition: opacity 0.2s;
    }
    .media-preview-container:hover {
      opacity: 0.9;
    }
    .media-preview-img {
      width: 100%;
      max-height: 200px;
      object-fit: cover;
      display: block;
    }

    /* Lightbox Gallery Overlay */
    .gallery-lightbox {
      position: fixed;
      inset: 0;
      background: rgba(6, 10, 9, 0.95);
      backdrop-filter: blur(8px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.25s cubic-bezier(.22,.9,.28,1);
    }
    .lightbox-content {
      max-width: 90vw;
      max-height: 80vh;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 16px 48px rgba(0,0,0,0.5);
    }
    .lightbox-close {
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(255,255,255,0.1);
      color: #fff;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 20px;
      border: none;
      transition: background 0.2s;
    }
    .lightbox-close:hover {
      background: rgba(255,255,255,0.2);
    }
    .lightbox-caption {
      position: absolute;
      bottom: 20px;
      color: #b9c9c2;
      font-size: 14px;
      text-align: center;
      width: 100%;
      padding: 0 20px;
    }
  `;
  document.head.appendChild(style);

  // Attachment icon SVG
  const ATTACH_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`;
  // Document icon SVG
  const DOC_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
  // Close icon SVG for lightbox
  const CLOSE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="width:20px; height:20px;"><path d="M18 6L6 18M6 6l12 12"/></svg>`;

  // Helper function to check image extension
  function isImageFile(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
  }

  // 2. DOM me input detect karne ke liye MutationObserver
  const observer = new MutationObserver(() => {
    const composer = document.querySelector('.composer'); //
    if (composer && !document.getElementById('hidden-file-input')) { //
      setupFileUpload(composer); //
    }
  });

  observer.observe(document.body, { childList: true, subtree: true }); //

  function setupFileUpload(composer) { //
    const fileInput = document.createElement('input'); //
    fileInput.type = 'file'; //
    fileInput.id = 'hidden-file-input'; //
    document.body.appendChild(fileInput); //

    const attachBtn = document.createElement('button'); //
    attachBtn.className = 'file-upload-btn'; //
    attachBtn.id = 'file-upload-trigger'; //
    attachBtn.title = 'Send File/Image (Max 1MB)';
    attachBtn.innerHTML = ATTACH_ICON; //

    const emojiBtn = composer.querySelector('#emoji-toggle'); //
    if (emojiBtn) { //
      emojiBtn.parentNode.insertBefore(attachBtn, emojiBtn.nextSibling); //
    } else { //
      composer.insertBefore(attachBtn, composer.firstChild); //
    }

    attachBtn.addEventListener('click', () => { //
      fileInput.click(); //
    });

    fileInput.addEventListener('change', async (e) => { //
      const file = e.target.files[0]; //
      if (!file) return; //

      const maxLimit = 1 * 1024 * 1024; // 1 MB

      if (file.size > maxLimit) { //
        alert("Limit reached! You cant send file bigger than 1 mb"); //
        fileInput.value = ''; //
        return; //
      }

      const selectedChatItem = document.querySelector('.chat-item.selected'); //
      const activeChatId = selectedChatItem ? selectedChatItem.getAttribute('data-chat-id') : null; //

      if (!activeChatId) { //
        alert("Koi active chat nahi mili! Kripya kisi chat par click karein."); //
        fileInput.value = ''; //
        return; //
      }

      const reader = new FileReader(); //
      reader.onload = async function (event) { //
        const base64Data = event.target.result; //
        await sendFileMessage(activeChatId, file.name, base64Data); //
        fileInput.value = ''; //
      };
      reader.readAsDataURL(file); //
    });
  }

  async function sendFileMessage(activeChatId, fileName, base64Data) { //
    const firebase = window.__rc_firebase; //

    if (!firebase) { //
      alert("Firebase module ready nahi hai!"); //
      return; //
    }

    const messageText = `塘 FILE:[${fileName}](${base64Data})`; //
    const { db, ref, push, set, update } = firebase; //

    const msgRef = push(ref(db, `chats/${activeChatId}/messages`)); //
    const now = Date.now(); //
    const myUid = firebase.auth.currentUser.uid; //

    await set(msgRef, { //
      senderId: myUid, //
      text: messageText, //
      createdAt: now, //
      seen: false, //
      deleted: false, //
      edited: false, //
    });

    const uids = activeChatId.split('__'); //
    const otherUid = uids.find(uid => uid !== myUid) || myUid; //

    const chatUpdates = {}; //
    
    // Recent chat preview texts update logic
    if (isImageFile(fileName)) {
      chatUpdates[`chats/${activeChatId}/meta/lastMessageText`] = `🖼️ Photo: ${fileName}`;
    } else {
      chatUpdates[`chats/${activeChatId}/meta/lastMessageText`] = `刀 Document: ${fileName}`; //
    }
    
    chatUpdates[`chats/${activeChatId}/meta/lastMessageAt`] = now; //
    chatUpdates[`chats/${activeChatId}/meta/lastMessageSender`] = myUid; //
    
    try {
      const unreadSnap = await firebase.get(ref(db, `chats/${activeChatId}/meta/unread/${otherUid}`)); //
      const currentUnread = unreadSnap.exists() ? unreadSnap.val() : 0; //
      chatUpdates[`chats/${activeChatId}/meta/unread/${otherUid}`] = currentUnread + 1; //
    } catch (err) {
      chatUpdates[`chats/${activeChatId}/meta/unread/${otherUid}`] = 1; //
    }

    await update(ref(db), chatUpdates); //
  }

  // 3. Parser jo Base64 string ko custom Image Preview card ya Document Card me render karega
  const contentObserver = new MutationObserver(() => {
    document.querySelectorAll('.msg-bubble').forEach(bubble => {
      const txt = bubble.textContent; //
      if (txt.startsWith('塘 FILE:[')) { //
        const match = txt.match(/塘 FILE:\[(.*?)\]\((.*?)\)/); //
        if (match) {
          const name = match[1]; //
          const dataUrl = match[2]; //
          
          if (isImageFile(name)) {
            // Image layout inside bubble with data attributes for gallery lookup
            bubble.innerHTML = `
              <div class="media-preview-container rc-gallery-trigger" data-src="${dataUrl}" data-name="${name}">
                <img src="${dataUrl}" class="media-preview-img" alt="${name}" loading="lazy" />
              </div>
            `;
          } else {
            // Document card fall-through rendering framework logic
            bubble.innerHTML = `
              <a href="${dataUrl}" download="${name}" class="file-download-action" target="_blank">
                <div class="file-bubble-container">
                  <div class="file-icon-wrapper">
                    ${DOC_ICON}
                  </div>
                  <div class="file-info-text">
                    <span class="file-name-label" title="${name}">${name}</span>
                  </div>
                </div>
              </a>
            `;
          }
        }
      }
    });
  });

  contentObserver.observe(document.body, { childList: true, subtree: true });

  // 4. Global Event Listener for Lightbox Overlay (Popup view)
  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('.rc-gallery-trigger');
    if (trigger) {
      const src = trigger.getAttribute('data-src');
      const name = trigger.getAttribute('data-name');
      if (src) openLightbox(src, name);
    }
  });

  function openLightbox(src, name) {
    // Purana open lightbox clean up karenge safety ke liye
    const oldLightbox = document.getElementById('rc-active-lightbox');
    if (oldLightbox) oldLightbox.remove();

    const lightbox = document.createElement('div');
    lightbox.id = 'rc-active-lightbox';
    lightbox.className = 'gallery-lightbox';
    lightbox.innerHTML = `
      <button class="lightbox-close">${CLOSE_ICON}</button>
      <img src="${src}" class="lightbox-content" alt="${name}" />
      <div class="lightbox-caption">${name}</div>
    `;

    document.body.appendChild(lightbox);

    // Event handlers to close lightbox window context
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', () => lightbox.remove());
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.remove();
    });

    // Escape Key compatibility injection
    const escHandler = function (e) {
      if (e.key === 'Escape') {
        lightbox.remove();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

})();