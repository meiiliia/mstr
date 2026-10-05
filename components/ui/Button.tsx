import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90",
    secondary:
      "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:opacity-90",
    danger:
      "bg-[var(--danger)] text-white hover:opacity-90",
    ghost:
      "bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-sm",
  };

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}