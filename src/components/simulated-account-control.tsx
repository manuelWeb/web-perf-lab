"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createSimulatedAccount,
  disconnectSimulatedAccount,
  reconnectSimulatedAccount,
} from "@/app/actions/simulated-account";
import type { SimulatedAccount } from "@/lib/simulated-account";
import {
  fetchSimulatedAccount,
  SIMULATED_ACCOUNT_CHANGED_EVENT,
} from "@/lib/fetch-simulated-account";

export function SimulatedAccountControl() {
  const [account, setAccount] = useState<SimulatedAccount | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  async function refreshAccount() {
    setAccount(await fetchSimulatedAccount());
    window.dispatchEvent(new Event(SIMULATED_ACCOUNT_CHANGED_EVENT));
    router.refresh();
  }

  useEffect(() => {
    const controller = new AbortController();
    void fetchSimulatedAccount(controller.signal).then(setAccount).catch(() => {});
    return () => controller.abort();
  }, []);

  async function handleFirstLogin(formData: FormData) {
    if (await createSimulatedAccount(formData)) {
      dialogRef.current?.close();
      await refreshAccount();
    }
  }

  async function handleReconnect() {
    await reconnectSimulatedAccount();
    await refreshAccount();
  }

  async function handleDisconnect() {
    await disconnectSimulatedAccount();
    await refreshAccount();
  }

  if (account?.isConnected) {
    return (
      <div className="flex h-10 w-32 shrink-0 items-center justify-end gap-1">
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white"
        >
          {account.firstName.charAt(0).toLocaleUpperCase("fr")}
        </span>
        <form action={handleDisconnect}>
          <button
            aria-label="Se déconnecter du compte simulé"
            className="h-10 rounded-md border border-zinc-300 px-1.5 text-[10px] font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            type="submit"
          >
            Déconnexion
          </button>
        </form>
      </div>
    );
  }

  if (account) {
    return (
      <form action={handleReconnect}>
        <button
          className="h-10 w-32 rounded-md border border-zinc-300 px-3 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          type="submit"
        >
          Connexion
        </button>
      </form>
    );
  }

  return (
    <>
      <button
        className="h-10 w-32 rounded-md border border-zinc-300 px-3 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        onClick={() => dialogRef.current?.showModal()}
        type="button"
      >
        Connexion
      </button>

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
              Ces informations sont conservées dans un cookie de démonstration.
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
