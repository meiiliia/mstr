"use client";

import Card from "@/components/ui/Card";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export type ComparisonReading = {
  sessionId: number;
  sessionLabel: string;
  recordedAt: string;
  voltage: number;
  current: number;
  power: number;
};

type Props = {
  readings: ComparisonReading[];
};

function buildChartData(
  readings: ComparisonReading[]
) {
  const grouped = new Map<
    number,
    ComparisonReading[]
  >();

  for (const reading of readings) {
    const current = grouped.get(reading.sessionId) ?? [];

    grouped.set(reading.sessionId, [
      ...current,
      reading,
    ]);
  }

  const sessions = Array.from(grouped.values());

  const maxLength = Math.max(
    ...sessions.map((items) => items.length),
    0
  );

  return Array.from(
    { length: maxLength },
    (_, index) => {
      const point: Record<string, string | number> = {
        time: String(index + 1),
      };

      for (const session of sessions) {
        const reading = session[index];

        if (!reading) continue;

        point[`voltage_${session[0].sessionId}`] =
          reading.voltage;

        point[`current_${session[0].sessionId}`] =
          reading.current;

        point[`power_${session[0].sessionId}`] =
          reading.power;
      }

      return point;
    }
  );
}

function getSessions(
  readings: ComparisonReading[]
) {
  const sessions = new Map<
    number,
    string
  >();

  for (const reading of readings) {
    if (!sessions.has(reading.sessionId)) {
      sessions.set(
        reading.sessionId,
        reading.sessionLabel
      );
    }
  }

  return Array.from(sessions.entries()).map(
    ([id, label]) => ({
      id,
      label,
    })
  );
}

const lineStyles = [
  "var(--primary)",
  "#2563eb",
  "#d97706",
  "#9333ea",
];

type Metric = {
  key: "voltage" | "current" | "power";
  title: string;
  unit: string;
};

const metrics: Metric[] = [
  {
    key: "voltage",
    title: "Perbandingan Tegangan",
    unit: "V",
  },
  {
    key: "current",
    title: "Perbandingan Arus",
    unit: "mA",
  },
  {
    key: "power",
    title: "Perbandingan Daya",
    unit: "mW",
  },
];

export default function ComparisonCharts({
  readings,
}: Props) {
  if (readings.length === 0) {
    return null;
  }

  const chartData = buildChartData(readings);
  const sessions = getSessions(readings);

  return (
    <div className="space-y-6">
      {metrics.map((metric) => (
        <Card key={metric.key}>
          <div>
            <h2 className="text-lg font-semibold">
              {metric.title}
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Perubahan nilai {metric.key} berdasarkan
              urutan pengukuran.
            </p>
          </div>

          <div className="mt-6 h-[350px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="time"
                  label={{
                    value: "Pengukuran ke-",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />

                <YAxis
                  label={{
                    value: metric.unit,
                    angle: -90,
                    position: "insideLeft",
                  }}
                />

                <Tooltip />

                <Legend />

                {sessions.map(
                  (session, index) => (
                    <Line
                      key={session.id}
                      type="monotone"
                      dataKey={`${metric.key}_${session.id}`}
                      name={session.label}
                      stroke={
                        lineStyles[
                          index %
                            lineStyles.length
                        ]
                      }
                      strokeWidth={2}
                      dot={false}
                    />
                  )
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      ))}
    </div>
  );
}