import { AdminShell } from "@/components/admin/AdminShell";

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{ key: string }>;
}

export default async function AdminLayout({
  children,
  params,
}: AdminLayoutProps) {
  const { key } = await params;

  return <AdminShell adminKey={key}>{children}</AdminShell>;
}
