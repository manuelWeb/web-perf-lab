"use client";

import { useEffect, useState } from "react";
import type { SimulatedAccount } from "@/lib/simulated-account";
import {
  fetchSimulatedAccount,
  SIMULATED_ACCOUNT_CHANGED_EVENT,
} from "@/lib/fetch-simulated-account";
import { WelcomeBannerView } from "@/components/welcome-banner-view";

export function ClsWelcomeBanner() {
  const [account, setAccount] = useState<SimulatedAccount | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAccount() {
      try {
        const parsed = await fetchSimulatedAccount(controller.signal);
        if (!controller.signal.aborted) {
          setAccount(parsed?.isConnected ? parsed : null);
        }
      } catch {
        if (!controller.signal.aborted) setAccount(null);
      }
    }

    void loadAccount();
    window.addEventListener(SIMULATED_ACCOUNT_CHANGED_EVENT, loadAccount);
    return () => {
      controller.abort();
      window.removeEventListener(SIMULATED_ACCOUNT_CHANGED_EVENT, loadAccount);
    };
  }, []);

  if (!account) return null;

  return <WelcomeBannerView account={account} />;
}
