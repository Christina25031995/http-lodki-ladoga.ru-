/**
 * Лодки на Ладоге — interactions
 */

(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const stickyCta = document.querySelector(".sticky-cta");
  const hero = document.querySelector(".hero");

  /* Transparent header over hero */
  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 48);
  }

  /* Header scroll state */
  function onScroll() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 48);
    }

    if (stickyCta && hero) {
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      const pastHero = window.scrollY > heroBottom - 120;
      const nearFooter =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 80;
      stickyCta.classList.toggle("is-visible", pastHero && !nearFooter);
      stickyCta.setAttribute("aria-hidden", String(!pastHero || nearFooter));
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile navigation */
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      mobileNav.hidden = expanded;
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        mobileNav.hidden = true;
      });
    });
  }

  /* Scroll reveal */
  const revealTargets = document.querySelectorAll(
    ".section-header, .scenario-card, .boat-card, .fleet-item, .included-item, .process-step, .contact-layout"
  );

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealTargets.forEach((el) => el.classList.add("reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealTargets.forEach((el) => observer.observe(el));
  }

  /* Smooth anchor offset for sticky header */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h"), 10) || 64;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();
