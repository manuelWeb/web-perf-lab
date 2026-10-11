"use client";

import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/retail/product-grid";
import {
  ALL_CATEGORIES,
  filterAndSortProducts,
  type SortOrder,
} from "@/lib/catalogue";
import type { Product } from "@/lib/products";

type FilterableCatalogueProps = {
  categories: readonly string[];
  products: readonly Product[];
};

const sortOptions = [
  { label: "Default", value: "default" },
  { label: "Price: low to high", value: "price-ascending" },
  { label: "Price: high to low", value: "price-descending" },
] satisfies { label: string; value: SortOrder }[];

export function FilterableCatalogue({
  categories,
  products,
}: FilterableCatalogueProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");

  const filteredProducts = useMemo(
    () =>
      filterAndSortProducts({
        products,
        searchQuery,
        selectedCategory,
        sortOrder,
      }),
    [products, searchQuery, selectedCategory, sortOrder],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3 rounded-md border border-zinc-200 bg-white p-4 sm:grid-cols-3">
        <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
          Search
          <input
            className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-base font-normal text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-teal-700"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Product name"
            type="search"
            value={searchQuery}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
          Category
          <select
            className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-base font-normal text-zinc-950 outline-none transition-colors focus:border-teal-700"
            onChange={(event) => setSelectedCategory(event.target.value)}
            value={selectedCategory}
          >
            <option value={ALL_CATEGORIES}>All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.replaceAll("-", " ")}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
          Sort
          <select
            className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-base font-normal text-zinc-950 outline-none transition-colors focus:border-teal-700"
            onChange={(event) => setSortOrder(event.target.value as SortOrder)}
            value={sortOrder}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center justify-between gap-4 text-sm text-zinc-600">
        <p>
          Showing {filteredProducts.length} of {products.length} products
        </p>
        {(searchQuery ||
          selectedCategory !== ALL_CATEGORIES ||
          sortOrder !== "default") && (
          <button
            className="font-semibold text-teal-700 transition-colors hover:text-teal-900"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory(ALL_CATEGORIES);
              setSortOrder("default");
            }}
            type="button"
          >
            Reset filters
          </button>
        )}
      </div>

      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className="rounded-md border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-600">
          No products match the current filters.
        </div>
      )}
    </div>
  );
}
