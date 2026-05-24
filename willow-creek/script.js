/* ============================================================
   WILLOW CREEK FARMSTAY — script.js
   FAQ accordion + mobile nav + form thank-you state.
   No external JS libraries.
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     MOBILE NAV
     ============================================================ */
  var hamburger = document.getElementById('hamburger');
  var nav       = document.getElementById('site-nav');

  function openNav() {
    hamburger.classList.add('is-open');
    nav.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    hamburger.classList.remove('is-open');
    nav.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      if (hamburger.classList.contains('is-open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    /* Close when clicking outside the header */
    document.addEventListener('click', function (e) {
      if (
        hamburger.classList.contains('is-open') &&
        !hamburger.contains(e.target) &&
        !nav.contains(e.target)
      ) {
        closeNav();
      }
    });

    /* Close when a nav link is clicked (navigates to section) */
    Array.prototype.forEach.call(nav.querySelectorAll('a'), function (link) {
      link.addEventListener('click', function () {
        closeNav();
      });
    });
  }

  /* ============================================================
     FAQ ACCORDION
     ============================================================ */
  var accordionItems = document.querySelectorAll('.accordion-item');

  Array.prototype.forEach.call(accordionItems, function (item) {
    var question = item.querySelector('.accordion-question');
    var answer   = item.querySelector('.accordion-answer');

    if (!question || !answer) return;

    question.addEventListener('click', function () {
      var isOpen = !answer.hidden;

      if (isOpen) {
        /* Close this item */
        answer.hidden = true;
        question.setAttribute('aria-expanded', 'false');
      } else {
        /* Open this item */
        answer.hidden = false;
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ============================================================
     INQUIRY FORM — THANK YOU STATE
     ============================================================ */
  var form     = document.getElementById('inquiry-form');
  var thankYou = document.getElementById('thank-you');

  if (form && thankYou) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      form.hidden     = true;
      thankYou.hidden = false;
      thankYou.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

})();

/* ============================================================
   REVEAL ANIMATION SYSTEM (beautiful-grid curtain wipe)
   IntersectionObserver fires each .reveal-wrap when it enters
   the viewport; stagger is calculated from position in parent.
   ============================================================ */
(function () {
  'use strict';

  var wraps = document.querySelectorAll('.reveal-wrap');
  if (!wraps.length) return;

  /* Skip animation for users who prefer reduced motion */
  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    Array.prototype.forEach.call(wraps, function (w) {
      w.classList.add('is-revealed', 'is-done');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      var el = entry.target;

      /* Stagger within the same parent container (e.g. gallery-grid) */
      var siblings = Array.prototype.slice.call(
        el.parentElement.querySelectorAll('.reveal-wrap')
      );
      /* data-reveal-delay overrides stagger (used on hero for a page-load pause) */
      var delay = el.dataset.revealDelay !== undefined
        ? parseInt(el.dataset.revealDelay, 10)
        : (siblings.indexOf(el) % 4) * 120;

      setTimeout(function () {
        el.classList.add('is-revealed');
        var curtain = el.querySelector('.reveal-curtain');
        if (curtain) {
          curtain.addEventListener('animationend', function () {
            el.classList.add('is-done');
          }, { once: true });
        }
      }, delay);

      observer.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  Array.prototype.forEach.call(wraps, function (w) {
    observer.observe(w);
  });
}());
