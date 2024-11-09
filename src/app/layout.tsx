import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-700`}>
        <nav>
          <ul className={"flex gap-5"}>
            <li><a href={"/"}>home</a></li>
            <li><a href={"/syllabary-table"}>syllabary table</a></li>
            <li><a href={"/roman-to-japanese"}>roman to japanese</a></li>
            <li><a href={"/syllabary-traps"}>syllabary traps</a></li>
            <li><a href={"/syllabary-training"}>syllabary training</a></li>
            <li><a href={"/syllabary"}>-theme-</a></li>
            <li><a href={"/syllabary"}>-translate-</a></li>
            <li><a href={"/syllabary"}>-vocabulary-</a></li>
            <li><a href={"/syllabary"}>-dictionary-</a></li>
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
