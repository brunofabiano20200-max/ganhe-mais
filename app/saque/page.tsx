"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import Navbar from "@/components/app/Navbar";
import { CheckCircle, AlertCircle, Coins, ArrowRight } from "lucide-react";

const MIN_COINS = 500;

export default function Saque() {
  const { isLoggedIn, user, coins, transactions, requestWithdraw } = useAppStore();
  const router = useRouter();
  const [pixKey, setPixKey] = useState("");
  const [amount, setAmount] = useState(500);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) router.replace("/");
    if (user?.pixKey) setPixKey(user.pixKey);
  }, [isLoggedIn, router, user]);

  if (!isLoggedIn) return null;

  const reais = (coins / 100).toFixed(2).replace(".", ",");
  const withdrawReais = (amount / 100).toFixed(2).replace(".", ",");
  const canWithdraw = coins >= MIN_COINS && pixKey.trim().length > 5;

  async function handleWithdraw(e: React.FormEvent) {
    e.preventDefault();
    if (!canWithdraw) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    requestWithdraw(pixKey.trim(), amount);
    setSuccess(true);
    setLoading(false);
  }

  const withdrawHistory = transactions.filter((t) => t.type === "withdraw");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        <div>
          <h1 className="text-2xl font-extrabold">Solicitar Saque</h1>
          <p className="text-muted-foreground text-sm mt-1">Converta suas moedas em dinheiro via PIX</p>
        </div>

        {/* Balance */}
        <div className="rounded-2xl p-6 border border-primary/30 bg-gradient-to-br from-primary/10 to-accent/5">
          <p className="text-muted-foreground text-sm">Saldo disponível</p>
          <p className="text-4xl font-extrabold shimmer-text">R${reais}</p>
          <p className="text-muted-foreground text-sm mt-1">{coins.toLocaleString("pt-BR")} moedas · mínimo R$5,00 ({MIN_COINS} moedas)</p>
        </div>

        {coins < MIN_COINS && (
          <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-xl p-4">
            <AlertCircle size={18} className="text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Saldo insuficiente</p>
              <p className="text-muted-foreground text-sm">Você precisa de pelo menos {MIN_COINS} moedas para sacar. Complete mais tarefas!</p>
            </div>
          </div>
        )}

        {success ? (
          <div className="card-glass rounded-2xl p-8 border border-primary/30 text-center">
            <CheckCircle size={48} className="text-primary mx-auto mb-3" />
            <h3 className="text-xl font-extrabold mb-2">Saque Solicitado! 🎉</h3>
            <p className="text-muted-foreground">Seu PIX de <strong className="text-primary">R${withdrawReais}</strong> foi enviado para <strong>{pixKey}</strong></p>
            <p className="text-muted-foreground text-sm mt-2">Processamento em até 24 horas úteis.</p>
            <button onClick={() => setSuccess(false)} className="mt-5 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity">
              Novo Saque
            </button>
          </div>
        ) : (
          <form onSubmit={handleWithdraw} className="card-glass rounded-2xl p-6 border border-border space-y-5">
            <h2 className="font-bold">Dados do PIX</h2>

            <div>
              <label className="block text-sm font-medium mb-1.5">Chave PIX (CPF, e-mail, telefone ou aleatória)</label>
              <input
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="Ex: 11999887766 ou seuemail@gmail.com"
                required
                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Quantidade de moedas</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={MIN_COINS}
                  max={coins}
                  step={100}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  disabled={coins < MIN_COINS}
                  className="flex-1 accent-primary"
                />
                <div className="text-right min-w-[80px]">
                  <p className="font-bold text-accent">{amount.toLocaleString("pt-BR")}</p>
                  <p className="text-xs text-muted-foreground">moedas</p>
                </div>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-muted-foreground">Você recebe:</span>
                <span className="font-bold text-primary">R${withdrawReais}</span>
              </div>
            </div>

            <div className="bg-secondary/30 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Moedas a sacar</span><span className="font-medium">{amount.toLocaleString("pt-BR")} 🪙</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Taxa (0%)</span><span className="font-medium text-primary">Grátis</span></div>
              <div className="flex justify-between border-t border-border pt-2"><span className="font-bold">Total a receber</span><span className="font-extrabold text-primary">R${withdrawReais}</span></div>
            </div>

            <button
              type="submit"
              disabled={!canWithdraw || loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold glow-green hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {loading ? "Processando..." : <><Coins size={16} /> Sacar R${withdrawReais} via PIX <ArrowRight size={15} /></>}
            </button>
          </form>
        )}

        {/* History */}
        {withdrawHistory.length > 0 && (
          <div className="card-glass rounded-2xl p-5 border border-border">
            <h2 className="font-bold mb-4">Histórico de Saques</h2>
            <div className="space-y-3">
              {withdrawHistory.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-destructive">-{tx.amount} 🪙</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${tx.status === "pending" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
                      {tx.status === "pending" ? "Pendente" : "Pago"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
