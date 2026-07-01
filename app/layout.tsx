import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AgentationGuard } from "@/components/AgentationGuard";
import { HappySeedsWatermark } from "@/components/HappySeedsWatermark";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "GanheMais — Ganhe Dinheiro Online com Tarefas",
  description: "Complete tarefas simples, acumule moedas e saque via PIX. A plataforma mais confiável para ganhar dinheiro online no Brasil.",
  keywords: "ganhar dinheiro online, pix, tarefas pagas, renda extra",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${plusJakarta.variable} antialiased`}>
        {children}
        <HappySeedsWatermark />
        <AgentationGuard />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
