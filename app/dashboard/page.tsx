import { supabaseServer } from "@/lib/supabase";
import { xrpFromDrops } from "@/lib/util";

export default async function Dashboard() {
  const sb = supabaseServer();
  const { data: links } = await sb.from("pay_links").select("*").order("created_at", { ascending: false }).limit(50);

  return (
    <div className="min-h-screen py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid gap-4">
          {(links ?? []).map((l) => (
            <div key={l.id} className="card !max-w-none">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{xrpFromDrops(l.amount_drops)} XRP</div>
                  <div className="muted text-sm">{l.memo || "Payment"}</div>
                </div>
                <div className="text-sm">
                  <span className="px-2 py-1 rounded bg-gray-800 border border-gray-700">{l.status}</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-white/50 break-all">To: {l.dest_address}</div>
            </div>
          ))}
          {(!links || links.length === 0) && <div className="card">No links yet.</div>}
        </div>
      </div>
    </div>
  );
}
