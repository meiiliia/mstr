import Card from "@/components/ui/Card";
import SessionForm from "@/components/sesi/SessionForm";
import ActiveSession from "@/components/sesi/ActiveSession";

import { createClient } from "@/lib/supabase/server";

export default async function SessionPage() {
  const supabase = await createClient();

  const { data: activeSession, error: sessionError } =
    await supabase
      .from("sessions")
      .select(`
        *,
        substrates (
          id,
          name
        )
      `)
      .eq("status", "running")
      .order("started_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

  const { data: substrates, error: substrateError } =
    await supabase
      .from("substrates")
      .select("*")
      .order("name", {
        ascending: true,
      });

  if (sessionError || substrateError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            Kontrol Sesi
          </h1>

          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Kelola eksperimen Microbial Fuel Cell.
          </p>
        </div>

        <Card>
          <p className="text-sm text-[var(--danger)]">
            Gagal mengambil data sesi atau substrat.
          </p>
        </Card>
      </div>
    );
  }

  /*
   * Jika ada sesi yang sedang berjalan,
   * tampilkan ActiveSession.
   */
  if (activeSession) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            Kontrol Sesi
          </h1>

          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Monitoring eksperimen yang sedang berjalan.
          </p>
        </div>

        <ActiveSession
          session={activeSession}
        />
      </div>
    );
  }

  /*
   * Jika tidak ada sesi aktif,
   * tampilkan form untuk memulai sesi baru.
   */
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Kontrol Sesi
        </h1>

        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Atur parameter awal sebelum memulai eksperimen MFC.
        </p>
      </div>

      <Card>
        <div className="mb-6">
          <h2 className="text-lg font-semibold">
            Parameter Eksperimen
          </h2>

          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Masukkan kondisi awal sistem sebelum sesi dimulai.
          </p>
        </div>

        {substrates && substrates.length > 0 ? (
          <SessionForm
            substrates={substrates}
          />
        ) : (
          <div className="rounded-lg border border-dashed border-[var(--border)] p-8 text-center">
            <p className="font-medium">
              Belum ada substrat
            </p>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Tambahkan substrat terlebih dahulu sebelum
              memulai sesi.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}