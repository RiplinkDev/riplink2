export default function Home() {
  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-brand.blue/20 via-purple-700/10 to-black">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight">Riplink ⚡</h1>
        <p className="muted text-lg">XRP payments via Xumm — simple, instant, non-custodial.</p>
        <div className="flex gap-3 justify-center">
          <a className="btn" href="/create">Create Pay Link</a>
          <a className="btn-secondary" href="/dashboard">Dashboard</a>
        </div>
      </div>
    </div>
  );
}
