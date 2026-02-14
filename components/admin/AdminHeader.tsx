"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Menu, ChevronRight } from "lucide-react";

const TAB_TITLES: Record<string, string> = {
  orders: "Замовлення",
  varieties: "Продукти",
};

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "orders";
  const title = TAB_TITLES[tab] ?? "Адмін-панель";

  return (
    <header className="sticky top-0 z-40 flex h-14 flex-col justify-center border-b border-border bg-background px-4 md:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex size-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
            aria-label="Відкрити меню"
          >
            <Menu className="size-5" />
          </button>
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Адмін</span>
            <ChevronRight className="size-4" />
            <span className="font-semibold text-foreground">{title}</span>
          </nav>
        </div>
        <Link
          href="/"
          className="text-sm font-medium text-primary hover:underline"
        >
          На сайт
        </Link>
      </div>
    </header>
  );
}
