"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Clock3,
  Database,
  LayoutDashboard,
  Settings,
} from "lucide-react";

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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-64 flex-col border-r border-[var(--border)] bg-[var(--card)] lg:flex">
      <div className="flex h-16 items-center gap-3 border-b border-[var(--border)] px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
          <Activity size={20} />
        </div>

        <div>
          <h1 className="text-sm font-bold">
            MFC Monitoring
          </h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Monitoring System
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-[var(--secondary)] text-[var(--primary)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--border)] p-4">
        <div className="flex items-center gap-3 rounded-lg bg-[var(--muted)] p-3">
          <Settings size={18} className="text-[var(--muted-foreground)]" />

          <div>
            <p className="text-xs font-medium">
              Sistem MFC
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">
              v1.0
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}