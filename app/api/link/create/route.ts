import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, amountXrp, memo, destAddress, destinationTag } = body;

  if (!userId || !amountXrp || !destAddress) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const amount_drops = Math.round(Number(amountXrp) * 1_000_000);
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  const { data, error } = await supabase
    .from("pay_links")
    .insert({
      user_id: userId,
      amount_drops,
      memo,
      dest_address: destAddress,
      destination_tag: destinationTag ?? null,
      status: "pending"
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id: data.id, url: `/pay/${data.id}` });
}
