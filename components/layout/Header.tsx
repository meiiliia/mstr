"use client";

import { Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

type Props = {
  onMenuClick?: () => void;
};

export default function Header({ onMenuClick }: Props) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--foreground)] hover:bg-[var(--muted)] lg:hidden"
          aria-label="Buka menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <p className="text-sm font-semibold">
            Monitoring Microbial Fuel Cell
          </p>

          <p className="hidden text-xs text-[var(--muted-foreground)] sm:block">
            Pantau performa sistem secara realtime
          </p>
        </div>
      </div>

      <ThemeToggle />
    </header>
  );
}