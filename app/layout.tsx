import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rébus Truffaut !",
  description: "Devinez les rébus de vos professeurs préférés !",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
    >
      <body className="">{children}</body>
    </html>
  );
}
