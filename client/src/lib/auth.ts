// Credenciais padrão que funcionam mesmo sem banco de dados
const DEFAULT_USERS = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@musicschool.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Professor Demo',
    email: 'professor@musicschool.com',
    password: 'professor123',
    role: 'teacher',
  },
];

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

// Simula login com as credenciais padrão
export const login = async (email: string, password: string): Promise<User | null> => {
  console.log(`Tentando login com: ${email} / ${password}`);
  
  // Delay para simular API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Convertemos tudo para minúsculo para evitar problemas de comparação
  email = email.toLowerCase().trim();
  
  const user = DEFAULT_USERS.find(
    user => user.email.toLowerCase() === email && user.password === password
  );
  
  if (user) {
    console.log('Usuário encontrado:', user);
    // Remove a senha antes de retornar
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  
  console.error('Usuário não encontrado');
  return null;
};

// Salva usuário em localStorage
export const saveUserToStorage = (user: User): void => {
  try {
    localStorage.setItem('musicschool_user', JSON.stringify(user));
  } catch (error) {
    console.error('Erro ao salvar usuário no localStorage', error);
  }
};

// Recupera usuário do localStorage
export const getUserFromStorage = (): User | null => {
  try {
    const userJson = localStorage.getItem('musicschool_user');
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Erro ao recuperar usuário do localStorage', error);
    return null;
  }
};

// Remove usuário do localStorage
export const removeUserFromStorage = (): void => {
  localStorage.removeItem('musicschool_user');
};