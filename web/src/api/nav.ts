export interface Tab {
  key: string;
  href: string;
  label: string;
  children: Tab[] | [];
}

export const tabList: Tab[] = [
  {
    key: "home",
    href: "/",
    label: "Home",
    children: [],
  },
  {
    key: "syllabaryTable",
    href: "/syllabary-table",
    label: "Syllabary table",
    children: [],
  },
  {
    key: "syllabaryTraps",
    href: "/syllabary-traps",
    label: "Syllabary traps",
    children: [],
  },
  {
    key: "syllabaryTraining",
    href: "/syllabary-training",
    label: "Syllabary training",
    children: [],
  },
  {
    key: "translateTraining",
    href: "/translate-training",
    label: "Translate training",
    children: [],
  },
  {
    key: "themeTraining",
    href: "/theme-training",
    label: "Theme training",
    children: [],
  },
  {
    key: "dictionary",
    href: "/dictionary",
    label: "Dictionary",
    children: [],
  },
  {
    key: "romanToJapanese",
    href: "/roman-to-japanese",
    label: "Roman to japanese",
    children: [],
  },
  {
    key: "user",
    href: "/user",
    label: "User",
    children: [
      {
        key: "userList",
        href: "/user/list",
        label: "List",
        children: [],
      },
      {
        key: "userLogin",
        href: "/user/login",
        label: "Login",
        children: [],
      },
      {
        key: "userProfile",
        href: "/user/profile",
        label: "Profile",
        children: [],
      },
    ],
  },
];
