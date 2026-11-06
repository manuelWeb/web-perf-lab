import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LazyProductRecommendations } from "@/components/retail/lazy-product-recommendations";

export const metadata: Metadata = {
  title: "TBT · chargement à la demande | Web Performance Lab",
  description:
    "Le moteur de recommandations est chargé avec next/dynamic lorsque sa zone devient visible, puis exécute le même calcul dans le navigateur.",
};

export default function LazyLoadingTbtPage() {
  return (
    <main className="flex-1 bg-stone-50 text-zinc-950">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
          <div className="flex flex-col justify-center">
            <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-teal-700">
              Expérience TBT · version lazy loading
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">
              Un moteur chargé à la demande
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-700">
              Le moteur est chargé lorsque la zone de recommandations entre
              dans le viewport, puis prépare la sélection. Le catalogue, le
              profil et le calcul restent identiques à ceux de la version lente.
            </p>
            <Link
              className="mt-4 w-fit text-sm font-semibold text-teal-700 underline decoration-teal-300 underline-offset-4 transition-colors hover:text-teal-900"
              prefetch={false}
              href="/tbt/slow"
            >
              Comparer avec la version lente
            </Link>
            <Link
              className="mt-4 w-fit text-sm font-semibold text-teal-700 underline decoration-teal-300 underline-offset-4 transition-colors hover:text-teal-900"
              prefetch={false}
              href="/tbt/optimized/deferred"
            >
              Comparer avec la version différée
            </Link>
          </div>

          <figure className="overflow-hidden rounded-md border border-zinc-200 bg-stone-50">
            <div className="relative aspect-4/3 bg-stone-100">
              <Image
                alt="Capture de référence de la longue tâche du moteur dans la version lente"
                className="object-cover"
                fetchPriority="high"
                fill
                loading="eager"
                sizes="(min-width: 1024px) 544px, (min-width: 640px) calc(100vw - 64px), calc(100vw - 48px)"
                src="/images/tbt/perf-tab.png"
              />
            </div>
            <figcaption className="px-4 py-3 text-sm leading-6 text-zinc-600">
              Référence : la longue tâche de la version lente. Ici, le
              chargement et l’exécution du moteur sont reportés.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-6 py-10 sm:px-8 lg:grid-cols-3 lg:px-10">
        <ExplainerCard
          title="Ce qui change"
          body="Un IntersectionObserver déclenche le rendu du composant chargé avec next/dynamic quand la zone devient visible. Son code est alors demandé, puis le calcul démarre après son montage. L’espace est réservé pendant l’attente. Le SSR reste activé par défaut ; le rendu conditionnel reporte le chargement."
        />
        <ExplainerCard
          title="Ce qui reste coûteux"
          body="Les 3 628 800 permutations sont conservées. next/dynamic sépare le code, mais ne déplace pas le calcul vers un autre thread : il bloque toujours le Main Thread lorsqu’il démarre. Si la zone est visible à l’ouverture, le chargement commence aussitôt. Lors d’une nouvelle visite, le code peut déjà être en cache."
        />
        <ExplainerCard
          title="À observer"
          body="Sur un rechargement avec le cache désactivé, observe Network avant puis après avoir atteint les recommandations : le chunk du moteur est demandé à ce moment-là. Dans Performance, repère tbt:recommendations:visible, puis tbt:recommendations pour le calcul. Le téléchargement et le calcul sont deux étapes distinctes ; la longue tâche persiste."
        />
      </section>

      <section
        aria-labelledby="recommendations-title"
        className="mx-auto w-full max-w-6xl px-6 pb-12 sm:px-8 lg:px-10"
      >
        <h2 id="recommendations-title" className="text-2xl font-semibold">
          Recommandé pour vous
        </h2>
        <p className="mt-2 mb-6 text-sm leading-6 text-zinc-600">
          Une sélection issue des dix produits du catalogue, calculée dans votre
          navigateur.
        </p>
        <LazyProductRecommendations />
      </section>
    </main>
  );
}

function ExplainerCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-md border border-zinc-200 bg-white p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-zinc-700">{body}</p>
    </article>
  );
}
