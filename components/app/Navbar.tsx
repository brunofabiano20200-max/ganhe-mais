"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Home, CheckSquare, DollarSign, Trophy, Zap, LogOut, Coins } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/tarefas", label: "Tarefas", icon: CheckSquare },
  { href: "/saque", label: "Sacar", icon: DollarSign },
  { href: "/ranking", label: "Ranking", icon: Trophy },
  { href: "/api-pagamento", label: "API Firebase", icon: Zap },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, coins, logout } = useAppStore();

  return (
    <header className="sticky top-0 z-50 card-glass border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-extrabold text-xl">
          <span className="text-2xl coin-anim">🪙</span>
          <span className="shimmer-text">GanheMais</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === href
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-accent/15 border border-accent/30 px-3 py-1.5 rounded-full">
            <Coins size={15} className="text-accent" />
            <span className="font-bold text-accent text-sm">{coins.toLocaleString("pt-BR")}</span>
          </div>
          {user && (
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-sm">
              {user.avatar}
            </div>
          )}
          <button
            onClick={logout}
            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex border-t border-border">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
              pathname === href ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </div>
    </header>
  );
}
