"use client";

import { useEffect, useState } from "react";
import { ProductRecommendationsView } from "@/components/retail/product-recommendations-view";
import { catalogueProducts } from "@/lib/catalogue";
import type {
  RecommendationWorkerRequest,
  RecommendationWorkerResponse,
} from "@/lib/recommendations-worker-messages";

type WorkerSuccess = Extract<RecommendationWorkerResponse, { type: "success" }>;

export function WorkerProductRecommendations() {
  const [response, setResponse] = useState<WorkerSuccess | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let worker: Worker | undefined;
    let observer: PerformanceObserver | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let firstFrame = 0;
    let secondFrame = 0;
    let scheduled = false;
    let cancelled = false;

    // Ces mesures appartiennent au thread principal. La durée du calcul est
    // mesurée séparément dans le Worker, dont l'horloge a sa propre origine.
    performance.clearMarks("tbt:recommendations:request");
    performance.clearMarks("tbt:recommendations:response");
    performance.clearMeasures("tbt:recommendations:roundtrip");
    performance.clearMeasures("tbt:recommendations");

    function fail() {
      if (cancelled) return;
      worker?.terminate();
      setHasError(true);
    }

    function startWorker() {
      if (cancelled) return;
      try {
        // L'URL littérale permet au bundler de créer le fichier du Worker.
        // Le moteur n'est jamais importé ni exécuté par ce composant React.
        performance.mark("tbt:recommendations:request");
        worker = new Worker(
          new URL(
            "../../workers/product-recommendations.worker.ts",
            import.meta.url,
          ),
          { type: "module", name: "tbt-recommendations" },
        );
        worker.onmessage = (event: MessageEvent<RecommendationWorkerResponse>) => {
          if (cancelled) return;
          performance.mark("tbt:recommendations:response");
          performance.measure(
            "tbt:recommendations:roundtrip",
            "tbt:recommendations:request",
            "tbt:recommendations:response",
          );
          if (event.data.type === "success") {
            setResponse(event.data);
            worker?.terminate();
          } else {
            fail();
          }
        };
        worker.onerror = fail;
        worker.onmessageerror = fail;
        const request: RecommendationWorkerRequest = {
          products: catalogueProducts,
        };
        // Le catalogue est copié par structured clone, sans modifier l'original.
        worker.postMessage(request);
      } catch {
        // Pas de repli silencieux sur Main : il fausserait cette démonstration.
        fail();
      }
    }

    function scheduleRecommendations() {
      if (scheduled || cancelled) return;
      scheduled = true;
      observer?.disconnect();
      // Comme slow, déclencher automatiquement après le FCP, sans attendre
      // l'entrée dans le viewport. Seul le lieu d'exécution du moteur change.
      timer = setTimeout(startWorker, 0);
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
      // Repli identique à slow : laisser passer deux frames, sans garantir le FCP.
      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(scheduleRecommendations);
      });
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      // Une navigation interrompt aussi un calcul déjà en cours dans le Worker.
      worker?.terminate();
    };
  }, []);

  if (hasError) {
    return (
      <p
        className="rounded-md border border-rose-200 bg-white p-5 text-sm text-rose-700"
        role="alert"
      >
        Le Web Worker n’a pas pu préparer les recommandations. Recharge la page
        dans un navigateur compatible pour réessayer.
      </p>
    );
  }

  return (
    <div>
      <ProductRecommendationsView
        result={response?.result ?? null}
        waitingText="Le moteur prépare vos recommandations dans un Web Worker…"
      />
      {response && (
        <p className="mt-4 text-sm leading-6 text-zinc-600">
          {response.result.evaluatedPermutations.toLocaleString("fr-FR")} permutations
          évaluées en{" "}
          {Math.round(response.computationDuration).toLocaleString("fr-FR")} ms dans
          le Worker. Cette durée de calcul n’est pas le TBT.
        </p>
      )}
    </div>
  );
}
