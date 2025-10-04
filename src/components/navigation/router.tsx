import React, { Suspense } from "react";
import Loading from "@/components/layouts/loading.tsx";
import { Menu } from "@/types/navigation.ts";
import { pageComponents } from "@/components/pages";
import { navigationMenu } from "@/config/navigation-menu.ts";
import { createBrowserRouter, RouteObject } from "react-router";
import NotFound from "@/components/layouts/not-found.tsx";
import App from "@/app.tsx";

const createChildrenRoutes = (items: Menu): RouteObject[] => {
  return items
    .filter((item) => item.component || item.children)
    .map((item) => ({
      path: item.url,
      ...(item.component && {
        element: (
          <Suspense fallback={<Loading />}>
            {React.createElement(
              pageComponents[item.component as keyof typeof pageComponents],
            )}
          </Suspense>
        ),
      }),
      //loader: checkRouteAuthentication,
      children: item.children ? createChildrenRoutes(item.children) : [],
    }));
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: createChildrenRoutes(navigationMenu),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
