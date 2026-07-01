"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { CheckCircle, Star, Zap, Shield, Users, TrendingUp } from "lucide-react";

export default function Home() {
  const [step, setStep] = useState<"landing" | "register">("landing");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAppStore((s) => s.login);
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const router = useRouter();

  if (isLoggedIn) {
    router.replace("/dashboard");
    return null;
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    login(name.trim(), email.trim());
    router.push("/dashboard");
  }

  const stats = [
    { label: "Usuários ativos", value: "48.293", icon: Users },
    { label: "Saques realizados", value: "R$ 2,1M", icon: TrendingUp },
    { label: "Tarefas disponíveis", value: "120+", icon: Zap },
    { label: "Avaliação", value: "4.9 ★", icon: Star },
  ];

  const features = [
    { icon: "🎬", title: "Assista vídeos", desc: "Ganhe moedas por cada vídeo assistido" },
    { icon: "📋", title: "Pesquisas pagas", desc: "Responda formulários e acumule saldo" },
    { icon: "👥", title: "Indique amigos", desc: "Ganhe 300 moedas por indicação" },
    { icon: "💸", title: "Saque via PIX", desc: "Receba na hora direto no seu banco" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 card-glass border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-xl">
            <span className="text-2xl coin-anim">🪙</span>
            <span className="shimmer-text">GanheMais</span>
          </div>
          <button
            onClick={() => setStep("register")}
            className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity glow-green"
          >
            Cadastrar Grátis
          </button>
        </div>
      </header>

      <main className="pt-16">
        {step === "landing" ? (
          <>
            {/* Hero */}
            <section className="relative overflow-hidden py-20 px-4 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.72_0.2_145/0.12)_0%,transparent_70%)]" />
              <div className="relative max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                  <Zap size={14} /> Mais de 48 mil usuários já sacaram
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
                  Ganhe Dinheiro Real<br />
                  <span className="shimmer-text">Fazendo Tarefas Simples</span>
                </h1>
                <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                  Complete tarefas rápidas, acumule moedas e saque direto via PIX no seu banco. Grátis, simples e confiável.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setStep("register")}
                    className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg glow-green hover:opacity-90 transition-opacity"
                  >
                    🚀 Começar a Ganhar Agora
                  </button>
                  <button
                    onClick={() => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })}
                    className="px-8 py-4 rounded-xl border border-border text-foreground font-semibold text-lg hover:bg-secondary transition-colors"
                  >
                    Como funciona?
                  </button>
                </div>
                <p className="text-muted-foreground text-sm mt-4">
                  ✅ Grátis para sempre &nbsp;•&nbsp; ✅ Sem cartão de crédito &nbsp;•&nbsp; ✅ Saque mínimo R$5
                </p>
              </div>
            </section>

            {/* Stats */}
            <section className="py-10 px-4 border-y border-border">
              <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="card-glass rounded-xl p-4 text-center">
                    <Icon size={20} className="text-primary mx-auto mb-2" />
                    <p className="text-2xl font-extrabold text-foreground">{value}</p>
                    <p className="text-muted-foreground text-xs">{label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Features */}
            <section id="como-funciona" className="py-16 px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-extrabold text-center mb-3">Como Funciona</h2>
                <p className="text-muted-foreground text-center mb-10">4 passos simples para começar a ganhar</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {features.map((f, i) => (
                    <div key={i} className="card-glass rounded-2xl p-6 text-center hover:border-primary/40 transition-colors border border-border">
                      <div className="text-4xl mb-3">{f.icon}</div>
                      <h3 className="font-bold mb-1">{f.title}</h3>
                      <p className="text-muted-foreground text-sm">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section className="py-12 px-4 bg-secondary/20">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-extrabold text-center mb-8">O que dizem nossos usuários</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { name: "Ana S.", city: "São Paulo", text: "Saquei R$47 em uma semana! Simplesmente incrível 🤑", stars: 5 },
                    { name: "Carlos M.", city: "Belo Horizonte", text: "Fácil demais. Tarefas simples e PIX caiu na hora!", stars: 5 },
                    { name: "Letícia R.", city: "Fortaleza", text: "Já indiquei 12 amigos. Meu saldo cresce todo dia 💰", stars: 5 },
                  ].map((t, i) => (
                    <div key={i} className="card-glass rounded-2xl p-5 border border-border">
                      <div className="flex gap-0.5 mb-3">{Array.from({ length: t.stars }).map((_, j) => <Star key={j} size={14} className="fill-accent text-accent" />)}</div>
                      <p className="text-sm text-muted-foreground mb-3">"{t.text}"</p>
                      <p className="font-semibold text-sm">{t.name} <span className="text-muted-foreground font-normal">— {t.city}</span></p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-4 text-center">
              <div className="max-w-xl mx-auto">
                <h2 className="text-3xl font-extrabold mb-4">Pronto para começar?</h2>
                <p className="text-muted-foreground mb-6">Cadastro gratuito em 30 segundos. Ganhe R$1,50 de bônus só por se registrar.</p>
                <button
                  onClick={() => setStep("register")}
                  className="px-10 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg glow-green hover:opacity-90 transition-opacity w-full sm:w-auto"
                >
                  🎁 Criar Conta Grátis
                </button>
              </div>
            </section>
          </>
        ) : (
          /* Register Form */
          <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
              <div className="card-glass rounded-2xl p-8 border border-border">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3 coin-anim">🪙</div>
                  <h2 className="text-2xl font-extrabold">Criar Conta Grátis</h2>
                  <p className="text-muted-foreground text-sm mt-1">Ganhe R$1,50 de bônus de boas-vindas!</p>
                </div>

                <div className="bg-accent/10 border border-accent/30 rounded-xl p-3 mb-6 text-center">
                  <span className="text-accent font-bold text-sm">🎁 Bônus: 150 moedas = R$1,50 na sua conta</span>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Seu nome</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: João Silva"
                      required
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">E-mail</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@gmail.com"
                      required
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-base glow-green hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    {loading ? "Criando sua conta..." : "🚀 Cadastrar e Ganhar Agora"}
                  </button>
                </form>

                <div className="mt-4 space-y-2">
                  {["Cadastro 100% gratuito", "Saque mínimo R$5 via PIX", "Pagamento em até 24h"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle size={14} className="text-primary flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>

                <p className="text-center mt-4">
                  <button onClick={() => setStep("landing")} className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                    ← Voltar
                  </button>
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4 text-center text-muted-foreground text-sm">
        <p>© 2026 GanheMais — Plataforma de recompensas online</p>
        <p className="mt-1">Os pagamentos são processados via Firebase + PIX</p>
      </footer>
    </div>
  );
}
