import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import {
  signOut,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      setUser({ ...result.user, displayName: name });
      return { success: true };
    } catch (error: any) {
      let msg = 'Register မအောင်မြင်ပါ';
      if (error.code === 'auth/email-already-in-use') msg = 'Email ကို အသုံးပြုပြီးသားဖြစ်နေသည်';
      else if (error.code === 'auth/weak-password') msg = 'Password အနည်းဆုံး ၆ လုံးထည့်ပါ';
      else if (error.code === 'auth/invalid-email') msg = 'Email မှားနေသည်';
      else if (error.code === 'auth/network-request-failed') msg = 'Internet ချိတ်ဆက်မှု စစ်ဆေးပါ';
      return { success: false, error: msg };
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      let msg = 'Login မအောင်မြင်ပါ';
      if (error.code === 'auth/user-not-found') msg = 'အကောင့် မတွေ့ပါ';
      else if (error.code === 'auth/wrong-password') msg = 'Password မှားနေသည်';
      else if (error.code === 'auth/invalid-credential') msg = 'Email သို့မဟုတ် Password မှားနေသည်';
      else if (error.code === 'auth/network-request-failed') msg = 'Internet ချိတ်ဆက်မှု စစ်ဆေးပါ';
      return { success: false, error: msg };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      return { success: true };
    } catch (error: any) {
      let msg = 'Google login မအောင်မြင်ပါ';
      if (error.code === 'auth/popup-closed-by-user') msg = 'Login ကို ပိတ်လိုက်သည်';
      else if (error.code === 'auth/network-request-failed') msg = 'Internet ချိတ်ဆက်မှု စစ်ဆေးပါ';
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <UserContext.Provider value={{
      user,
      isLoggedIn: !!user,
      isLoading,
      register,
      loginWithEmail,
      loginWithGoogle,
      logout,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}
