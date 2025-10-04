import React from "react";

const ProductsPage = React.lazy(
  () => import("@/components/pages/products/products-page.tsx"),
);

export const pageComponents = { ProductsPage };
