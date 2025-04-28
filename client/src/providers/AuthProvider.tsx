import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { signInWithGoogle, logOut, auth } from '@/lib/firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  error: Error | null;
  signIn: () => void;
  signOut: () => Promise<void>;
}

// Create context with a default value that matches the shape, but is clearly a placeholder
// This helps with type checking without null checks everywhere
const defaultValue: AuthContextType = {
  user: null,
  loading: true,
  error: null,
  signIn: () => {
    console.error("AuthContext not initialized");
  },
  signOut: async () => {
    console.error("AuthContext not initialized");
  }
};

const AuthContext = createContext<AuthContextType>(defaultValue);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        console.log("Auth state changed", user ? "User logged in" : "No user");
        setUser(user);
        setLoading(false);
      },
      (error) => {
        console.error("Auth error:", error);
        setError(error);
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const signIn = () => {
    signInWithGoogle().catch(error => {
      console.error("Sign in error:", error);
      setError(error as Error);
    });
  };

  const signOut = async () => {
    try {
      await logOut();
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
      setError(error as Error);
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
