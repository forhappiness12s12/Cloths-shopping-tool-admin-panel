import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import ImageDisplay from './Imagediplay';
import Login from './Login';

const App = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Function to get the current session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    // Get session on initial load
    getSession();

    // Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup function to unsubscribe from the listener
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      {session ? (
        <ImageDisplay onLogout={async () => {
          await supabase.auth.signOut();
          setSession(null);
        }} />
      ) : (
        <Login onLogin={() => {
          const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
          };
          getSession();
        }} />
      )}
    </div>
  );
};

export default App;
