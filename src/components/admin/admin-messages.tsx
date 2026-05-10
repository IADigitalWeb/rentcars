"use client";

import { useState } from "react";
import { cn, formatDate } from "@/lib/utils";
import { Mail, MailOpen, Trash2, ChevronLeft } from "lucide-react";
import { markMessageRead, deleteMessage } from "@/app/actions/message";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  subject: string;
  body: string;
  isRead: boolean;
  createdAt: Date;
}

export function AdminMessages({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = filter === "unread" ? messages.filter((m) => !m.isRead) : messages;
  const selected = messages.find((m) => m.id === selectedId);

  async function handleSelect(id: string) {
    setSelectedId(id);
    const msg = messages.find((m) => m.id === id);
    if (msg && !msg.isRead) {
      await markMessageRead(id);
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    await deleteMessage(id);
    if (selectedId === id) setSelectedId(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-lg">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Messages</h1>

      <div className="flex gap-sm">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "px-sm py-xs rounded font-label-bold text-label-bold transition-colors",
            filter === "all" ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant"
          )}
        >
          Tous ({messages.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={cn(
            "px-sm py-xs rounded font-label-bold text-label-bold transition-colors",
            filter === "unread" ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant"
          )}
        >
          Non lus ({messages.filter((m) => !m.isRead).length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Message list */}
        <div className="lg:col-span-1 bg-surface rounded-xl border border-outline-variant/20 overflow-hidden">
          <div className="divide-y divide-outline-variant/10 max-h-[600px] overflow-y-auto">
            {filtered.length === 0 && (
              <div className="px-md py-lg text-center font-body-md text-body-md text-on-surface-variant">
                Aucun message
              </div>
            )}
            {filtered.map((m) => (
              <button
                key={m.id}
                onClick={() => handleSelect(m.id)}
                className={cn(
                  "w-full text-left px-md py-sm hover:bg-surface-container-low/50 transition-colors",
                  selectedId === m.id && "bg-primary/5",
                  !m.isRead && "bg-primary/5"
                )}
              >
                <div className="flex items-center gap-sm mb-xs">
                  {m.isRead ? (
                    <MailOpen size={14} className="text-on-surface-variant shrink-0" />
                  ) : (
                    <Mail size={14} className="text-primary shrink-0" />
                  )}
                  <span className={cn("font-label-bold text-label-bold text-on-surface truncate", !m.isRead && "text-primary")}>
                    {m.firstName} {m.lastName}
                  </span>
                </div>
                <div className="font-label-bold text-label-bold text-on-surface truncate pl-[22px]">{m.subject}</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant pl-[22px] mt-xs">
                  {new Date(m.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message detail */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-outline-variant/20 p-lg">
          {!selected ? (
            <div className="flex items-center justify-center h-[400px] font-body-md text-body-md text-on-surface-variant">
              Selectionnez un message pour le lire
            </div>
          ) : (
            <div className="flex flex-col gap-md">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedId(null)}
                  className="lg:hidden flex items-center gap-xs text-primary font-label-bold text-label-bold"
                >
                  <ChevronLeft size={16} />
                  Retour
                </button>
                <button
                  onClick={() => handleDelete(selected.id)}
                  className="flex items-center gap-xs text-red-600 hover:bg-red-50 px-sm py-xs rounded transition-colors font-label-sm text-label-sm ml-auto"
                >
                  <Trash2 size={14} />
                  Supprimer
                </button>
              </div>

              <h2 className="font-headline-md text-headline-md text-on-surface">{selected.subject}</h2>

              <div className="flex flex-col gap-xs bg-surface-container-low rounded-lg p-md">
                <div className="font-label-bold text-label-bold text-on-surface">
                  {selected.firstName} {selected.lastName}
                </div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">{selected.email}</div>
                {selected.phone && (
                  <div className="font-label-sm text-label-sm text-on-surface-variant">{selected.phone}</div>
                )}
                <div className="font-label-sm text-label-sm text-on-surface-variant">
                  {formatDate(selected.createdAt)} a {new Date(selected.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>

              <div className="font-body-md text-body-md text-on-surface whitespace-pre-wrap leading-relaxed">
                {selected.body}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
