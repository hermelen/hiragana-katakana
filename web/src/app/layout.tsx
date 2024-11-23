"use client";

import localFont from "next/font/local";
import "./globals.css";
import { useRouter, usePathname } from "next/navigation";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();
  const tabs: { key: string; href: string; label: string }[] = [
    {
      key: "syllabaryTable",
      href: "/syllabary-table",
      label: "Syllabary table",
    },
    {
      key: "syllabaryTraps",
      href: "/syllabary-traps",
      label: "Syllabary traps",
    },
    {
      key: "syllabaryTraining",
      href: "/syllabary-training",
      label: "Syllabary training",
    },
    {
      key: "vocabularyTranslate",
      href: "/vocabulary-translate",
      label: "Vocabulary translate",
    },
    {
      key: "vocabularyTheme",
      href: "/vocabulary-theme",
      label: "Vocabulary theme",
    },
    {
      key: "vocabularyDictionary",
      href: "/vocabulary-dictionary",
      label: "Dictionary",
    },
    {
      key: "romanToJapanese",
      href: "/roman-to-japanese",
      label: "Roman to japanese",
    },
    {
      key: "home",
      href: "/",
      label: "Home",
    },
  ];

  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-800 p-2`}
      >
        <nav>
          <ul className="flex flex-wrap gap-1 full-size justify-between">
            {tabs.map((tab: { key: string; href: string; label: string }) => (
              <li
                className={`flex-auto
            cursor-pointer
            text-2xl 
            text-center
            flex
            items-center
            justify-center
            h-20 
            pl-2 
            pr-2
            rounded-sm 
            shadow-lg
            bg-gradient-to-b 
             ${pathname === tab.href ? "from-yellow-500" : "from-indigo-500 hover:from-indigo-400"}`}
                key={tab.key}
                onClick={() => router.push(tab.href)}
              >
                {tab.label}
              </li>
            ))}
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
