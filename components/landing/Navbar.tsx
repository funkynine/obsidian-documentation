"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const NAV_LINKS = [
  { href: "/", label: "Головна" },
  { href: "/catalog", label: "Каталог" },
  { href: "/about", label: "Про нас" },
  { href: "/contacts", label: "Контакти" },
] as const;


const BURGER_BREAKPOINT = {
  nav: "lg:flex lg:gap-8",
  burger: "lg:hidden",
  menu: "lg:hidden",
};

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = (href: string) => {
    const isActive =
      href === "/" ? pathname === "/" : pathname?.startsWith(href);
    return `text-sm font-medium transition-colors whitespace-nowrap py-3 ${
      isActive
        ? "text-destructive hover:text-destructive/90"
        : "text-muted-foreground hover:text-foreground"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur">
      <div className="grid h-16 grid-cols-[1fr_1fr] lg:grid-cols-[1fr_auto_1fr] md:grid-cols-[1fr_1fr] sm:grid-cols-[1fr_1fr] items-center gap-4 px-4 md:px-6">
        <div className="flex">
          <Logo />
        </div>

        <nav
          className={`hidden items-center justify-center gap-6 ${BURGER_BREAKPOINT.nav}`}
          aria-label="Основна навігація"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className={linkClass(href)}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className={`flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${BURGER_BREAKPOINT.burger}`}
            aria-label={menuOpen ? "Закрити меню" : "Відкрити меню"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-border bg-background transition-all duration-200 ease-out ${BURGER_BREAKPOINT.menu} ${
          menuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <nav
          className="container flex flex-col px-4 py-4"
          aria-label="Мобільна навігація"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={linkClass(href)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
