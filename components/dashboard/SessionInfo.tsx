import { FlaskConical, PlayCircle } from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

type Props = {
  session: {
    id: number;
    substrate: string;
    ph: number | null;
    temperature: number | null;
    volume: number | null;
    loadResistance: number | null;
    startedAt: string | null;
  } | null;
};

export default function SessionInfo({
  session,
}: Props) {
  if (!session) {
    return (
      <Card>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-[var(--muted)] p-2">
            <FlaskConical size={20} />
          </div>

          <div>
            <h2 className="font-semibold">
              Tidak Ada Sesi Aktif
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Mulai eksperimen melalui menu Kontrol Sesi.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-[var(--secondary)] p-2 text-[var(--primary)]">
            <FlaskConical size={20} />
          </div>

          <div>
            <p className="text-sm text-[var(--muted-foreground)]">
              Sesi Aktif #{session.id}
            </p>

            <h2 className="font-semibold">
              {session.substrate}
            </h2>
          </div>
        </div>

        <Badge variant="success">
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-current" />
          Running
        </Badge>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs text-[var(--muted-foreground)]">
            pH
          </p>
          <p className="mt-1 font-medium">
            {session.ph ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-[var(--muted-foreground)]">
            Suhu
          </p>
          <p className="mt-1 font-medium">
            {session.temperature != null
              ? `${session.temperature} °C`
              : "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-[var(--muted-foreground)]">
            Volume
          </p>
          <p className="mt-1 font-medium">
            {session.volume != null
              ? `${session.volume} mL`
              : "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-[var(--muted-foreground)]">
            Resistor
          </p>
          <p className="mt-1 font-medium">
            {session.loadResistance != null
              ? `${session.loadResistance} Ω`
              : "-"}
          </p>
        </div>
      </div>

      <div className="mt-5 border-t border-[var(--border)] pt-4">
        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <PlayCircle size={16} />

          <span>
            Mulai:{" "}
            {session.startedAt
              ? new Date(
                  session.startedAt
                ).toLocaleString("id-ID")
              : "-"}
          </span>
        </div>
      </div>
    </Card>
  );
}