import { NextRequest, NextResponse } from "next/server";
import { XummSdk } from "xumm-sdk";

const xumm = new XummSdk(
  process.env.NEXT_PUBLIC_XUMM_API_KEY!,
  process.env.XUMM_API_SECRET!
);

function strToHex(s: string) {
  return Buffer.from(s, "utf8").toString("hex").toUpperCase();
}

export async function POST(req: NextRequest) {
  try {
    const { destination, amountXrp, memo } = await req.json();
    if (!destination || !amountXrp) {
      return NextResponse.json({ error: "destination & amountXrp required" }, { status: 400 });
    }
    const drops = Math.round(Number(amountXrp) * 1_000_000);
    const txjson: any = { TransactionType: "Payment", Destination: destination, Amount: String(drops) };

    if (memo?.trim()) {
      txjson.Memos = [{ Memo: { MemoType: strToHex("riplink-memo"), MemoData: strToHex(memo.trim()) } }];
    }

    const { uuid, next } = await xumm.payload.create({
      txjson,
      options: { submit: true, expire: 180 },
      custom_meta: { instruction: "Approve to send XRP on XRPL testnet" }
    });

    return NextResponse.json({ uuid, openUrl: next.always, qrUrl: `https://xumm.app/sign/${uuid}.png` });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "xumm error" }, { status: 500 });
  }
}
