import { ProductCard } from "@/components/retail/product-card";
import type { Product } from "@/lib/products";

type ProductGridProps = {
  products: readonly Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
