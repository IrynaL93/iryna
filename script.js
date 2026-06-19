const header = document.querySelector("[data-header]");
const revealItems = document.querySelectorAll(".reveal");
const slider = document.querySelector("[data-slider]");
const form = document.querySelector("[data-form]");

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (slider) {
  const slides = [...slider.querySelectorAll("[data-slide]")];
  const dots = [...slider.querySelectorAll("[data-dot]")];
  let activeIndex = 0;
  let autoTimer;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
      dot.tabIndex = isActive ? 0 : -1;
    });
  };

  const startAuto = () => {
    window.clearInterval(autoTimer);
    autoTimer = window.setInterval(() => showSlide(activeIndex + 1), 7200);
  };

  const goPrev = () => {
    showSlide(activeIndex - 1);
    startAuto();
  };

  const goNext = () => {
    showSlide(activeIndex + 1);
    startAuto();
  };

  slider.addEventListener("click", (event) => {
    const control = event.target.closest("[data-prev], [data-next], [data-dot]");
    if (!control || !slider.contains(control)) return;
    event.preventDefault();

    if (control.matches("[data-prev]")) {
      goPrev();
      return;
    }

    if (control.matches("[data-next]")) {
      goNext();
      return;
    }

    showSlide(Number(control.dataset.dot));
    startAuto();
  });

  slider.addEventListener("mouseenter", () => window.clearInterval(autoTimer));
  slider.addEventListener("mouseleave", startAuto);
  slider.addEventListener("focusin", () => window.clearInterval(autoTimer));
  slider.addEventListener("focusout", startAuto);

  showSlide(activeIndex);
  startAuto();
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = form.querySelector("[data-form-message]");
  message?.classList.add("is-visible");
  form.reset();
});
