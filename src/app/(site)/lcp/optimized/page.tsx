import Image from "next/image";
import Link from "next/link";
import {
  getLcpExperimentProduct,
  LCP_EXPERIMENT_IMAGE_URL,
} from "@/lib/lcp-lab";

export default function OptimizedLcpPage() {
  const product = getLcpExperimentProduct();

  return (
    <main className="flex-1 bg-stone-50 text-zinc-950">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
              Expérience LCP · version optimisée
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">
              Image principale priorisée
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-700">
              Cette page affiche le même produit que la version slow, mais
              indique explicitement au navigateur que l’image visible dans le
              viewport sans défilement est critique pour le rendu initial.
            </p>
            <Link
              className="mt-4 w-fit text-sm font-semibold text-teal-700 underline decoration-teal-300 underline-offset-4 transition-colors hover:text-teal-900"
              href="/lcp/slow"
            >
              Comparer avec la version slow
            </Link>
          </div>

          <article className="order-first overflow-hidden rounded-md border border-zinc-200 bg-stone-50 lg:order-last">
            <div className="relative aspect-4/3 bg-stone-100">
              <Image
                alt={product.name}
                className="object-cover"
                fetchPriority="high"
                fill
                loading="eager"
                sizes="(min-width: 1024px) 544px, (min-width: 640px) calc(100vw - 64px), calc(100vw - 48px)"
                src={LCP_EXPERIMENT_IMAGE_URL}
              />
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
