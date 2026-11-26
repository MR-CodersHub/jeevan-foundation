document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic Footer Year
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Floating Navbar Scroll Effect
  const header = document.querySelector(".site-header");
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }

  // 3. Mobile Navigation Menu
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = nav.classList.toggle("open");
      if (header) header.classList.toggle("menu-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        if (header) header.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target) && nav.classList.contains("open")) {
        nav.classList.remove("open");
        if (header) header.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // 4. Active Navigation State Detection (if not explicitly set in HTML)
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".main-nav a");
  navLinks.forEach(link => {
    const linkHref = link.getAttribute("href");
    if (linkHref === currentPath || (currentPath === "" && linkHref === "index.html")) {
      link.classList.add("active");
    }
  });

  // 5. Animated Impact Counters
  const counterElements = document.querySelectorAll("[data-counter]");
  if (counterElements.length > 0 && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-counter"), 10);
          const suffix = el.getAttribute("data-suffix") || "";
          const prefix = el.getAttribute("data-prefix") || "";
          const duration = 1800;
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
              clearInterval(timer);
            } else {
              el.textContent = `${prefix}${Math.floor(current).toLocaleString()}${suffix}`;
            }
          }, stepTime);

          obs.unobserve(el);
        }
      });
    }, { threshold: 0.25 });

    counterElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver not available
    counterElements.forEach(el => {
      const target = el.getAttribute("data-counter");
      const suffix = el.getAttribute("data-suffix") || "";
      const prefix = el.getAttribute("data-prefix") || "";
      el.textContent = `${prefix}${parseInt(target, 10).toLocaleString()}${suffix}`;
    });
  }

  // 6. Gallery Filtering System
  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");
  if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        const filter = button.dataset.filter;

        galleryItems.forEach(item => {
          if (filter === "all" || item.dataset.category === filter) {
            item.style.display = "";
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  }

  // 7. Lightbox System
  const lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    const image = lightbox.querySelector(".lightbox-image");
    const title = lightbox.querySelector("#lightbox-title");
    const meta = lightbox.querySelector(".lightbox-meta");
    const description = lightbox.querySelector(".lightbox-description");
    const closeBtn = lightbox.querySelector(".lightbox-close");

    document.querySelectorAll(".gallery-open").forEach(btn => {
      btn.addEventListener("click", () => {
        const source = btn.querySelector("img");
        if (source) {
          image.src = source.src;
          image.alt = source.alt;
        }
        if (title) title.textContent = btn.dataset.title || "";
        if (meta) meta.textContent = btn.dataset.meta || "";
        if (description) description.textContent = btn.dataset.description || "";
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        if (closeBtn) closeBtn.focus();
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("open")) {
        closeLightbox();
      }
    });
  }

  // 8. Testimonials Carousel
  const testimonialCards = document.querySelectorAll(".testimonial-slide");
  const dotsContainer = document.querySelector(".slider-dots");
  const prevBtn = document.querySelector(".slider-btn.prev");
  const nextBtn = document.querySelector(".slider-btn.next");
  if (testimonialCards.length > 0) {
    let currentIndex = 0;
    let autoSlideTimer = null;

    // Create dots if container exists
    if (dotsContainer) {
      dotsContainer.innerHTML = "";
      testimonialCards.forEach((_, idx) => {
        const dot = document.createElement("button");
        dot.className = `slider-dot ${idx === 0 ? "active" : ""}`;
        dot.setAttribute("aria-label", `Go to slide ${idx + 1}`);
        dot.addEventListener("click", () => goToSlide(idx));
        dotsContainer.appendChild(dot);
      });
    }

    const updateSlides = () => {
      testimonialCards.forEach((card, idx) => {
        card.style.display = idx === currentIndex ? "block" : "none";
      });
      const dots = document.querySelectorAll(".slider-dot");
      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === currentIndex);
      });
    };

    const goToSlide = (idx) => {
      currentIndex = (idx + testimonialCards.length) % testimonialCards.length;
      updateSlides();
    };

    if (prevBtn) prevBtn.addEventListener("click", () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => goToSlide(currentIndex + 1));

    // Auto-advance every 6 seconds with pause on hover
    const startAutoSlide = () => {
      autoSlideTimer = setInterval(() => goToSlide(currentIndex + 1), 6000);
    };
    const stopAutoSlide = () => {
      if (autoSlideTimer) clearInterval(autoSlideTimer);
    };

    const sliderWrapper = document.querySelector(".testimonials-section");
    if (sliderWrapper) {
      sliderWrapper.addEventListener("mouseenter", stopAutoSlide);
      sliderWrapper.addEventListener("mouseleave", startAutoSlide);
    }

    updateSlides();
    startAutoSlide();
  }

  // 9. Contact & Volunteer Form Validation & Feedback (Formspree AJAX Integration)
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    const successBanner = document.querySelector(".form-success-banner");
    const errorBanner = document.querySelector(".form-server-error-banner");
    const submitBtn = contactForm.querySelector("button[type='submit']");
    const defaultBtnHtml = submitBtn ? submitBtn.innerHTML : 'Send Message <span>→</span>';

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      const nameInput = contactForm.querySelector("#name");
      const nameError = contactForm.querySelector("#name-error");
      if (nameInput) {
        if (nameInput.value.trim().length < 2) {
          nameInput.classList.add("is-invalid");
          if (nameError) nameError.classList.add("visible");
          isValid = false;
        } else {
          nameInput.classList.remove("is-invalid");
          if (nameError) nameError.classList.remove("visible");
        }
      }

      // Validate Email
      const emailInput = contactForm.querySelector("#email");
      const emailError = contactForm.querySelector("#email-error");
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput) {
        if (!emailPattern.test(emailInput.value.trim())) {
          emailInput.classList.add("is-invalid");
          if (emailError) emailError.classList.add("visible");
          isValid = false;
        } else {
          emailInput.classList.remove("is-invalid");
          if (emailError) emailError.classList.remove("visible");
        }
      }

      // Validate Phone
      const phoneInput = contactForm.querySelector("#phone");
      const phoneError = contactForm.querySelector("#phone-error");
      if (phoneInput) {
        const cleanPhone = phoneInput.value.replace(/[^0-9]/g, "");
        if (cleanPhone.length < 8) {
          phoneInput.classList.add("is-invalid");
          if (phoneError) phoneError.classList.add("visible");
          isValid = false;
        } else {
          phoneInput.classList.remove("is-invalid");
          if (phoneError) phoneError.classList.remove("visible");
        }
      }

      // Validate Message
      const messageInput = contactForm.querySelector("#message");
      const messageError = contactForm.querySelector("#message-error");
      if (messageInput) {
        if (messageInput.value.trim().length < 8) {
          messageInput.classList.add("is-invalid");
          if (messageError) messageError.classList.add("visible");
          isValid = false;
        } else {
          messageInput.classList.remove("is-invalid");
          if (messageError) messageError.classList.remove("visible");
        }
      }

      if (isValid) {
        // Reset previous banner states
        if (successBanner) successBanner.classList.remove("visible");
        if (errorBanner) errorBanner.classList.remove("visible");

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = "Sending message...";
        }

        const formData = new FormData(contactForm);

        try {
          const response = await fetch("https://formspree.io/f/xdegbjew", {
            method: "POST",
            body: formData,
            headers: {
              "Accept": "application/json"
            }
          });

          if (response.ok) {
            if (successBanner) {
              successBanner.classList.add("visible");
              successBanner.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            contactForm.reset();
          } else {
            const data = await response.json();
            let errorMsg = "There was an issue sending your message. Please try again.";
            if (data && data.errors && data.errors.length > 0) {
              errorMsg = data.errors.map(err => err.message).join(", ");
            }
            if (errorBanner) {
              const errSpan = errorBanner.querySelector(".error-text");
              if (errSpan) errSpan.textContent = errorMsg;
              errorBanner.classList.add("visible");
              errorBanner.scrollIntoView({ behavior: "smooth", block: "center" });
            } else {
              alert(errorMsg);
            }
          }
        } catch (error) {
          if (errorBanner) {
            const errSpan = errorBanner.querySelector(".error-text");
            if (errSpan) errSpan.textContent = "Network error. Please check your connection and try again.";
            errorBanner.classList.add("visible");
            errorBanner.scrollIntoView({ behavior: "smooth", block: "center" });
          } else {
            alert("Network error. Please check your connection and try again.");
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = defaultBtnHtml;
          }
        }
      }
    });

    // Clear validation state on input
    contactForm.querySelectorAll(".form-control").forEach(input => {
      input.addEventListener("input", () => {
        input.classList.remove("is-invalid");
        const err = input.parentElement.querySelector(".form-error");
        if (err) err.classList.remove("visible");
      });
    });
  }

  // 10. Editorial Story Modal Reader
  const storyModal = document.querySelector(".story-modal");
  if (storyModal) {
    const modalTitle = storyModal.querySelector("#modal-story-title");
    const modalMeta = storyModal.querySelector("#modal-story-meta");
    const modalBody = storyModal.querySelector("#modal-story-body");
    const modalClose = storyModal.querySelector(".story-modal-close");

    document.querySelectorAll("[data-story-trigger]").forEach(trigger => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const title = trigger.getAttribute("data-story-title");
        const meta = trigger.getAttribute("data-story-meta");
        const content = trigger.getAttribute("data-story-content");

        if (modalTitle) modalTitle.textContent = title;
        if (modalMeta) modalMeta.textContent = meta;
        if (modalBody) modalBody.innerHTML = content;

        storyModal.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });

    const closeStoryModal = () => {
      storyModal.classList.remove("open");
      document.body.style.overflow = "";
    };

    if (modalClose) modalClose.addEventListener("click", closeStoryModal);
    storyModal.addEventListener("click", (e) => {
      if (e.target === storyModal) closeStoryModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && storyModal.classList.contains("open")) {
        closeStoryModal();
      }
    });
  }

  // 11. Birthday Wishes (Single Spotlight Frame — Reference Layout)
  // (Static single profile frame; carousel rotation disabled per design requirement)

  // 12. Service Page Full-Screen Video Hero Controls
  const serviceHero = document.getElementById("service-hero");
  const videoContainer = document.getElementById("video-container");
  const heroVideo = document.getElementById("hero-video");
  const cinemaBtn = document.getElementById("toggle-cinema-btn");
  const fullscreenBtn = document.getElementById("native-fullscreen-btn");

  // Auto-play polyfill: if browser blocked autoplay, attempt play on first user interaction
  if (heroVideo) {
    const tryPlay = () => {
      heroVideo.play().catch(() => {});
    };
    tryPlay();
    document.addEventListener("click", function resumePlay() {
      tryPlay();
      document.removeEventListener("click", resumePlay);
    }, { once: true });
  }

  if (serviceHero && cinemaBtn) {
    cinemaBtn.addEventListener("click", () => {
      const isCinema = serviceHero.classList.toggle("cinema-mode");
      const textSpan = cinemaBtn.querySelector(".cinema-btn-text");
      if (textSpan) textSpan.textContent = isCinema ? "Exit Cinema" : "Cinema View";
      cinemaBtn.setAttribute("aria-pressed", String(isCinema));
    });
  }

  if (fullscreenBtn) {
    const fsTarget = heroVideo || videoContainer;
    fullscreenBtn.addEventListener("click", () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (fsTarget.requestFullscreen) {
          fsTarget.requestFullscreen();
        } else if (fsTarget.webkitRequestFullscreen) {
          fsTarget.webkitRequestFullscreen();
        } else if (fsTarget.msRequestFullscreen) {
          fsTarget.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      }
    });

    const updateFullscreenState = () => {
      const isFs = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
      fullscreenBtn.setAttribute("aria-pressed", String(isFs));
      const span = fullscreenBtn.querySelector("span:last-child");
      if (span) span.textContent = isFs ? "Exit Fullscreen" : "Fullscreen";
    };
    document.addEventListener("fullscreenchange", updateFullscreenState);
    document.addEventListener("webkitfullscreenchange", updateFullscreenState);
  }
});