import { db } from './firebase';
import {
  doc, collection,
  setDoc, getDoc, updateDoc, addDoc,
  increment, serverTimestamp, query, where, getDocs, orderBy, limit,
} from 'firebase/firestore';

// ── Tipos ──────────────────────────────────────────────────────────────────
export type FSUser = {
  name: string;
  email: string;
  pixKey: string;
  moedas: number;
  referralCode: string;
  criadoEm?: unknown;
};

export type FSSaque = {
  userId: string;
  pixKey: string;
  moedas: number;
  valorReais: number;
  status: 'pendente' | 'pago' | 'erro';
  criadoEm?: unknown;
};

export type FSTransacao = {
  userId: string;
  tipo: 'ganhou' | 'saque';
  moedas: number;
  descricao: string;
  status: 'aprovado' | 'pendente';
  criadoEm?: unknown;
};

// ── Usuários ───────────────────────────────────────────────────────────────

/** Cria ou atualiza o perfil do usuário no Firestore */
export async function salvarUsuario(userId: string, dados: Partial<FSUser>) {
  await setDoc(doc(db, 'usuarios', userId), {
    ...dados,
    criadoEm: serverTimestamp(),
  }, { merge: true });
}

/** Busca os dados do usuário */
export async function buscarUsuario(userId: string): Promise<FSUser | null> {
  const snap = await getDoc(doc(db, 'usuarios', userId));
  return snap.exists() ? (snap.data() as FSUser) : null;
}

/** Adiciona moedas ao usuário e registra a transação */
export async function adicionarMoedas(userId: string, moedas: number, descricao: string) {
  await updateDoc(doc(db, 'usuarios', userId), {
    moedas: increment(moedas),
  });
  await addDoc(collection(db, 'transacoes'), {
    userId,
    tipo: 'ganhou',
    moedas,
    descricao,
    status: 'aprovado',
    criadoEm: serverTimestamp(),
  } satisfies FSTransacao);
}

// ── Saques ─────────────────────────────────────────────────────────────────

/** Registra pedido de saque — desconta moedas e cria documento na coleção saques */
export async function solicitarSaque(userId: string, pixKey: string, moedas: number) {
  if (moedas < 500) throw new Error('Mínimo 500 moedas (R$5,00)');

  const valorReais = parseFloat((moedas / 100).toFixed(2));

  // 1. Desconta as moedas
  await updateDoc(doc(db, 'usuarios', userId), {
    moedas: increment(-moedas),
    pixKey,
  });

  // 2. Cria o pedido — a Cloud Function vai detectar e enviar o PIX
  const ref = await addDoc(collection(db, 'saques'), {
    userId,
    pixKey,
    moedas,
    valorReais,
    status: 'pendente',
    criadoEm: serverTimestamp(),
  } satisfies FSSaque);

  // 3. Registra na lista de transações
  await addDoc(collection(db, 'transacoes'), {
    userId,
    tipo: 'saque',
    moedas,
    descricao: `Saque PIX para ${pixKey}`,
    status: 'pendente',
    criadoEm: serverTimestamp(),
  } satisfies FSTransacao);

  return ref.id;
}

/** Busca histórico de transações do usuário */
export async function buscarTransacoes(userId: string) {
  const q = query(
    collection(db, 'transacoes'),
    where('userId', '==', userId),
    orderBy('criadoEm', 'desc'),
    limit(20),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as (FSTransacao & { id: string })[];
}

/** Busca histórico de saques do usuário */
export async function buscarSaques(userId: string) {
  const q = query(
    collection(db, 'saques'),
    where('userId', '==', userId),
    orderBy('criadoEm', 'desc'),
    limit(10),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as (FSSaque & { id: string })[];
}
