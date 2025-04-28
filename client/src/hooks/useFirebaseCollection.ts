import { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type CollectionName = 'students' | 'teachers' | 'courses' | 'classes' | 'enrollments' | 'payments' | 'expenses' | 'communications';

export function useFirebaseCollection<T>(collectionName: CollectionName, constraints?: [string, '==' | '!=' | '>' | '<' | '>=' | '<=', any][]) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const collectionRef = collection(db, collectionName);
      
      let queryResult;
      if (constraints && constraints.length > 0) {
        const queryConstraints = constraints.map(([field, operator, value]) => 
          where(field, operator, value)
        );
        queryResult = query(collectionRef, ...queryConstraints);
      } else {
        queryResult = collectionRef;
      }
      
      const querySnapshot = await getDocs(queryResult);
      const items: T[] = [];
      
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as unknown as T);
      });
      
      setData(items);
      setError(null);
    } catch (err) {
      console.error(`Erro ao buscar coleção ${collectionName}:`, err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: Omit<T, 'id'>) => {
    try {
      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, { 
        ...item,
        createdAt: new Date() 
      });
      
      // Refresh data
      fetchData();
      
      return { id: docRef.id, ...item } as unknown as T;
    } catch (err) {
      console.error(`Erro ao adicionar item em ${collectionName}:`, err);
      setError(err as Error);
      throw err;
    }
  };

  const updateItem = async (id: string, updates: Partial<T>) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, { 
        ...updates,
        updatedAt: new Date() 
      });
      
      // Refresh data
      fetchData();
      
      return true;
    } catch (err) {
      console.error(`Erro ao atualizar item ${id} em ${collectionName}:`, err);
      setError(err as Error);
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      
      // Update local state without fetching
      setData(prevData => prevData.filter((item: any) => item.id !== id));
      
      return true;
    } catch (err) {
      console.error(`Erro ao deletar item ${id} em ${collectionName}:`, err);
      setError(err as Error);
      throw err;
    }
  };

  // Load data on component mount or when dependencies change
  useEffect(() => {
    fetchData();
  }, [collectionName, JSON.stringify(constraints)]);

  return {
    data,
    loading,
    error,
    refreshData: fetchData,
    addItem,
    updateItem,
    deleteItem
  };
}