"use client";

import { cn } from "@/lib/utils";
import { Phone, Mail, Menu, X, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "@/lib/use-theme";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@/components/public/auth-status";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/inventaire", label: "Inventaire" },
  { href: "/reservations/nouvelle", label: "Réservation" },
  { href: "/informations/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { dark, toggle } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 w-full z-50 border-b transition-colors",
        "bg-surface/95 backdrop-blur-md border-outline-variant/20",
        scrolled ? "shadow-sm" : "",
        "dark:bg-inverse-surface/95 dark:border-outline/10 dark:shadow-none"
      )}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-margin h-20">
        <Link href="/" className="font-headline-lg text-headline-lg font-extrabold tracking-tighter text-primary dark:text-primary-fixed">
          RentCars
        </Link>

        <nav className="hidden md:flex items-center gap-margin font-label-bold text-label-bold">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors py-2 px-3 rounded scale-100 active:scale-95 transition-transform duration-150",
                  isActive
                    ? "text-primary dark:text-primary-fixed border-b-2 border-primary dark:border-primary-fixed pb-1"
                    : "text-on-surface-variant hover:text-primary dark:text-on-surface-variant/80 dark:hover:text-primary-fixed hover:bg-primary/5 dark:hover:bg-primary-fixed/10"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-md">
          <div className="hidden lg:flex items-center gap-sm text-on-surface-variant">
            <Phone size={20} className="cursor-pointer hover:text-primary transition-colors" />
            <Mail size={20} className="cursor-pointer hover:text-primary transition-colors" />
          </div>

          <button
            onClick={toggle}
            className="p-sm rounded hover:bg-surface-container transition-colors text-on-surface-variant"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <SignedIn>
            <Link href="/dashboard">
              <Button size="sm">Mon espace</Button>
            </Link>
          </SignedIn>

          <SignedOut>
            <Link href="/auth/connexion">
              <Button size="sm">Connexion</Button>
            </Link>
          </SignedOut>

          <button
            className="md:hidden p-sm text-on-surface-variant"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-outline-variant/20 bg-surface dark:bg-inverse-surface px-margin py-md flex flex-col gap-sm font-label-bold text-label-bold">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="py-sm px-sm rounded text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
