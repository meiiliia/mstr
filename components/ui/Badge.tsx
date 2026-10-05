type BadgeProps = {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "default";
};

export default function Badge({
  children,
  variant = "default",
}: BadgeProps) {
  const variants = {
    success:
      "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
    warning:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
    danger:
      "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
    default:
      "bg-[var(--muted)] text-[var(--muted-foreground)]",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}