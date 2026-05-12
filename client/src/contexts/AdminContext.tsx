import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';

interface AdminContextType {
  isAdminLoggedIn: boolean;
  adminUser: User | null;
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  logoutAdmin: () => Promise<void>;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_EMAILS = ['shinekoko555666@gmail.com'];

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && ADMIN_EMAILS.includes(user.email ?? '')) {
        setAdminUser(user);
        setIsAdminLoggedIn(true);
      } else {
        setAdminUser(null);
        setIsAdminLoggedIn(false);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (!ADMIN_EMAILS.includes(result.user.email ?? '')) {
        await signOut(auth);
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const logoutAdmin = async () => {
    await signOut(auth);
    setIsAdminLoggedIn(false);
    setAdminUser(null);
  };

  return (
    <AdminContext.Provider value={{ isAdminLoggedIn, adminUser, loginAdmin, logoutAdmin, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
}
