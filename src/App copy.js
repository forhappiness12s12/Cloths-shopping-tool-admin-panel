// src/App.js
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <div>
      {session ? (
        <>
          <button onClick={handleLogout}>Logout</button>
          <ImageDisplay />
        </>
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
