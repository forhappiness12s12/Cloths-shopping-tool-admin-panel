import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from './Login';
import Header from './Header'; // Import the Header component
import ImageDisplay from './ImageDisplay';
import Prac from './prac';

const App = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription?.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">

      <Header
        user={session?.user}
        onLogout={async () => {
          await supabase.auth.signOut();
          setSession(null);
        }}
      />
      {session ? (
        <div className="flex lg:flex-row flex-col w-full h-full bg-[#292929]">
          <div className="lg:w-[30%] lg:h-full w-full h-[30%] bg-[#141720] text-[white] ">
            <Prac />
          </div>
          <div className="lg:w-[70%] lg:h-full w-full h-[70%] overflow-y-auto bg-[#181717] shadow-[#f0f0ef] shadow-lg">
            <ImageDisplay onLogout={async () => {
              await supabase.auth.signOut();
              setSession(null);
            }} />
          </div>

        </div>
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
