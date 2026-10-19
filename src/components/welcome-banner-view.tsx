import type { SimulatedAccount } from "@/lib/simulated-account";

export function WelcomeBannerView({
  account,
}: {
  account: SimulatedAccount | null;
}) {
  if (!account) {
    return (
      <aside className="flex min-h-24 items-center bg-sky-400 px-4 py-3 text-base text-zinc-950 sm:min-h-20 sm:px-8 lg:min-h-16">
        <p className="mx-auto w-full max-w-7xl text-center leading-6">
          Simulation d'une bannière de bienvenue ou d'un message publicitaire.
          Il nous faut deux lignes afin de simuler un décalage suffisamment
          important afin de dégrader le score CLS.
        </p>
      </aside>
    );
  }

  const salutation = account.civility === "Mme" ? "Madame" : "Monsieur";
  const formattedLastLogin = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }).format(new Date(account.lastLoginAt));
  const fullMessage = `Bonjour ${salutation} ${account.firstName}, ravi de vous revoir depuis votre dernière connexion du ${formattedLastLogin}.`;

  return (
    <aside className="flex min-h-24 items-center bg-sky-400 px-4 py-3 text-base text-zinc-950 sm:min-h-20 sm:px-8 lg:min-h-16">
      <p
        aria-label={fullMessage}
        className="mx-auto w-full max-w-7xl text-center leading-6"
        title={fullMessage}
      >
        Bonjour {salutation} {account.firstName}, ravi de vous revoir depuis
        votre dernière connexion du{" "}
        <time dateTime={account.lastLoginAt}>{formattedLastLogin}</time>.
      </p>
    </aside>
  );
}
