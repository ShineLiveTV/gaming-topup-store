import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, signInWithGoogle, signInWithPhone } from '@/lib/firebase';
import {
  signOut,
  onAuthStateChanged,
  User,
  ConfirmationResult
} from 'firebase/auth';

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<boolean>;
  loginWithPhone: (phoneNumber: string) => Promise<ConfirmationResult>;
  verifyOtp: (confirmationResult: ConfirmationResult, otp: string) => Promise<boolean>;
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

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const result = await signInWithGoogle();
      setUser(result.user);
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    }
  };

  const loginWithPhone = async (phoneNumber: string): Promise<ConfirmationResult> => {
    return await signInWithPhone(phoneNumber);
  };

  const verifyOtp = async (confirmationResult: ConfirmationResult, otp: string): Promise<boolean> => {
    try {
      const result = await confirmationResult.confirm(otp);
      setUser(result.user);
      return true;
    } catch (error) {
      console.error('OTP verification error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      isLoggedIn: !!user,
      isLoading,
      loginWithGoogle,
      loginWithPhone,
      verifyOtp,
      logout,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
