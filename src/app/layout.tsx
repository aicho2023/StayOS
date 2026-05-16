import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stay OS",
  description: "A stay-centric intelligence layer for luxury hospitality teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
