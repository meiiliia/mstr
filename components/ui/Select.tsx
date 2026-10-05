import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: {
    label: string;
    value: string;
  }[];
};

export default function Select({
  label,
  options,
  ...props
}: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium">
          {label}
        </label>
      )}

      <select
        {...props}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
      >
        <option value="">Pilih...</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}