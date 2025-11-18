import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Seminar Slide Generator",
  description: "講演テーマからスライド構成案を自動生成",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
