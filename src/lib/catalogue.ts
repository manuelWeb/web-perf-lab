import { products, type Product } from "@/lib/products";

export type SortOrder = "default" | "price-ascending" | "price-descending";

export const ALL_CATEGORIES = "all";
export const catalogueProducts = products;

const priceFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "EUR",
});

type FilterAndSortProductsParams = {
  products: readonly Product[];
  searchQuery: string;
  selectedCategory: string;
  sortOrder: SortOrder;
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase()
    .trim();

export function formatPrice(priceInCents: number): string {
  return priceFormatter.format(priceInCents / 100);
}

export function getProductCategories(products: readonly Product[]): string[] {
  return [...new Set(products.map((product) => product.category))].sort(
    (a, b) => a.localeCompare(b),
  );
}

export function filterAndSortProducts({
  products,
  searchQuery,
  selectedCategory,
  sortOrder,
}: FilterAndSortProductsParams): Product[] {
  const normalizedQuery = normalize(searchQuery);
  const filteredProducts = products.filter((product) => {
    const matchesSearch = normalize(product.name).includes(normalizedQuery);
    const matchesCategory =
      selectedCategory === ALL_CATEGORIES ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  switch (sortOrder) {
    case "price-ascending":
      filteredProducts.sort((a, b) => a.priceInCents - b.priceInCents);
      break;
    case "price-descending":
      filteredProducts.sort((a, b) => b.priceInCents - a.priceInCents);
      break;
    case "default":
      break;
  }

  return filteredProducts;
}
