import type { ReactNode } from "react";
import Card from "@/components/ui/Card";

type Props = {
  title: string;
  value: string;
  unit: string;
  icon?: ReactNode;
  description?: string;
};

export default function MetricCard({
  title,
  value,
  unit,
  icon,
  description,
}: Props) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--muted-foreground)]">
            {title}
          </p>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold">
              {value}
            </span>

            <span className="text-sm text-[var(--muted-foreground)]">
              {unit}
            </span>
          </div>

          {description && (
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">
              {description}
            </p>
          )}
        </div>

        {icon && (
          <div className="rounded-lg bg-[var(--secondary)] p-2 text-[var(--primary)]">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}