import { MenuElement } from "@/types/navigation.ts";

export const navigationMenu: MenuElement[] = [
  {
    id: 1,
    name: "Home Page",
    url: "/",
    component: "HomePage",
    menuPosition: "none",
  },
  {
    id: 2,
    name: "Periods Page",
    url: "/periods",
    component: "PeriodsPage",
    menuPosition: "left",
  },
  {
    id: 3,
    name: "Products Page",
    url: "/products",
    component: "ProductsPage",
    menuPosition: "left",
  },
] as const;
