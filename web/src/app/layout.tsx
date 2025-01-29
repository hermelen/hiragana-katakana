"use client";

import localFont from "next/font/local";
import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { tabList } from "@/api/nav";
import { userAgent } from "next/dist/server/web/spec-extension/user-agent";
import { headers } from "next/dist/server/request/headers";
import { MobileNav } from "@/app/components/MobileNav";
import { DesktopNav } from "@/app/components/DesktopNav";

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
  const [deviceType, setDeviceType] = useState<"mobile" | "desktop">("desktop");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setHiddenTabList(tabList.map(() => true));

    const fetchDeviceType = async () => {
      const headersList = await headers();
      const { device } = userAgent({ headers: headersList });
      const deviceType = device?.type === "mobile" ? "mobile" : "desktop";
      setDeviceType(deviceType);
    };

    fetchDeviceType();
  }, []);

  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-800 p-2`}
      >
        {deviceType === "mobile" ? (
          <MobileNav
            pathname={pathname}
            hiddenTabList={hiddenTabList}
            routeChange={(path) => router.push(path)}
            hiddenTabListChange={(hiddenTabList) =>
              setHiddenTabList(hiddenTabList)
            }
          />
        ) : (
          <DesktopNav
            pathname={pathname}
            hiddenTabList={hiddenTabList}
            routeChange={(path) => router.push(path)}
            hiddenTabListChange={(hiddenTabList) =>
              setHiddenTabList(hiddenTabList)
            }
          />
        )}
        ;<div className="max-h-dvh overflow-scroll pb-80">{children}</div>
      </body>
    </html>
  );
}
