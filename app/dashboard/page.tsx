"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import Navbar from "@/components/app/Navbar";
import { TrendingUp, Coins, CheckSquare, Users, ArrowRight, Clock } from "lucide-react";

export default function Dashboard() {
  const { isLoggedIn, user, coins, transactions, tasks } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.replace("/");
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !user) return null;

  const reais = (coins / 100).toFixed(2).replace(".", ",");
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* Welcome */}
        <div className="card-glass rounded-2xl p-6 border border-border relative overflow-hidden">
          <div className="absolute right-4 top-4 text-6xl opacity-10">🪙</div>
          <p className="text-muted-foreground text-sm">Bem-vindo de volta,</p>
          <h1 className="text-2xl font-extrabold">{user.name} 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">Código de indicação: <span className="text-primary font-bold">{user.referralCode}</span></p>
        </div>

        {/* Balance card */}
        <div className="rounded-2xl p-6 border border-primary/30 bg-gradient-to-br from-primary/10 to-accent/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.72_0.2_145/0.08),transparent)]" />
          <div className="relative">
            <p className="text-muted-foreground text-sm mb-1">Saldo disponível</p>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-5xl font-extrabold shimmer-text">R${reais}</span>
              <span className="text-muted-foreground text-sm mb-1">= {coins.toLocaleString("pt-BR")} moedas</span>
            </div>
            <Link
              href="/saque"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold text-sm glow-green hover:opacity-90 transition-opacity"
            >
              <TrendingUp size={16} /> Sacar via PIX <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Coins, label: "Moedas totais", value: coins.toLocaleString("pt-BR"), color: "text-accent" },
            { icon: CheckSquare, label: "Tarefas feitas", value: `${completedTasks}/${tasks.length}`, color: "text-primary" },
            { icon: Clock, label: "Tarefas pendentes", value: String(pendingTasks), color: "text-muted-foreground" },
            { icon: Users, label: "Indicações", value: "0", color: "text-blue-400" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="card-glass rounded-xl p-4 border border-border">
              <Icon size={18} className={`${color} mb-2`} />
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-muted-foreground text-xs">{label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-3 gap-3">
          <Link href="/tarefas" className="card-glass rounded-2xl p-5 border border-border hover:border-primary/40 transition-colors group">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">Ver Tarefas</h3>
            <p className="text-muted-foreground text-sm">{pendingTasks} tarefas disponíveis</p>
          </Link>
          <Link href="/saque" className="card-glass rounded-2xl p-5 border border-border hover:border-accent/40 transition-colors group">
            <div className="text-3xl mb-3">💸</div>
            <h3 className="font-bold mb-1 group-hover:text-accent transition-colors">Sacar PIX</h3>
            <p className="text-muted-foreground text-sm">Mínimo R$5,00</p>
          </Link>
          <Link href="/guia-firebase" className="card-glass rounded-2xl p-5 border border-border hover:border-blue-400/40 transition-colors group">
            <div className="text-3xl mb-3">🔥</div>
            <h3 className="font-bold mb-1 group-hover:text-blue-400 transition-colors">Guia Firebase</h3>
            <p className="text-muted-foreground text-sm">Como integrar pagamentos</p>
          </Link>
        </div>

        {/* Recent transactions */}
        <div className="card-glass rounded-2xl p-5 border border-border">
          <h2 className="font-bold mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-primary" /> Histórico Recente</h2>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">Nenhuma transação ainda. Complete uma tarefa!</p>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${tx.type === "earn" ? "text-primary" : "text-destructive"}`}>
                      {tx.type === "earn" ? "+" : "-"}{tx.amount} 🪙
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      tx.status === "approved" ? "bg-primary/10 text-primary" :
                      tx.status === "pending" ? "bg-accent/10 text-accent" :
                      "bg-secondary text-muted-foreground"
                    }`}>{tx.status === "approved" ? "Aprovado" : tx.status === "pending" ? "Pendente" : "Pago"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
