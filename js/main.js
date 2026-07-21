"use strict";
import form from "./form.js";
import skillbar from "./skillbar.js";

document.addEventListener("DOMContentLoaded", () => {
  AOS.init({
    once: true,
  });
  form();
  skillbar();
  initSkillsCarousels();

  const nav = document.querySelector("#nav");
  const navBtn = document.querySelector("#nav-btn");
  const navBtnImg = document.querySelector("#nav-btn-img");

  //Hamburger menu
  navBtn.onclick = () => {
    if (nav.classList.toggle("open")) {
      navBtnImg.src = "img/icons/close.svg";
    } else {
      navBtnImg.src = "img/icons/open.svg";
    }
  };

  window.addEventListener("scroll", function () {
    const header = document.querySelector("#header");
    const hero = document.querySelector("#home");
    let triggerHeight = hero.offsetHeight - 170;

    if (window.scrollY > triggerHeight) {
      header.classList.add("header-sticky");
      goToTop.classList.add("reveal");
    } else {
      header.classList.remove("header-sticky");
      goToTop.classList.remove("reveal");
    }
  });

  let sections = document.querySelectorAll("body > section");
  let navLinks = document.querySelectorAll("header nav a");

  window.onscroll = () => {
    sections.forEach((sec) => {
      let top = window.scrollY;
      let offset = sec.offsetTop - 170;
      let height = sec.offsetHeight;
      let id = sec.getAttribute("id");

      if (top >= offset && top < offset + height) {
        navLinks.forEach((links) => {
          links.classList.remove("active");
          document
            .querySelector("header nav a[href*=" + id + "]")
            .classList.add("active");
        });
      }
    });
  };
});

function initSkillsCarousels() {
  const mobileQuery = window.matchMedia("(max-width: 720px)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.querySelectorAll(".skill-group").forEach((group) => {
    const track = group.querySelector(".skills-track");
    const prevBtn = group.querySelector(".skill-carousel-prev");
    const nextBtn = group.querySelector(".skill-carousel-next");

    if (!track || !prevBtn || !nextBtn) return;

    let autoplayTimer = null;
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
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
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

        const reachedEnd = track.scrollLeft >= maxScroll - 2;
        track.scrollTo({
          left: reachedEnd ? 0 : Math.min(track.scrollLeft + getStep(), maxScroll),
          behavior: "smooth",
        });
      }, 3200);
    };

    const pauseForInteraction = () => {
      isInteracting = true;
      stopAutoplay();
    };

    const resumeAfterInteraction = () => {
      isInteracting = false;
      startAutoplay();
    };

    prevBtn.addEventListener("click", () => {
      track.scrollBy({ left: -getStep(), behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
      track.scrollBy({ left: getStep(), behavior: "smooth" });
    });

    group.addEventListener("pointerenter", pauseForInteraction);
    group.addEventListener("pointerleave", resumeAfterInteraction);
    group.addEventListener("pointerdown", pauseForInteraction);
    group.addEventListener("pointerup", resumeAfterInteraction);
    group.addEventListener("focusin", pauseForInteraction);
    group.addEventListener("focusout", (event) => {
      if (!group.contains(event.relatedTarget)) resumeAfterInteraction();
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

function initProjectsCarousel() {
  const carousel = document.querySelector('[data-carousel="projects"]');
  if (!carousel) return;

  const viewport = carousel.querySelector("[data-carousel-viewport]");
  const track = carousel.querySelector("[data-carousel-track]");
  const prevBtn = carousel.querySelector(".carousel-btn-prev");
  const nextBtn = carousel.querySelector(".carousel-btn-next");
  const dotsRoot = carousel.querySelector("[data-carousel-dots]");

  if (!viewport || !track) return;

  const slides = Array.from(track.querySelectorAll(".project-box"));
  if (slides.length === 0) return;

  const scrollToIndex = (index) => {
    const clamped = Math.max(0, Math.min(slides.length - 1, index));
    slides[clamped].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    setActiveDot(clamped);
  };

  const setActiveDot = (activeIndex) => {
    if (!dotsRoot) return;
    const dots = Array.from(dotsRoot.querySelectorAll("button.carousel-dot"));
    dots.forEach((dot, i) => {
      dot.setAttribute("aria-current", i === activeIndex ? "true" : "false");
    });
  };

  const getActiveIndex = () => {
    const viewportRect = viewport.getBoundingClientRect();
    const viewportCenterX = viewportRect.left + viewportRect.width / 2;
    let bestIndex = 0;
    let bestDistance = Infinity;

    slides.forEach((slide, index) => {
      const rect = slide.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const dist = Math.abs(centerX - viewportCenterX);
      if (dist < bestDistance) {
        bestDistance = dist;
        bestIndex = index;
      }
    });
    return bestIndex;
  };

  if (dotsRoot) {
    dotsRoot.innerHTML = "";
    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", `Go to work ${index + 1}`);
      dot.setAttribute("aria-current", index === 0 ? "true" : "false");
      dot.addEventListener("click", () => scrollToIndex(index));
      dotsRoot.appendChild(dot);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const current = getActiveIndex();
      const prev = current <= 0 ? slides.length - 1 : current - 1;
      scrollToIndex(prev);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const current = getActiveIndex();
      const next = current >= slides.length - 1 ? 0 : current + 1;
      scrollToIndex(next);
    });
  }

  let rafId = null;
  viewport.addEventListener(
    "scroll",
    () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setActiveDot(getActiveIndex()));
    },
    { passive: true }
  );

  window.addEventListener("resize", () => setActiveDot(getActiveIndex()));
  setActiveDot(0);
}
