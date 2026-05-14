import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { getDatabase, ref, push, set, get, query, orderByChild, equalTo } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// ===== AUTH =====
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
};

export const signInWithPhone = async (phoneNumber: string) => {
  const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
  return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
};

// ===== ORDERS =====
export interface Order {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  productId: string;
  productName: string;
  packageName: string;
  price: number;
  priceMMK: number;
  gameId: string;
  serverId?: string;
  verifiedName?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: number;
}

// Save order to Firebase
export const saveOrder = async (order: Omit<Order, 'id'>): Promise<string> => {
  const ordersRef = ref(db, 'orders');
  const newOrderRef = push(ordersRef);
  await set(newOrderRef, { ...order, createdAt: Date.now() });
  return newOrderRef.key!;
};

// Get orders by user
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const ordersRef = ref(db, 'orders');
  const userOrdersQuery = query(ordersRef, orderByChild('userId'), equalTo(userId));
  const snapshot = await get(userOrdersQuery);
  if (!snapshot.exists()) return [];
  const orders: Order[] = [];
  snapshot.forEach(child => {
    orders.push({ id: child.key!, ...child.val() });
  });
  return orders.sort((a, b) => b.createdAt - a.createdAt);
};

// Get all orders (admin)
export const getAllOrders = async (): Promise<Order[]> => {
  const ordersRef = ref(db, 'orders');
  const snapshot = await get(ordersRef);
  if (!snapshot.exists()) return [];
  const orders: Order[] = [];
  snapshot.forEach(child => {
    orders.push({ id: child.key!, ...child.val() });
  });
  return orders.sort((a, b) => b.createdAt - a.createdAt);
};

// Update order status (admin)
export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  const orderRef = ref(db, `orders/${orderId}/status`);
  await set(orderRef, status);
};

// ===== PRODUCTS (admin editable) =====
export const saveProduct = async (product: any) => {
  const productRef = ref(db, `products/${product.id}`);
  await set(productRef, product);
};

export const getProducts = async () => {
  const productsRef = ref(db, 'products');
  const snapshot = await get(productsRef);
  if (!snapshot.exists()) return null;
  return snapshot.val();
};

// ===== USD TO MMK RATE =====
export const USD_TO_MMK = 3500;

export const formatMMK = (usd: number): string => {
  const mmk = Math.round(usd * USD_TO_MMK);
  return mmk.toLocaleString() + ' Ks';
};

export { auth, app, db };

declare global {
  interface Window { recaptchaVerifier: any; }
}
