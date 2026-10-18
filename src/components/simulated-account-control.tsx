"use client";

import { useRef, useSyncExternalStore } from "react";
import {
  createSimulatedAccount,
  getAccountSnapshot,
  getServerAccountSnapshot,
  parseSimulatedAccount,
  setSimulatedAccountConnection,
  subscribeToAccountChanges,
} from "@/lib/simulated-account";

export function SimulatedAccountControl() {
  const snapshot = useSyncExternalStore(
    subscribeToAccountChanges,
    getAccountSnapshot,
    getServerAccountSnapshot,
  );
  const account = parseSimulatedAccount(snapshot);
  const dialogRef = useRef<HTMLDialogElement>(null);

  function handleLogin() {
    if (account) {
      setSimulatedAccountConnection(account, true);
      return;
    }

    dialogRef.current?.showModal();
  }

  function handleFirstLogin(formData: FormData) {
    const civility = formData.get("civility");
    const firstName = formData.get("firstName");

    if (
      (civility === "Mme" || civility === "M.") &&
      typeof firstName === "string" &&
      firstName.trim()
    ) {
      createSimulatedAccount(civility, firstName);
      dialogRef.current?.close();
    }
  }

  return (
    <>
      <div className="flex h-10 w-32 shrink-0 items-center justify-end gap-2">
        {account?.isConnected ? (
          <>
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white"
            >
              {account.firstName.charAt(0).toLocaleUpperCase("fr")}
            </span>
            <button
              aria-label="Se déconnecter du compte simulé"
              className="h-10 rounded-md border border-zinc-300 px-2 text-xs font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              onClick={() => setSimulatedAccountConnection(account, false)}
              type="button"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <button
            className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            onClick={handleLogin}
            type="button"
          >
            Connexion
          </button>
        )}
      </div>

      <dialog
        aria-labelledby="simulated-login-title"
        className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-lg border border-zinc-200 bg-white p-6 text-zinc-950 shadow-xl backdrop:bg-zinc-950/30"
        ref={dialogRef}
      >
        <form action={handleFirstLogin} className="grid gap-4">
          <div className="grid gap-1">
            <h2 className="text-lg font-semibold" id="simulated-login-title">
              Connexion de démonstration
            </h2>
            <p className="text-sm text-zinc-600">
              Ces informations sont conservées dans ce navigateur.
            </p>
          </div>

          <label className="grid gap-1 text-sm font-medium" htmlFor="civility">
            Civilité
            <select
              className="h-10 rounded-md border border-zinc-300 bg-white px-3 font-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              defaultValue="Mme"
              id="civility"
              name="civility"
            >
              <option value="Mme">Madame</option>
              <option value="M.">Monsieur</option>
            </select>
          </label>

          <label className="grid gap-1 text-sm font-medium" htmlFor="firstName">
            Prénom
            <input
              autoComplete="given-name"
              className="h-10 rounded-md border border-zinc-300 px-3 font-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              id="firstName"
              maxLength={40}
              name="firstName"
              required
            />
          </label>

          <div className="flex justify-end gap-2 pt-1">
            <button
              className="h-10 rounded-md px-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              onClick={() => dialogRef.current?.close()}
              type="button"
            >
              Annuler
            </button>
            <button
              className="h-10 rounded-md bg-zinc-900 px-3 text-sm font-semibold text-white hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              type="submit"
            >
              Continuer
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
