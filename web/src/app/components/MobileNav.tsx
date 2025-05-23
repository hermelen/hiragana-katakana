import React, { useCallback, useState } from "react";
import { Tab, tabList } from "@/api/nav";
import { router } from "next/client";
import { DesktopNav } from "@/app/components/DesktopNav";

type MobileNavProps = {
  pathname: string;
  hiddenTabList: boolean[];
  hiddenTabListChange: (hiddenTabList: boolean[]) => void;
  routeChange: (path: string) => void;
};

export function MobileNav({
  pathname,
  hiddenTabList,
  hiddenTabListChange,
  routeChange,
}: MobileNavProps) {
  const [isMainExpanded, setIsMainExpanded] = useState<boolean>(false);
  const tabClick = useCallback(
    (
      event:
        | React.MouseEvent<HTMLLIElement>
        | React.MouseEvent<HTMLSpanElement>,
      tab: Tab,
      index: number,
      isChild: boolean,
    ) => {
      event.stopPropagation();
      setIsMainExpanded(false);
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

  const subMenuClose = useCallback(
    (event: React.MouseEvent<HTMLSpanElement>) => {
      event.stopPropagation();
      setIsMainExpanded(true);
      hiddenTabListChange(tabList.map(() => true));
    },
    [hiddenTabListChange],
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
    <nav className="relative h-20 w-full z-10">
      <div
        className="absolute h-20 w-full bg-linear-to-b from-indigo-400 flex items-center justify-between p-3"
        onClick={() => setIsMainExpanded(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-14"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
          />
        </svg>
        <span className="flex-1 text-3xl flex justify-center">
          Hiragana-Katakana
        </span>
      </div>
      <ul
        className={`absolute w-full bg-stone-800 ${!isMainExpanded && "-left-full pr-2"}`}
      >
        {tabList.map((tab: Tab, index: number) => (
          <li
            className={`
              flex-auto
              cursor-pointer
              text-2xl 
              flex
              text-center
              items-center
              h-20 
              pl-2 
              pr-2
              rounded-xs 
              shadow-lg
              bg-linear-to-b 
              to-stone-800
              ${isActive(tab.href) ? "from-yellow-500" : "from-indigo-500 hover:from-indigo-400"}
            `}
            key={tab.key}
          >
            <span
              className={`${index !== 0 ? "hidden" : "p-7 -ml-2"}`}
              onClick={() => setIsMainExpanded(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </span>
            <span
              className={`
                flex-1 
                ${index === 0 && tab.children.length !== 0 && "pt-6 pb-6"}
                ${index === 0 && tab.children.length === 0 && "pt-6 pb-6 pr-16"}
                ${index !== 0 && tab.children.length === 0 && "p-6"}
                ${index !== 0 && tab.children.length !== 0 && "pt-6 pb-6 pl-16"}
              `}
              onClick={(event) => tabClick(event, tab, index, false)}
            >
              {tab.label}
            </span>
            <span
              className={`${tab.children.length === 0 ? "hidden" : "p-7 -mr-2"}`}
              onClick={(event) => tabClick(event, tab, index, false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </span>
            <ul
              className={`absolute w-full bg-stone-800 top-0 ${tab.children.length === 0 || hiddenTabList[index] ? "-left-full pr-2" : "left-full"}`}
            >
              {tab.children.map((child, childIndex) => (
                <li
                  className={`
                    flex-auto
                    cursor-pointer
                    text-2xl 
                    text-center
                    flex
                    items-center
                    h-20 
                    pl-2 
                    pr-2
                    rounded-xs 
                    shadow-lg
                    bg-linear-to-b 
                    ${childIndex === 0 ? "justify-between" : "justify-end"}
                    ${child.href === pathname ? "from-yellow-500" : "from-indigo-500 hover:from-indigo-400"}
                    to-stone-800
                  `}
                  key={child.key}
                >
                  <span
                    className={`${childIndex !== 0 ? "hidden" : "p-7 -ml-2"}`}
                    onClick={(event) => subMenuClose(event)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5 8.25 12l7.5-7.5"
                      />
                    </svg>
                  </span>
                  <span
                    className={`flex-1 ${childIndex === 0 ? "pt-6 pr-16 pb-6 -ml-2 -mr-2" : "p-6"}`}
                    onClick={(event) => tabClick(event, child, index, true)}
                  >
                    {child.label}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
