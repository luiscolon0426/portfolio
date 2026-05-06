"use strict";
import form from "./form.js";
import skillbar from "./skillbar.js";

document.addEventListener("DOMContentLoaded", () => {
  AOS.init({
    once: true,
  });
  form();
  skillbar();
  initProjectsCarousel();

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

  let sections = document.querySelectorAll("section");
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
