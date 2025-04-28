// Versão mínima apenas com HTML básico
function App() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ padding: '20px', maxWidth: '400px', textAlign: 'center', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>MusicSchool Pro</h1>
        <p style={{ marginTop: '16px' }}>Sistema de Gestão para Escolas de Música</p>
        <div style={{ marginTop: '20px' }}>
          <div style={{ width: '30px', height: '30px', margin: '0 auto', border: '3px solid #ddd', borderTopColor: '#3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
        <p style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>Carregando aplicação...</p>
        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
}

export default App;
