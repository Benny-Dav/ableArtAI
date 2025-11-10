'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../utils/supabase/client';

interface AuthContextType {
  user:any | null;
  loading: boolean;
  signUp:(params:{email:string; password:string}) => Promise<any>;
  signIn:(params:{email:string; password:string}) => Promise<any>;
  signOut:()=> Promise<{error:any | null}>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider ({ children } : {children: ReactNode}) {
  const [user, setUser] = useState <any | null> (null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

   


    // const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
    //   setUser(session?.user ?? null);
    //   setLoading(false);
    // });

    const fetchSession=async() =>{
      const {data : {session}} = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }
    fetchSession();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  
  const value: AuthContextType = { 
    user,
    loading,
    signUp: ({email, password}) => supabase.auth.signUp({email, password}),
    signIn: ({email, password}) => supabase.auth.signInWithPassword({email, password}),
    signOut: () => supabase.auth.signOut(),
    
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if(!context){
    throw new Error('useAuth must be used within an Authprovider')
  }
  return context;
}; 