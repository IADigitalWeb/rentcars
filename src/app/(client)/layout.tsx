import { Navbar } from "@/components/public/navbar";
import { ClientSidebar } from "@/components/client/client-sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="flex">
        <ClientSidebar />
        <main className="flex-1 ml-[260px] p-lg min-h-[calc(100vh-80px)]">
          {children}
        </main>
      </div>
    </>
  );
}
