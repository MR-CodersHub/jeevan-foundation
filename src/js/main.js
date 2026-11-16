document.addEventListener("DOMContentLoaded", () => {
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.textContent = isOpen ? "×" : "☰";
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "☰";
    }));
  }

  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");
  filterButtons.forEach(button => button.addEventListener("click", () => {
    filterButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    galleryItems.forEach(item => {
      item.hidden = filter !== "all" && item.dataset.category !== filter;
    });
  }));

  const lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    const image = lightbox.querySelector(".lightbox-image");
    const title = lightbox.querySelector("#lightbox-title");
    const meta = lightbox.querySelector(".lightbox-meta");
    const description = lightbox.querySelector(".lightbox-description");
    const close = lightbox.querySelector(".lightbox-close");
    document.querySelectorAll(".gallery-open").forEach(button => button.addEventListener("click", () => {
      const source = button.querySelector("img");
      image.src = source.src;
      image.alt = source.alt;
      title.textContent = button.dataset.title;
      meta.textContent = button.dataset.meta;
      description.textContent = button.dataset.description;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      close.focus();
    }));
    const closeLightbox = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
    close.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", event => { if (event.key === "Escape" && lightbox.classList.contains("open")) closeLightbox(); });
  }
});