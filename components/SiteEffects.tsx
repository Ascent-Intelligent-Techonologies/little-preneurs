"use client";

import { useEffect } from "react";

// Behaviour for the marketing page: mobile nav, header logo reveal,
// click-to-play video embeds, photo lightbox and scroll reveals. It works
// on the server-rendered markup in app/page.tsx via the DOM.
export default function SiteEffects() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const on = <T extends EventTarget>(el: T | null | undefined, type: string, fn: EventListener) => {
      if (!el) return;
      el.addEventListener(type, fn);
      cleanups.push(() => el.removeEventListener(type, fn));
    };

    // Mobile nav
    const toggle = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");
    if (toggle && links) {
      on(toggle, "click", () => {
        const open = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      on(links, "click", (e) => {
        if ((e.target as HTMLElement).closest("a")) {
          links.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    // Click-to-load video embeds (Instagram + YouTube)
    document.querySelectorAll<HTMLElement>("[data-embed]").forEach((box) => {
      const btn = box.querySelector(".play");
      on(btn, "click", () => {
        const f = document.createElement("iframe");
        f.src = box.dataset.embed ?? "";
        f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
        f.allowFullscreen = true;
        f.loading = "lazy";
        f.title = "Littlepreneurs video";
        box.replaceChildren(f);
      });
    });

    // Lightbox
    const lb = document.getElementById("lightbox");
    const lbImg = lb?.querySelector("img");
    const lbCap = lb?.querySelector("p");
    if (lb && lbImg && lbCap) {
      const close = () => {
        lb.hidden = true;
        document.body.style.overflow = "";
      };
      document.querySelectorAll<HTMLImageElement>("img[data-lb]").forEach((img) => {
        on(img, "click", () => {
          lbImg.src = img.src;
          lbImg.alt = img.alt;
          lbCap.textContent = img.closest("figure")?.querySelector("figcaption")?.textContent || "";
          lb.hidden = false;
          document.body.style.overflow = "hidden";
        });
      });
      on(lb, "click", (e) => {
        if (e.target !== lbImg) close();
      });
      on(document, "keydown", (e) => {
        if ((e as KeyboardEvent).key === "Escape") close();
      });
    }

    // Reveal on scroll
    const targets = document.querySelectorAll(".section .wrap > *, .hero .wrap > *");
    targets.forEach((t) => t.classList.add("reveal"));
    let io2: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      io2 = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io2?.unobserve(e.target);
            }
          }),
        { threshold: 0.08 }
      );
      targets.forEach((t) => io2!.observe(t));
    } else {
      targets.forEach((t) => t.classList.add("in"));
    }

    // Keep anchor jumps flush under the sticky header (no extra gap)
    const nav = document.querySelector<HTMLElement>(".nav");
    const setNavH = () => {
      if (nav) document.documentElement.style.setProperty("--nav-h", nav.offsetHeight + "px");
    };
    setNavH();
    on(window, "resize", setNavH);
    on(window, "load", setNavH);

    return () => {
      cleanups.forEach((fn) => fn());
      io2?.disconnect();
      targets.forEach((t) => t.classList.remove("reveal", "in"));
    };
  }, []);

  return null;
}
