import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function Input({
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 ${className}`}
      />

      {error && (
        <p className="text-xs text-[var(--danger)]">
          {error}
        </p>
      )}
    </div>
  );
}