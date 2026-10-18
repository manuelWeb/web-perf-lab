import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web Performance Lab",
  description: "A focused Next.js lab for web performance experiments.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="flex min-h-screen flex-col">
        {children}
      </body>
    </html>
  );
}
