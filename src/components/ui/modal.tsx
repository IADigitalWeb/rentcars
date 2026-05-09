"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, footer, className }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-inverse-surface/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          "relative bg-surface rounded-xl shadow-[0_12px_32px_rgba(35,35,35,0.08)]",
          "w-full max-w-lg mx-md animate-in fade-in",
          className
        )}
      >
        <div className="flex items-center justify-between p-md border-b border-outline-variant/20">
          <h2 className="font-headline-md text-headline-md text-on-surface">{title}</h2>
          <button
            onClick={onClose}
            className="p-xs rounded hover:bg-surface-container transition-colors text-on-surface-variant"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-md">{children}</div>
        {footer && (
          <div className="p-md border-t border-outline-variant/20 flex justify-end gap-sm">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
