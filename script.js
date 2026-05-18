(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));
  if (prefersReduced || revealEls.length === 0) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const avatar = document.getElementById("avatar");
  const profileImage = document.getElementById("profileImage");
  if (avatar && profileImage) {
    profileImage.addEventListener("error", () => {
      avatar.classList.add("avatar--missing");
    });
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const el = entry.target;
        const delay = Number(el.getAttribute("data-reveal-delay") ?? "0");
        if (delay > 0) {
          el.style.transitionDelay = `${delay}ms`;
        }
        el.classList.add("is-visible");
        io.unobserve(el);
      }
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => io.observe(el));

  const form = document.getElementById("connectForm");
  const status = document.getElementById("formStatus");
  if (!form) return;

  const setStatus = (text) => {
    if (status) status.textContent = text;
  };

  const markTouched = (input) => {
    input.dataset.touched = "true";
  };

  const inputs = Array.from(form.querySelectorAll("input"));
  inputs.forEach((input) => {
    input.addEventListener("blur", () => markTouched(input));
    input.addEventListener("input", () => setStatus(""));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    inputs.forEach(markTouched);

    if (!form.checkValidity()) {
      setStatus("Please fill all required fields.");
      const firstInvalid = form.querySelector(":invalid");
      if (firstInvalid instanceof HTMLElement) firstInvalid.focus();
      return;
    }

    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();

    const subject = `Portfolio connection request — ${name}`;
    const body =
      `Hi Ayush,%0D%0A%0D%0A` +
      `I’d like to connect.%0D%0A%0D%0A` +
      `Name: ${encodeURIComponent(name)}%0D%0A` +
      `Email: ${encodeURIComponent(email)}%0D%0A` +
      `Phone: ${encodeURIComponent(phone)}%0D%0A%0D%0A` +
      `Sent from your portfolio site.`;

    const mailto = `mailto:singhayush4307@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

    setStatus("Thank you!");
    window.setTimeout(() => {
      window.location.href = mailto;
    }, 150);
  });
})();
