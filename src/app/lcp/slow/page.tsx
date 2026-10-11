import Image from "next/image";
import Link from "next/link";
import { catalogueProducts, formatPrice } from "@/lib/catalogue";
import type { Product } from "@/lib/products";

const LCP_SLOW_PRODUCT_ID = "11";

function getSlowPageProduct(): Product {
  const product = catalogueProducts.find(
    (product) => product.id === LCP_SLOW_PRODUCT_ID,
  );

  if (!product) {
    throw new Error(`Missing LCP slow page product: ${LCP_SLOW_PRODUCT_ID}`);
  }

  return product;
}

export default function SlowLcpPage() {
  const product = getSlowPageProduct();

  return (
    <main className="min-h-screen bg-stone-50 text-zinc-950">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
          <div className="flex flex-col justify-center">
            <Link
              className="text-sm font-semibold text-teal-700 transition-colors hover:text-teal-900"
              href="/"
            >
              Retour aux métriques
            </Link>
            <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-rose-700">
              LCP slow
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">
              Image principale sans priorité explicite
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-700">
              Cette page place une grande image produit au-dessus de la ligne
              de flottaison, c’est-à-dire visible dans le viewport sans
              défilement, mais laisse le navigateur la découvrir sans signal de
              priorité adapté. C’est un bon point de départ pour observer un
              candidat LCP chargé trop tard.
            </p>
          </div>

          <article className="overflow-hidden rounded-md border border-zinc-200 bg-stone-50">
            <div className="relative aspect-[4/3] bg-stone-100">
              <Image
                alt={product.name}
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                src={product.imageUrl}
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
          title="Ce qui est mesuré"
          body="Le LCP mesure le temps nécessaire pour afficher le plus grand élément de contenu visible. Ici, l'image produit est volontairement le candidat principal."
        />
        <ExplainerCard
          title="Pourquoi c'est lent"
          body="L'image visible dans le viewport sans défilement n'a pas de signal indiquant qu'elle est critique. Le navigateur peut donc la prioriser trop tard par rapport au rendu initial."
        />
        <ExplainerCard
          title="Comment l'analyser"
          body="Dans Chrome DevTools ou Lighthouse, repère l'élément LCP, sa requête réseau, son début de chargement et le temps perdu avant réception de l'image."
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
