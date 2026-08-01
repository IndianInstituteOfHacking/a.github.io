(function () {
  // 1. Sleek transitions aur physics-based easing animations inject karenge
  const style = document.createElement('style');
  style.textContent = `
    /* Smooth Globals */
    :root {
      --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
      --ease-smooth: cubic-bezier(0.25, 1, 0.5, 1);
    }

    /* Chat List Item Hover & Active Transitions */
    .chat-list .chat-item {
      transition: background 0.25s var(--ease-smooth), transform 0.2s var(--ease-smooth) !important;
    }
    .chat-list .chat-item:hover {
      transform: translateY(-1px);
    }
    .chat-list .chat-item:active {
      transform: scale(0.98);
    }

    /* Selected state micro-indicator glow */
    .chat-item.selected::before {
      transition: height 0.3s var(--ease-spring) !important;
      box-shadow: 0 0 12px var(--mint);
    }

    /* Ultra Smooth Message Bubble Entry Animation */
    .msg-bubble {
      animation: smoothPopIn 0.35s var(--ease-spring) forwards !important;
      transform-origin: var(--origin, center bottom);
    }
    .msg-row.mine .msg-bubble {
      --origin: right bottom;
    }
    .msg-row.theirs .msg-bubble {
      --origin: left bottom;
    }

    @keyframes smoothPopIn {
      from {
        opacity: 0;
        transform: scale(0.88) translateY(8px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    /* Message Row Actions Hover Slide */
    .msg-actions {
      transition: opacity 0.2s var(--ease-smooth), transform 0.25s var(--ease-spring) !important;
      transform: translateY(6px) scale(0.95);
    }
    .msg-row:hover .msg-actions {
      transform: translateY(0) scale(1) !important;
    }

    /* Custom Popup Box Entry Animation Override */
    .rc-popup-box {
      animation: springPop 0.4s var(--ease-spring) forwards !important;
    }

    @keyframes springPop {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(15px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    /* Dropdown Smooth Scale-in Effect */
    .rc-dropdown {
      animation: dropdownSlideIn 0.22s var(--ease-spring) forwards !important;
      transform-origin: right top;
    }

    @keyframes dropdownSlideIn {
      from {
        opacity: 0;
        transform: scale(0.85) translateY(-5px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    /* File neat box hover effect */
    .file-download-action {
      transition: opacity 0.2s var(--ease-smooth);
    }
    .file-bubble-container {
      transition: transform 0.2s var(--ease-smooth), background 0.2s var(--ease-smooth);
    }
    .file-bubble-container:hover {
      transform: scale(1.02);
    }
  `;
  document.head.appendChild(style);

  // 2. Typing indicator aur micro-interactions tweak karne ke liye dynamic logic
  const observer = new MutationObserver(() => {
    // Dynamic message auto-scroll behaviour ko smoothing transition dena
    const scrollArea = document.getElementById('messages-scroll');
    if (scrollArea && scrollArea.style.scrollBehavior !== 'smooth') {
      scrollArea.style.scrollBehavior = 'smooth';
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

})();