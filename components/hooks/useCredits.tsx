'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useAuth } from '../context/AuthProvider';

export function useCredits() {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCredits = async () => {
    if (!user?.id) {
      setCredits(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('users')
        .select('credits')
        .eq('id', user.id)
        .maybeSingle(); // Use maybeSingle() to handle 0 rows gracefully

      if (fetchError) {
        console.error('Error fetching credits:', fetchError);
        setError('Failed to load credits');
        return;
      }

      // If user doesn't exist yet, try to create them
      if (!data) {
        console.log('User record not found, attempting to create...');
        
        // Try to insert the user (will only work if RLS policy allows it)
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([{
            id: user.id,
            email: user.email,
            credits: 50,
            role: 'regular'
          }])
          .select('credits')
          .single();

        if (insertError) {
          console.log('Could not create user (likely RLS policy). Using default credits.');
          setCredits(50); // Default credits value
        } else {
          console.log('User created successfully');
          setCredits(newUser?.credits ?? 50);
        }
      } else {
        setCredits(data.credits ?? 50);
      }
    } catch (err: any) {
      console.error('Credits fetch error:', err);
      setError('Failed to load credits');
    } finally {
      setLoading(false);
    }
  };

  // Fetch credits when user changes
  useEffect(() => {
    fetchCredits();
  }, [user?.id]);

  // Refresh credits function
  const refreshCredits = () => {
    fetchCredits();
  };

  return {
    credits,
    loading,
    error,
    refreshCredits
  };
}