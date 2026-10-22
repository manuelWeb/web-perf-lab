import type { Metadata } from "next";
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
  return (
    <html lang="fr" className="h-full antialiased">
      <body className={`flex min-h-screen flex-col ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
