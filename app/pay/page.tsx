"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Payload = { uuid: string; openUrl: string; qrUrl: string };

export default function PayPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const amount = sp.get("amount") || "";
  const memo = sp.get("memo") || "";
  const to = sp.get("to") || "";

  const [payload, setPayload] = useState<Payload | null>(null);
  const [status, setStatus] = useState<"idle" | "awaiting" | "signed" | "expired" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function init() {
      if (!amount || !to) return;
      try {
        const res = await fetch("/api/xumm/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ destination: to, amountXrp: Number(amount), memo }),
        });
        const data = await res.json();
        if (!res.ok || !data?.uuid) {
          setErr(data?.error || "Create payment failed");
          setStatus("error");
          return;
        }
        setPayload(data);
        setStatus("awaiting");
      } catch (e: any) {
        setErr(e?.message || "Network error");
        setStatus("error");
      }
    }
    init();
  }, [amount, memo, to]);

  useEffect(() => {
    if (!payload?.uuid || status !== "awaiting") return;
    async function tick() {
      try {
        const res = await fetch(`/api/xumm/payload/${payload.uuid}`);
        const data = await res.json();
        if (data?.expired) {
          setStatus("expired");
          if (pollRef.current) clearInterval(pollRef.current);
        } else if (data?.signed) {
          setStatus("signed");
          if (pollRef.current) clearInterval(pollRef.current);
          if (data?.txHash) router.push(`/success/${data.txHash}`);
        }
      } catch {}
    }
    pollRef.current = setInterval(tick, 3000);
    return () => pollRef.current && clearInterval(pollRef.current);
  }, [payload?.uuid, status, router]);

  if (!amount || !to) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="card text-center">
          <h1 className="text-2xl font-bold mb-2">Missing payment details</h1>
          <p className="muted">Provide <code>?amount=</code> and <code>?to=</code> in the URL.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center px-6">
      <div className="card text-center">
        <h1 className="text-2xl font-bold mb-2">Pay {amount} XRP</h1>
        {memo && <p className="muted mb-2">Memo: {memo}</p>}
        <p className="text-xs text-white/50 break-all mb-4">To: {to}</p>

        {!payload && <p className="muted">Preparing request…</p>}
        {err && <p className="text-red-400 mb-2 text-sm">{err}</p>}

        {payload && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={payload.qrUrl} alt="Xumm QR" className="mx-auto w-56 h-56 rounded bg-white" />
            <a href={payload.openUrl} className="btn-secondary mt-4">Open in Xumm</a>
            <div className="mt-4 text-sm">
              Status:{" "}
              {status === "awaiting" && <span className="text-yellow-400">Awaiting signature…</span>}
              {status === "signed" && <span className="text-green-400">Signed & submitted ✅</span>}
              {status === "expired" && <span className="text-red-400">Expired ❌</span>}
              {status === "error" && <span className="text-red-400">Error</span>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
