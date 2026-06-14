import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pin Ensina",
  description: "Plataforma de estudo divertida para a Gigi e amigos!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT">
      <body>{children}</body>
    </html>
  );
}
