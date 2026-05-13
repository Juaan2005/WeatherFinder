import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Trash2,
  Wallet,
  Sparkles,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Expense Tracker - Catat Keuangan Pribadi" },
      {
        name: "description",
        content:
          "Aplikasi pencatat pemasukan dan pengeluaran pribadi dengan ringkasan saldo otomatis.",
      },
    ],
  }),
});

type Tipe = "masuk" | "keluar";

interface Transaksi {
  id: string;
  ket: string;
  nominal: number;
  tipe: Tipe;
}

const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

function Index() {
  const [transaksi, setTransaksi] = useState<Transaksi[]>([
    { id: "1", ket: "Uang Saku", nominal: 100000, tipe: "masuk" },
    { id: "2", ket: "Beli Cilok", nominal: 10000, tipe: "keluar" },
  ]);
  const [ket, setKet] = useState("");
  const [nominal, setNominal] = useState("");

  const { saldo, totalMasuk, totalKeluar } = useMemo(() => {
    let masuk = 0;
    let keluar = 0;
    for (const t of transaksi) {
      if (t.tipe === "masuk") masuk += t.nominal;
      else keluar += t.nominal;
    }
    return { saldo: masuk - keluar, totalMasuk: masuk, totalKeluar: keluar };
  }, [transaksi]);

  const tambah = (tipe: Tipe) => (e: FormEvent) => {
    e.preventDefault();
    const n = Number(nominal);
    if (!ket.trim() || !n || n <= 0) return;
    setTransaksi((prev) => [
      { id: crypto.randomUUID(), ket: ket.trim(), nominal: n, tipe },
      ...prev,
    ]);
    setKet("");
    setNominal("");
  };

  const hapus = (id: string) =>
    setTransaksi((prev) => prev.filter((t) => t.id !== id));

  return (
    <main className="min-h-screen py-10 px-4">
      <div className="mx-auto w-full max-w-xl space-y-6">
        {/* Header */}
        <header className="text-center space-y-2 animate-slide-up">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 backdrop-blur px-3 py-1 text-xs text-muted-foreground shadow-soft">
            <Sparkles className="h-3 w-3 text-primary" />
            Catat keuanganmu dengan mudah
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-saldo bg-clip-text text-transparent">
            Expense Tracker
          </h1>
        </header>

        {/* Saldo Card */}
        <section
          className="relative overflow-hidden rounded-3xl p-7 text-primary-foreground bg-gradient-saldo shadow-glow animate-slide-up"
          style={{ animationDelay: "60ms" }}
        >
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

          <div className="relative">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-80">
              <Wallet className="h-3.5 w-3.5" />
              <span>Saldo Saat Ini</span>
            </div>
            <div className="mt-3 text-4xl font-bold tracking-tight tabular-nums">
              {formatRupiah(saldo)}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-white/15 backdrop-blur-sm p-4 border border-white/10">
                <div className="flex items-center gap-1.5 opacity-90 text-xs">
                  <TrendingUp className="h-3.5 w-3.5" /> Pemasukan
                </div>
                <div className="font-semibold mt-1 tabular-nums">
                  {formatRupiah(totalMasuk)}
                </div>
              </div>
              <div className="rounded-2xl bg-white/15 backdrop-blur-sm p-4 border border-white/10">
                <div className="flex items-center gap-1.5 opacity-90 text-xs">
                  <TrendingDown className="h-3.5 w-3.5" /> Pengeluaran
                </div>
                <div className="font-semibold mt-1 tabular-nums">
                  {formatRupiah(totalKeluar)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form */}
        <section
          className="rounded-3xl border bg-card p-6 shadow-soft animate-slide-up"
          style={{ animationDelay: "120ms" }}
        >
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <span className="h-6 w-1 rounded-full bg-gradient-saldo" />
            Tambah Transaksi
          </h2>
          <form className="space-y-3" onSubmit={tambah("keluar")}>
            <div className="space-y-1.5">
              <Label htmlFor="ket">Deskripsi</Label>
              <Input
                id="ket"
                placeholder="Contoh: Beli Makan"
                value={ket}
                onChange={(e) => setKet(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nominal">Nominal (Rp)</Label>
              <Input
                id="nominal"
                type="number"
                inputMode="numeric"
                min={1}
                placeholder="50000"
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                className="h-11 rounded-xl tabular-nums"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <Button
                type="button"
                onClick={tambah("masuk") as unknown as () => void}
                className="h-11 rounded-xl bg-income-solid hover:opacity-90 text-white shadow-soft transition-all hover:-translate-y-0.5"
              >
                <ArrowUpCircle className="h-4 w-4" /> Pemasukan
              </Button>
              <Button
                type="submit"
                className="h-11 rounded-xl bg-expense-solid hover:opacity-90 text-white shadow-soft transition-all hover:-translate-y-0.5"
              >
                <ArrowDownCircle className="h-4 w-4" /> Pengeluaran
              </Button>
            </div>
          </form>
        </section>

        {/* Riwayat */}
        <section
          className="rounded-3xl border bg-card p-6 shadow-soft animate-slide-up"
          style={{ animationDelay: "180ms" }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold flex items-center gap-2">
              <span className="h-6 w-1 rounded-full bg-gradient-saldo" />
              Riwayat Transaksi
            </h2>
            <span className="text-xs text-muted-foreground">
              {transaksi.length} transaksi
            </span>
          </div>

          {transaksi.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              <Wallet className="h-8 w-8 mx-auto mb-2 opacity-40" />
              Belum ada transaksi. Tambahkan yang pertama!
            </div>
          ) : (
            <ul className="space-y-2">
              {transaksi.map((t, idx) => {
                const masuk = t.tipe === "masuk";
                return (
                  <li
                    key={t.id}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-transparent hover:border-border bg-muted/40 hover:bg-card hover:shadow-soft p-3 transition-all animate-slide-up"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                          masuk
                            ? "bg-income-soft text-income"
                            : "bg-expense-soft text-expense",
                        )}
                      >
                        {masuk ? (
                          <ArrowUpCircle className="h-5 w-5" />
                        ) : (
                          <ArrowDownCircle className="h-5 w-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{t.ket}</div>
                        <div className="text-xs text-muted-foreground">
                          {masuk ? "Pemasukan" : "Pengeluaran"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className={cn(
                          "font-semibold tabular-nums text-sm",
                          masuk ? "text-income" : "text-expense",
                        )}
                      >
                        {masuk ? "+" : "-"}
                        {formatRupiah(t.nominal)}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => hapus(t.id)}
                        aria-label="Hapus transaksi"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <footer className="text-center text-xs text-muted-foreground pt-2">
          Dibuat dengan ❤ untuk catatan keuangan harian
        </footer>
      </div>
    </main>
  );
}
