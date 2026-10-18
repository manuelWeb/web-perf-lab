"use client";

import { useEffect, useRef, useState } from "react";
import { MetricNavigation } from "@/components/metric-navigation";
import type { MetricNavigationItem } from "@/components/metric-navigation";

type MobileMetricMenuProps = {
  items: readonly MetricNavigationItem[];
};

export function MobileMetricMenu({ items }: MobileMetricMenuProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const wasOpenRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  function toggleMenu() {
    setIsOpen((open) => !open);
  }

  useEffect(() => {
    if (!isOpen) {
      if (wasOpenRef.current) {
        triggerRef.current?.focus();
        wasOpenRef.current = false;
      }
      return;
    }

    wasOpenRef.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    headingRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])',
      );
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && (document.activeElement === first || !dialogRef.current.contains(document.activeElement))) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current.contains(document.activeElement))) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={
          isOpen ? "Fermer le menu des métriques" : "Ouvrir le menu des métriques"
        }
        aria-controls="mobile-metric-menu"
        className="relative z-50 flex size-11 flex-col items-center justify-center gap-1.5 rounded-md border border-zinc-300 bg-white text-zinc-800 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        onClick={toggleMenu}
        ref={triggerRef}
        type="button"
      >
        <span
          className={`absolute h-0.5 w-5 bg-current transition-transform duration-300 ${isOpen ? "rotate-45" : "-translate-y-1.5"}`}
        />
        <span
          className={`absolute h-0.5 w-5 bg-current transition-opacity duration-200 ${isOpen ? "opacity-0" : "opacity-100"}`}
        />
        <span
          className={`absolute h-0.5 w-5 bg-current transition-transform duration-300 ${isOpen ? "-rotate-45" : "translate-y-1.5"}`}
        />
      </button>

      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-40 transition-[visibility] duration-300 ${isOpen ? "visible" : "invisible delay-300"}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setIsOpen(false);
          }
        }}
        ref={dialogRef}
      >
        <div
          className={`absolute inset-0 bg-zinc-950/15 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsOpen(false)}
        />
        <aside
          aria-label="Navigation des métriques"
          aria-modal="true"
          className={`absolute inset-y-0 right-0 flex h-dvh w-[min(22rem,100vw)] flex-col overflow-y-auto border-l border-zinc-200 bg-white px-5 pb-6 pt-5 shadow-xl transition-transform duration-300 ease-out motion-reduce:transition-none ${isOpen ? "translate-x-0" : "translate-x-full"}`}
          id="mobile-metric-menu"
          role="dialog"
        >
          <h2
            className="mb-5 pr-14 text-lg font-semibold text-zinc-950"
            id="mobile-metric-menu-title"
            ref={headingRef}
            tabIndex={-1}
          >
            Métriques
          </h2>
          <nav aria-label="Navigation des métriques">
            <MetricNavigation
              items={items}
              onNavigate={() => setIsOpen(false)}
              orientation="vertical"
            />
          </nav>
        </aside>
      </div>
    </div>
  );
}
