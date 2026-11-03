import type { Product } from "@/lib/products";
import {
  precedesRecommendationSelection,
  scoreRecommendationSelection,
  TBT_RECOMMENDATION_COUNT,
  type RecommendationResult,
} from "@/lib/tbt-lab";

/**
 * Implémentation volontairement inefficace : essayer tous les ordres possibles
 * des dix produits, alors que seules les quatre premières places sont utiles.
 *
 * Pour chaque choix du premier produit (10 possibilités), on essaie chacun des
 * 9 produits restants en deuxième, puis chacun des 8 restants en troisième, etc.
 * Le nombre d'ordres complets est donc un PRODUIT, pas une somme :
 * 10 × 9 × 8 × 7 × 6 × 5 × 4 × 3 × 2 × 1 = 3 628 800.
 * « 10! » est la notation mathématique de ce produit, appelée factorielle de 10.
 * Ce n'est pas une syntaxe JavaScript : ce sont les appels récursifs ci-dessous
 * qui construisent un par un ces 3 628 800 ordres, aussi appelés permutations.
 *
 * Les six dernières places n'influencent pas le score. Leurs 6! = 720 ordres
 * font donc recalculer 720 fois chaque même sélection ordonnée de quatre produits.
 *
 * Calcul lancé uniquement par le callback navigateur de la route lente, après le FCP, jamais pendant le rendu.
 * On garde un seul tableau de travail et la
 * meilleure sélection, sans stocker les millions de permutations.
 */
export function calculateSlowRecommendations(
  products: readonly Product[],
): RecommendationResult {
  if (
    products.length !== 10 ||
    new Set(products.map((product) => product.id)).size !== 10
  ) {
    throw new Error(
      "The TBT experiment requires the ten unique catalogue products.",
    );
  }

  // Copier le tableau pour pouvoir échanger ses éléments sans modifier le catalogue.
  const permutation = [...products];
  let bestProducts: Product[] = [];
  let bestScore = Number.NEGATIVE_INFINITY;
  let evaluatedPermutations = 0;

  function enumerateCataloguePermutations(position: number): void {
    // « position » est l'index du tableau à remplir : 0, puis 1, jusqu'à 9.
    // Les index précédents restent fixés pendant l'exploration de cette suite de choix.
    if (position === permutation.length) {
      // À position 10, les dix places sont remplies : un ordre complet est trouvé.
      // Exemple avec trois produits : ABC est un ordre, ACB en est un autre.
      const selection = permutation.slice(0, TBT_RECOMMENDATION_COUNT);
      const score = scoreRecommendationSelection(selection);
      // Compter une fois chaque ordre complet, pas chaque appel récursif.
      // Après toute l'exploration, ce compteur vaudra exactement 3 628 800.
      evaluatedPermutations += 1;

      if (
        Number.isFinite(score) &&
        (score > bestScore ||
          (score === bestScore &&
            precedesRecommendationSelection(selection, bestProducts)))
      ) {
        bestScore = score;
        bestProducts = selection;
      }
      return;
    }

    // Essayer chaque produit restant à l'index « position » :
    // position 0 → 10 choix ; pour CHACUN, position 1 → 9 choix ; puis 8, etc.
    // Avec A, B, C : choisir A en premier explore ABC et ACB ;
    // choisir B explore BAC et BCA ; choisir C explore CAB et CBA.
    for (let next = position; next < permutation.length; next += 1) {
      // 1. Choisir : échanger les éléments pour placer le candidat à cet index.
      [permutation[position], permutation[next]] = [
        permutation[next],
        permutation[position],
      ];
      // 2. Explorer : remplir la place suivante en essayant toutes ses possibilités.
      enumerateCataloguePermutations(position + 1);
      // 3. Annuler le choix : refaire l'échange pour retrouver l'état précédent
      // avant le prochain candidat de la boucle. C'est le retour arrière (backtracking).
      [permutation[position], permutation[next]] = [
        permutation[next],
        permutation[position],
      ];
    }
  }

  // Commencer à l'index 0. Chaque ordre complet sera évalué au fil de l'exploration.
  enumerateCataloguePermutations(0);
  return { products: bestProducts, score: bestScore, evaluatedPermutations };
}
