"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import Navbar from "@/components/app/Navbar";
import { Trophy, Coins } from "lucide-react";

const mockRanking = [
  { name: "Lucas M.", city: "SP", coins: 12450, badge: "👑" },
  { name: "Fernanda K.", city: "RJ", coins: 9870, badge: "🥈" },
  { name: "Ricardo S.", city: "MG", coins: 8240, badge: "🥉" },
  { name: "Ana Paula R.", city: "BA", coins: 6500, badge: "⭐" },
  { name: "Thiago N.", city: "PR", coins: 5900, badge: "⭐" },
  { name: "Camila F.", city: "CE", coins: 5100, badge: "⭐" },
  { name: "Bruno O.", city: "PE", coins: 4700, badge: "⭐" },
  { name: "Isabela C.", city: "RS", coins: 4200, badge: "⭐" },
  { name: "Diego W.", city: "DF", coins: 3800, badge: "⭐" },
  { name: "Mariana A.", city: "GO", coins: 3500, badge: "⭐" },
];

export default function Ranking() {
  const { isLoggedIn, user, coins } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.replace("/");
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  const myEntry = { name: user?.name ?? "Você", city: "BR", coins, badge: "🌱" };
  const fullRanking = [...mockRanking, myEntry].sort((a, b) => b.coins - a.coins);
  const myPos = fullRanking.findIndex((r) => r.name === myEntry.name) + 1;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2"><Trophy size={24} className="text-accent" /> Ranking Global</h1>
          <p className="text-muted-foreground text-sm mt-1">Top usuários que mais acumularam moedas</p>
        </div>

        {/* My position */}
        <div className="rounded-2xl p-4 border border-accent/30 bg-accent/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-extrabold text-accent">#{myPos}</div>
          <div className="flex-1">
            <p className="font-bold">{user?.name} (Você)</p>
            <p className="text-xs text-muted-foreground">Sua posição atual</p>
          </div>
          <div className="flex items-center gap-1 text-accent font-bold">
            <Coins size={14} /> {coins.toLocaleString("pt-BR")}
          </div>
        </div>

        {/* Ranking list */}
        <div className="card-glass rounded-2xl border border-border overflow-hidden">
          {fullRanking.map((entry, i) => {
            const isMe = entry.name === myEntry.name;
            const pos = i + 1;
            return (
              <div
                key={i}
                className={`flex items-center gap-4 px-5 py-4 border-b border-border last:border-0 ${isMe ? "bg-accent/5" : ""}`}
              >
                <div className={`w-8 text-center font-extrabold ${pos === 1 ? "text-yellow-400" : pos === 2 ? "text-gray-300" : pos === 3 ? "text-amber-600" : "text-muted-foreground"}`}>
                  {pos <= 3 ? entry.badge : `#${pos}`}
                </div>
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-sm">
                  {entry.name[0]}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${isMe ? "text-accent" : ""}`}>{entry.name} {isMe && "(Você)"}</p>
                  <p className="text-xs text-muted-foreground">{entry.city}</p>
                </div>
                <div className="flex items-center gap-1 font-bold text-sm text-accent">
                  <Coins size={13} /> {entry.coins.toLocaleString("pt-BR")}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-muted-foreground text-sm">Complete mais tarefas para subir no ranking! 🚀</p>
      </main>
    </div>
  );
}
