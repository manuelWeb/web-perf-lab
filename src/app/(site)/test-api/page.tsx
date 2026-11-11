"use client";

import { useState } from "react";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, "");
const productsUrl = apiBaseUrl ? `${apiBaseUrl}/products?limit=2` : undefined;

export default function TestApiPage() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState("");

  async function testProducts() {
    if (!productsUrl) return;

    setPending(true);
    setResult("");

    try {
      const response = await fetch(productsUrl, {
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        setResult(`Erreur HTTP ${response.status}`);
        return;
      }

      const products: unknown = await response.json();
      setResult(`HTTP ${response.status}\n${JSON.stringify(products, null, 2)}`);
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Échec de la requête.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 space-y-4 p-6">
      <h1 className="text-2xl font-bold">Test de l’API</h1>
      <p className="break-all font-mono text-sm">
        {productsUrl
          ? `GET ${productsUrl}`
          : "Renseigne NEXT_PUBLIC_API_BASE_URL dans le fichier .env."}
      </p>
      <button
        type="button"
        className="rounded border px-4 py-2 disabled:opacity-50"
        disabled={pending || !productsUrl}
        onClick={testProducts}
      >
        Appeler l’API
      </button>
      <pre aria-live="polite" className="overflow-auto text-sm">
        {pending ? "Requête en cours…" : result}
      </pre>
    </main>
  );
}
