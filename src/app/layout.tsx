import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Web Performance Lab",
  description: "A focused Next.js lab for web performance experiments.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="fr" className="h-full antialiased">
      <body className={`flex min-h-screen flex-col ${inter.variable}`}>
        {children}
        {/* Le layout racine partage une seule instance GTM entre les routes. */}
        {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      </body>
    </html>
  );
}
