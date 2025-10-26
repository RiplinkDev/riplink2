import { NextResponse } from "next/server";
import { XummSdk } from "xumm-sdk";

const xumm = new XummSdk(
  process.env.NEXT_PUBLIC_XUMM_API_KEY!,
  process.env.XUMM_API_SECRET!
);

export async function GET(_: Request, { params }: { params: { uuid: string } }) {
  try {
    const res = await xumm.payload.get(params.uuid);
    if (res?.meta?.expired) return NextResponse.json({ signed: false, expired: true });
    if (res?.meta?.signed) {
      const txHash = (res as any).response?.txid || (res as any).response?.hash || null;
      return NextResponse.json({ signed: true, txHash });
    }
    return NextResponse.json({ signed: false });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "poll error" }, { status: 500 });
  }
}
