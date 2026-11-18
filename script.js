// Golden Touch Agency — site behaviour
// Mobile nav toggle, active-link tracking, footer year, live hours note.

document.addEventListener("DOMContentLoaded", () => {

  /* Footer year */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Mobile nav toggle */
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("siteNav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    // Close the mobile menu after a link is chosen
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("open")) return;
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }
    });
  }

  /* Highlight the current section's nav link while scrolling */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".site-nav a[href^='#']");

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const linkFor = (id) =>
      [...navLinks].find((a) => a.getAttribute("href") === `#${id}`);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = linkFor(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((a) => a.classList.remove("is-active"));
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* "Back to top" links target the sticky header, which the browser
     treats as already in place while scrolled, so the native anchor
     jump silently no-ops. Force an explicit scroll to the very top. */
  document.querySelectorAll('a[href="#top"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      history.pushState(null, "", "#top");
    });
  });

  /* Simple open/closed note based on Ghana office hours (Mon-Sat, 8am-6pm) */
  const noteEl = document.getElementById("clock");
  if (noteEl) {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Sunday
    const isOpenNow = day !== 0 && hour >= 8 && hour < 18;
    noteEl.textContent = isOpenNow
      ? "Lines are open now — Monday to Saturday, 8am to 6pm."
      : "Outside our usual hours (Mon–Sat, 8am–6pm) — call anyway, or reach us first thing.";
  }

});
