import xrpl from "xrpl";

export async function findMatchingPayment(
  wss: string,
  dest: string,
  minLedger?: number,
  amountDrops?: number,
  memo?: string
) {
  const client = new xrpl.Client(wss);
  await client.connect();
  const accountTx = await client.request({
    command: "account_tx",
    account: dest,
    ledger_index_min: minLedger ?? -1,
    ledger_index_max: -1,
    limit: 100
  });

  const txs = (accountTx.result.transactions || [])
    .map((t: any) => t.tx)
    .filter((tx: any) => tx.TransactionType === "Payment" && tx.Destination === dest);

  const match = txs.find((tx: any) => {
    const amt = typeof tx.Amount === "string" ? Number(tx.Amount) : 0;
    const memos = (tx.Memos || []).map((m: any) => Buffer.from(m.Memo.MemoData || "", "hex").toString("utf8"));
    const memoMatch = memo ? memos.some((m: string) => m.includes(memo)) : true;
    return (!amountDrops || amt === amountDrops) && memoMatch;
  });

  await client.disconnect();
  return match;
}
