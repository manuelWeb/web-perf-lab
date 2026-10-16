"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
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

const inpRiskFactors = [
  {
    title: "Calcul déclenché par l’interaction",
    body: "Un clic ou un changement de filtre lance un calcul, un tri ou une agrégation trop coûteuse sur le main thread.",
  },
  {
    title: "Payload trop grosse au mauvais moment",
    body: "Une API peut renvoyer trop de données. Le coût réseau est une partie du problème, mais le parsing, la transformation et le rendu côté navigateur peuvent aussi retarder le prochain paint.",
  },
  {
    title: "Rendu React trop large",
    body: "Une mise à jour d’état peut re-render une grande liste ou des composants coûteux alors que seule une petite partie de l’interface devait changer.",
  },
  {
    title: "Travail tiers ou transversal",
    body: "Analytics, tag managers, composants design system ou logique globale peuvent occuper le main thread au même moment que l’interaction utilisateur.",
  },
];

const optimizationStrategies = [
  {
    id: "reduce-work",
    title: "Réduire le travail",
    summary:
      "Avant de déplacer ou découper un traitement, il faut vérifier si tout ce travail est vraiment nécessaire.",
    example:
      "Exemple : éviter de parcourir tout un catalogue à chaque clic si le serveur peut filtrer les produits, paginer les résultats ou réutiliser un calcul déjà effectué.",
    improvement:
      "Amélioration typique : meilleur algorithme, moins de données à traiter, pagination, filtrage serveur, pré-calcul ou cache applicatif.",
  },
  {
    id: "split-work",
    title: "Découper le travail",
    summary:
      "Si le calcul doit rester côté client, il ne doit pas nécessairement être exécuté en une seule longue tâche.",
    example:
      "Exemple : remplacer une grande boucle synchrone par des lots de calcul qui rendent la main au navigateur entre deux morceaux.",
    improvement:
      "Amélioration typique : traiter par chunks avec setTimeout, scheduler.yield() ou requestIdleCallback pour laisser le navigateur peindre une réponse visuelle.",
  },
  {
    id: "move-work",
    title: "Déplacer le travail",
    summary:
      "Un calcul CPU pur n'a pas toujours sa place sur le main thread, surtout s'il est déclenché par une interaction.",
    example:
      "Exemple : envoyer un traitement catalogue coûteux dans un Web Worker, ou demander à une API de renvoyer des résultats déjà filtrés et triés.",
    improvement:
      "Amélioration typique : Web Worker pour le calcul local, endpoint serveur pour l'agrégation, base de données pour trier et filtrer efficacement.",
  },
  {
    id: "paint-first",
    title: "Rendre d'abord",
    summary:
      "L'utilisateur doit voir rapidement que son interaction a été prise en compte, même si le résultat complet arrive après.",
    example:
      "Exemple : afficher immédiatement un état sélectionné ou un statut de calcul, puis lancer le traitement coûteux ensuite.",
    improvement:
      "Amélioration typique : feedback visuel immédiat, état pending, transition, puis résultat final quand le calcul est terminé.",
  },
  {
    id: "reduce-react-render",
    title: "Réduire le rendu React",
    summary:
      "Parfois, le calcul n'est pas le seul problème : la mise à jour React déclenche trop de composants ou trop de DOM.",
    example:
      "Exemple : un filtre qui re-render toute une grande liste alors que seuls quelques éléments visibles changent.",
    improvement:
      "Amélioration typique : état plus local, memoisation ciblée, virtualisation de liste, composants plus petits et rendu limité aux éléments visibles.",
  },
];

export default function SlowInpPage() {
  const categories = useMemo(() => getProductCategories(catalogueProducts), []);
  const [openStrategyId, setOpenStrategyId] = useState(
    optimizationStrategies[0].id,
  );
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  function handleCategoryChange(nextCategory: string) {
    blockMainThread(INP_BLOCKING_DELAY_MS);
    const nextFilteredProducts = filterAndSortProducts({
      products: catalogueProducts,
      searchQuery: "",
      selectedCategory: nextCategory,
      sortOrder: "default",
    });

    setSelectedCategory(nextCategory);
    setFilteredProducts(nextFilteredProducts);
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
              href="/inp/optimized"
            >
              Voir la version optimisée
            </Link>
            <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-rose-700">
              INP slow
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">
              Filtre catalogue bloqué avant le prochain rendu
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-700">
              Cette page simule volontairement un mauvais handler d’interaction.
              Le changement de catégorie bloque le main thread avant d’afficher
              les résultats, donc le navigateur ne peut pas peindre le retour
              visuel immédiatement.
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
                  Le filtre utilise les produits déterministes du catalogue. Le
                  ralentissement vient d’un travail synchrone volontairement
                  placé avant la mise à jour visuelle.
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

              <p className="text-sm font-semibold text-zinc-700">
                {filteredProducts.length === 0
                  ? "Aucun filtre appliqué"
                  : `${filteredProducts.length.toLocaleString("fr-FR")} résultats affichés après blocage synchrone`}
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
        <ExplainerCard
          title="Ce qui est mesuré"
          body={
            <>
              <abbr title="Interaction to Next Paint">INP</abbr> (interaction
              jusqu’au prochain rendu visible) mesure le délai entre une action
              utilisateur et le moment où le navigateur affiche la réponse
              visuelle suivante. Ici, le changement de filtre bloque le main
              thread avant que les résultats puissent être peints.
            </>
          }
        />
        <ExplainerCard
          title="À éviter"
          body="Ne pas bloquer le main thread dans un handler d'interaction avant d'afficher un retour visuel. Le navigateur doit pouvoir peindre rapidement que l'action a été prise en compte."
        />
        <ExplainerCard
          title="À vérifier"
          body={
            <>
              <abbr title="Interaction to Next Paint">INP</abbr> remplace{" "}
              <abbr title="First Input Delay">FID</abbr> (délai avant le premier
              traitement d’une interaction).{" "}
              <abbr title="First Input Delay">FID</abbr> ne mesurait que le
              délai avant le début du handler, alors que{" "}
              <abbr title="Interaction to Next Paint">INP</abbr> couvre aussi le
              traitement et l’attente avant le prochain rendu visible.
            </>
          }
        />
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-12 sm:px-8 lg:px-10">
        <div className="mb-5 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-normal">
            Diagnostiquer et corriger une interaction lente
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Une mauvaise valeur INP ne se corrige pas toujours au même endroit.
            Le premier réflexe consiste à identifier le travail qui bloque le
            main thread, puis à choisir la stratégie adaptée.
          </p>
        </div>

        <div className="mb-5 rounded-md border border-zinc-200 bg-white p-5">
          <h3 className="text-lg font-semibold">
            Ce qui peut entraîner une valeur INP élevée
          </h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {inpRiskFactors.map((factor) => (
              <article key={factor.title}>
                <h4 className="font-semibold text-zinc-950">{factor.title}</h4>
                <p className="mt-2 text-sm leading-6 text-zinc-700">
                  {factor.body}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="divide-y divide-zinc-200 overflow-hidden rounded-md border border-zinc-200 bg-white">
          {optimizationStrategies.map((strategy) => {
            const isOpen = strategy.id === openStrategyId;

            return (
              <article key={strategy.id}>
                <button
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-stone-50"
                  onClick={() => setOpenStrategyId(strategy.id)}
                  type="button"
                >
                  <span className="font-semibold">{strategy.title}</span>
                  <span className="text-sm font-semibold text-teal-700">
                    {isOpen ? "Ouvert" : "Voir"}
                  </span>
                </button>

                {isOpen ? (
                  <div className="grid gap-4 border-t border-zinc-100 bg-stone-50 px-5 py-5 text-sm leading-6 text-zinc-700 lg:grid-cols-3">
                    <div>
                      <h3 className="font-semibold text-zinc-950">Quand</h3>
                      <p className="mt-2">{strategy.summary}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-950">Exemple</h3>
                      <p className="mt-2">{strategy.example}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-950">
                        Comment améliorer
                      </h3>
                      <p className="mt-2">{strategy.improvement}</p>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

type ExplainerCardProps = {
  body: ReactNode;
  title: string;
};

function ExplainerCard({ body, title }: ExplainerCardProps) {
  return (
    <article className="rounded-md border border-zinc-200 bg-white p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-zinc-700">{body}</p>
    </article>
  );
}
