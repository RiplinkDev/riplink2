export default function Success({ params }: { params: { hash: string } }) {
  const tx = params.hash;
  return (
    <div className="min-h-screen grid place-items-center px-6">
      <div className="card text-center">
        <h1 className="text-3xl font-bold">Payment Confirmed 🎉</h1>
        <p className="muted mt-2">TX: {tx.slice(0, 12)}…{tx.slice(-12)}</p>
        <div className="mt-6 flex gap-3 justify-center">
          <a className="btn-secondary" href={`https://testnet.xrpl.org/transactions/${tx}`} target="_blank">View on XRPL</a>
          {/* <button className="btn">Mint NFT Receipt</button> */}
        </div>
      </div>
    </div>
  );
}
