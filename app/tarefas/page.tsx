"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import Navbar from "@/components/app/Navbar";
import { CheckCircle, Lock, Coins, Clock } from "lucide-react";

export default function Tarefas() {
  const { isLoggedIn, tasks, completeTask, coins } = useAppStore();
  const router = useRouter();
  const [doing, setDoing] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) router.replace("/");
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  async function handleTask(taskId: string) {
    if (doing) return;
    setDoing(taskId);
    await new Promise((r) => setTimeout(r, 2000));
    completeTask(taskId);
    setDone(taskId);
    setDoing(null);
    setTimeout(() => setDone(null), 3000);
  }

  const typeColors: Record<string, string> = {
    video: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    form: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    referral: "bg-accent/10 text-accent border-accent/20",
    social: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    daily: "bg-primary/10 text-primary border-primary/20",
  };

  const typeLabels: Record<string, string> = {
    video: "Vídeo",
    form: "Formulário",
    referral: "Indicação",
    social: "Social",
    daily: "Diário",
  };

  const pending = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        <div>
          <h1 className="text-2xl font-extrabold">Tarefas Disponíveis</h1>
          <p className="text-muted-foreground text-sm mt-1">Complete tarefas e acumule moedas para sacar</p>
        </div>

        {/* Progress */}
        <div className="card-glass rounded-xl p-4 border border-border flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-medium">Progresso das tarefas</span>
              <span className="text-muted-foreground">{completed.length}/{tasks.length}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${(completed.length / tasks.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-accent/10 border border-accent/30 px-3 py-1.5 rounded-full">
            <Coins size={14} className="text-accent" />
            <span className="font-bold text-accent text-sm">{coins.toLocaleString("pt-BR")}</span>
          </div>
        </div>

        {/* Pending tasks */}
        {pending.length > 0 && (
          <div>
            <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wide mb-3">Disponíveis ({pending.length})</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {pending.map((task) => (
                <div key={task.id} className="card-glass rounded-2xl p-5 border border-border hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{task.icon}</span>
                      <div>
                        <h3 className="font-bold">{task.title}</h3>
                        <p className="text-muted-foreground text-xs mt-0.5">{task.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs border px-2 py-0.5 rounded-full ${typeColors[task.type]}`}>
                        {typeLabels[task.type]}
                      </span>
                      <span className="flex items-center gap-1 text-accent font-bold text-sm">
                        <Coins size={13} /> +{task.coins}
                      </span>
                    </div>
                    <button
                      onClick={() => handleTask(task.id)}
                      disabled={!!doing}
                      className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
                    >
                      {doing === task.id ? (
                        <><Clock size={13} className="animate-spin" /> Fazendo...</>
                      ) : (
                        <>Fazer tarefa ▶</>
                      )}
                    </button>
                  </div>
                  {done === task.id && (
                    <div className="mt-3 flex items-center gap-2 text-primary text-sm font-semibold">
                      <CheckCircle size={14} /> +{task.coins} moedas adicionadas! 🎉
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed tasks */}
        {completed.length > 0 && (
          <div>
            <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wide mb-3">Concluídas ({completed.length})</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {completed.map((task) => (
                <div key={task.id} className="rounded-2xl p-5 border border-border opacity-50 bg-secondary/10">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl grayscale">{task.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold line-through">{task.title}</h3>
                      <p className="text-muted-foreground text-xs">{task.description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-primary font-bold text-sm">
                      <CheckCircle size={14} /> +{task.coins}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pending.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="font-bold text-xl">Todas as tarefas concluídas!</h3>
            <p className="text-muted-foreground mt-1">Volte amanhã para novas tarefas ou faça seu saque.</p>
          </div>
        )}
      </main>
    </div>
  );
}
