import type { Metadata } from "next";
import Link from "next/link";
import { SiteFrame } from "@/components/site-frame";
import { WelcomeBannerView } from "@/components/welcome-banner-view";
import { readSimulatedAccountCookie } from "@/lib/simulated-account-cookie";
import Image from "next/image";

export const metadata: Metadata = {
  title: "CLS optimisé | Web Performance Lab",
  description:
    "Comparaison d’un bandeau de bienvenue rendu avec le profil avant l’envoi du HTML.",
};

export default async function ClsOptimizedPage() {
  const account = await readSimulatedAccountCookie();

  return (
    <SiteFrame
      announcement={
        <WelcomeBannerView account={account?.isConnected ? account : null} />
      }
    >
      <main className="flex-1 bg-stone-50 text-zinc-950">
        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-6 py-10 sm:px-8 lg:grid-cols-2 lg:px-10">
            <div className="flex flex-col">
            <Link
              className="w-fit text-sm font-semibold text-teal-700 transition-colors hover:text-teal-900"
              href="/cls/analysis"
            >
              Guide d’analyse du CLS
            </Link>
            <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-green-700">
              Expérience CLS · version optimisée
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold sm:text-5xl">
              Un bandeau sans déplacement
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-700">
              Le serveur lit le cookie et inclut la phrase complète dans le HTML
              initial. Le navigateur reçoit donc le bandeau à sa position
              finale, sans insertion tardive ni espace artificiellement réservé.
            </p>
            <h2 className="mt-6 text-lg font-semibold">
              Pourquoi le CLS reste faible
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-700">
              Avant d’envoyer la page, le serveur lit le cookie HttpOnly et
              connaît l’état du compte. Si la session est active, il rend le
              bandeau complet avant le header dans le HTML initial. Le
              navigateur calcule ainsi la mise en page avec les deux éléments
              dès le premier affichage : aucun bandeau tardif ne pousse le
              contenu et aucun espace fixe à maintenir n’est nécessaire. La
              lecture du cookie rend cette route dynamique côté serveur, mais ne
              change pas le rendu statique des autres pages.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-600">
              Connecte-toi avec le bouton du header. Après cette action, le
              serveur relit le cookie et actualise le bandeau ; compare son
              rendu avec la version slow, qui récupère le même cookie après
              l’hydratation.
            </p>
            <Link
              className="mt-4 w-fit text-sm font-semibold text-teal-700 underline decoration-teal-300 underline-offset-4 transition-colors hover:text-teal-900"
              href="/cls/slow"
            >
              Comparer avec la version slow
            </Link>
            </div>

            <Image
              alt="CLS optimized example"
              className="h-auto w-full"
              height={1394}
              sizes="(min-width: 1024px) 520px, (min-width: 640px) calc(100vw - 64px), calc(100vw - 48px)"
              src="/images/cls/CLS-optimized-banner.png"
              width={1216}
            />
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
          <h2 className="text-2xl font-semibold">Contenu de la page</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700">
            Dans DevTools, compare la piste{" "}
            <span className="font-semibold">Layout Shifts</span> au chargement
            des deux pages. Ici, la mise à jour du texte ne doit pas déplacer
            cette section.
          </p>
        </section>
      </main>
    </SiteFrame>
  );
}
