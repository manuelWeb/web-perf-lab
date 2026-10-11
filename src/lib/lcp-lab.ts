import { catalogueProducts } from "@/lib/catalogue";
import type { Product } from "@/lib/products";

export const LCP_EXPERIMENT_PRODUCT_ID = "11";
export const LCP_EXPERIMENT_IMAGE_URL = "https://picsum.photos/id/29/4000/2670";

/**
 * Récupère le produit commun aux pages LCP slow et optimized.
 *
 * Les deux variantes doivent afficher le même contenu principal et la même
 * grande image pour que la comparaison porte sur la stratégie de chargement,
 * pas sur un produit ou un visuel différent.
 */
export function getLcpExperimentProduct(): Product {
  const product = catalogueProducts.find(
    (product) => product.id === LCP_EXPERIMENT_PRODUCT_ID,
  );

  if (!product) {
    throw new Error(
      `Missing LCP experiment product: ${LCP_EXPERIMENT_PRODUCT_ID}`,
    );
  }

  return product;
}
