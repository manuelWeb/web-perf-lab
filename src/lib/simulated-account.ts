export type SimulatedAccount = {
  civility: "Mme" | "M.";
  firstName: string;
  isConnected: boolean;
  lastLoginAt: string;
};

export type PublicSimulatedAccount = Pick<
  SimulatedAccount,
  "civility" | "firstName" | "lastLoginAt"
>;

export function parseSimulatedAccount(value: string | undefined) {
  if (!value) return null;

  try {
    const account: unknown = JSON.parse(value);
    if (
      typeof account === "object" &&
      account !== null &&
      "civility" in account &&
      (account.civility === "Mme" || account.civility === "M.") &&
      "firstName" in account &&
      typeof account.firstName === "string" &&
      account.firstName.trim().length > 0 &&
      account.firstName.length <= 40 &&
      "isConnected" in account &&
      typeof account.isConnected === "boolean" &&
      "lastLoginAt" in account &&
      typeof account.lastLoginAt === "string" &&
      Number.isFinite(Date.parse(account.lastLoginAt))
    ) {
      return account as SimulatedAccount;
    }
  } catch {
    return null;
  }

  return null;
}
