import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { findMatchingPayment } from "@/lib/xrpl";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data: link } = await supabase.from("pay_links").select("*").eq("id", params.id).single();
  if (!link) return NextResponse.json({ status: "not_found" }, { status: 404 });

  if (link.status === "paid") return NextResponse.json({ status: "paid" });

  const tx = await findMatchingPayment(
    process.env.NEXT_PUBLIC_XRPL_WSS!,
    link.dest_address,
    undefined,
    link.amount_drops,
    link.memo || undefined
  );

  if (tx?.hash) {
    await supabase.from("pay_links").update({ status: "paid" }).eq("id", params.id);
    await supabase.from("payments").insert({
      pay_link_id: params.id,
      tx_hash: tx.hash,
      payer_address: tx.Account,
      amount_drops: Number(tx.Amount),
      confirmed_at: new Date().toISOString()
    });
    return NextResponse.json({ status: "paid", hash: tx.hash });
  }

  return NextResponse.json({ status: "pending" });
}
