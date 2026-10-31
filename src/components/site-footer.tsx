import { CookiePreferencesButton } from "@/components/consent-manager";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <p className="font-semibold text-zinc-700">Web Performance Lab</p>
        <nav aria-label="Liens et confidentialité">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <li>
              <CookiePreferencesButton />
            </li>
            <li>
              <button
                className="cursor-not-allowed font-medium text-zinc-400"
                disabled
                type="button"
              >
                Portfolio
              </button>
            </li>
            <li>
              <a
                className="font-medium text-zinc-700 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-teal-800"
                href="https://github.com/manuelWeb/web-perf-lab"
                rel="noreferrer"
                target="_blank"
              >
                Dépôt Git
              </a>
            </li>
            <li>
              <a
                className="font-medium text-zinc-700 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-teal-800"
                href="https://daily.dev/tags/webdev"
                rel="noreferrer"
                target="_blank"
              >
                Veille web
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
