"use client";

import { Link, useLocation } from "react-router-dom";
import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { History, Home, User } from "lucide-react";

export function FooterNavigation() {
  const { isInputFocused } = useUiStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItemClass = (path: string) =>
    cn(
      "flex flex-col items-center justify-center gap-1 h-full flex-1 cursor-pointer transition-colors duration-200", // flex-1로 3등분
      isActive(path) ? "text-primary font-bold" : "text-muted-foreground hover:text-primary/70"
    );

  return (
    <nav
      className={cn(
        "fixed bottom-0 z-50 transition-transform duration-300 ease-in-out",
        "w-full max-w-[600px] left-0 right-0 mx-auto",
        "bg-background/95 backdrop-blur-md border-t border-border/60 shadow-lg",
        {
          "translate-y-full": isInputFocused,
          "translate-y-0": !isInputFocused,
        }
      )}
    >
      <div className='flex items-center justify-between h-[60px] px-2'>
        <Link
          to='/histories'
          className={menuItemClass("/histories")}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <History className={cn("w-6 h-6", isActive("/histories") && "stroke-[2.5px]")} />
          <span className='text-[10px] font-medium'>기록</span>
        </Link>

        <Link
          to='/'
          className={menuItemClass("/")}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Home className={cn("w-6 h-6", isActive("/") && "stroke-[2.5px]")} />
          <span className='text-[10px] font-medium'>홈</span>
        </Link>

        <Link
          to='/my'
          className={menuItemClass("/my")}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <User className={cn("w-6 h-6", isActive("/my") && "stroke-[2.5px]")} />
          <span className='text-[10px] font-medium'>마이</span>
        </Link>
      </div>

      <div className='h-[env(safe-area-inset-bottom)] bg-transparent' />
    </nav>
  );
}
