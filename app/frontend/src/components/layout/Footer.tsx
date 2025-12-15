"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { useMobile } from "@/hooks/use-mobile";
import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

export function FooterNavigation() {
  const isMobile = useMobile();
  const { isInputFocused } = useUiStore();

  return (
    <NavigationMenu
      viewport={isMobile}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={isInputFocused ? "display-none" : "z-30"}
    >
      <NavigationMenuList
        className={cn("flex-wrap transition-transform duration-300", {
          "translate-y-full": isInputFocused,
        })}
        style={{
          width: "100%",
          maxWidth: "600px",
          position: "fixed",
          bottom: 0,
          display: "flex",
          backgroundColor: "white",
          padding: "10px 0",
          justifyContent: "space-around",
          zIndex: 1000,
        }}
      >
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to='/links'>LINK</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to='/'>HOME</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to='/my'>MY</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
