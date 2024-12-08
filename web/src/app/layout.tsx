"use client";

import localFont from "next/font/local";
import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { Tab, tabList } from "@/api/nav";

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
  const [hiddenTab, setHiddenTab] = useState<boolean[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setHiddenTab(tabList.map(() => true));
  }, []);

  const tabClick = useCallback(
    (
      event: React.MouseEvent<HTMLLIElement>,
      tab: Tab,
      index: number,
      isChild: boolean,
    ) => {
      event.stopPropagation();
      let hiddenTabArray = tabList.map(() => true);
      setHiddenTab(hiddenTabArray);
      if (isChild) {
        router.push(tab.href);
      } else {
        if (tab.children.length === 0) {
          router.push(tab.href);
        } else {
          hiddenTabArray[index] = false;
          setHiddenTab(hiddenTabArray);
        }
      }
    },
    [router],
  );

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    } else {
      return pathname.startsWith(href);
    }
  }

  if (hiddenTab.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-800 p-2`}
      >
        <nav>
          <ul className="flex flex-wrap gap-1 full-size justify-between">
            {tabList.map((tab: Tab, index: number) => (
              <li
                className={`relative 
                    flex-auto
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
                     ${isActive(tab.href) ? "from-yellow-500" : "from-indigo-500 hover:from-indigo-400"}`}
                key={tab.key}
                onClick={(event) => tabClick(event, tab, index, false)}
              >
                {tab.label}
                <ul
                  className={`absolute top-20 w-full ${tab.children.length === 0 || (hiddenTab[index] && "hidden")}`}
                >
                  {tab.children.map((child) => (
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
                             ${child.href === pathname ? "from-yellow-500" : "from-indigo-500 hover:from-indigo-400"}`}
                      key={child.key}
                      onClick={(event) => tabClick(event, child, index, true)}
                    >
                      {child.label}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
