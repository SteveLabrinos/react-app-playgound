import NavigationMenu from "@/components/navigation/navigation-menu.tsx";
import { Outlet } from "react-router";

function App() {
  return (
    <div className="flex flex-col h-screen w-screen gap-0 overflow-hidden">
      <div className="sticky top-0">
        <NavigationMenu />
      </div>
      foo
      <div className="flex w-full h-full">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
