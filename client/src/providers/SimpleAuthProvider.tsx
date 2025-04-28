import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

// Definição do tipo de usuário
interface User {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'teacher';
}

// Credenciais fixas para login
const USERS: User[] = [
  {
    id: '1',
    name: 'Administrador',
    username: 'admin',
    role: 'admin'
  },
  {
    id: '2',
    name: 'Professor',
    username: 'professor',
    role: 'teacher'
  }
];

// Senhas correspondentes aos usuários
const PASSWORDS: Record<string, string> = {
  'admin': 'admin123',
  'professor': 'professor123'
};

// Interface do contexto de autenticação
interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

// Valor padrão do contexto
const defaultValue: AuthContextType = {
  user: null,
  login: async () => false,
  logout: () => {},
  isLoading: false,
  error: null
};

// Criação do contexto
const AuthContext = createContext<AuthContextType>(defaultValue);

// Provider de autenticação
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar usuário do localStorage na inicialização
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Erro ao carregar usuário do localStorage');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Função de login
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    console.log(`Tentando login com: ${username} / ${password}`);
    
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verificar credenciais
      const userMatch = USERS.find(u => u.username === username);
      
      if (!userMatch) {
        console.error('Usuário não encontrado');
        setError('Usuário não encontrado');
        return false;
      }
      
      if (PASSWORDS[username] !== password) {
        console.error('Senha incorreta');
        setError('Senha incorreta');
        return false;
      }
      
      // Login bem-sucedido
      console.log('Login bem-sucedido:', userMatch);
      setUser(userMatch);
      localStorage.setItem('user', JSON.stringify(userMatch));
      return true;
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Ocorreu um erro durante o login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}