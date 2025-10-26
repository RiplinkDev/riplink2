import { NextRequest, NextResponse } from "next/server";
import xrpl from "xrpl";

export async function POST(req: NextRequest) {
  const { seed, payer, payee, amountXrp, tx_hash, memo, image, metadata_url } = await req.json();

  if (!seed) return NextResponse.json({ error: "Missing seed (TESTNET ONLY)" }, { status: 400 });

  const client = new xrpl.Client(process.env.NEXT_PUBLIC_XRPL_WSS!);
  await client.connect();
  const wallet = xrpl.Wallet.fromSeed(seed); // DEV/TESTNET ONLY

  const payload = { payer, payee, amountXrp, tx_hash, memo, image, metadata_url, timestamp: new Date().toISOString() };
  const URI = xrpl.convertStringToHex(JSON.stringify(payload));

  const tx: xrpl.NFTokenMint = { TransactionType: "NFTokenMint", Account: wallet.classicAddress, NFTokenTaxon: 0, Flags: 0, URI };
  const result = await client.submitAndWait(tx, { wallet });

  await client.disconnect();
  return NextResponse.json({ result });
}
