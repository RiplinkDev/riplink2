"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function CreatePage() {
  const [amount, setAmount] = useState("25");
  const [memo, setMemo] = useState("Invoice #001");
  const [dest, setDest] = useState("");
  const [link, setLink] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const url = `${base}/pay?amount=${encodeURIComponent(amount)}&memo=${encodeURIComponent(memo)}&to=${encodeURIComponent(dest)}`;
    setLink(url);
  }

  return (
    <div className="min-h-screen grid place-items-center px-6">
      <form onSubmit={handleSubmit} className="card space-y-4">
        <h1 className="text-2xl font-bold">Create XRP Payment Link</h1>
        <Input placeholder="Amount (XRP)" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Input placeholder="Memo (optional)" value={memo} onChange={(e) => setMemo(e.target.value)} />
        <Input placeholder="Destination XRP Address" value={dest} onChange={(e) => setDest(e.target.value)} />
        <Button type="submit">Generate Link</Button>

        {link && (
          <div className="mt-4 text-center">
            <p className="muted mb-1">Share this link:</p>
            <a className="text-brand.blue underline break-all" href={link}>{link}</a>
          </div>
        )}
      </form>
    </div>
  );
}
