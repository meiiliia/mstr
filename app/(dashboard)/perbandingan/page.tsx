import { createClient } from "@/lib/supabase/server";

import SessionSelector from "@/components/perbandingan/SessionSelector";

import ComparisonCharts, {
  type ComparisonReading,
} from "@/components/perbandingan/ComparisonCharts";

import ComparisonTable, {
  type ComparisonData,
} from "@/components/perbandingan/ComparisonTable";

type Props = {
  searchParams: Promise<{
    ids?: string;
  }>;
};

function formatDuration(
  startedAt: string | null,
  endedAt: string | null
) {
  if (!startedAt || !endedAt) {
    return "-";
  }

  const start = new Date(startedAt).getTime();
  const end = new Date(endedAt).getTime();

  const totalSeconds = Math.max(
    0,
    Math.floor((end - start) / 1000)
  );

  const hours = Math.floor(
    totalSeconds / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds = totalSeconds % 60;

  return `${hours}j ${minutes}m ${seconds}d`;
}

function average(values: number[]) {
  if (values.length === 0) {
    return null;
  }

  return (
    values.reduce(
      (sum, value) => sum + value,
      0
    ) / values.length
  );
}

export default async function ComparisonPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const supabase = await createClient();

  // Ambil semua sesi yang sudah selesai
  const { data: sessions } = await supabase
    .from("sessions")
    .select(`
      *,
      substrates (
        id,
        name
      )
    `)
    .eq("status", "completed")
    .order("started_at", {
      ascending: false,
    });

  const selectedIds = params.ids
    ? params.ids
        .split(",")
        .map(Number)
        .filter(
          (id) => !Number.isNaN(id)
        )
    : [];

  let comparisonData: ComparisonData[] = [];

  let comparisonReadings: ComparisonReading[] =
    [];

  if (selectedIds.length >= 2) {
    // Ambil sesi yang dipilih
    const { data: selectedSessions } =
      await supabase
        .from("sessions")
        .select(`
          *,
          substrates (
            id,
            name
          )
        `)
        .in("id", selectedIds);

    // Ambil semua data sensor dari sesi yang dipilih
    const { data: readings } =
      await supabase
        .from("sensor_readings")
        .select("*")
        .in("session_id", selectedIds)
        .order("recorded_at", {
          ascending: true,
        });

    // Data untuk grafik
    comparisonReadings = (
      readings ?? []
    )
      .map((reading) => {
        const session =
          selectedSessions?.find(
            (item) =>
              item.id === reading.session_id
          );

        return {
          sessionId: reading.session_id,

          sessionLabel: `Sesi #${reading.session_id} - ${
            session?.substrates?.name ?? "-"
          }`,

          recordedAt:
            reading.recorded_at,

          voltage: Number(
            reading.voltage
          ),

          current: Number(
            reading.current
          ),

          power: Number(
            reading.power
          ),
        };
      })
      .sort(
        (a, b) =>
          new Date(
            a.recordedAt
          ).getTime() -
          new Date(
            b.recordedAt
          ).getTime()
      );

    // Data untuk tabel
    comparisonData = (
      selectedSessions ?? []
    ).map((session) => {
      const sessionReadings =
        readings?.filter(
          (reading) =>
            reading.session_id ===
            session.id
        ) ?? [];

      const voltages =
        sessionReadings.map(
          (reading) =>
            Number(reading.voltage)
        );

      const currents =
        sessionReadings.map(
          (reading) =>
            Number(reading.current)
        );

      const powers =
        sessionReadings.map(
          (reading) =>
            Number(reading.power)
        );

      return {
        id: session.id,

        substrate:
          session.substrates?.name ?? "-",

        ph: session.ph,

        temperature:
          session.temperature,

        volume: session.volume,

        resistance:
          session.load_resistance,

        duration: formatDuration(
          session.started_at,
          session.ended_at
        ),

        maxVoltage:
          voltages.length > 0
            ? Math.max(...voltages)
            : null,

        avgVoltage:
          average(voltages),

        maxCurrent:
          currents.length > 0
            ? Math.max(...currents)
            : null,

        avgCurrent:
          average(currents),

        maxPower:
          powers.length > 0
            ? Math.max(...powers)
            : null,

        avgPower:
          average(powers),
      };
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Perbandingan Sesi
        </h1>

        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Bandingkan hasil eksperimen dari
          beberapa sesi MFC.
        </p>
      </div>

      {/* Pemilihan sesi */}
      <SessionSelector
        sessions={sessions ?? []}
      />

      {/* Grafik perbandingan */}
      {comparisonData.length >= 2 && (
        <ComparisonCharts
          readings={comparisonReadings}
        />
      )}

      {/* Tabel perbandingan */}
      {comparisonData.length >= 2 && (
        <ComparisonTable
          data={comparisonData}
        />
      )}
    </div>
  );
}