import { useState, useEffect } from "react";
import { 
  addDocument, 
  updateDocument, 
  getDocument, 
  getDocuments, 
  deleteDocument 
} from "@/lib/firebase";

type FirestoreDocument = {
  id: string;
  [key: string]: any;
};

export function useFirestore<T extends FirestoreDocument>(collectionName: string) {
  const [documents, setDocuments] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Buscar todos os documentos da coleção
  const fetchDocuments = async (constraints?: { field: string, operator: any, value: any }[]) => {
    setLoading(true);
    try {
      const data = await getDocuments(collectionName, constraints);
      setDocuments(data as T[]);
      setError(null);
    } catch (err) {
      console.error(`Erro ao buscar documentos de ${collectionName}:`, err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar um documento específico por ID
  const fetchDocument = async (id: string) => {
    setLoading(true);
    try {
      const doc = await getDocument(collectionName, id);
      setError(null);
      return doc as T;
    } catch (err) {
      console.error(`Erro ao buscar documento ${id} de ${collectionName}:`, err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Adicionar um novo documento
  const addDoc = async (data: Omit<T, 'id'>) => {
    setLoading(true);
    try {
      const id = await addDocument(collectionName, data);
      setError(null);
      // Atualizar a lista local após adicionar
      fetchDocuments();
      return id;
    } catch (err) {
      console.error(`Erro ao adicionar documento em ${collectionName}:`, err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar um documento existente
  const updateDoc = async (id: string, data: Partial<T>) => {
    setLoading(true);
    try {
      await updateDocument(collectionName, id, data);
      setError(null);
      // Atualizar a lista local após editar
      fetchDocuments();
      return true;
    } catch (err) {
      console.error(`Erro ao atualizar documento ${id} em ${collectionName}:`, err);
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remover um documento
  const removeDoc = async (id: string) => {
    setLoading(true);
    try {
      await deleteDocument(collectionName, id);
      setError(null);
      // Atualizar a lista local após remover
      setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== id));
      return true;
    } catch (err) {
      console.error(`Erro ao remover documento ${id} de ${collectionName}:`, err);
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Carregar documentos na inicialização
  useEffect(() => {
    fetchDocuments();
  }, [collectionName]);

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    fetchDocument,
    addDocument: addDoc,
    updateDocument: updateDoc,
    deleteDocument: removeDoc
  };
}