"use client";

import { useEffect, useState } from "react";
import { ProductRecommendationsView } from "@/components/retail/product-recommendations-view";
import { catalogueProducts } from "@/lib/catalogue";
import { calculateSlowRecommendations } from "@/lib/slow-product-recommendations";
import type { RecommendationResult } from "@/lib/tbt-lab";

export function SlowProductRecommendations() {
  const [result, setResult] = useState<RecommendationResult | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let observer: PerformanceObserver | undefined;
    let cancelled = false;
    let scheduled = false;

    function scheduleRecommendations() {
      if (scheduled || cancelled) return;
      scheduled = true;
      observer?.disconnect();

      // A separate task, scheduled immediately after observing an actual FCP.
      // Only a Lighthouse trace can confirm inclusion in its TBT measurement window.
      timer = setTimeout(function runSlowRecommendations() {
        if (cancelled) return;
        performance.clearMarks("tbt:recommendations:start");
        performance.clearMarks("tbt:recommendations:end");
        performance.clearMeasures("tbt:recommendations");
        performance.mark("tbt:recommendations:start");
        const recommendations = calculateSlowRecommendations(catalogueProducts);
        performance.mark("tbt:recommendations:end");
        performance.measure(
          "tbt:recommendations",
          "tbt:recommendations:start",
          "tbt:recommendations:end",
        );
        setResult(recommendations);
      }, 0);
    }

    if (
      typeof PerformanceObserver !== "undefined" &&
      PerformanceObserver.supportedEntryTypes.includes("paint")
    ) {
      observer = new PerformanceObserver((list) => {
        if (
          list
            .getEntries()
            .some((entry) => entry.name === "first-contentful-paint")
        ) {
          scheduleRecommendations();
        }
      });
      observer.observe({ type: "paint", buffered: true });
    } else {
      // Compatibility fallback only: two frames allow an initial paint, but do
      // not prove FCP timing. Chrome's measured path uses the observer above.
      let secondFrame = 0;
      const firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(scheduleRecommendations);
      });
      return () => {
        cancelled = true;
        cancelAnimationFrame(firstFrame);
        cancelAnimationFrame(secondFrame);
        clearTimeout(timer);
      };
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return <ProductRecommendationsView result={result} />;
}
