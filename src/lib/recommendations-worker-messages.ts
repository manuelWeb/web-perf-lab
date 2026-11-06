import type { Product } from "@/lib/products";
import type { RecommendationResult } from "@/lib/tbt-lab";

// Seules des données sérialisables traversent la frontière du Worker.
export type RecommendationWorkerRequest = {
  products: readonly Product[];
};

export type RecommendationWorkerResponse =
  | { type: "success"; result: RecommendationResult; computationDuration: number }
  | { type: "error" };
