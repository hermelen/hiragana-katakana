"use client";

import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { tabList } from "@/api/nav";
import { MobileNav } from "@/app/components/MobileNav";
import { DesktopNav } from "@/app/components/DesktopNav";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [hiddenTabList, setHiddenTabList] = useState<boolean[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setHiddenTabList(tabList.map(() => true));

    const fetchDeviceType = async () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /android.+mobile|ip(hone|[oa]d)/i.test(userAgent);
      console.log(isMobileDevice);
      setIsMobile(isMobileDevice);
    };

    fetchDeviceType();
  }, []);

  return (
    <html lang="fr">
      <body className="bg-stone-800 p-2">
        {isMobile ? (
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
        <div className="max-h-dvh overflow-scroll pb-80">{children}</div>
      </body>
    </html>
  );
}
