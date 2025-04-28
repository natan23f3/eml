import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Registro de usuário com email/senha
export const registerWithEmailAndPassword = async (
  email: string, 
  password: string, 
  name: string, 
  role: 'admin' | 'teacher' | 'staff' = 'staff'
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Salva informações adicionais no Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email,
      role,
      createdAt: new Date(),
    });
    
    return user;
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    throw error;
  }
};

// Login com email/senha
export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
};

// Login com Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Verifica se o usuário já existe
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // É a primeira vez que este usuário do Google faz login, cria o perfil
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        role: 'staff', // role padrão para novos usuários
        createdAt: new Date(),
        photoURL: user.photoURL
      });
    }
    
    return user;
  } catch (error) {
    console.error("Erro no login com Google:", error);
    throw error;
  }
};

// Recuperação de senha
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error("Erro ao enviar email de recuperação:", error);
    throw error;
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Erro no logout:", error);
    throw error;
  }
};

// Verifica estado de autenticação do usuário
export const onUserAuthStateChanged = (callback: any) => {
  return onAuthStateChanged(auth, callback);
};

// Obter dados do usuário atual do Firestore
export const getCurrentUserData = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Erro ao obter dados do usuário:", error);
    return null;
  }
};

export { auth, db };