"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  { href: "/admin/vehicules", label: "Véhicules", icon: Car },
  { href: "/admin/reservations", label: "Réservations", icon: CalendarCheck },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/statistiques", label: "Statistiques", icon: BarChart3 },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-surface dark:bg-inverse-surface border-r border-outline-variant/20 flex flex-col z-40">
      <div className="p-md border-b border-outline-variant/20">
        <Link href="/admin" className="font-headline-lg text-headline-lg font-extrabold tracking-tighter text-primary dark:text-primary-fixed">
          RentCars
        </Link>
        <span className="block font-label-sm text-label-sm text-on-surface-variant mt-xs">Administration</span>
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
                  : "text-on-surface-variant hover:bg-surface-container dark:hover:bg-surface-container-high"
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
