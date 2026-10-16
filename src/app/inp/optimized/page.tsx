"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  catalogueProducts,
  filterAndSortProducts,
  formatPrice,
  getProductCategories,
} from "@/lib/catalogue";
import {
  blockMainThread,
  INP_BLOCKING_DELAY_MS,
} from "@/lib/performance-simulation";
import type { Product } from "@/lib/products";

function waitForNextPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

export default function OptimizedInpPage() {
  const categories = useMemo(() => getProductCategories(catalogueProducts), []);
  const [isPending, setIsPending] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [requestedCategory, setRequestedCategory] = useState<string | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  useEffect(() => {
    if (!requestedCategory) {
      return;
    }

    let isCancelled = false;

    async function runAnalysis() {
      await waitForNextPaint();

      if (isCancelled || !requestedCategory) {
        return;
      }

      blockMainThread(INP_BLOCKING_DELAY_MS);

      const nextFilteredProducts = filterAndSortProducts({
        products: catalogueProducts,
        searchQuery: "",
        selectedCategory: requestedCategory,
        sortOrder: "default",
      });

      if (!isCancelled) {
        setFilteredProducts(nextFilteredProducts);
        setIsPending(false);
        setRequestedCategory(null);
      }
    }

    void runAnalysis();

    return () => {
      isCancelled = true;
    };
  }, [requestedCategory]);

  function handleCategoryChange(nextCategory: string) {
    setSelectedCategory(nextCategory);
    setFilteredProducts([]);
    setIsPending(true);
    setRequestedCategory(nextCategory);
  }

  return (
    <main className="min-h-screen bg-stone-50 text-zinc-950">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
          <div className="flex flex-col justify-start">
            <Link
              className="text-sm font-semibold text-teal-700 transition-colors hover:text-teal-900"
              href="/"
            >
              Retour aux métriques
            </Link>
            <Link
              className="mt-3 text-sm font-semibold text-zinc-700 transition-colors hover:text-zinc-950"
              href="/inp/slow"
            >
              Voir la version slow
            </Link>
            <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-teal-700">
              INP optimized
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">
              Retour visuel avant le travail bloquant
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-700">
              Cette page garde le même travail simulé que la version slow, avec
              le même délai bloquant. La différence est l’ordre d’exécution :
              l’interface affiche d’abord un état de chargement, puis le travail
              est lancé dans un effet après le rendu.
            </p>
            <Link
              className="mt-3 w-fit text-sm font-semibold text-teal-700 underline decoration-teal-300 underline-offset-4 transition-colors hover:text-teal-900"
              href="/inp/analysis"
            >
              Guide d’analyse INP
            </Link>
          </div>

          <section className="rounded-md border border-zinc-200 bg-stone-50 p-5">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-xl font-semibold">Analyse commerciale</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Même catalogue, même catégorie, même travail bloquant. Le gain
                  vient du retour visuel immédiat avant le calcul.
                </p>
              </div>

              <div className="grid gap-2">
                <p className="text-sm font-semibold text-zinc-800">Catégorie</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {categories.map((category) => {
                    const isSelected = category === selectedCategory;

                    return (
                      <button
                        className={`h-11 rounded-md border px-3 text-sm font-semibold transition-colors ${
                          isSelected
                            ? "border-zinc-950 bg-zinc-950 text-white"
                            : "border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50"
                        }`}
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        type="button"
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              {isPending ? (
                <div className="grid gap-3 rounded-md border border-teal-200 bg-teal-50 p-4">
                  <p className="text-sm font-semibold text-teal-900">
                    Chargement des résultats…
                  </p>
                  <div className="grid gap-2" aria-hidden="true">
                    <div className="h-9 rounded-md bg-teal-100" />
                    <div className="h-9 rounded-md bg-teal-100" />
                    <div className="h-9 rounded-md bg-teal-100" />
                  </div>
                </div>
              ) : null}

              <p className="text-sm font-semibold text-zinc-700">
                {filteredProducts.length === 0
                  ? "Aucun résultat affiché"
                  : `${filteredProducts.length.toLocaleString("fr-FR")} résultats affichés après retour visuel immédiat`}
              </p>

              <ol className="grid gap-2">
                {filteredProducts.map((product) => (
                  <li
                    className="flex items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
                    key={product.id}
                  >
                    <span className="font-semibold">{product.name}</span>
                    <span className="text-right text-zinc-600">
                      {formatPrice(product.priceInCents)}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-6 py-10 sm:px-8 lg:grid-cols-3 lg:px-10">
        <article className="rounded-md border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold">Ce qui change</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-700">
            Le travail coûteux n’est pas supprimé. Il est déclenché après un
            premier rendu visible, ce qui donne au navigateur une occasion de
            peindre l’état de chargement.
          </p>
        </article>
        <article className="rounded-md border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold">À retenir</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-700">
            Cette approche améliore le retour perçu, mais ne réduit pas le coût
            CPU. Pour une correction plus robuste, il faudrait réduire, découper
            ou déplacer le travail.
          </p>
        </article>
        <article className="rounded-md border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold">À vérifier</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-700">
            Dans Performance, compare la sous-partie Presentation delay et le
            moment où l’état de chargement apparaît avec la version slow.
          </p>
        </article>
      </section>
    </main>
  );
}
