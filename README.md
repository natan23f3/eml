# MusicSchool Pro - Sistema de Gestão para Escolas de Música

Sistema completo para gerenciamento de escolas de música, com controle de alunos, professores, aulas, pagamentos e relatórios.

## Funcionalidades

- 👥 **Gerenciamento de Alunos**: Cadastro, histórico, acompanhamento
- 👨‍🏫 **Gerenciamento de Professores**: Cadastro, especialidades, agenda
- 🎵 **Cursos e Aulas**: Programação de cursos, turmas e aulas
- 💰 **Financeiro**: Controle de pagamentos, mensalidades e despesas
- 📊 **Relatórios**: Visualização de dados analíticos e desempenho
- 📱 **Responsivo**: Interface adaptável para todos os dispositivos

## Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Vite, TailwindCSS, shadcn/ui
- **Backend**: Node.js, Express
- **Banco de Dados**: Firebase Firestore
- **Autenticação**: Firebase Authentication
- **Hospedagem**: Firebase Hosting

## Pré-requisitos

- Node.js 18+
- Conta no Firebase

## Instalação

1. Clone o repositório
   ```bash
   git clone https://github.com/seu-usuario/musicschool-pro.git
   cd musicschool-pro
   ```

2. Instale as dependências
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente
   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

   ```
   VITE_FIREBASE_API_KEY=sua-api-key
   VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=seu-projeto-id
   VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
   VITE_FIREBASE_APP_ID=seu-app-id
   ```

4. Execute o projeto em desenvolvimento
   ```bash
   npm run dev
   ```

## Deploy

Para fazer o deploy no Firebase:

1. Instale o Firebase CLI
   ```bash
   npm install -g firebase-tools
   ```

2. Faça login no Firebase
   ```bash
   firebase login
   ```

3. Inicialize o projeto Firebase (se ainda não inicializado)
   ```bash
   firebase init
   ```

4. Construa o projeto
   ```bash
   npm run build
   ```

5. Faça o deploy
   ```bash
   firebase deploy
   ```

## Licença

[MIT](LICENSE)

## Contato

Para questões e suporte: suporte@musicschoolpro.com