(function () {
  const firebase = window.__rc_firebase;

  // 1. Local Database Initialisation Logic
  const cacheManager = {
    // Profiles ko cache me daalna aur read karna
    saveProfile: function (uid, profileData) {
      try {
        localStorage.setItem(`rc_cache_prof_${uid}`, JSON.stringify(profileData));
      } catch (e) { console.warn("Cache full or disabled"); }
    },
    getProfile: function (uid) {
      try {
        const data = localStorage.getItem(`rc_cache_prof_${uid}`);
        return data ? JSON.parse(data) : null;
      } catch (e) { return null; }
    },

    // Chat messages backup data rules
    saveMessages: function (chatId, messages) {
      try {
        // Sirf last 50 messages cache karenge taaki memory full na ho
        const optimizedBatch = messages.slice(-50);
        localStorage.setItem(`rc_cache_msgs_${chatId}`, JSON.stringify(optimizedBatch));
      } catch (e) { console.warn("Message cache storage limit hit"); }
    },
    getMessages: function (chatId) {
      try {
        const data = localStorage.getItem(`rc_cache_msgs_${chatId}`);
        return data ? JSON.parse(data) : [];
      } catch (e) { return []; }
    }
  };

  // 2. Main Application context variables hook implementation
  const interceptorObserver = new MutationObserver(() => {
    if (window.S) {
      // Core state cache mechanism bypass implementation
      // Users details lookup framework hook override
      const originalFetch = window.fetchUserProfile;
      if (originalFetch && !originalFetch.isIntercepted) {
        window.fetchUserProfile = async function(uid) {
          const localData = cacheManager.getProfile(uid);
          if (localData) {
            window.S.usersCache[uid] = localData;
            return localData;
          }
          const cloudData = await originalFetch(uid);
          if (cloudData) cacheManager.saveProfile(uid, cloudData);
          return cloudData;
        };
        window.fetchUserProfile.isIntercepted = true;
      }
    }
  });

  interceptorObserver.observe(document.body, { childList: true, subtree: true });

  // 3. Dynamic background sync event interceptor for active chats
  document.addEventListener('click', function(e) {
    const chatItem = e.target.closest('.chat-list .chat-item');
    if (chatItem) {
      const chatId = chatItem.getAttribute('data-chat-id');
      if (chatId && window.messagesCache && window.messagesCache.length > 0) {
        // Sync active workspace array directly to hardware sandbox partition
        cacheManager.saveMessages(chatId, window.messagesCache);
      }
    }
  });

})();