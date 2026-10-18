import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/catalogue";
import {
  getLcpExperimentProduct,
  LCP_EXPERIMENT_IMAGE_URL,
} from "@/lib/lcp-lab";

export default function OptimizedLcpPage() {
  const product = getLcpExperimentProduct();

  return (
    <main className="flex-1 bg-stone-50 text-zinc-950">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap gap-4 text-sm font-semibold">
              <Link
                className="text-teal-700 transition-colors hover:text-teal-900"
                href="/"
              >
                Retour aux métriques
              </Link>
              <Link
                className="text-zinc-700 transition-colors hover:text-zinc-950"
                href="/lcp/slow"
              >
                Voir la version slow
              </Link>
            </div>
            <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-teal-700">
              LCP optimized
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">
              Image principale priorisée
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-700">
              Cette page affiche le même produit que la version slow, mais
              indique explicitement au navigateur que l’image visible dans le
              viewport sans défilement est critique pour le rendu initial.
            </p>
          </div>

          <article className="overflow-hidden rounded-md border border-zinc-200 bg-stone-50">
            <div className="relative aspect-[4/3] bg-stone-100">
              <Image
                alt={product.name}
                className="object-cover"
                fetchPriority="high"
                fill
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 544px"
                src={LCP_EXPERIMENT_IMAGE_URL}
              />
            </div>
            <div className="flex items-start justify-between gap-4 p-5">
              <div>
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="mt-1 text-sm capitalize text-zinc-600">
                  {product.category}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold">
                {formatPrice(product.priceInCents)}
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-6 py-10 sm:px-8 lg:grid-cols-3 lg:px-10">
        <ExplainerCard
          title="Ce qui change"
          body="Le contenu reste identique à la version slow. La différence porte sur la priorité de l'image candidate au LCP."
        />
        <ExplainerCard
          title="À faire"
          body="Laisser Next.js optimiser l'image, déclarer une valeur sizes fidèle à la taille d'affichage et prioriser l'image principale visible dans le viewport sans défilement."
        />
        <ExplainerCard
          title="Comment le vérifier"
          body="Dans Lighthouse ou Chrome DevTools, compare l'élément LCP, le poids transféré, la ressource choisie par Next.js et la waterfall réseau avec la version slow."
        />
      </section>
    </main>
  );
}

type ExplainerCardProps = {
  body: string;
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
