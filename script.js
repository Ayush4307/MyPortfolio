(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const projectGrid = document.getElementById("projectGrid");
  if (projectGrid) {
    const projects = [
      {
        title: "IPL Player Performance Analyzer",
        description:
          "An interactive Streamlit dashboard for analyzing IPL player and team performances from 2008–2024, with overview metrics, top batsmen and bowlers analysis, season-wise insights, team performance, and player search.",
        tags: ["Python", "Streamlit", "Pandas", "Plotly", "Kaggle"],
        primary: {
          label: "View on GitHub",
          href: "https://github.com/Ayush4307/Analysis-of-Best-Performing-Players-in-IPL.git",
        },
        secondary: {
          label: "Live demo",
          href: "https://ipl-player-analyzer.streamlit.app/",
        },
      },
      {
        title: "Job Tracker",
        description:
          "A full-stack job application tracking app built with React, TypeScript, Supabase, and Tailwind CSS. Includes authentication, job management, analytics, search, filters, and row-level security.",
        tags: ["React", "TypeScript", "Supabase", "Tailwind CSS", "Vercel"],
        primary: {
          label: "View on GitHub",
          href: "https://github.com/Ayush4307/job-tracker.git",
        },
        secondary: {
          label: "Live demo",
          href: "https://job-tracker-ayush.vercel.app",
        },
      },
    ];

    const escapeHtml = (value) =>
      String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

    const cardHtml = (project) => {
      const tagsHtml = (project.tags ?? [])
        .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
        .join("");

      const actions = [];
      if (project.primary?.href && project.primary?.label) {
        actions.push(
          `<a class="btn btn--primary" href="${escapeHtml(project.primary.href)}" target="_blank" rel="noreferrer">${escapeHtml(project.primary.label)}</a>`
        );
      }
      if (project.secondary?.href && project.secondary?.label) {
        actions.push(
          `<a class="btn btn--ghost" href="${escapeHtml(project.secondary.href)}" target="_blank" rel="noreferrer">${escapeHtml(project.secondary.label)}</a>`
        );
      }

      return `
        <article class="project-card">
          <div class="project-card__head">
            <h3 class="project-card__title">${escapeHtml(project.title)}</h3>
            <div class="project-card__tags" aria-label="Tech stack">${tagsHtml}</div>
          </div>
          <p class="project-card__text">${escapeHtml(project.description)}</p>
          <div class="project-card__actions">${actions.join("")}</div>
        </article>
      `;
    };

    projectGrid.innerHTML = projects.map(cardHtml).join("");
  }

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav__toggle");
  const navLinks = document.getElementById("navLinks");
  const desktopQuery = window.matchMedia("(max-width: 920px)");

  if (nav instanceof HTMLElement && navToggle instanceof HTMLButtonElement && navLinks instanceof HTMLElement) {
    const setOpen = (open) => {
      nav.classList.toggle("nav--open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    };

    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.contains("nav--open");
      setOpen(!isOpen);
    });

    navLinks.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });

    document.addEventListener("click", (e) => {
      if (!desktopQuery.matches) return;
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (nav.contains(target)) return;
      setOpen(false);
    });

    desktopQuery.addEventListener("change", () => {
      if (!desktopQuery.matches) setOpen(false);
    });
  }

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
  const copyEmailBtn = document.getElementById("copyEmail");
  const sendBtn = document.getElementById("sendBtn");
  if (!form) return;

  const setStatus = (text) => {
    if (status) status.textContent = text;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand("copy");
        textarea.remove();
        return ok;
      } catch {
        return false;
      }
    }
  };

  if (copyEmailBtn instanceof HTMLButtonElement) {
    copyEmailBtn.addEventListener("click", async () => {
      const ok = await copyToClipboard("singhayush4307@gmail.com");
      setStatus(ok ? "Email copied." : "Couldn’t copy email.");
    });
  }

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
      setStatus("Missing required fields.");
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

    setStatus("Opening email…");
    if (sendBtn instanceof HTMLButtonElement) {
      sendBtn.disabled = true;
      sendBtn.textContent = "Opening…";
    }
    window.setTimeout(() => {
      window.location.href = mailto;
    }, 150);
  });
})();
