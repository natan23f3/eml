import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { 
  login as authLogin, 
  getUserFromStorage, 
  saveUserToStorage, 
  removeUserFromStorage,
  User
} from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Valor padrão do contexto
const defaultValue: AuthContextType = {
  user: null,
  loading: false,
  error: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false
};

const AuthContext = createContext<AuthContextType>(defaultValue);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Verificar no localStorage se há usuário salvo
  useEffect(() => {
    const savedUser = getUserFromStorage();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  // Função de login
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const authenticatedUser = await authLogin(email, password);
      
      if (authenticatedUser) {
        setUser(authenticatedUser);
        saveUserToStorage(authenticatedUser);
        return true;
      } else {
        setError('Credenciais inválidas');
        return false;
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Ocorreu um erro no login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    removeUserFromStorage();
  };

  // Valor do contexto
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
