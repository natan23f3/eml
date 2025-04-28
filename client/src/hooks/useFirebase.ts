import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type CollectionName = 'students' | 'teachers' | 'courses' | 'classes' | 'enrollments' | 'payments' | 'expenses' | 'communications';

export function useFirebaseCollection<T>(collectionName: CollectionName, constraints?: [string, '==' | '!=' | '>' | '<' | '>=' | '<=', any][]) {
  const [documents, setDocuments] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let q = collection(db, collectionName);
    
    if (constraints && constraints.length > 0) {
      q = query(q, ...constraints.map(c => where(c[0], c[1], c[2])));
    }

    setLoading(true);
    
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setDocuments(docs);
        setLoading(false);
      },
      (err) => {
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, JSON.stringify(constraints)]);

  const addDocument = async (data: Omit<T, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return docRef.id;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateDocument = async (id: string, data: Partial<T>) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data as DocumentData);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const getDocument = async (id: string): Promise<T | null> => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      } else {
        return null;
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return { 
    documents, 
    loading, 
    error, 
    addDocument, 
    updateDocument, 
    deleteDocument, 
    getDocument 
  };
}
