(function () {
  "use strict";

  // Year
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { links.classList.remove("open"); });
    });
  }

  // Header shadow on scroll
  var header = document.getElementById("header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal on scroll
  var reveals = [].slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // Lead form (Web3Forms) — AJAX submit so the user stays on the page
  var form = document.getElementById("leadForm");
  var msg = document.getElementById("formMsg");
  if (form) {
    form.addEventListener("submit", function (ev) {
      var key = form.querySelector('input[name="access_key"]');
      // If the Web3Forms key hasn't been set yet, let the native POST proceed
      // (or you can block it). We attempt AJAX only when a real key is present.
      if (!key || key.value.indexOf("REPLACE_") === 0) {
        ev.preventDefault();
        if (msg) {
          msg.className = "form-msg err";
          msg.textContent = "Form isn't connected yet. Please call (760) 330-4215.";
        }
        return;
      }
      ev.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var original = btn ? btn.textContent : "";
      if (btn) { btn.textContent = "Sending…"; btn.disabled = true; }
      var data = new FormData(form);
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res.success) {
            form.reset();
            if (msg) { msg.className = "form-msg ok"; msg.textContent = "Thanks! Ron will get back to you shortly."; }
          } else {
            if (msg) { msg.className = "form-msg err"; msg.textContent = "Something went wrong. Please call (760) 330-4215."; }
          }
        })
        .catch(function () {
          if (msg) { msg.className = "form-msg err"; msg.textContent = "Something went wrong. Please call (760) 330-4215."; }
        })
        .finally(function () {
          if (btn) { btn.textContent = original; btn.disabled = false; }
        });
    });
  }
})();
