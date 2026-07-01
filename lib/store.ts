import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Task = {
  id: string;
  title: string;
  description: string;
  coins: number;
  type: 'video' | 'form' | 'referral' | 'social' | 'daily';
  completed: boolean;
  icon: string;
};

export type Transaction = {
  id: string;
  type: 'earn' | 'withdraw';
  amount: number;
  description: string;
  date: string;
  status: 'pending' | 'approved' | 'paid';
};

export type User = {
  name: string;
  email: string;
  pixKey: string;
  referralCode: string;
  avatar: string;
};

type AppState = {
  isLoggedIn: boolean;
  user: User | null;
  coins: number;
  transactions: Transaction[];
  tasks: Task[];
  referrals: number;
  login: (name: string, email: string) => void;
  logout: () => void;
  completeTask: (taskId: string) => void;
  requestWithdraw: (pixKey: string, amount: number) => void;
  updatePixKey: (key: string) => void;
};

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Assistir vídeo patrocinado', description: 'Assista 30 segundos e ganhe moedas', coins: 50, type: 'video', completed: false, icon: '🎬' },
  { id: '2', title: 'Preencher pesquisa rápida', description: 'Responda 5 perguntas simples', coins: 120, type: 'form', completed: false, icon: '📋' },
  { id: '3', title: 'Indicar um amigo', description: 'Seu amigo se cadastra e você ganha', coins: 300, type: 'referral', completed: false, icon: '👥' },
  { id: '4', title: 'Seguir no Instagram', description: 'Siga nossa página parceira', coins: 80, type: 'social', completed: false, icon: '📸' },
  { id: '5', title: 'Check-in diário', description: 'Entre todo dia e ganhe bônus', coins: 30, type: 'daily', completed: false, icon: '📅' },
  { id: '6', title: 'Baixar aplicativo parceiro', description: 'Instale e abra uma vez', coins: 200, type: 'form', completed: false, icon: '📱' },
  { id: '7', title: 'Compartilhar no WhatsApp', description: 'Compartilhe seu link de indicação', coins: 60, type: 'social', completed: false, icon: '💬' },
  { id: '8', title: 'Assistir 3 vídeos', description: 'Complete a playlist de vídeos curtos', coins: 150, type: 'video', completed: false, icon: '▶️' },
];

function generateCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      coins: 0,
      transactions: [],
      tasks: INITIAL_TASKS,
      referrals: 0,

      login: (name, email) => {
        const code = generateCode();
        set({
          isLoggedIn: true,
          user: { name, email, pixKey: '', referralCode: code, avatar: name[0].toUpperCase() },
          coins: 150,
          transactions: [
            { id: 't1', type: 'earn', amount: 150, description: 'Bônus de boas-vindas 🎉', date: new Date().toLocaleDateString('pt-BR'), status: 'approved' },
          ],
        });
      },

      logout: () => set({ isLoggedIn: false, user: null, coins: 0, transactions: [], tasks: INITIAL_TASKS }),

      completeTask: (taskId) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId);
          if (!task || task.completed) return state;
          const tx: Transaction = {
            id: `tx-${Date.now()}`,
            type: 'earn',
            amount: task.coins,
            description: `Tarefa: ${task.title}`,
            date: new Date().toLocaleDateString('pt-BR'),
            status: 'approved',
          };
          return {
            coins: state.coins + task.coins,
            tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, completed: true } : t)),
            transactions: [tx, ...state.transactions],
          };
        }),

      requestWithdraw: (pixKey, amount) =>
        set((state) => {
          if (state.coins < amount) return state;
          const tx: Transaction = {
            id: `tx-${Date.now()}`,
            type: 'withdraw',
            amount,
            description: `Saque PIX para ${pixKey}`,
            date: new Date().toLocaleDateString('pt-BR'),
            status: 'pending',
          };
          return {
            coins: state.coins - amount,
            transactions: [tx, ...state.transactions],
            user: state.user ? { ...state.user, pixKey } : null,
          };
        }),

      updatePixKey: (key) =>
        set((state) => ({
          user: state.user ? { ...state.user, pixKey: key } : null,
        })),
    }),
    { name: 'moneyapp-storage' }
  )
);
