import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATIMAR Dev Dashboard",
  description: "Dashboard interna per super admin ATIMAR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
