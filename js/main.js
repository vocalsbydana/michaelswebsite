/* Michael The Bassist — small progressive-enhancement script.
   No dependencies, no build step. */

(function () {
  "use strict";

  // Current year in footer
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    // Close the menu after tapping a link
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Preloader: hide once the page (incl. images/fonts) has loaded, with a
  // short minimum so the animation is seen, and a hard fallback so it can
  // never get stuck.
  var startTime = Date.now();
  function hidePreloader() {
    document.body.classList.add("loaded");
  }
  window.addEventListener("load", function () {
    var elapsed = Date.now() - startTime;
    var wait = Math.max(0, 650 - elapsed);
    window.setTimeout(hidePreloader, wait);
  });
  // Safety net in case 'load' never fires
  window.setTimeout(hidePreloader, 4000);

  // Scroll-spy: highlight the nav link for the section in view
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.site-nav a[href^="#"]')
  );
  var sections = navLinks
    .map(function (a) {
      var id = a.getAttribute("href").slice(1);
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (a) {
              a.classList.toggle(
                "active",
                a.getAttribute("href") === "#" + entry.target.id
              );
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  // Subtle parallax on the hero image and the B&W performance band
  if (!reduceMotion) {
    var heroMedia = document.querySelector(".hero-media");
    var band = document.querySelector(".band");
    var bandImg = band ? band.querySelector("img") : null;
    var ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var y = window.pageYOffset;
        if (heroMedia) {
          heroMedia.style.transform = "translateY(" + y * 0.18 + "px)";
        }
        if (band && bandImg) {
          var rect = band.getBoundingClientRect();
          var offset = (rect.top - window.innerHeight / 2) * -0.08;
          bandImg.style.transform = "translateY(" + offset + "px) scale(1.12)";
        }
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Magnetic hover on the social icons and buttons
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    var magnets = document.querySelectorAll(".watch-social a, .btn, .social a");
    magnets.forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var mx = e.clientX - r.left - r.width / 2;
        var my = e.clientY - r.top - r.height / 2;
        el.style.transform =
          "translate(" + mx * 0.3 + "px," + my * 0.3 + "px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "";
      });
    });
  }

  // Scroll-reveal for elements marked .reveal
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();
