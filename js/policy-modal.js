/* ============================================
   SHRED HIMALAYAS — POLICY POPUP MODAL MANAGER
   ============================================ */

(function () {
  'use strict';

  var currentPolicyType = 'privacy';

  function createModalDOM() {
    if (document.getElementById('policyModalBackdrop')) return;

    var backdrop = document.createElement('div');
    backdrop.className = 'policy-modal-backdrop';
    backdrop.id = 'policyModalBackdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');

    backdrop.innerHTML = [
      '<div class="policy-modal">',
      '  <div class="policy-modal__header">',
      '    <div class="policy-modal__brand">',
      '      <div class="policy-modal__badge">',
      '        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      '        <span>Legal & Policy Hub</span>',
      '      </div>',
      '      <h2 class="policy-modal__title" id="policyModalTitle">Shred Himalayas Policies</h2>',
      '    </div>',
      '    <button class="policy-modal__close" id="policyModalClose" aria-label="Close modal">&times;</button>',
      '  </div>',
      '  <div class="policy-modal__tabs">',
      '    <button class="policy-tab-btn" data-tab="privacy">Privacy Policy</button>',
      '    <button class="policy-tab-btn" data-tab="terms">Terms of Service</button>',
      '    <button class="policy-tab-btn" data-tab="cancellation">Cancellation Policy</button>',
      '  </div>',
      '  <div class="policy-modal__body" id="policyModalBody"></div>',
      '  <div class="policy-modal__footer">',
      '    <span class="policy-modal__foot-text">Questions about our policies? We are here to help.</span>',
      '    <a href="https://wa.me/919149974118?text=Hi%2C%20I%20have%20a%20question%20regarding%20your%20policies." target="_blank" class="policy-modal__contact-btn">',
      '      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>',
      '      <span>Ask on WhatsApp</span>',
      '    </a>',
      '  </div>',
      '</div>'
    ].join('');

    document.body.appendChild(backdrop);

    // Event listeners inside modal
    document.getElementById('policyModalClose').addEventListener('click', closePolicyModal);
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) closePolicyModal();
    });

    var tabBtns = backdrop.querySelectorAll('.policy-tab-btn');
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tab = this.getAttribute('data-tab');
        renderPolicyTab(tab);
      });
    });
  }

  function renderPolicyTab(type) {
    currentPolicyType = type || 'privacy';
    createModalDOM();

    var backdrop = document.getElementById('policyModalBackdrop');
    var body = document.getElementById('policyModalBody');
    var tabBtns = backdrop.querySelectorAll('.policy-tab-btn');

    tabBtns.forEach(function (btn) {
      if (btn.getAttribute('data-tab') === currentPolicyType) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    var policies = typeof SHData !== 'undefined' ? SHData.getPolicies() : null;
    var defaults = typeof SHData !== 'undefined' && SHData.defaults ? SHData.defaults.policies : null;
    var content = '';

    if (policies && policies[currentPolicyType]) {
      content = policies[currentPolicyType];
    } else if (defaults && defaults[currentPolicyType]) {
      content = defaults[currentPolicyType];
    } else {
      content = '<p>Policy content unavailable.</p>';
    }

    body.innerHTML = content;
    body.scrollTop = 0;
  }

  function openPolicyModal(type) {
    createModalDOM();
    renderPolicyTab(type || 'privacy');
    var backdrop = document.getElementById('policyModalBackdrop');
    if (backdrop) {
      backdrop.classList.add('is-open');
    }
    document.body.style.overflow = 'hidden';
  }

  function closePolicyModal() {
    var backdrop = document.getElementById('policyModalBackdrop');
    if (backdrop) {
      backdrop.classList.remove('is-open');
    }
    document.body.style.overflow = '';
  }

  // Keyboard Escape listener
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closePolicyModal();
    }
  });

  // Global Click Event Listener to capture clicks on any policy links
  document.addEventListener('click', function (e) {
    var target = e.target.closest('[data-policy], .footer__bottom-link, .footer__policy-links a');
    if (!target) return;

    var text = (target.textContent || '').trim().toLowerCase();
    if (text.includes('admin')) return; // Skip Admin link

    var policyType = target.getAttribute('data-policy');
    if (!policyType) {
      if (text.includes('privacy')) policyType = 'privacy';
      else if (text.includes('terms')) policyType = 'terms';
      else if (text.includes('cancellation')) policyType = 'cancellation';
    }

    if (policyType) {
      e.preventDefault();
      openPolicyModal(policyType);
    }
  });

  // Expose globally
  window.openPolicyModal = openPolicyModal;
  window.closePolicyModal = closePolicyModal;
})();
