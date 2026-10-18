import { parseSimulatedAccount } from "@/lib/simulated-account";

export const SIMULATED_ACCOUNT_CHANGED_EVENT = "simulated-account-changed";

export async function fetchSimulatedAccount(signal?: AbortSignal) {
  const response = await fetch("/api/simulated-account", {
    cache: "no-store",
    signal,
  });
  if (!response.ok || response.status === 204) return null;

  const payload: unknown = await response.json();
  return parseSimulatedAccount(JSON.stringify(payload));
}
