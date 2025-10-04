import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@radix-ui/react-menubar";
import { Menu } from "@/types/navigation.ts";
import { Link } from "react-router";
import { navigationMenu } from "@/config/navigation-menu.ts";
import { ChevronDown } from "lucide-react";

export default function NavigationMenu() {
  const buildNavMenuItems = (items: Menu) =>
    items.map((item) =>
      item.children ? (
        <MenubarSub key={item.id}>
          <MenubarSubTrigger>{item.name}</MenubarSubTrigger>
          <MenubarSubContent>
            {buildNavMenuItems(item.children)}
          </MenubarSubContent>
        </MenubarSub>
      ) : (
        <MenubarItem key={item.id} asChild>
          <Link to={item.url} className="cursor-pointer">
            {item.name}
          </Link>
        </MenubarItem>
      ),
    );

  return (
    <Menubar className="h-16 bg-primary rounded-none">
      <div className="flex flex-row w-full h-full items-center px-4">
        {/* Left Section */}
        <div className="flex basis-9/12 justify-start text-primary-foreground gap-2">
          {/* Logo */}
          <Link to="/" className="flex items-center px-3 py-2">
            <img
              src="/playground.png"
              alt="playground logo"
              className="h-6 w-auto"
            />
          </Link>

          {navigationMenu
            .filter((item) => item.menuPosition === "left")
            .map((item) => (
              <MenubarMenu key={item.id}>
                <MenubarTrigger className="cursor-pointer px-3 py-2 hover:bg-primary-foreground/10 rounded-md transition-colors">
                  {!item.children ? (
                    <Link to={item.url}>{item.name} </Link>
                  ) : (
                    <div className="flex flex-row items-center gap-1">
                      <span>{item.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  )}
                </MenubarTrigger>
                {item.children && item.children.length > 0 && (
                  <MenubarContent className="mt-0" align="center">
                    {buildNavMenuItems(item.children)}
                  </MenubarContent>
                )}
              </MenubarMenu>
            ))}
        </div>

        {/* Right Section */}
        <div className="flex basis-3/12 justify-end items-center">
          <div className="text-primary-foreground px-4 py-2">
            User Menu (wip)
          </div>
        </div>
      </div>
    </Menubar>
  );
}
