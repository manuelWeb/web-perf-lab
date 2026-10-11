import { ProductGrid } from "@/components/retail/product-grid";
import {
  catalogueProducts,
  formatPrice,
  getProductCategories,
} from "@/lib/catalogue";

export default function CataloguePage() {
  const categories = getProductCategories(catalogueProducts);
  const availableCount = catalogueProducts.filter(
    (product) => product.availability === "available",
  ).length;
  const prices = catalogueProducts.map((product) => product.priceInCents);
  const lowestPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);

  return (
    <main className="min-h-screen bg-stone-50 text-zinc-950">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
              Catalogue
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-zinc-950 sm:text-5xl">
              Deterministic retail catalogue
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-700">
              A compact product dataset adapted for future React and Next.js
              performance experiments without introducing cart, router, or
              network mock complexity.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Products" value={catalogueProducts.length} />
            <Metric label="Available" value={availableCount} />
            <Metric label="Categories" value={categories.length} />
            <Metric
              label="Price range"
              value={`${formatPrice(lowestPrice)} - ${formatPrice(highestPrice)}`}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-950">
              Retail products
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Static product data adapted from the React Reboot reference app.
            </p>
          </div>
          <p className="text-sm text-zinc-600">{categories.join(" / ")}</p>
        </div>
        <ProductGrid products={catalogueProducts} />
      </section>
    </main>
  );
}

type MetricProps = {
  label: string;
  value: number | string;
};

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-md border border-zinc-200 bg-stone-50 p-4">
      <p className="text-sm text-zinc-600">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-zinc-950">{value}</p>
    </div>
  );
}
