import React, { useCallback } from "react";
import { Tab, tabList } from "@/api/nav";
import { router } from "next/client";

type DesktopNavProps = {
  pathname: string;
  hiddenTabList: boolean[];
  hiddenTabListChange: (hiddenTabList: boolean[]) => void;
  routeChange: (path: string) => void;
};

export function DesktopNav({
  pathname,
  hiddenTabList,
  hiddenTabListChange,
  routeChange,
}: DesktopNavProps) {
  const tabClick = useCallback(
    (
      event: React.MouseEvent<HTMLLIElement>,
      tab: Tab,
      index: number,
      isChild: boolean,
    ) => {
      event.stopPropagation();
      let hiddenTabArray = tabList.map(() => true);
      hiddenTabListChange(hiddenTabArray);
      if (isChild) {
        routeChange(tab.href);
      } else {
        if (tab.children.length === 0) {
          routeChange(tab.href);
        } else {
          hiddenTabArray[index] = false;
          hiddenTabListChange(hiddenTabArray);
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

  if (hiddenTabList.length === 0) {
    return <div>Loading...</div>;
  }

  return (
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
              className={`absolute top-20 w-full ${tab.children.length === 0 || (hiddenTabList[index] && "hidden")}`}
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
  );
}
