// Place this just before &lt;/body&gt; so all DOM elements exist
document.addEventListener('DOMContentLoaded', function () {

  /* ── Custom Cursor ───────────────────────────────────────── */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  // Guard: skip cursor logic if elements are missing
  if (dot && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    (function animateRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    })();

    document.querySelectorAll(
      'a, button, input, [class*="card"], [class*="chip"], .captcha-check'
    ).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ── Popup ───────────────────────────────────────────────── */
  let captchaChecked = false;

  function openPopup() {
    const overlay = document.getElementById('popup-overlay');
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closePopup() {
    const overlay = document.getElementById('popup-overlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';

    setTimeout(() => {
      const formView = document.getElementById('popup-form-view');
      const success  = document.getElementById('popup-success');
      const nameEl   = document.getElementById('popup-name');
      const phoneEl  = document.getElementById('popup-phone');
      const captcha  = document.getElementById('captcha-check');
      // Only reset if elements actually exist
      if (formView) formView.style.display = 'block';
      if (success)  success.style.display  = 'none';
      if (nameEl)   nameEl.value  = '';
      if (phoneEl)  phoneEl.value = '';
      if (captcha)  captcha.classList.remove('checked');
      captchaChecked = false;
    }, 350);
  }

  function toggleCaptcha(el) {
    captchaChecked = !captchaChecked;
    el.classList.toggle('checked', captchaChecked);
  }

  function submitPopup() {
    const nameEl  = document.getElementById('popup-name');
    const phoneEl = document.getElementById('popup-phone');
    if (!nameEl || !phoneEl) return;

    const name  = nameEl.value.trim();
    const phone = phoneEl.value.trim();
    if (!name)  { nameEl.focus();  return; }
    if (!phone) { phoneEl.focus(); return; }
    if (!captchaChecked) { alert('Please verify you are not a robot.'); return; }

    const formView = document.getElementById('popup-form-view');
    const success  = document.getElementById('popup-success');
    if (formView) formView.style.display = 'none';
    if (success)  success.style.display  = 'block';
  }

  // Close popup when clicking the overlay backdrop
  const overlay = document.getElementById('popup-overlay');
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === this) closePopup();
    });
  }

  // Expose functions globally for inline onclick="" attributes
  window.openPopup    = openPopup;
  window.closePopup   = closePopup;
  window.toggleCaptcha = toggleCaptcha;
  window.submitPopup  = submitPopup;

  // Auto-open after 3 seconds
  setTimeout(openPopup, 3000);

});