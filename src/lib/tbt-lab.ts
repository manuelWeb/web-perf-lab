import type { Product } from "@/lib/products";

export const TBT_RECOMMENDATION_COUNT = 4;
export const TBT_PROFILE = {
  preferredCategory: "beauty",
  budgetInCents: 2000,
} as const;

export type RecommendationResult = {
  products: Product[];
  score: number;
  evaluatedPermutations: number;
};

/**
 * Business contract shared with the future optimized engine:
 * four distinct, available products, ordered by decreasing position importance.
 * Category affinity: 40 points; budget proximity: 0–20 points; position: 4–1.
 * Each pair of different categories adds 8 points for diversity.
 * Unavailable selections are ineligible. Scores use integer arithmetic rounding.
 */
export function scoreRecommendationSelection(
  selection: readonly Product[],
): number {
  let score = 0;
  let available = true;

  for (let index = 0; index < selection.length; index += 1) {
    const product = selection[index];
    available &&= product.availability === "available";
    const categoryAffinity =
      product.category === TBT_PROFILE.preferredCategory ? 40 : 0;
    const budgetProximity = Math.floor(
      (20 * TBT_PROFILE.budgetInCents) /
        (TBT_PROFILE.budgetInCents +
          Math.abs(product.priceInCents - TBT_PROFILE.budgetInCents)),
    );
    score += (selection.length - index) * (categoryAffinity + budgetProximity);

    for (let previous = 0; previous < index; previous += 1) {
      if (selection[previous].category !== product.category) score += 8;
    }
  }

  return available ? score : Number.NEGATIVE_INFINITY;
}

/** Equal scores are resolved by lexicographic product IDs, independent of traversal. */
export function precedesRecommendationSelection(
  candidate: readonly Product[],
  current: readonly Product[],
): boolean {
  for (let index = 0; index < candidate.length; index += 1) {
    if (!current[index]) return true;
    if (candidate[index].id !== current[index].id) {
      return candidate[index].id < current[index].id;
    }
  }
  return false;
}
