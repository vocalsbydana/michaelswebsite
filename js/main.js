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

  // Contact form: submit in the background so the visitor stays on the page.
  // Without JS the form still posts normally to Formspree, which shows its own
  // confirmation page — so this is enhancement, not a requirement.
  var contactForm = document.querySelector(".contact-form");
  var status = contactForm ? contactForm.querySelector(".form-status") : null;

  if (contactForm && status && window.fetch) {
    var fieldErrors = contactForm.querySelectorAll(".field-error");

    // Clear any per-field messages left over from a previous attempt
    function clearFieldErrors() {
      fieldErrors.forEach(function (el) {
        el.textContent = "";
        var input = contactForm.elements[el.getAttribute("data-error-for")];
        if (input) input.removeAttribute("aria-invalid");
      });
    }

    // Formspree returns { errors: [{ field, message }, ...] }. Show each message
    // beside its input where we can, and return whatever couldn't be placed.
    function showFieldErrors(errors) {
      var unplaced = [];
      errors.forEach(function (err) {
        var slot = err.field
          ? contactForm.querySelector('[data-error-for="' + err.field + '"]')
          : null;
        if (slot) {
          slot.textContent = err.message;
          var input = contactForm.elements[err.field];
          if (input) input.setAttribute("aria-invalid", "true");
        } else {
          unplaced.push(err.message);
        }
      });
      return unplaced;
    }

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var button = contactForm.querySelector("button[type=submit]");
      button.disabled = true;
      clearFieldErrors();
      status.className = "form-status is-pending";
      status.textContent = "Sending…";

      fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            contactForm.reset();
            status.className = "form-status is-ok";
            status.textContent =
              "Thanks — your message is on its way. Michael will be in touch soon.";
            return;
          }
          return res.json().then(function (data) {
            var errors = (data && data.errors) || [];
            var unplaced = showFieldErrors(errors);
            status.className = "form-status is-error";
            status.textContent = unplaced.length
              ? unplaced.join(" ")
              : errors.length
                ? "Please check the highlighted fields and try again."
                : "Something went wrong. Please try again, or reach out on Instagram.";
          });
        })
        .catch(function () {
          status.className = "form-status is-error";
          status.textContent =
            "Couldn't reach the server. Please check your connection and try again, " +
            "or reach out on Instagram.";
        })
        .finally(function () {
          button.disabled = false;
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
