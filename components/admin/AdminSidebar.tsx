"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShoppingCart, Flower2, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  adminKey: string;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

const NAV_ITEMS = [
  { href: "orders", label: "Замовлення", icon: ShoppingCart },
  { href: "varieties", label: "Продукти", icon: Flower2 },
] as const;

export function AdminSidebar({
  adminKey,
  collapsed = false,
  onCollapsedChange,
  mobileOpen = false,
  onMobileOpenChange,
}: AdminSidebarProps) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "orders";

  const baseUrl = `/admin/${adminKey}`;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => onMobileOpenChange?.(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border bg-background transition-all duration-200",
          "md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:!translate-x-0 md:flex",
          collapsed ? "md:w-16" : "md:w-56"
        )}
      >
        {/* Header with logo/brand */}
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          {!collapsed && (
            <span className="truncate text-sm font-semibold">TULIP GARDEN</span>
          )}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onCollapsedChange?.(!collapsed)}
              className="hidden rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:flex"
              aria-label={collapsed ? "Розгорнути" : "Згорнути"}
            >
              <Menu className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onMobileOpenChange?.(false)}
              className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
              aria-label="Закрити"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = tab === href;
            return (
              <Link
                key={href}
                href={`${baseUrl}?tab=${href}`}
                onClick={() => onMobileOpenChange?.(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-5 shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

    </>
  );
}
