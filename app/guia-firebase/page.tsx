"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import Navbar from "@/components/app/Navbar";
import { CheckCircle, Copy, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

export default function GuiaFirebase() {
  const { isLoggedIn } = useAppStore();
  const router = useRouter();
  const [copied, setCopied] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    if (!isLoggedIn) router.replace("/");
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const steps = [
    {
      title: "1. Criar projeto no Firebase Console",
      emoji: "🔥",
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>Acesse o Firebase Console e crie um novo projeto:</p>
          <ol className="list-decimal list-inside space-y-2 text-foreground">
            <li>Vá em <strong>console.firebase.google.com</strong></li>
            <li>Clique em <strong>"Adicionar projeto"</strong></li>
            <li>Digite o nome do seu app (ex: <code className="bg-secondary px-1 rounded">ganhe-mais-app</code>)</li>
            <li>Ative o Google Analytics (opcional)</li>
            <li>Clique em <strong>"Criar projeto"</strong></li>
          </ol>
          <a
            href="https://console.firebase.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-400 hover:underline"
          >
            <ExternalLink size={14} /> Abrir Firebase Console
          </a>
        </div>
      ),
    },
    {
      title: "2. Pegar as credenciais da API (apiKey, projectId...)",
      emoji: "🔑",
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>Com o projeto criado, você precisa pegar as chaves de configuração:</p>
          <ol className="list-decimal list-inside space-y-2 text-foreground">
            <li>No painel do projeto, clique no ícone <strong>&lt;/&gt; (Web)</strong> para registrar o app</li>
            <li>Digite um apelido pro app (ex: <code className="bg-secondary px-1 rounded">web-app</code>)</li>
            <li>Clique em <strong>"Registrar app"</strong></li>
            <li>Copie o objeto <code className="bg-secondary px-1 rounded">firebaseConfig</code> que aparece</li>
          </ol>
          <p className="font-semibold text-foreground">Vai aparecer algo assim:</p>
          <CodeBlock
            code={`const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "ganhe-mais-app.firebaseapp.com",
  projectId: "ganhe-mais-app",
  storageBucket: "ganhe-mais-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
}`}
            id="config"
            copied={copied}
            onCopy={copy}
          />
          <p className="text-yellow-400">⚠️ Nunca compartilhe sua <code>apiKey</code> publicamente. Coloque em variáveis de ambiente (<code>.env</code>).</p>
        </div>
      ),
    },
    {
      title: "3. Instalar o Firebase SDK no projeto",
      emoji: "📦",
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>No terminal do seu projeto Next.js:</p>
          <CodeBlock code="npm install firebase" id="install" copied={copied} onCopy={copy} />
          <p>Crie o arquivo <code className="bg-secondary px-1 rounded">lib/firebase.ts</code>:</p>
          <CodeBlock
            code={`import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);`}
            id="firebase-ts"
            copied={copied}
            onCopy={copy}
          />
        </div>
      ),
    },
    {
      title: "4. Estrutura do Firestore para usuários e saldos",
      emoji: "🗄️",
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>No Firebase Console, ative o <strong>Firestore Database</strong>. A estrutura recomendada é:</p>
          <CodeBlock
            code={`// Coleção: users
// Documento: {userId}
{
  name: "João Silva",
  email: "joao@gmail.com",
  pixKey: "11999887766",
  coins: 1500,
  createdAt: Timestamp,
  referralCode: "ABC12345"
}

// Coleção: transactions
// Documento: {transactionId}
{
  userId: "abc123",
  type: "earn" | "withdraw",
  amount: 500,
  description: "Tarefa: Assistir vídeo",
  status: "pending" | "approved" | "paid",
  createdAt: Timestamp
}

// Coleção: withdrawRequests
// Documento: {requestId}
{
  userId: "abc123",
  pixKey: "11999887766",
  coins: 500,
  amountBRL: 5.00,
  status: "pending" | "processing" | "paid",
  createdAt: Timestamp
}`}
            id="structure"
            copied={copied}
            onCopy={copy}
          />
        </div>
      ),
    },
    {
      title: "5. Salvar saldo do usuário no Firestore",
      emoji: "💾",
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>Para salvar e atualizar o saldo de moedas:</p>
          <CodeBlock
            code={`import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Adicionar moedas quando o usuário completa uma tarefa
async function addCoins(userId: string, amount: number, description: string) {
  // Atualiza o saldo do usuário
  await updateDoc(doc(db, 'users', userId), {
    coins: increment(amount)
  });

  // Cria um registro de transação
  await addDoc(collection(db, 'transactions'), {
    userId,
    type: 'earn',
    amount,
    description,
    status: 'approved',
    createdAt: serverTimestamp()
  });
}

// Exemplo de uso:
await addCoins(user.uid, 50, 'Tarefa: Assistir vídeo');`}
            id="save-coins"
            copied={copied}
            onCopy={copy}
          />
        </div>
      ),
    },
    {
      title: "6. Criar solicitação de saque (PIX)",
      emoji: "💸",
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>Quando o usuário clica em "Sacar", salve no Firestore:</p>
          <CodeBlock
            code={`import { collection, addDoc, updateDoc, doc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

async function requestWithdraw(userId: string, pixKey: string, coins: number) {
  const amountBRL = coins / 100; // 100 moedas = R$1,00

  if (coins < 500) throw new Error('Mínimo 500 moedas (R$5,00)');

  // Desconta as moedas do saldo
  await updateDoc(doc(db, 'users', userId), {
    coins: increment(-coins)
  });

  // Cria a solicitação de saque
  const ref = await addDoc(collection(db, 'withdrawRequests'), {
    userId,
    pixKey,
    coins,
    amountBRL,
    status: 'pending',
    createdAt: serverTimestamp()
  });

  console.log('Saque solicitado! ID:', ref.id);
  return ref.id;
}`}
            id="withdraw"
            copied={copied}
            onCopy={copy}
          />
        </div>
      ),
    },
    {
      title: "7. Painel Admin: aprovar saques e enviar PIX",
      emoji: "👨‍💼",
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>Para pagar os usuários, você (admin) acompanha as solicitações no Firestore e processa o PIX manualmente ou via API do seu banco.</p>
          <CodeBlock
            code={`// Página admin: listar saques pendentes
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

async function getPendingWithdraws() {
  const q = query(
    collection(db, 'withdrawRequests'),
    where('status', '==', 'pending')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Marcar como pago após enviar o PIX
async function markAsPaid(requestId: string) {
  await updateDoc(doc(db, 'withdrawRequests', requestId), {
    status: 'paid',
    paidAt: serverTimestamp()
  });
}`}
            id="admin"
            copied={copied}
            onCopy={copy}
          />
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mt-2">
            <p className="text-blue-300 font-semibold mb-1">💡 Como enviar o PIX automaticamente?</p>
            <p className="text-blue-200 text-xs">Para pagar automaticamente via PIX, use a API do seu banco (ex: Mercado Pago, PicPay, EFI Bank ou Itaú). O fluxo é: Firebase detecta saque pendente → Cloud Function chama a API do banco → PIX enviado → status atualizado para "paid".</p>
          </div>
        </div>
      ),
    },
    {
      title: "8. Cloud Function para pagamento automático (opcional)",
      emoji: "⚡",
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>Para automatizar totalmente o pagamento, use Firebase Cloud Functions:</p>
          <CodeBlock
            code={`// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

admin.initializeApp();

// Dispara quando um novo saque é criado
export const processWithdraw = functions.firestore
  .document('withdrawRequests/{requestId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const { pixKey, amountBRL, userId } = data;

    try {
      // Chama a API do Mercado Pago (exemplo)
      const response = await axios.post(
        'https://api.mercadopago.com/v1/payments',
        {
          transaction_amount: amountBRL,
          payment_method_id: 'pix',
          payer: { email: pixKey }
        },
        {
          headers: {
            Authorization: \`Bearer \${process.env.MP_ACCESS_TOKEN}\`
          }
        }
      );

      // Atualiza status para pago
      await snap.ref.update({
        status: 'paid',
        paymentId: response.data.id,
        paidAt: admin.firestore.FieldValue.serverTimestamp()
      });

    } catch (error) {
      await snap.ref.update({ status: 'error' });
    }
  });`}
            id="cloud-fn"
            copied={copied}
            onCopy={copy}
          />
        </div>
      ),
    },
    {
      title: "9. Variáveis de ambiente (.env)",
      emoji: "🔒",
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>Crie um arquivo <code className="bg-secondary px-1 rounded">.env.local</code> na raiz do projeto:</p>
          <CodeBlock
            code={`# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef

# API do banco para pagamento PIX (ex: Mercado Pago)
MP_ACCESS_TOKEN=APP_USR-XXXXXXXXXX`}
            id="env"
            copied={copied}
            onCopy={copy}
          />
          <p className="text-yellow-400">⚠️ Adicione <code>.env.local</code> ao <code>.gitignore</code> para não vazar suas chaves!</p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">🔥 Guia Firebase</h1>
          <p className="text-muted-foreground text-sm mt-1">Aprenda a integrar Firebase e pagar seus usuários via PIX</p>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <p className="text-blue-300 font-semibold mb-1">📚 O que você vai aprender</p>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>✅ Criar projeto e pegar as chaves da API do Firebase</li>
            <li>✅ Configurar banco de dados Firestore para usuários e saldos</li>
            <li>✅ Salvar ganhos e solicitar saques via código</li>
            <li>✅ Processar pagamentos PIX automáticos com Cloud Functions</li>
          </ul>
        </div>

        {steps.map((step, i) => (
          <div key={i} className="card-glass rounded-2xl border border-border overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/20 transition-colors"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{step.emoji}</span>
                <span className="font-bold">{step.title}</span>
              </div>
              <div className="flex items-center gap-2">
                {open === i ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
              </div>
            </button>
            {open === i && (
              <div className="px-5 pb-5 border-t border-border pt-4">
                {step.content}
              </div>
            )}
          </div>
        ))}

        <div className="card-glass rounded-2xl p-6 border border-primary/30 text-center">
          <div className="text-3xl mb-3">🚀</div>
          <h3 className="font-bold text-lg mb-2">Resumo do Fluxo Completo</h3>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            {["Usuário cadastra", "→", "Faz tarefas", "→", "Acumula moedas no Firestore", "→", "Solicita saque", "→", "Cloud Function envia PIX", "→", "Usuário recebe! 💸"].map((s, i) => (
              <span key={i} className={s === "→" ? "text-muted-foreground" : "bg-secondary px-2 py-1 rounded-lg font-medium"}>{s}</span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function CodeBlock({ code, id, copied, onCopy }: { code: string; id: string; copied: string | null; onCopy: (t: string, k: string) => void }) {
  return (
    <div className="relative">
      <pre className="bg-secondary/50 border border-border rounded-xl p-4 text-xs text-foreground overflow-x-auto leading-relaxed font-mono">
        {code}
      </pre>
      <button
        onClick={() => onCopy(code, id)}
        className="absolute top-2 right-2 flex items-center gap-1 text-xs bg-secondary border border-border px-2 py-1 rounded-lg hover:bg-border transition-colors"
      >
        {copied === id ? <><CheckCircle size={12} className="text-primary" /> Copiado!</> : <><Copy size={12} /> Copiar</>}
      </button>
    </div>
  );
}
