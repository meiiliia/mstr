import Card from "@/components/ui/Card";

import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/Table";

export type ComparisonData = {
  id: number;
  substrate: string;
  ph: number | null;
  temperature: number | null;
  volume: number | null;
  resistance: number | null;
  duration: string;
  maxVoltage: number | null;
  avgVoltage: number | null;
  maxCurrent: number | null;
  avgCurrent: number | null;
  maxPower: number | null;
  avgPower: number | null;
};

type Props = {
  data: ComparisonData[];
};

export default function ComparisonTable({
  data,
}: Props) {
  return (
    <Card>
      <div>
        <h2 className="text-lg font-semibold">
          Tabel Perbandingan
        </h2>

        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Perbandingan parameter eksperimen dan hasil
          pengukuran setiap sesi.
        </p>
      </div>

      <div className="mt-6 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Parameter</TableHead>

              {data.map((item) => (
                <TableHead key={item.id}>
                  Sesi #{item.id}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell>Substrat</TableCell>

              {data.map((item) => (
                <TableCell key={item.id}>
                  {item.substrate}
                </TableCell>
              ))}
            </TableRow>

            <TableRow>
              <TableCell>pH</TableCell>

              {data.map((item) => (
                <TableCell key={item.id}>
                  {item.ph ?? "-"}
                </TableCell>
              ))}
            </TableRow>

            <TableRow>
              <TableCell>Suhu</TableCell>

              {data.map((item) => (
                <TableCell key={item.id}>
                  {item.temperature != null
                    ? `${item.temperature} °C`
                    : "-"}
                </TableCell>
              ))}
            </TableRow>

            <TableRow>
              <TableCell>Volume</TableCell>

              {data.map((item) => (
                <TableCell key={item.id}>
                  {item.volume != null
                    ? `${item.volume} mL`
                    : "-"}
                </TableCell>
              ))}
            </TableRow>

            <TableRow>
              <TableCell>Resistor Beban</TableCell>

              {data.map((item) => (
                <TableCell key={item.id}>
                  {item.resistance != null
                    ? `${item.resistance} Ω`
                    : "-"}
                </TableCell>
              ))}
            </TableRow>

            <TableRow>
              <TableCell>Durasi</TableCell>

              {data.map((item) => (
                <TableCell key={item.id}>
                  {item.duration}
                </TableCell>
              ))}
            </TableRow>

            <TableRow>
              <TableCell>Max Voltage</TableCell>

              {data.map((item) => (
                <TableCell key={item.id}>
                  {item.maxVoltage != null
                    ? `${item.maxVoltage.toFixed(3)} V`
                    : "-"}
                </TableCell>
              ))}
            </TableRow>

            <TableRow>
              <TableCell>Avg Voltage</TableCell>

              {data.map((item) => (
                <TableCell key={item.id}>
                  {item.avgVoltage != null
                    ? `${item.avgVoltage.toFixed(3)} V`
                    : "-"}
                </TableCell>
              ))}
            </TableRow>

            <TableRow>
              <TableCell>Max Current</TableCell>

              {data.map((item) => (
                <TableCell key={item.id}>
                  {item.maxCurrent != null
                    ? `${item.maxCurrent.toFixed(3)} mA`
                    : "-"
                  }
                </TableCell>
              ))}
            </TableRow>

            <TableRow>
              <TableCell>Avg Current</TableCell>

              {data.map((item) => (
                <TableCell key={item.id}>
                  {item.avgCurrent != null
                    ? `${item.avgCurrent.toFixed(3)} mA`
                    : "-"}
                </TableCell>
              ))}
            </TableRow>

            <TableRow>
              <TableCell>Max Power</TableCell>

              {data.map((item) => (
                <TableCell key={item.id}>
                  {item.maxPower != null
                    ? `${item.maxPower.toFixed(3)} mW`
                    : "-"}
                </TableCell>
              ))}
            </TableRow>

            <TableRow>
              <TableCell>Avg Power</TableCell>

              {data.map((item) => (
                <TableCell key={item.id}>
                  {item.avgPower != null
                    ? `${item.avgPower.toFixed(3)} mW`
                    : "-"}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}