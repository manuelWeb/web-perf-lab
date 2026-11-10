import type { Metadata } from "next";

export const metadata: Metadata = { title: "Confidentialité — Web Performance Lab" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-6 py-12 text-zinc-800">
      <h1 className="text-3xl font-bold">Confidentialité et cookies</h1>
      <p>
        Web Performance Lab est un site de démonstration des performances web.
        Vous pouvez le consulter sans accepter la mesure d’audience.
      </p>
      <h2 className="text-xl font-semibold">Cookies nécessaires</h2>
      <p>
        Le cookie wpl_consent conserve votre acceptation ou votre refus pendant
        182 jours. Si vous activez le compte simulé, un cookie fonctionnel mémorise
        les informations de cette démonstration.
      </p>
      <h2 className="text-xl font-semibold">Mesure d’audience facultative</h2>
      <p>
        Avec votre consentement, Google Analytics, fourni par Google et chargé
        via Google Tag Manager, reçoit des informations sur les pages consultées,
        les interactions et le navigateur. Les cookies _ga et _ga_* permettent
        de distinguer les visiteurs et les sessions. Aucun chargement de ces
        services n’a lieu avant votre acceptation.
      </p>
      <p>
        Consultez les{' '}
        <a className="underline" href="https://policies.google.com/privacy?hl=fr">
          règles de confidentialité de Google
        </a>{' '}
        pour en savoir plus sur ce fournisseur.
      </p>
      <p>
        Avec le même accord, Datadog RUM mesure les performances des pages,
        notamment les temps d’affichage, les interactions et le chargement des
        ressources. Le cookie _dd_s_v2 associe ces mesures à une session. La
        collecte est envoyée à l’instance européenne de Datadog. En production,
        Session Replay reconstitue la navigation d’un échantillon de sessions
        pour aider à diagnostiquer les problèmes rencontrés. Le texte, les images
        et les saisies sont masqués.
      </p>
      <h2 className="text-xl font-semibold">Modifier ou retirer votre accord</h2>
      <p>
        Le bouton « Gérer mes cookies » du pied de page ouvre vos préférences.
        Le retrait efface les cookies Google Analytics accessibles sur le domaine et
        arrête la collecte Datadog. La page se recharge pour arrêter les scripts
        Google déjà exécutés. Les données déjà transmises restent chez les
        fournisseurs.
      </p>
    </main>
  );
}
