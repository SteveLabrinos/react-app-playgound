import { useAuth } from "react-oidc-context";
import { MenubarMenu } from "@/components/ui/menubar.tsx";
import {
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarTrigger,
} from "@radix-ui/react-menubar";
import { ChevronDown, LogOut, User } from "lucide-react";

export function UserMenu() {
  const auth = useAuth();

  return (
    <MenubarMenu>
      <MenubarTrigger className="cursor-pointer px-3 py-2 hover:bg-primary-foreground/10 rounded-md transition-colors text-primary-foreground">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-foreground/20">
            <User className="h-4 w-4" />
          </div>
          <span className="font-medium">{auth.user?.profile.name}</span>
          <ChevronDown className="h-4 w-4" />
        </div>
      </MenubarTrigger>
      <MenubarContent className="min-w-[200px]" align="end" sideOffset={8}>
        {/* User Info */}
        <div className="px-2 py-2">
          <p className="text-sm font-medium">{auth.user?.profile.name}</p>
          <p className="text-xs text-muted-foreground">
            {auth.user?.profile.email}
          </p>
        </div>
        <MenubarSeparator />
        {/* Logout */}
        <MenubarItem
          onClick={async () => await auth.signoutRedirect()}
          className="flex items-center cursor-pointer text-gray-500 focus:text-gray-600 focus:bg-destructive/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
}
