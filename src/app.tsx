import NavigationMenu from "@/components/navigation/navigation-menu.tsx";
import { Outlet } from "react-router";
import { useAutoSignin } from "react-oidc-context";
import { useTokenRenewal } from "@/hooks/use-token-renewal.ts";

function App() {
  useTokenRenewal();

  useAutoSignin({ signinMethod: "signinRedirect" });

  return (
    <div className="flex flex-col h-screen w-screen gap-0 overflow-hidden">
      <div className="sticky top-0 z-50">
        <NavigationMenu />
      </div>
      <div className="flex w-full h-full overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
