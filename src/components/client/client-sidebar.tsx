"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarRange,
  Heart,
  UserCircle,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/reservations", label: "Mes Réservations", icon: CalendarRange },
  { href: "/dashboard/favoris", label: "Mes Favoris", icon: Heart },
  { href: "/dashboard/profil", label: "Mon Profil", icon: UserCircle },
];

export function ClientSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-20 h-[calc(100vh-80px)] w-[260px] bg-surface border-r border-outline-variant/20 flex flex-col z-40">
      <div className="p-md border-b border-outline-variant/20">
        <div className="flex items-center gap-sm">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-label-bold text-label-bold">
            M
          </div>
          <div>
            <span className="font-label-bold text-label-bold text-on-surface block">Marie Martin</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Client</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-md px-sm flex flex-col gap-xs">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-sm px-md py-sm rounded font-label-bold text-label-bold transition-colors",
                isActive
                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                  : "text-on-surface-variant hover:bg-surface-container"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-md border-t border-outline-variant/20">
        <button className="flex items-center gap-sm px-md py-sm rounded font-label-bold text-label-bold text-on-surface-variant hover:bg-surface-container w-full transition-colors">
          <LogOut size={20} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
