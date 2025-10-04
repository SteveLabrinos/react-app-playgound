import { MenuElement } from "@/types/navigation.ts";

export const navigationMenu: MenuElement[] = [
  {
    id: 1,
    name: "Home Page",
    url: "/",
    component: "DashboardPage",
    menuPosition: "none",
  },
  {
    id: 2,
    name: "Periods Page",
    url: "/periods",
    menuPosition: "left",
  },
  {
    id: 3,
    name: "Products Page",
    url: "/products",
    menuPosition: "left",
  },
] as const;
