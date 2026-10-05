import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export default function Card({
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={`rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}