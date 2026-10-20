import Image from "next/image";
import Link from "next/link";
import {
  getLcpExperimentProduct,
  LCP_EXPERIMENT_IMAGE_URL,
} from "@/lib/lcp-lab";

export default function SlowLcpPage() {
  const product = getLcpExperimentProduct();

  return (
    <main className="flex-1 bg-stone-50 text-zinc-950">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-rose-700">
              Expérience LCP · version lente
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">
              Image principale non optimisée
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-700">
              Cette page place une grande image produit au-dessus de la ligne de
              flottaison, c’est-à-dire visible dans le viewport sans défilement,
              mais désactive l’optimisation de Next.js. Le navigateur charge
              donc l’image distante brute au lieu d’une version redimensionnée
              pour sa taille d’affichage.
            </p>
            <Link
              className="mt-4 w-fit text-sm font-semibold text-teal-700 underline decoration-teal-300 underline-offset-4 transition-colors hover:text-teal-900"
              href="/lcp/optimized"
            >
              Comparer avec la version optimisée
            </Link>
          </div>

          <article className="order-first overflow-hidden rounded-md border border-zinc-200 bg-stone-50 lg:order-last">
            <div className="relative aspect-4/3 bg-stone-100">
              <Image
                alt={product.name}
                className="object-cover"
                fill
                unoptimized
                src={LCP_EXPERIMENT_IMAGE_URL}
              />
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-6 py-10 sm:px-8 lg:grid-cols-3 lg:px-10">
        <ExplainerCard
          title="Ce qui est mesuré"
          body="Le LCP mesure le temps nécessaire pour afficher le plus grand élément de contenu visible. Ici, l'image produit est volontairement le candidat principal."
        />
        <ExplainerCard
          title="À éviter"
          body="L'image visible dans le viewport sans défilement utilise unoptimized. Next.js ne génère donc pas de version redimensionnée et le navigateur charge l'image distante brute."
        />
        <ExplainerCard
          title="À vérifier"
          body="Dans Chrome DevTools ou Lighthouse, repère l'élément LCP, sa requête réseau et le poids transféré. Le problème attendu est une image brute trop coûteuse pour sa taille réelle d'affichage."
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
