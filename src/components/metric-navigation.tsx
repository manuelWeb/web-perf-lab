import Link from "next/link";
import type { PerformanceMetric } from "@/lib/performance-metrics";

export type MetricNavigationItem = Pick<
  PerformanceMetric,
  "fullName" | "hasAnalysisGuide" | "id" | "name"
> & {
  href?: string;
};

type MetricNavigationProps = {
  items: readonly MetricNavigationItem[];
  onNavigate?: () => void;
  orientation: "horizontal" | "vertical";
};

export function MetricNavigation({
  items,
  onNavigate,
  orientation,
}: MetricNavigationProps) {
  const listClassName =
    orientation === "horizontal"
      ? "flex items-center gap-3 xl:gap-4"
      : "grid gap-1";
  const itemClassName =
    orientation === "horizontal"
      ? "rounded-sm px-1 py-2 text-sm font-semibold"
      : "w-full rounded-sm px-3 py-3 text-left text-base font-semibold";

  return (
    <ul className={listClassName}>
      {items.map((item) => (
        <li key={item.id}>
          {item.href ? (
            <Link
              className={`${itemClassName} text-zinc-700 transition-colors hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700`}
              href={item.href}
              onClick={onNavigate}
            >
              <abbr className="no-underline" title={item.fullName}>
                {item.name}
              </abbr>
            </Link>
          ) : (
            <button
              className={`${itemClassName} cursor-not-allowed text-zinc-400`}
              disabled
              type="button"
            >
              <abbr className="no-underline" title={item.fullName}>
                {item.name}
              </abbr>
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
