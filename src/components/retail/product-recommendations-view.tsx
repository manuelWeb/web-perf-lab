import { ProductGrid } from "@/components/retail/product-grid";
import {
  TBT_RECOMMENDATION_COUNT,
  type RecommendationResult,
} from "@/lib/tbt-lab";

type ProductRecommendationsViewProps = {
  result: RecommendationResult | null;
  waitingText?: string;
  isPending?: boolean;
};

export function ProductRecommendationsView({
  result,
  waitingText = "Préparation de vos recommandations…",
  isPending = !result,
}: ProductRecommendationsViewProps) {
  return (
    <div aria-busy={isPending}>
      <p className="mb-5 min-h-6 text-sm text-zinc-600" role="status">
        {result
          ? `${result.products.length} recommandations sélectionnées pour votre profil.`
          : waitingText}
      </p>
      {result ? (
        <ProductGrid products={result.products} />
      ) : (
        <div
          aria-hidden="true"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {Array.from({ length: TBT_RECOMMENDATION_COUNT }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-md border border-zinc-200 bg-white"
            >
              <div className="aspect-square bg-stone-100" />
              <div className="min-h-40 space-y-3 p-4">
                <div className="h-6 w-3/4 rounded-sm bg-stone-100" />
                <div className="h-6 w-1/2 rounded-sm bg-stone-100" />
              </div>
            </div>
          ))}
        </div>
      )}
      <noscript>
        Active JavaScript pour lancer le moteur de recommandations de cette
        expérience.
      </noscript>
    </div>
  );
}
