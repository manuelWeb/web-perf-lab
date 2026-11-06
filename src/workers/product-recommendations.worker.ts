/// <reference lib="webworker" />

import { calculateSlowRecommendations } from "@/lib/slow-product-recommendations";
import type {
  RecommendationWorkerRequest,
  RecommendationWorkerResponse,
} from "@/lib/recommendations-worker-messages";

const workerScope = self as unknown as DedicatedWorkerGlobalScope;

workerScope.addEventListener(
  "message",
  (event: MessageEvent<RecommendationWorkerRequest>) => {
    try {
      performance.mark("tbt:recommendations:start");
      // Le même moteur et les mêmes permutations, exécutés sur ce thread.
      const result = calculateSlowRecommendations(event.data.products);
      performance.mark("tbt:recommendations:end");
      const measure = performance.measure(
        "tbt:recommendations",
        "tbt:recommendations:start",
        "tbt:recommendations:end",
      );
      const response: RecommendationWorkerResponse = {
        type: "success",
        result,
        computationDuration: measure.duration,
      };
      workerScope.postMessage(response);
    } catch {
      const response: RecommendationWorkerResponse = { type: "error" };
      workerScope.postMessage(response);
    }
  },
);
