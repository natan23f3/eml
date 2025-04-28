import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, limit } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Database collections
const studentsCollection = collection(db, 'students');
const teachersCollection = collection(db, 'teachers');
const coursesCollection = collection(db, 'courses');
const classesCollection = collection(db, 'classes');
const enrollmentsCollection = collection(db, 'enrollments');
const paymentsCollection = collection(db, 'payments');
const expensesCollection = collection(db, 'expenses');
const communicationsCollection = collection(db, 'communications');

// Helper functions para operações no banco de dados
async function addDocument(collectionName: string, data: any, id?: string) {
  const collectionRef = collection(db, collectionName);
  
  if (id) {
    await setDoc(doc(collectionRef, id), {
      ...data,
      createdAt: new Date()
    });
    return id;
  } else {
    // Gerar ID automático
    const newDocRef = doc(collectionRef);
    await setDoc(newDocRef, {
      ...data,
      createdAt: new Date()
    });
    return newDocRef.id;
  }
}

async function updateDocument(collectionName: string, id: string, data: any) {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date()
  });
  return id;
}

async function getDocument(collectionName: string, id: string) {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
}

async function getDocuments(collectionName: string, constraints?: { field: string, operator: any, value: any }[]) {
  const collectionRef = collection(db, collectionName);
  
  let queryResult;
  
  if (constraints && constraints.length > 0) {
    const queryConstraints = constraints.map(c => where(c.field, c.operator, c.value));
    queryResult = query(collectionRef, ...queryConstraints);
  } else {
    queryResult = collectionRef;
  }
  
  const querySnapshot = await getDocs(queryResult);
  const documents: any[] = [];
  
  querySnapshot.forEach((doc) => {
    documents.push({ id: doc.id, ...doc.data() });
  });
  
  return documents;
}

async function deleteDocument(collectionName: string, id: string) {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
  return id;
}

// Upload de arquivos
async function uploadFile(path: string, file: File) {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

export { 
  db, 
  storage, 
  studentsCollection,
  teachersCollection,
  coursesCollection,
  classesCollection,
  enrollmentsCollection,
  paymentsCollection,
  expensesCollection,
  communicationsCollection,
  addDocument,
  updateDocument,
  getDocument,
  getDocuments,
  deleteDocument,
  uploadFile
};
