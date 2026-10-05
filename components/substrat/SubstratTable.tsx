"use client";

import { Pencil, Trash2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import type { Substrate } from "@/lib/types/database";

type Props = {
  substrates: Substrate[];
  onEdit: (substrate: Substrate) => void;
  onDelete: (substrate: Substrate) => void;
};

export default function SubstratTable({
  substrates,
  onEdit,
  onDelete,
}: Props) {
  if (substrates.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] p-10 text-center">
        <p className="font-medium">
          Belum ada substrat
        </p>

        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Tambahkan substrat untuk mulai menggunakan sistem.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama</TableHead>
          <TableHead>Deskripsi</TableHead>
          <TableHead>Dibuat</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">
            Aksi
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {substrates.map((substrate) => (
          <TableRow key={substrate.id}>
            <TableCell className="font-medium">
              {substrate.name}
            </TableCell>

            <TableCell className="max-w-xs">
              <span className="line-clamp-2 text-[var(--muted-foreground)]">
                {substrate.description || "-"}
              </span>
            </TableCell>

            <TableCell>
              {new Date(
                substrate.created_at
              ).toLocaleDateString("id-ID")}
            </TableCell>

            <TableCell>
              <Badge variant="success">
                Aktif
              </Badge>
            </TableCell>

            <TableCell>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(substrate)}
                  aria-label={`Edit ${substrate.name}`}
                >
                  <Pencil size={16} />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(substrate)}
                  aria-label={`Hapus ${substrate.name}`}
                >
                  <Trash2
                    size={16}
                    className="text-[var(--danger)]"
                  />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}