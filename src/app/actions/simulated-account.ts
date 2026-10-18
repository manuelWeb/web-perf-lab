"use server";

import {
  readSimulatedAccountCookie,
  writeSimulatedAccountCookie,
} from "@/lib/simulated-account-cookie";
import type { SimulatedAccount } from "@/lib/simulated-account";

export async function createSimulatedAccount(formData: FormData) {
  const civility = formData.get("civility");
  const firstName = formData.get("firstName");

  if (
    (civility !== "Mme" && civility !== "M.") ||
    typeof firstName !== "string" ||
    firstName.trim().length === 0 ||
    firstName.trim().length > 40
  ) {
    return false;
  }

  const account: SimulatedAccount = {
    civility,
    firstName: firstName.trim(),
    isConnected: true,
    lastLoginAt: new Date().toISOString(),
  };

  await writeSimulatedAccountCookie(account);
  return true;
}

export async function reconnectSimulatedAccount() {
  const account = await readSimulatedAccountCookie();
  if (!account) return;

  await writeSimulatedAccountCookie({
    ...account,
    isConnected: true,
    lastLoginAt: new Date().toISOString(),
  });
}

export async function disconnectSimulatedAccount() {
  const account = await readSimulatedAccountCookie();
  if (!account) return;

  await writeSimulatedAccountCookie({ ...account, isConnected: false });
}

