import type { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from "react";

export function Table({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[var(--border)]">
      <table
        {...props}
        className={`w-full text-left text-sm ${className}`}
      />
    </div>
  );
}

export function TableHeader({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      {...props}
      className={`border-b border-[var(--border)] bg-[var(--muted)] ${className}`}
    />
  );
}

export function TableHead({
  className = "",
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)] ${className}`}
    />
  );
}

export function TableBody({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      {...props}
      className={`divide-y divide-[var(--border)] ${className}`}
    />
  );
}

export function TableRow({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      {...props}
      className={`transition hover:bg-[var(--muted)] ${className}`}
    />
  );
}

export function TableCell({
  className = "",
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      {...props}
      className={`px-4 py-3 ${className}`}
    />
  );
}