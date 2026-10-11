import Image from "next/image";
import { formatPrice } from "@/lib/catalogue";
import type { Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const isAvailable = product.availability === "available";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-md border border-zinc-200 bg-white">
      <div className="relative aspect-square bg-stone-100">
        <Image
          alt={product.name}
          className="object-cover"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          src={product.imageUrl}
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold leading-6 text-zinc-950">
              {product.name}
            </h3>
            <p className="mt-1 text-sm capitalize text-zinc-600">
              {product.category.replaceAll("-", " ")}
            </p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-zinc-950">
            {formatPrice(product.priceInCents)}
          </p>
        </div>
        <p
          className={`mt-auto text-sm font-medium ${
            isAvailable ? "text-teal-700" : "text-rose-700"
          }`}
        >
          {isAvailable ? "Available" : "Unavailable"}
        </p>
      </div>
    </article>
  );
}
