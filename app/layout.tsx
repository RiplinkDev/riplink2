import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Riplink ⚡",
  description: "Non-custodial XRP payment links with instant confirmation.",
  openGraph: { images: ["/og.jpg"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-white antialiased">{children}</body>
    </html>
  );
}
