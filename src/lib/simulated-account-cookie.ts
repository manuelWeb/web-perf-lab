import "server-only";

import { cookies } from "next/headers";
import { parseSimulatedAccount, type SimulatedAccount } from "@/lib/simulated-account";

export const SIMULATED_ACCOUNT_COOKIE = "web-perf-lab-simulated-account";

export async function readSimulatedAccountCookie() {
  const cookieStore = await cookies();
  return parseSimulatedAccount(
    cookieStore.get(SIMULATED_ACCOUNT_COOKIE)?.value,
  );
}

export async function writeSimulatedAccountCookie(account: SimulatedAccount) {
  const cookieStore = await cookies();
  cookieStore.set(SIMULATED_ACCOUNT_COOKIE, JSON.stringify(account), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
