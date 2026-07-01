"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import Navbar from "@/components/app/Navbar";
import { CheckCircle, Copy, ExternalLink, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

// ── helpers ──────────────────────────────────────────────────────────────────
function CodeBlock({ code, id, copied, onCopy }: { code: string; id: string; copied: string | null; onCopy: (t: string, k: string) => void }) {
  return (
    <div className="relative mt-3">
      <pre className="bg-[oklch(0.08_0.01_240)] border border-border rounded-xl p-4 text-xs text-foreground overflow-x-auto leading-relaxed font-mono whitespace-pre">
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

function Step({ num, emoji, title, children, open, onToggle }: { num: number; emoji: string; title: string; children: React.ReactNode; open: boolean; onToggle: () => void }) {
  return (
    <div className="card-glass rounded-2xl border border-border overflow-hidden">
      <button className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/20 transition-colors" onClick={onToggle}>
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-primary/20 text-primary font-extrabold text-sm flex items-center justify-center">{num}</span>
          <span className="text-xl">{emoji}</span>
          <span className="font-bold">{title}</span>
        </div>
        {open ? <ChevronUp size={16} className="text-muted-foreground flex-shrink-0" /> : <ChevronDown size={16} className="text-muted-foreground flex-shrink-0" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-border pt-4 text-sm text-muted-foreground space-y-3">{children}</div>}
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function ApiPagamento() {
  const { isLoggedIn } = useAppStore();
  const router = useRouter();
  const [copied, setCopied] = useState<string | null>(null);
  const [open, setOpen] = useState<number>(0);

  useEffect(() => { if (!isLoggedIn) router.replace("/"); }, [isLoggedIn, router]);
  if (!isLoggedIn) return null;

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">🔥 Como pegar a API do Firebase para pagar usuários</h1>
          <p className="text-muted-foreground text-sm mt-1">Guia completo: do zero até o PIX caindo na conta do usuário</p>
        </div>

        {/* Aviso importante */}
        <div className="flex gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <AlertTriangle size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-300 font-semibold text-sm">Importante entender</p>
            <p className="text-yellow-200/80 text-xs mt-1">O Firebase <strong>não envia PIX diretamente</strong>. Ele é o banco de dados onde você guarda o saldo dos usuários. Para <em>enviar o PIX de verdade</em>, você usa a API de um banco/gateway (Mercado Pago, EFI, etc.) chamado por uma <strong>Cloud Function</strong> do Firebase. Este guia cobre os dois.</p>
          </div>
        </div>

        {/* Fluxo visual */}
        <div className="card-glass rounded-2xl p-5 border border-border">
          <p className="font-bold mb-3 text-sm">🔄 Fluxo completo de pagamento</p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {["Usuário pede saque", "→", "Firebase Firestore\n(registra pedido)", "→", "Cloud Function\n(ativada automático)", "→", "API do Banco\n(envia o PIX)", "→", "Usuário recebe 💸"].map((s, i) => (
              s === "→"
                ? <span key={i} className="text-muted-foreground font-bold text-base">→</span>
                : <span key={i} className="bg-secondary border border-border px-3 py-2 rounded-lg font-medium text-center whitespace-pre-line leading-tight">{s}</span>
            ))}
          </div>
        </div>

        {/* Steps */}
        <StepsSection open={open} setOpen={setOpen} copy={copy} copied={copied} />

      </main>
    </div>
  );
}

function StepsSection({ open, setOpen, copy, copied }: { open: number; setOpen: (n: number) => void; copy: (t: string, k: string) => void; copied: string | null }) {
  const toggle = (n: number) => setOpen(open === n ? -1 : n);

  return (
    <div className="space-y-3">
      <Step num={1} emoji="🔥" title="Criar projeto e ATIVAR o Firestore" open={open === 0} onToggle={() => toggle(0)}>
        <StepFirestore />
      </Step>
      <Step num={2} emoji="🔑" title="Pegar as credenciais da API do Firebase" open={open === 1} onToggle={() => toggle(1)}>
        <StepCredenciais copy={copy} copied={copied} />
      </Step>
      <Step num={3} emoji="⚙️" title="Configurar Firebase no projeto Next.js" open={open === 2} onToggle={() => toggle(2)}>
        <StepConfigurar copy={copy} copied={copied} />
      </Step>
      <Step num={4} emoji="💾" title="Salvar pedido de saque no Firestore" open={open === 3} onToggle={() => toggle(3)}>
        <StepSalvarSaque copy={copy} copied={copied} />
      </Step>
      <Step num={5} emoji="⚡" title="Cloud Function: detectar e enviar PIX" open={open === 4} onToggle={() => toggle(4)}>
        <StepCloudFunction copy={copy} copied={copied} />
      </Step>
      <Step num={6} emoji="🔒" title="Proteger com Regras do Firestore" open={open === 5} onToggle={() => toggle(5)}>
        <StepRegras copy={copy} copied={copied} />
      </Step>
    </div>
  );
}

// ── Conteúdo de cada step ─────────────────────────────────────────────────────

function StepFirestore() {
  return (
    <>
      <p>Acesse o console do Firebase e siga os passos:</p>
      <ol className="list-decimal list-inside space-y-2 text-foreground">
        <li>Acesse <strong>console.firebase.google.com</strong></li>
        <li>Clique em <strong>"Criar um projeto"</strong> → dê um nome</li>
        <li>No menu lateral, clique em <strong>Build → Firestore Database</strong></li>
        <li>Clique em <strong>"Criar banco de dados"</strong></li>
        <li>Escolha <strong>"Iniciar no modo de produção"</strong></li>
        <li>Escolha a região <strong>southamerica-east1 (São Paulo)</strong></li>
        <li>Clique em <strong>"Ativar"</strong></li>
      </ol>
      <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-400 hover:underline text-xs mt-1">
        <ExternalLink size={12} /> Abrir Firebase Console
      </a>
    </>
  );
}

function StepCredenciais({ copy, copied }: { copy: (t: string, k: string) => void; copied: string | null }) {
  return (
    <>
      <p>No painel do seu projeto Firebase:</p>
      <ol className="list-decimal list-inside space-y-2 text-foreground">
        <li>Clique na engrenagem ⚙️ ao lado de <strong>"Visão geral do projeto"</strong></li>
        <li>Clique em <strong>"Configurações do projeto"</strong></li>
        <li>Role até <strong>"Seus apps"</strong> → clique em <strong>&lt;/&gt; (Web)</strong></li>
        <li>Registre o app com um apelido qualquer</li>
        <li>Copie o objeto <code className="bg-secondary px-1 rounded">firebaseConfig</code> que aparecer</li>
      </ol>
      <p className="text-foreground font-semibold mt-2">Vai aparecer exatamente assim:</p>
      <CodeBlock
        id="creds"
        copied={copied}
        onCopy={copy}
        code={`const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXX",        // ← esta é a API Key
  authDomain: "meu-app.firebaseapp.com",
  projectId: "meu-app",                           // ← ID do projeto
  storageBucket: "meu-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};`}
      />
      <div className="flex gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3 mt-1">
        <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
        <p className="text-red-300 text-xs">Nunca coloque essas chaves direto no código! Use variáveis de ambiente <code>.env.local</code> (próximo passo).</p>
      </div>
    </>
  );
}

function StepConfigurar({ copy, copied }: { copy: (t: string, k: string) => void; copied: string | null }) {
  return (
    <>
      <p>1. Instale o Firebase no projeto:</p>
      <CodeBlock id="install" copied={copied} onCopy={copy} code={`npm install firebase`} />

      <p className="mt-2">2. Crie o arquivo <code className="bg-secondary px-1 rounded">.env.local</code> na raiz com suas chaves:</p>
      <CodeBlock
        id="env"
        copied={copied}
        onCopy={copy}
        code={`NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=meu-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=meu-app
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=meu-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456`}
      />

      <p className="mt-2">3. Crie o arquivo <code className="bg-secondary px-1 rounded">lib/firebase.ts</code>:</p>
      <CodeBlock
        id="firebase-ts"
        copied={copied}
        onCopy={copy}
        code={`import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Evita criar duas instâncias no Next.js
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);`}
      />
    </>
  );
}

function StepSalvarSaque({ copy, copied }: { copy: (t: string, k: string) => void; copied: string | null }) {
  return (
    <>
      <p>Quando o usuário clica em <strong>"Sacar"</strong>, salve no Firestore assim:</p>
      <CodeBlock
        id="salvar-saque"
        copied={copied}
        onCopy={copy}
        code={`// app/actions/saque.ts  (Server Action ou chamada client-side)
import { db } from '@/lib/firebase';
import {
  doc, collection,
  addDoc, updateDoc,
  increment, serverTimestamp
} from 'firebase/firestore';

export async function solicitarSaque(
  userId: string,
  pixKey: string,
  moedas: number
) {
  const valorReais = moedas / 100; // 100 moedas = R$1,00

  if (moedas < 500) throw new Error('Mínimo 500 moedas (R$5,00)');

  // 1️⃣ Desconta as moedas do usuário
  await updateDoc(doc(db, 'usuarios', userId), {
    moedas: increment(-moedas)
  });

  // 2️⃣ Cria o pedido de saque — a Cloud Function vai detectar isso
  const ref = await addDoc(collection(db, 'saques'), {
    userId,
    pixKey,
    moedas,
    valorReais,
    status: 'pendente',   // ← Cloud Function muda para 'pago'
    criadoEm: serverTimestamp()
  });

  return ref.id; // ID do pedido
}`}
      />
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mt-2">
        <p className="text-blue-300 text-xs">💡 O campo <code>status: 'pendente'</code> é o gatilho! A Cloud Function escuta essa coleção e age assim que um novo documento aparece.</p>
      </div>
    </>
  );
}

function StepCloudFunction({ copy, copied }: { copy: (t: string, k: string) => void; copied: string | null }) {
  return (
    <>
      <p>A Cloud Function fica rodando no servidor do Firebase, escuta a coleção <code className="bg-secondary px-1 rounded">saques</code> e envia o PIX automaticamente.</p>

      <p className="text-foreground font-semibold mt-2">1. Instale as Cloud Functions:</p>
      <CodeBlock id="cf-install" copied={copied} onCopy={copy} code={`npm install -g firebase-tools
firebase init functions   # escolha TypeScript`} />

      <p className="text-foreground font-semibold mt-3">2. Código da função <code className="bg-secondary px-1 rounded">functions/src/index.ts</code>:</p>
      <CodeBlock
        id="cloud-fn"
        copied={copied}
        onCopy={copy}
        code={`import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import axios from 'axios';

admin.initializeApp();
const db = admin.firestore();

// Dispara toda vez que um novo documento é criado em /saques
export const processarSaque = functions.firestore
  .onDocumentCreated('saques/{saqueId}', async (event) => {
    const saque = event.data?.data();
    if (!saque || saque.status !== 'pendente') return;

    const { pixKey, valorReais, saqueId } = {
      pixKey: saque.pixKey as string,
      valorReais: saque.valorReais as number,
      saqueId: event.params.saqueId,
    };

    try {
      // ── Chama a API do Mercado Pago para enviar o PIX ──────────
      const resposta = await axios.post(
        'https://api.mercadopago.com/v1/payments',
        {
          transaction_amount: valorReais,
          payment_method_id: 'pix',
          payer: {
            email: pixKey,          // ou use chave PIX no campo key
            first_name: 'Usuario',
          },
          description: 'Saque GanheMais',
        },
        {
          headers: {
            Authorization: \`Bearer \${process.env.MP_ACCESS_TOKEN}\`,
            'Content-Type': 'application/json',
          },
        }
      );
      // ──────────────────────────────────────────────────────────

      // Atualiza o status no Firestore para 'pago'
      await db.doc(\`saques/\${saqueId}\`).update({
        status: 'pago',
        pagamentoId: resposta.data.id,
        pagoEm: admin.firestore.FieldValue.serverTimestamp(),
      });

    } catch (err: unknown) {
      // Se falhar, marca como erro (não desconta as moedas duas vezes)
      await db.doc(\`saques/\${saqueId}\`).update({ status: 'erro' });
      throw err;
    }
  });`}
      />

      <p className="text-foreground font-semibold mt-3">3. Variável de ambiente da função (no Firebase):</p>
      <CodeBlock
        id="cf-env"
        copied={copied}
        onCopy={copy}
        code={`# No terminal, define o token do Mercado Pago como variável secreta
firebase functions:secrets:set MP_ACCESS_TOKEN
# Cole o token quando pedir (começa com APP_USR-...)

# Depois faça o deploy:
firebase deploy --only functions`}
      />

      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mt-2">
        <p className="text-green-300 font-semibold text-xs mb-1">✅ Onde pegar o MP_ACCESS_TOKEN (Mercado Pago)?</p>
        <ol className="text-green-200 text-xs list-decimal list-inside space-y-1">
          <li>Acesse <strong>mercadopago.com.br</strong> e crie uma conta</li>
          <li>Vá em <strong>Seu negócio → Credenciais</strong></li>
          <li>Copie o <strong>Access Token de Produção</strong> (começa com <code>APP_USR-</code>)</li>
          <li>Cole no comando <code>firebase functions:secrets:set</code> acima</li>
        </ol>
      </div>
    </>
  );
}

function StepRegras({ copy, copied }: { copy: (t: string, k: string) => void; copied: string | null }) {
  return (
    <>
      <p>No Firebase Console → Firestore → <strong>Regras</strong>, cole isso para proteger os dados:</p>
      <CodeBlock
        id="rules"
        copied={copied}
        onCopy={copy}
        code={`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Usuário só lê/edita o próprio perfil
    match /usuarios/{userId} {
      allow read, update: if request.auth != null
                          && request.auth.uid == userId;
      allow create: if request.auth != null;
    }

    // Usuário só cria e lê os próprios saques
    match /saques/{saqueId} {
      allow create: if request.auth != null
                    && request.resource.data.userId == request.auth.uid;
      allow read:   if request.auth != null
                    && resource.data.userId == request.auth.uid;
      // Só a Cloud Function (admin) pode atualizar o status
      allow update, delete: if false;
    }
  }
}`}
      />
      <p className="text-xs text-yellow-300">⚠️ Sem essas regras, qualquer pessoa pode ler o saldo de outro usuário!</p>
    </>
  );
}
