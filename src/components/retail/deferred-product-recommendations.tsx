"use client";

import { useEffect, useRef, useState } from "react";
import { ProductRecommendationsView } from "@/components/retail/product-recommendations-view";
import { catalogueProducts } from "@/lib/catalogue";
import { calculateSlowRecommendations } from "@/lib/slow-product-recommendations";
import type { RecommendationResult } from "@/lib/tbt-lab";

export function DeferredProductRecommendations() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let observer: IntersectionObserver | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let scheduled = false;
    let cancelled = false;

    // Une navigation côté client peut conserver les mesures de la route précédente.
    performance.clearMarks("tbt:recommendations:start");
    performance.clearMarks("tbt:recommendations:end");
    performance.clearMarks("tbt:recommendations:visible");
    performance.clearMeasures("tbt:recommendations");

    function scheduleRecommendations() {
      if (scheduled || cancelled) return;
      scheduled = true;
      observer?.disconnect();
      performance.mark("tbt:recommendations:visible");

      // Le code est déjà chargé. Ce timer programme une seule tâche sur le Main
      // Thread : il ne découpe pas le calcul et ne le déplace pas dans un Worker.
      timer = setTimeout(function runDeferredRecommendations() {
        if (cancelled) return;
        performance.mark("tbt:recommendations:start");
        try {
          const recommendations =
            calculateSlowRecommendations(catalogueProducts);
          setResult(recommendations);
        } catch {
          setHasError(true);
        } finally {
          performance.mark("tbt:recommendations:end");
          performance.measure(
            "tbt:recommendations",
            "tbt:recommendations:start",
            "tbt:recommendations:end",
          );
        }
      }, 0);
    }

    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            scheduleRecommendations();
          }
        },
        // Déclenchement à l'entrée dans le viewport, sans marge d'anticipation.
        // Si la zone est déjà visible au chargement, le calcul démarre aussi.
        { rootMargin: "0px", threshold: 0 },
      );
      observer.observe(container);
    } else {
      // Sans cette API, conserver un résultat fonctionnel : calcul au chargement.
      scheduleRecommendations();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={containerRef}>
      {hasError ? (
        <p
          className="rounded-md border border-rose-200 bg-white p-5 text-sm text-rose-700"
          role="alert"
        >
          Les recommandations n’ont pas pu être préparées. Recharge la page pour
          réessayer.
        </p>
      ) : (
        <ProductRecommendationsView
          result={result}
          isPending={false}
          waitingText="Les recommandations seront préparées lorsque cette zone sera visible."
        />
      )}
    </div>
  );
}
