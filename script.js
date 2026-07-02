/* =========================================================
   CA Deepak V Sharma & Associates — Site Scripts
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    setYear();
    initLoader();
    initScrollProgress();
    initNavbar();
    initHamburger();
    initRevealAnimations();
    initCounters();
    initTestimonialCarousel();
    initFaqAccordion();
    initAppointmentForm();
    initBackToTop();
    initSmoothAnchors();
  }

  /* ---------- Footer year ---------- */
  function setYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- Loading screen ---------- */
  function initLoader() {
    var loader = document.getElementById("loader");
    if (!loader) return;
    var done = false;
    function hide() {
      if (done) return;
      done = true;
      loader.classList.add("hidden");
    }
    window.addEventListener("load", function () {
      setTimeout(hide, 400);
    });
    // Fallback in case load event is delayed
    setTimeout(hide, 2200);
  }

  /* ---------- Scroll progress bar ---------- */
  function initScrollProgress() {
    var bar = document.getElementById("scrollProgress");
    if (!bar) return;
    function update() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var pct = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = pct + "%";
    }
    window.addEventListener("scroll", throttle(update, 50));
    update();
  }

  /* ---------- Sticky navbar background on scroll ---------- */
  function initNavbar() {
    var nav = document.getElementById("navbar");
    if (!nav) return;
    function update() {
      if (window.scrollY > 40) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    }
    window.addEventListener("scroll", throttle(update, 50));
    update();
  }

  /* ---------- Mobile hamburger menu ---------- */
  function initHamburger() {
    var btn = document.getElementById("hamburger");
    var menu = document.getElementById("mobileMenu");
    if (!btn || !menu) return;

    function closeMenu() {
      btn.classList.remove("open");
      menu.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Open menu");
    }
    function toggleMenu() {
      var isOpen = btn.classList.toggle("open");
      menu.classList.toggle("open", isOpen);
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      btn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    }

    btn.addEventListener("click", toggleMenu);
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Scroll reveal animations ---------- */
  function initRevealAnimations() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 6, 5) * 0.06 + "s";
      observer.observe(el);
    });
  }

  /* ---------- Animated counters ---------- */
  function initCounters() {
    var counters = document.querySelectorAll(".stat-number");
    if (!counters.length) return;

    function animateCounter(el) {
      var target = parseInt(el.getAttribute("data-target"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1600;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.floor(eased * target);
        el.textContent = value.toLocaleString("en-IN") + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString("en-IN") + suffix;
      }
      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCounter);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Testimonial carousel ---------- */
  function initTestimonialCarousel() {
    var track = document.getElementById("testimonialTrack");
    var dotsWrap = document.getElementById("testimonialDots");
    var prevBtn = document.getElementById("prevSlide");
    var nextBtn = document.getElementById("nextSlide");
    var carousel = document.getElementById("testimonialCarousel");
    if (!track || !dotsWrap) return;

    var slides = Array.prototype.slice.call(track.children);
    var current = 0;
    var autoplayId = null;
    var AUTOPLAY_MS = 6000;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", function () { goTo(i); restartAutoplay(); });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = "translateX(-" + current * 100 + "%)";
      dots.forEach(function (d, i) { d.classList.toggle("active", i === current); });
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    if (nextBtn) nextBtn.addEventListener("click", function () { next(); restartAutoplay(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); restartAutoplay(); });

    function startAutoplay() {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      autoplayId = setInterval(next, AUTOPLAY_MS);
    }
    function stopAutoplay() { if (autoplayId) clearInterval(autoplayId); }
    function restartAutoplay() { stopAutoplay(); startAutoplay(); }

    if (carousel) {
      carousel.addEventListener("mouseenter", stopAutoplay);
      carousel.addEventListener("mouseleave", startAutoplay);
      carousel.addEventListener("focusin", stopAutoplay);
      carousel.addEventListener("focusout", startAutoplay);
    }

    // Basic touch swipe support
    var touchStartX = null;
    track.addEventListener("touchstart", function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); restartAutoplay(); }
      touchStartX = null;
    });

    goTo(0);
    startAutoplay();
  }

  /* ---------- FAQ accordion ---------- */
  function initFaqAccordion() {
    var items = document.querySelectorAll(".faq-item");
    items.forEach(function (item) {
      var btn = item.querySelector(".faq-question");
      var answer = item.querySelector(".faq-answer");
      if (!btn || !answer) return;

      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");
        items.forEach(function (other) {
          other.classList.remove("open");
          var otherBtn = other.querySelector(".faq-question");
          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* ---------- Appointment form -> WhatsApp ---------- */
  function initAppointmentForm() {
    var form = document.getElementById("appointmentForm");
    if (!form) return;

    var fields = {
      fullName: document.getElementById("fullName"),
      phone: document.getElementById("phone"),
      email: document.getElementById("email"),
      service: document.getElementById("service"),
      date: document.getElementById("date"),
      message: document.getElementById("message")
    };

    // Prevent selecting a past date
    var dateInput = fields.date;
    if (dateInput) {
      var today = new Date();
      var iso = today.toISOString().split("T")[0];
      dateInput.setAttribute("min", iso);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors();

      var valid = true;

      if (!fields.fullName.value.trim() || fields.fullName.value.trim().length < 2) {
        setError("fullName", "Please enter your full name.");
        valid = false;
      }

      var phoneVal = fields.phone.value.trim().replace(/\s+/g, "");
      if (!/^[6-9]\d{9}$/.test(phoneVal)) {
        setError("phone", "Enter a valid 10-digit Indian mobile number.");
        valid = false;
      }

      var emailVal = fields.email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        setError("email", "Enter a valid email address.");
        valid = false;
      }

      if (!fields.service.value) {
        setError("service", "Please select a service.");
        valid = false;
      }

      if (!fields.date.value) {
        setError("date", "Please choose a preferred date.");
        valid = false;
      }

      if (!valid) {
        var firstInvalid = form.querySelector(".invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var messageVal = fields.message.value.trim() || "—";
      var text =
        "Hello CA Deepak V Sharma & Associates,\n\n" +
        "I would like to book a consultation.\n\n" +
        "Name: " + fields.fullName.value.trim() + "\n" +
        "Phone: " + phoneVal + "\n" +
        "Email: " + emailVal + "\n" +
        "Service: " + fields.service.value + "\n" +
        "Preferred Date: " + fields.date.value + "\n" +
        "Message: " + messageVal;

      var url = "https://wa.me/918800285837?text=" + encodeURIComponent(text);
      window.open(url, "_blank", "noopener");

      showToast("Opening WhatsApp with your details filled in…");
      form.reset();
    });

    function setError(fieldKey, msg) {
      var input = fields[fieldKey];
      var errorEl = document.getElementById("err-" + fieldKey);
      if (input) input.classList.add("invalid");
      if (errorEl) errorEl.textContent = msg;
    }

    function clearErrors() {
      Object.keys(fields).forEach(function (key) {
        var input = fields[key];
        var errorEl = document.getElementById("err-" + key);
        if (input) input.classList.remove("invalid");
        if (errorEl) errorEl.textContent = "";
      });
    }
  }

  /* ---------- Toast notification ---------- */
  function showToast(message) {
    var toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      toast.classList.remove("show");
    }, 4000);
  }

  /* ---------- Back to top ---------- */
  function initBackToTop() {
    var btn = document.getElementById("backToTop");
    if (!btn) return;
    function update() {
      if (window.scrollY > 480) btn.classList.add("visible");
      else btn.classList.remove("visible");
    }
    window.addEventListener("scroll", throttle(update, 100));
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    update();
  }

  /* ---------- Smooth-scroll anchors (fallback for older browsers) ---------- */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        if (!id || id === "#" || id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, "", id);
      });
    });
  }

  /* ---------- Utility: throttle ---------- */
  function throttle(fn, wait) {
    var last = 0;
    var timeout = null;
    return function () {
      var now = Date.now();
      var args = arguments;
      var remaining = wait - (now - last);
      if (remaining <= 0) {
        last = now;
        fn.apply(null, args);
      } else if (!timeout) {
        timeout = setTimeout(function () {
          last = Date.now();
          timeout = null;
          fn.apply(null, args);
        }, remaining);
      }
    };
  }
})();
