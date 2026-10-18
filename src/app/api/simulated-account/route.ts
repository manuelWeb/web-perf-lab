import { readSimulatedAccountCookie } from "@/lib/simulated-account-cookie";

export async function GET() {
  const account = await readSimulatedAccountCookie();

  if (!account?.isConnected) {
    return new Response(null, {
      headers: { "Cache-Control": "private, no-store" },
      status: 204,
    });
  }

  return Response.json(account, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
