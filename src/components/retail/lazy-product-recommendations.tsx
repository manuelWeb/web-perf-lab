"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ProductRecommendationsView } from "@/components/retail/product-recommendations-view";

// Le SSR reste activé par défaut. C'est le rendu conditionnel plus bas qui
// reporte le chargement, pas une désactivation du prérendu serveur.
const LazyRecommendations = dynamic(
  () =>
    import("@/components/retail/slow-product-recommendations").then(
      (module) => module.SlowProductRecommendations,
    ),
  {
    loading: () => (
      <ProductRecommendationsView
        result={null}
        waitingText="Chargement du moteur de recommandations…"
      />
    ),
  },
);

export function LazyProductRecommendations() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let observer: IntersectionObserver | undefined;
    let triggered = false;

    for (const name of ["start", "end", "visible"]) {
      performance.clearMarks(`tbt:recommendations:${name}`);
    }
    performance.clearMeasures("tbt:recommendations");

    function showRecommendations() {
      if (triggered) return;
      triggered = true;
      observer?.disconnect();
      performance.mark("tbt:recommendations:visible");
      // Une fois monté, le composant reste monté même si la zone sort du viewport.
      setIsVisible(true);
    }

    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            showRecommendations();
          }
        },
        { rootMargin: "0px", threshold: 0 },
      );
      observer.observe(container);
    } else {
      // Repli fonctionnel : demander le composant dès le montage.
      showRecommendations();
    }

    return () => observer?.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      {isVisible ? (
        <LazyRecommendations />
      ) : (
        <ProductRecommendationsView
          result={null}
          isPending={false}
          waitingText="Le moteur sera chargé lorsque cette zone sera visible."
        />
      )}
    </div>
  );
}
