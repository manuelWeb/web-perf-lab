import type { SimulatedAccount } from "@/lib/simulated-account";

export function WelcomeBannerView({ account }: { account: SimulatedAccount }) {
  const salutation = account.civility === "Mme" ? "Madame" : "Monsieur";
  const formattedLastLogin = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }).format(new Date(account.lastLoginAt));
  const fullMessage = `Bonjour ${salutation} ${account.firstName}, ravi de vous revoir depuis votre dernière connexion du ${formattedLastLogin}.`;

  return (
    <aside className="flex min-h-24 items-center border-b border-[var(--color-sky-500)] bg-[var(--color-sky-400)] px-4 py-3 text-base text-zinc-950 sm:min-h-20 sm:px-8 lg:min-h-16">
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
