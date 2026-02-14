interface AdminContentProps {
  children: React.ReactNode;
  tab: string;
}

export function AdminContent({ children, tab }: AdminContentProps) {
  return <div className="space-y-4">{children}</div>;
}
