import Link from "next/link";
import { MetricNavigation } from "@/components/metric-navigation";
import { MobileMetricMenu } from "@/components/mobile-metric-menu";
import { performanceMetrics } from "@/lib/performance-metrics";

const metricNavigationItems = performanceMetrics.map(
  ({ experimentRoutes, fullName, hasAnalysisGuide, id, name }) => ({
    fullName,
    hasAnalysisGuide,
    href: hasAnalysisGuide
      ? `/${id}/analysis`
      : experimentRoutes.slow
        ? `/${id}/slow`
        : undefined,
    id,
    name,
  }),
);

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
        <Link
          aria-label="Web Performance Lab, accueil"
          className="shrink-0 text-base font-bold text-zinc-950 sm:text-lg"
          href="/"
        >
          <span className="sm:hidden">Web Perf Lab</span>
          <span className="hidden sm:inline">Web Performance Lab</span>
        </Link>

        <nav
          aria-label="Navigation des métriques"
          className="hidden lg:block"
        >
          <MetricNavigation
            items={metricNavigationItems}
            orientation="horizontal"
          />
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            className="h-10 rounded-md border border-zinc-300 px-3 text-sm font-semibold text-zinc-400"
            disabled
            type="button"
          >
            Connexion
          </button>
          <MobileMetricMenu items={metricNavigationItems} />
        </div>
      </div>
    </header>
  );
}
