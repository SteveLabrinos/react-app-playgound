import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { store } from "@/store";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import { router } from "@/components/navigation/router.tsx";
import { AuthProvider } from "react-oidc-context";
import { oidc } from "@/config/oidc.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider {...oidc}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </AuthProvider>
  </StrictMode>,
);
