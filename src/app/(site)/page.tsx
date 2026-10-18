import Link from "next/link";
import {
  performanceMetrics,
  type PerformanceMetric,
} from "@/lib/performance-metrics";

export default function Home() {
  return (
    <main className="flex-1 bg-stone-50 text-zinc-950">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
              Portfolio performance
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">
              Web Performance Lab
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-700">
              Un laboratoire Next.js et React pour comprendre, reproduire,
              mesurer puis corriger les principaux problemes de performance
              web. Chaque experience suivra une logique bad to good: une page
              lente, une page optimisee, et une explication mesurable.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex h-11 w-fit items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
              href="/catalogue"
            >
              Ouvrir le catalogue
            </Link>
            <a
              className="inline-flex h-11 w-fit items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
              href="https://web.dev/articles/vitals"
              rel="noreferrer"
              target="_blank"
            >
              Reference Core Web Vitals
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="mb-6 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-normal">
            Metriques a explorer
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Les Core Web Vitals forment le socle de l&apos;experience utilisateur
            mesuree sur le terrain. Lighthouse ajoute des metriques lab utiles
            pour diagnostiquer les causes avant de construire les pages
            slow/optimized.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {performanceMetrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </section>
    </main>
  );
}

function MetricCard({ metric }: { metric: PerformanceMetric }) {
  const hasSlowRoute = metric.experimentRoutes.slow;
  const hasOptimizedRoute = metric.experimentRoutes.optimized;
  const hasAnyExperimentRoute = hasSlowRoute || hasOptimizedRoute;
  const isCompleteExperiment = hasSlowRoute && hasOptimizedRoute;

  return (
    <article className="flex h-full flex-col gap-5 rounded-md border border-zinc-200 bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-teal-700">
            <abbr title={metric.fullName}>{metric.name}</abbr>
          </p>
          <h3 className="mt-1 text-xl font-semibold tracking-normal">
            {metric.fullName}
          </h3>
        </div>
        <span
          className={`w-fit rounded-md border px-3 py-1 text-xs font-semibold ${
            isCompleteExperiment
              ? "border-teal-200 bg-teal-50 text-teal-800"
              : hasAnyExperimentRoute
                ? "border-sky-200 bg-sky-50 text-sky-800"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          {isCompleteExperiment
            ? "Disponible"
            : hasAnyExperimentRoute
              ? "En cours"
              : "À venir"}{" "}
          · {metric.status}
        </span>
      </div>

      <p className="text-sm leading-6 text-zinc-700">{metric.description}</p>

      {metric.hasAnalysisGuide ? (
        <Link
          className="w-fit text-sm font-semibold text-teal-700 underline decoration-teal-300 underline-offset-4 transition-colors hover:text-teal-900"
          href={`/${metric.id}/analysis`}
        >
          Guide d’analyse {metric.name}
        </Link>
      ) : (
        <button
          className="w-fit cursor-not-allowed text-left text-sm font-semibold text-zinc-400"
          disabled
          type="button"
        >
          Guide d’analyse {metric.name}
        </button>
      )}

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-zinc-950">Poids</dt>
          <dd className="mt-1 leading-6 text-zinc-600">
            {metric.scoreWeight}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-zinc-950">SEO</dt>
          <dd className="mt-1 leading-6 text-zinc-600">{metric.seoImpact}</dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Outils: {metric.tools.join(" / ")}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            aria-disabled={!hasSlowRoute}
            className={`inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-3 text-sm font-semibold transition-colors ${
              hasSlowRoute
                ? "text-zinc-800 hover:bg-zinc-50"
                : "pointer-events-none text-zinc-400"
            }`}
            href={`/${metric.id}/slow`}
          >
            Version slow
          </Link>
          <Link
            aria-disabled={!hasOptimizedRoute}
            className={`inline-flex h-10 items-center justify-center rounded-md px-3 text-sm font-semibold transition-colors ${
              hasOptimizedRoute
                ? "bg-zinc-950 text-white hover:bg-zinc-800"
                : "pointer-events-none bg-zinc-200 text-zinc-400"
            }`}
            href={`/${metric.id}/optimized`}
          >
            Version optimized
          </Link>
        </div>
      </div>
    </article>
  );
}
