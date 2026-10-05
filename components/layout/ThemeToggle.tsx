"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)]"
        aria-label="Ganti tema"
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] transition hover:bg-[var(--muted)]"
      aria-label="Ganti tema"
    >
      {isDark ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
}