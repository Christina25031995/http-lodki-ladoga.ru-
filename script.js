/**
 * Лодки на Ладоге — interactions
 */
(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.add("js");

  var CFG = window.LODKI_CONFIG || {};
  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  var stickyCta = document.querySelector(".sticky-cta");
  var bookingSection = document.getElementById("process");
  var frame = document.querySelector(".booking-frame");

  /* Contacts from config.js (one place to change the numbers) */
  if (CFG.phone) {
    document.querySelectorAll('[data-contact="tel"]').forEach(function (a) {
      a.href = "tel:" + CFG.phone;
      if (CFG.phoneDisplay) a.textContent = CFG.phoneDisplay;
    });
  }
  document.querySelectorAll('[data-contact="telegram"]').forEach(function (a) {
    if (CFG.telegramUrl) a.href = CFG.telegramUrl;
    else if ("telegramUrl" in CFG) {
      var row = a.closest("[data-contact-row]");
      (row || a).remove();
    }
  });

  /* Header state */
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile navigation */
  if (navToggle && mobileNav) {
    var closeNav = function () {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Открыть меню");
      mobileNav.hidden = true;
      onScroll();
    };
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") !== "true";
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
      mobileNav.hidden = !open;
      if (open) header.classList.add("is-scrolled");
      else onScroll();
    });
    mobileNav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeNav); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !mobileNav.hidden) closeNav(); });
  }

  /* Sticky mobile CTA: always reachable; hidden only while the hero button or the booking form is on screen */
  if (stickyCta && "IntersectionObserver" in window) {
    var watched = [document.querySelector(".hero__actions"), document.querySelector(".booking")].filter(Boolean);
    var visible = new Set();
    var stickyIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target); });
      stickyCta.classList.toggle("is-hidden", visible.size > 0);
    }, { threshold: 0.1 });
    watched.forEach(function (el) { stickyIO.observe(el); });
  }

  /* Hero video: start after the page has loaded (poster paints first) */
  var video = document.querySelector(".hero__video");
  var saveData = navigator.connection && navigator.connection.saveData;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (video && !saveData && !reduceMotion) {
    var startVideo = function () {
      video.src = video.getAttribute("data-src");
      video.addEventListener("playing", function () { video.classList.add("is-playing"); }, { once: true });
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    };
    if (document.readyState === "complete") startVideo();
    else window.addEventListener("load", startVideo, { once: true });
  }

  /* Booking iframe: auto height + preselect boat from fleet buttons */
  window.addEventListener("message", function (e) {
    if (!frame || e.source !== frame.contentWindow) return;
    var h = e.data && e.data.iframeHeight;
    if (typeof h === "number" && h > 300 && h < 3000) frame.style.height = Math.ceil(h) + "px";
  });
  document.querySelectorAll("[data-boat]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (frame && frame.contentWindow) {
        frame.contentWindow.postMessage({ selectBoat: Number(btn.getAttribute("data-boat")) }, "*");
      }
    });
  });

  /* Yandex map: load only on request (saves ~8 MB) */
  var mapCard = document.querySelector("[data-map-src]");
  if (mapCard) {
    var btnMap = mapCard.querySelector(".map-card__load");
    if (btnMap) btnMap.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = mapCard.getAttribute("data-map-src");
      f.title = "Пирс «Лодки на Ладоге» на Яндекс Картах";
      f.setAttribute("allowfullscreen", "");
      mapCard.innerHTML = "";
      mapCard.appendChild(f);
    });
  }

  /* Scroll reveal */
  var targets = document.querySelectorAll(".section-header, .boat, .scenario-card, .included-item, .steps li, .card, .care, .services");
  if (!reduceMotion && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    targets.forEach(function (el) { el.classList.add("reveal"); io.observe(el); });
  }
})();
