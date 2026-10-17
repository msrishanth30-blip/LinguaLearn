
/* =========================================
   LinguaLearn - Interactive UI Effects
   File: effects.js
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // Respect users who prefer reduced motion
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Helper: safely select elements
  const selectAll = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

  // -----------------------------------------
  // 1. Add reusable effects stylesheet
  // -----------------------------------------
  const effectsCSS = document.createElement("style");

  effectsCSS.textContent = `
    .effect-ready {
      transition:
        transform 220ms ease,
        box-shadow 220ms ease,
        border-color 220ms ease,
        filter 220ms ease;
    }

    .effect-hover {
      box-shadow: 0 14px 32px rgba(25, 75, 50, 0.14);
      filter: brightness(1.025);
    }

    .ripple-host {
      position: relative;
      overflow: hidden;
      isolation: isolate;
    }

    .effect-ripple {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      background: rgba(255, 255, 255, 0.4);
      transform: scale(0);
      animation: linguaRipple 550ms ease-out forwards;
      z-index: 5;
    }

    @keyframes linguaRipple {
      to {
        transform: scale(1);
        opacity: 0;
      }
    }

    .reveal-on-scroll {
      opacity: 0;
      transform: translateY(18px);
      transition:
        opacity 550ms ease,
        transform 550ms ease;
    }

    .reveal-on-scroll.is-visible {
      opacity: 1;
      transform: translateY(0);
    }

    .effect-button {
      transition: transform 160ms ease, filter 160ms ease;
    }

    .effect-button:active {
      transform: scale(0.97);
    }

    .effect-focus:focus-visible {
      outline: 3px solid #77b96e;
      outline-offset: 4px;
    }

    @media (prefers-reduced-motion: reduce) {
      .effect-ready,
      .reveal-on-scroll,
      .effect-button {
        transition: none !important;
        animation: none !important;
      }

      .reveal-on-scroll {
        opacity: 1;
        transform: none;
      }

      .effect-ripple {
        display: none;
      }
    }
  `;

  document.head.appendChild(effectsCSS);

  // -----------------------------------------
  // 2. Smooth scrolling for internal links
  // -----------------------------------------
  selectAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  // -----------------------------------------
  // 3. Card hover lift and mouse tilt
  // -----------------------------------------
  const tiltCards = selectAll(
    ".stat-card, .category-btn, .flashcard"
  );

  tiltCards.forEach((card) => {
    card.classList.add("effect-ready");

    if (card.matches("button, a")) {
      card.classList.add("effect-focus");
    }

    if (reduceMotion) return;

    card.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch") return;

      card.classList.add("effect-hover");
    });

    card.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;

      const rect = card.getBoundingClientRect();

      if (!rect.width || !rect.height) return;

      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * 5;
      const rotateX = (0.5 - y) * 5;

      card.style.transform =
        `perspective(850px) rotateX(${rotateX}deg) ` +
        `rotateY(${rotateY}deg) translateY(-3px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.classList.remove("effect-hover");
      card.style.transform = "";
    });

    card.addEventListener("pointercancel", () => {
      card.classList.remove("effect-hover");
      card.style.transform = "";
    });
  });

  // -----------------------------------------
  // 4. Button ripple animation
  // -----------------------------------------
  const rippleButtons = selectAll(
    "button, .forest-button"
  );

  rippleButtons.forEach((button) => {
    button.classList.add("ripple-host", "effect-button");

    button.addEventListener("click", (event) => {
      if (reduceMotion) return;

      // Don't add decorative ripple to disabled controls
      if (button.disabled || button.getAttribute("aria-disabled") === "true") {
        return;
      }

      const rect = button.getBoundingClientRect();

      if (!rect.width || !rect.height) return;

      const size = Math.max(rect.width, rect.height) * 1.7;
      const ripple = document.createElement("span");

      ripple.className = "effect-ripple";
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;

      const hasPointerPosition =
        Number.isFinite(event.clientX) &&
        Number.isFinite(event.clientY);

      const x = hasPointerPosition
        ? event.clientX - rect.left
        : rect.width / 2;

      const y = hasPointerPosition
        ? event.clientY - rect.top
        : rect.height / 2;

      ripple.style.left = `${x - size / 2}px`;
      ripple.style.top = `${y - size / 2}px`;

      button.appendChild(ripple);

      window.setTimeout(() => ripple.remove(), 650);
    });
  });

  // -----------------------------------------
  // 5. Reveal sections as they enter view
  // -----------------------------------------
  const revealItems = selectAll(
    ".section-heading, .progress-card, .quiz-card, " +
    ".forest-panel, .welcome-section"
  );

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -25px 0px"
      }
    );

    revealItems.forEach((element) => {
      element.classList.add("reveal-on-scroll");
      revealObserver.observe(element);
    });
  } else {
    revealItems.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  // -----------------------------------------
  // 6. Animated number counters
  // Works with data-count="100" elements
  // -----------------------------------------
  function animateCounter(element) {
    if (element.dataset.counterDone === "true") return;

    const target = Number(element.dataset.count);

    if (!Number.isFinite(target)) return;

    element.dataset.counterDone = "true";

    if (reduceMotion) {
      element.textContent = String(target);
      return;
    }

    const duration = 900;
    const startTime = performance.now();
    const startValue = 0;

    function updateCounter(now) {
      const progress = Math.min(
        (now - startTime) / duration,
        1
      );

      // Smooth ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(
        startValue + (target - startValue) * eased
      );

      element.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  const counters = selectAll("[data-count]");

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  // -----------------------------------------
  // 7. Header shadow when scrolling
  // -----------------------------------------
  const header = document.querySelector("header");

  if (header) {
    const updateHeader = () => {
      header.style.boxShadow =
        window.scrollY > 12
          ? "0 5px 22px rgba(20, 50, 35, 0.12)"
          : "none";
    };

    window.addEventListener("scroll", updateHeader, {
      passive: true
    });

    updateHeader();
  }

  // -----------------------------------------
  // 8. Keyboard focus support
  // -----------------------------------------
  selectAll("button, a, input, select, textarea").forEach((element) => {
    element.classList.add("effect-focus");
  });

  // -----------------------------------------
  // 9. Gentle floating decoration
  // Add class "floating-decoration" to an
  // element to enable this effect.
  // -----------------------------------------
  if (!reduceMotion) {
    selectAll(".floating-decoration").forEach((element, index) => {
      element.animate(
        [
          { transform: "translateY(0px)" },
          { transform: "translateY(-8px)" },
          { transform: "translateY(0px)" }
        ],
        {
          duration: 2400 + index * 180,
          iterations: Infinity,
          easing: "ease-in-out"
        }
      );
    });
  }

  console.log("🌿 LinguaLearn interactive effects loaded!");
});
