"use strict";

document.addEventListener("DOMContentLoaded", () => {
  if (window.AOS) {
    window.AOS.init({ once: true });
  }

  initNavigation();
  initSkillsCarousels();

  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = new Date().getFullYear();
});

function initNavigation() {
  const header = document.querySelector("#header");
  const hero = document.querySelector("#home");
  const goToTop = document.querySelector("#goToTop");
  const nav = document.querySelector("#nav");
  const navBtn = document.querySelector("#nav-btn");
  const navBtnImg = document.querySelector("#nav-btn-img");
  const sections = document.querySelectorAll("body > section[id]");
  const navLinks = document.querySelectorAll("header nav a[href^='#']");

  if (!header || !hero || !nav || !navBtn || !navBtnImg) return;

  const setMenuOpen = (open) => {
    nav.classList.toggle("open", open);
    navBtn.setAttribute("aria-expanded", String(open));
    navBtnImg.src = open ? "img/icons/close.svg" : "img/icons/open.svg";
  };

  navBtn.addEventListener("click", () => setMenuOpen(!nav.classList.contains("open")));
  navLinks.forEach((link) => link.addEventListener("click", () => setMenuOpen(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });

  const updatePageState = () => {
    const stickyPoint = hero.offsetHeight - 170;
    const pastHero = window.scrollY > stickyPoint;
    header.classList.toggle("header-sticky", pastHero);
    goToTop?.classList.toggle("reveal", pastHero);

    sections.forEach((section) => {
      const isCurrent =
        window.scrollY >= section.offsetTop - 170 &&
        window.scrollY < section.offsetTop - 170 + section.offsetHeight;

      if (!isCurrent) return;
      navLinks.forEach((link) => link.classList.remove("active"));
      document.querySelector(`header nav a[href="#${section.id}"]`)?.classList.add("active");
    });
  };

  window.addEventListener("scroll", updatePageState, { passive: true });
  window.addEventListener("resize", updatePageState);
  updatePageState();
}

function initSkillsCarousels() {
  const mobileQuery = window.matchMedia("(max-width: 720px)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.querySelectorAll(".skill-group").forEach((group) => {
    const track = group.querySelector(".skills-track");
    const prevBtn = group.querySelector(".skill-carousel-prev");
    const nextBtn = group.querySelector(".skill-carousel-next");

    if (!track || !prevBtn || !nextBtn) return;

    let autoplayTimer = null;
    let autoplayFrame = null;
    let autoplayDirection = 1;
    let isVisible = false;
    let isInteracting = false;

    const getStep = () => {
      const card = track.querySelector(".skill-icon");
      if (!card) return track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      return card.getBoundingClientRect().width + gap;
    };

    const updateControls = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      prevBtn.disabled = track.scrollLeft <= 2;
      nextBtn.disabled = track.scrollLeft >= maxScroll - 2;
    };

    const stopAutoplay = () => {
      if (autoplayTimer) window.clearInterval(autoplayTimer);
      if (autoplayFrame) window.cancelAnimationFrame(autoplayFrame);
      autoplayTimer = null;
      autoplayFrame = null;
    };

    const glideTo = (target, duration = 1400) => {
      const start = track.scrollLeft;
      const distance = target - start;
      const startTime = performance.now();

      const animate = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 0.5 - Math.cos(progress * Math.PI) / 2;
        track.scrollLeft = start + distance * eased;

        if (progress < 1) autoplayFrame = window.requestAnimationFrame(animate);
        else autoplayFrame = null;
      };

      autoplayFrame = window.requestAnimationFrame(animate);
    };

    const startAutoplay = () => {
      stopAutoplay();
      if (
        !mobileQuery.matches ||
        reducedMotionQuery.matches ||
        !isVisible ||
        isInteracting ||
        document.hidden
      ) return;

      autoplayTimer = window.setInterval(() => {
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (maxScroll <= 2) return;
        if (track.scrollLeft >= maxScroll - 2) autoplayDirection = -1;
        if (track.scrollLeft <= 2) autoplayDirection = 1;

        glideTo(Math.max(0, Math.min(track.scrollLeft + getStep() * autoplayDirection, maxScroll)));
      }, 2800);
    };

    const pause = () => {
      isInteracting = true;
      stopAutoplay();
    };
    const resume = () => {
      isInteracting = false;
      startAutoplay();
    };

    prevBtn.addEventListener("click", () => track.scrollBy({ left: -getStep(), behavior: "smooth" }));
    nextBtn.addEventListener("click", () => track.scrollBy({ left: getStep(), behavior: "smooth" }));
    group.addEventListener("pointerenter", pause);
    group.addEventListener("pointerleave", resume);
    group.addEventListener("pointerdown", pause);
    group.addEventListener("pointerup", resume);
    group.addEventListener("focusin", pause);
    group.addEventListener("focusout", (event) => {
      if (!group.contains(event.relatedTarget)) resume();
    });
    track.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", () => {
      updateControls();
      startAutoplay();
    });
    document.addEventListener("visibilitychange", startAutoplay);
    mobileQuery.addEventListener("change", startAutoplay);
    reducedMotionQuery.addEventListener("change", startAutoplay);

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
          startAutoplay();
        },
        { threshold: 0.35 }
      );
      observer.observe(group);
    } else {
      isVisible = true;
      startAutoplay();
    }

    updateControls();
  });
}
