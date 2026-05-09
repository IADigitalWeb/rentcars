import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 ml-[260px] p-lg min-h-screen">
        {children}
      </main>
    </div>
  );
}
