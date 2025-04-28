import { useState } from 'react';

// Tela de login simplificada
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Simulando login bem-sucedido após 1.5 segundos
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f5f5' }}>
      <div style={{ padding: '30px', width: '400px', textAlign: 'center', background: 'white', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ width: '60px', height: '60px', margin: '0 auto', background: '#f0f9ff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 19C9 19.75 8.79 20 8 20H5C4.21 20 4 19.75 4 19V18C4 17.25 4.21 17 5 17H8C8.79 17 9 17.25 9 18V19Z" fill="#4299e1"/>
            <path d="M16 19C16 19.75 15.79 20 15 20H12C11.21 20 11 19.75 11 19V18C11 17.25 11.21 17 12 17H15C15.79 17 16 17.25 16 18V19Z" fill="#4299e1"/>
            <path d="M9 14C9 14.75 8.79 15 8 15H5C4.21 15 4 14.75 4 14V13C4 12.25 4.21 12 5 12H8C8.79 12 9 12.25 9 13V14Z" fill="#4299e1"/>
            <path d="M16 14C16 14.75 15.79 15 15 15H12C11.21 15 11 14.75 11 14V13C11 12.25 11.21 12 12 12H15C15.79 12 16 12.25 16 13V14Z" fill="#4299e1"/>
            <path d="M9 9C9 9.75 8.79 10 8 10H5C4.21 10 4 9.75 4 9V8C4 7.25 4.21 7 5 7H8C8.79 7 9 7.25 9 8V9Z" fill="#4299e1"/>
            <path d="M16 9C16 9.75 15.79 10 15 10H12C11.21 10 11 9.75 11 9V8C11 7.25 11.21 7 12 7H15C15.79 7 16 7.25 16 8V9Z" fill="#4299e1"/>
            <path d="M20 19C20 19.75 19.79 20 19 20H18C17.21 20 17 19.75 17 19V18C17 17.25 17.21 17 18 17H19C19.79 17 20 17.25 20 18V19Z" fill="#4299e1"/>
            <path d="M20 14C20 14.75 19.79 15 19 15H18C17.21 15 17 14.75 17 14V13C17 12.25 17.21 12 18 12H19C19.79 12 20 12.25 20 13V14Z" fill="#4299e1"/>
            <path d="M20 9C20 9.75 19.79 10 19 10H18C17.21 10 17 9.75 17 9V8C17 7.25 17.21 7 18 7H19C19.79 7 20 7.25 20 8V9Z" fill="#4299e1"/>
            <path d="M9 4C9 4.75 8.79 5 8 5H5C4.21 5 4 4.75 4 4V3C4 2.25 4.21 2 5 2H8C8.79 2 9 2.25 9 3V4Z" fill="#4299e1"/>
            <path d="M16 4C16 4.75 15.79 5 15 5H12C11.21 5 11 4.75 11 4V3C11 2.25 11.21 2 12 2H15C15.79 2 16 2.25 16 3V4Z" fill="#4299e1"/>
            <path d="M20 4C20 4.75 19.79 5 19 5H18C17.21 5 17 4.75 17 4V3C17 2.25 17.21 2 18 2H19C19.79 2 20 2.25 20 3V4Z" fill="#4299e1"/>
          </svg>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '20px' }}>MusicSchool Pro</h1>
        <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>Sistema de Gestão para Escolas de Música</p>
        
        <div style={{ marginTop: '30px', textAlign: 'left' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', textAlign: 'center' }}>Entre na sua conta</h2>
          
          <button 
            onClick={handleLogin}
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '12px', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'white', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              fontSize: '14px',
              cursor: isLoading ? 'default' : 'pointer',
              color: '#333',
              transition: 'background 0.2s'
            }}
          >
            {isLoading ? (
              <div style={{ width: '20px', height: '20px', marginRight: '10px', border: '2px solid #ddd', borderTopColor: '#3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            ) : (
              <svg width="20" height="20" style={{ marginRight: '10px' }} viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            {isLoading ? 'Entrando...' : 'Entrar com Google'}
          </button>
        </div>
        
        <p style={{ marginTop: '30px', fontSize: '12px', color: '#888' }}>
          Seguro e fácil de usar para gerenciar sua escola de música
        </p>
      </div>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          button:hover:not(:disabled) {
            background: #f8f8f8;
          }
        `}
      </style>
    </div>
  );
}

// Dashboard simplificado
function Dashboard() {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Dashboard</h1>
      <p style={{ marginTop: '10px' }}>Bem-vindo ao MusicSchool Pro!</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '30px' }}>
        {['Alunos', 'Aulas', 'Finanças', 'Relatórios'].map((item) => (
          <div key={item} style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '8px', 
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            flex: '1',
            minWidth: '200px'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>{item}</h2>
            <p style={{ marginTop: '10px', color: '#666' }}>Gerenciar {item.toLowerCase()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Aplicação principal
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return <Dashboard />;
}

export default App;
