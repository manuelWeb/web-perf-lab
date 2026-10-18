export type SimulatedAccount = {
  civility: "Mme" | "M.";
  firstName: string;
  isConnected: boolean;
  lastLoginAt: string;
};

const ACCOUNT_STORAGE_KEY = "web-perf-lab:simulated-account:v2";
const ACCOUNT_CHANGE_EVENT = "web-perf-lab:account-change";

export function subscribeToAccountChanges(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(ACCOUNT_CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(ACCOUNT_CHANGE_EVENT, onChange);
  };
}

export function getAccountSnapshot() {
  return window.localStorage.getItem(ACCOUNT_STORAGE_KEY);
}

export function getServerAccountSnapshot() {
  return null;
}

export function parseSimulatedAccount(snapshot: string | null) {
  if (!snapshot) return null;

  try {
    const account: unknown = JSON.parse(snapshot);
    if (
      typeof account === "object" &&
      account !== null &&
      "civility" in account &&
      (account.civility === "Mme" || account.civility === "M.") &&
      "firstName" in account &&
      typeof account.firstName === "string" &&
      "isConnected" in account &&
      typeof account.isConnected === "boolean" &&
      "lastLoginAt" in account &&
      typeof account.lastLoginAt === "string"
    ) {
      return account as SimulatedAccount;
    }
  } catch {
    return null;
  }

  return null;
}

function saveAccount(account: SimulatedAccount) {
  window.localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(account));
  window.dispatchEvent(new Event(ACCOUNT_CHANGE_EVENT));
}

export function createSimulatedAccount(civility: SimulatedAccount["civility"], firstName: string) {
  saveAccount({
    civility,
    firstName: firstName.trim(),
    isConnected: true,
    lastLoginAt: new Date().toISOString(),
  });
}

export function setSimulatedAccountConnection(
  account: SimulatedAccount,
  isConnected: boolean,
) {
  saveAccount({
    ...account,
    isConnected,
    lastLoginAt: isConnected ? new Date().toISOString() : account.lastLoginAt,
  });
}
