"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const STYLE_ID = "blog-highlight-style";

function injectHighlightStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  // Animate only `opacity` (GPU-composited) on a ::before overlay so the
  // browser never needs to repaint the element itself.
  style.textContent = `
    @keyframes blog-highlight-fade {
      0%   { opacity: 1; }
      30%  { opacity: 0.85; }
      100% { opacity: 0; }
    }
    .blog-highlight {
      position: relative;
      isolation: isolate;
    }
    .blog-highlight::before {
      content: '';
      position: absolute;
      inset: -2px -4px;
      background: rgba(250, 204, 21, 0.35);
      border-radius: 0.35rem;
      pointer-events: none;
      z-index: -1;
      animation: blog-highlight-fade 5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
  `;
  document.head.appendChild(style);
}

export function BlogContentEnhancer() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hash, setHash] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    injectHighlightStyles();

    const update = () => {
      setHash(window.location.hash.slice(1));
    };

    update();

    window.addEventListener("hashchange", update);

    return () => {
      window.removeEventListener("hashchange", update);
    };
  }, [pathname, searchParams]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!hash) return;

    const el = document.getElementById(hash);
    if (!el) return;

    el.classList.remove("blog-highlight");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.add("blog-highlight");
      });
    });

    timerRef.current = setTimeout(() => {
      el.classList.remove("blog-highlight");
      timerRef.current = null;
    }, 3000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [hash]);

  return null;
}
