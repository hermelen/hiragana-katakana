"use client";

import localFont from "next/font/local";
import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { tabList } from "@/api/nav";
import { Nav } from "@/app/components/Nav";

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
  const [hiddenTabList, setHiddenTabList] = useState<boolean[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setHiddenTabList(tabList.map(() => true));
  }, []);

  if (hiddenTabList.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-800 p-2`}
      >
        <Nav
          pathname={pathname}
          hiddenTabList={hiddenTabList}
          routeChange={(path) => router.push(path)}
          hiddenTabListChange={(hiddenTabList) =>
            setHiddenTabList(hiddenTabList)
          }
        />
        <div className="max-h-dvh overflow-scroll pb-80">{children}</div>
      </body>
    </html>
  );
}
