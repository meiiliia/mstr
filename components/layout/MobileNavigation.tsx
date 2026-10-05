"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Clock3,
  Database,
  LayoutDashboard,
  X,
} from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const menuItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Substrat",
    href: "/substrat",
    icon: Database,
  },
  {
    label: "Kontrol Sesi",
    href: "/sesi",
    icon: Activity,
  },
  {
    label: "Riwayat Sesi",
    href: "/riwayat",
    icon: Clock3,
  },
  {
    label: "Perbandingan",
    href: "/perbandingan",
    icon: BarChart3,
  },
];

export default function MobileNavigation({
  open,
  onClose,
}: Props) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <aside className="relative flex h-full w-72 flex-col bg-[var(--card)] shadow-xl">
        <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
              <Activity size={20} />
            </div>

            <span className="font-bold">
              MFC Monitoring
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[var(--muted)]"
            aria-label="Tutup menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              (item.href !== "/" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium ${
                  isActive
                    ? "bg-[var(--secondary)] text-[var(--primary)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                }`}
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}