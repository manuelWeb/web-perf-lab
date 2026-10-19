import type { Metadata } from "next";
import Link from "next/link";
import { ClsWelcomeBanner } from "@/components/cls-welcome-banner";
import { SiteFrame } from "@/components/site-frame";

export const metadata: Metadata = {
  title: "CLS lent | Web Performance Lab",
  description:
    "Observation d’un bandeau de bienvenue injecté après le rendu initial et de son décalage de mise en page.",
};

export default function ClsSlowPage() {
  return (
    <SiteFrame announcement={<ClsWelcomeBanner />}>
      <main className="flex-1 bg-stone-50 text-zinc-950">
        <section className="flex flex-col lg:flex-row gap-4 items-center px-6 py-10 border-b border-zinc-200 bg-white">
          <div className="flex-1 mx-auto flex w-full max-w-6xl flex-col">
            <Link
              className="w-fit text-sm font-semibold text-teal-700 transition-colors hover:text-teal-900"
              href="/cls/analysis"
            >
              Guide d’analyse du CLS
            </Link>
            <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-rose-700">
              Expérience CLS · version lente
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold sm:text-5xl">
              Un bandeau qui déplace la page
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-700">
              Après le rendu initial, le navigateur récupère le profil depuis
              une API protégée par cookie. Le bandeau de bienvenue apparaît
              alors au-dessus du header et pousse le contenu vers le bas : c’est
              un décalage de mise en page évitable.
            </p>
            <h2 className="mt-6 text-lg font-semibold">
              Pourquoi le CLS augmente
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-700">
              Le cookie est HttpOnly : le navigateur ne le rend pas accessible
              au JavaScript de la page. Après l’hydratation, le composant client
              appelle donc l’API, qui lit le cookie côté serveur. Si le compte
              est connecté, le composant insère alors le bandeau avant le
              header. Cette insertion modifie la position du header et du
              contenu déjà affichés ; c’est ce déplacement visible, et non le
              seul temps de réponse de l’API, qui crée le layout shift.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-600">
              Pour observer le scénario, connecte-toi une fois avec le bouton du
              header, puis recharge directement cette page. La connexion de
              démonstration doit être active dans ce navigateur.
            </p>
            <Link
              className="mt-4 w-fit text-sm font-semibold text-teal-700 underline decoration-teal-300 underline-offset-4 transition-colors hover:text-teal-900"
              href="/cls/optimized"
            >
              Comparer avec la version optimisée
            </Link>
          </div>
          <div className="flex-1">
            <video
              width="1300"
              height="1082"
              controls
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src="/videos/CLS-from-perf-tab.mp4" type="video/mp4" />
              Votre navigateur ne supporte pas la balise vidéo.
            </video>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
          <h2 className="text-2xl font-semibold">Contenu de la page</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700">
            Le bandeau tardif décale aussi cette section. Dans DevTools, observe
            la piste <span className="font-semibold">Layout Shifts</span> au
            chargement, puis compare le score et les nœuds déplacés. Sans
            session connectée, aucun bandeau n’est ajouté et l’expérience ne
            produit pas ce décalage.
          </p>
        </section>
      </main>
    </SiteFrame>
  );
}
