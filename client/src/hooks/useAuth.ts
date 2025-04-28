import { useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebaseAuth';
import { logoutUser } from '@/lib/firebaseAuth';
import { useMutation } from '@tanstack/react-query';

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);
  
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await logoutUser();
    },
    onSuccess: () => {
      setUser(null);
    }
  });

  return { user, loading, error, logoutMutation };
}
