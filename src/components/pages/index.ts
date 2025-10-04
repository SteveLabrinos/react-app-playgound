import React from "react";

const ProductsPage = React.lazy(
  () => import("@/components/pages/products/products-page.tsx"),
);
const PeriodsPage = React.lazy(
  () => import("@/components/pages/periods/periods-page.tsx"),
);
const HomePage = React.lazy(
  () => import("@/components/pages/home/home-page.tsx"),
);

export const pageComponents = { ProductsPage, PeriodsPage, HomePage };
