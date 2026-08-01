// 1. Chat input box ke focus hone par aane wale bekar square outline ka fix
(function() {
  const style = document.createElement('style');
  style.textContent = `
    .composer-input:focus {
      outline: none !important;
      box-shadow: none !important;
    }
  `;
  document.head.appendChild(style);
})();

// 2. Deleted messages ko screen se puri tarah hide karne ka fix
(function() {
  const style = document.createElement('style');
  style.textContent = `
    /* Agar message row me 'deleted' class ho, to us puri row ko hide kar do */
    .msg-row:has(.msg-bubble.deleted) {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
})();