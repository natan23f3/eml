import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import loginData from '../loginData.json';

// Tipo de usuário
type User = {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'teacher';
};

// Interface do contexto de autenticação
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Criação do contexto com valores padrão
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => false,
  logout: () => {}
});

// Provider que fornece o contexto de autenticação
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Carrega usuário do localStorage quando o componente monta
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Erro ao carregar usuário do localStorage');
        localStorage.removeItem('currentUser');
      }
    }
  }, []);
  
  // Função de login
  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // Log para debug
      console.log(`Tentando login com: ${username} / ${password}`);
      
      // Simula tempo de resposta
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Busca o usuário
      const foundUser = loginData.users.find(
        u => u.username === username && u.password === password
      );
      
      if (foundUser) {
        // Remove a senha antes de armazenar
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword as User);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        console.log('Login bem-sucedido:', userWithoutPassword);
        return true;
      } else {
        console.log('Usuário ou senha incorretos');
        setError('Usuário ou senha incorretos');
        return false;
      }
    } catch (e) {
      console.error('Erro no login:', e);
      setError('Ocorreu um erro no login. Tente novamente.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Função de logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };
  
  // Valor do contexto
  const value = {
    user,
    loading,
    error,
    login,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}