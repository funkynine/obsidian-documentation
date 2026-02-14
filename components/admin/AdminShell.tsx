"use client";

import { useState } from "react";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

interface AdminShellProps {
  adminKey: string;
  children: React.ReactNode;
}

export function AdminShell({ adminKey, children }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar
        adminKey={adminKey}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      />
      <main
        className={`min-h-screen transition-all duration-200 ${
          collapsed ? "md:pl-16" : "md:pl-56"
        }`}
      >
        <AdminHeader onMenuClick={() => setMobileOpen(true)} />
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
