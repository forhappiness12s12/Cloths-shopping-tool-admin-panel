import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from './Login';
import Header from './Header'; // Import the Header component
import ImageDisplay from './ImageDisplay';
import Prac from './prac';

const App = () => {
  const [session, setSession] = useState(null);
  const [currentView, setCurrentView] = useState('imageDisplay'); // Initialize with 'prac'

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

  const handleButtonClick = (view) => {
    setCurrentView(view);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'imageDisplay':
        return <ImageDisplay onLogout={async () => {
          await supabase.auth.signOut();
          setSession(null);
        }} />;
      case 'component2':
        return <div>Component 2</div>;
      case 'component3':
        return <div>Component 3</div>;
      case 'component4':
        return <div>Component 4</div>;
      default:
        return <Prac onButtonClick={handleButtonClick} />;
    }
  };

  return (
    <div className="min-h-screen w-full h-full flex flex-col items-center bg-gray-100">
      
      {session ? (
        <div>
          <Header
        user={session?.user}
        onLogout={async () => {
          await supabase.auth.signOut();
          setSession(null);
        }}
      />
        <div className="flex lg:flex-row flex-col w-full h-full bg-[#292929]">
          
          <div className="lg:w-[20%] lg:h-full w-full h-[20%] bg-[#141720] text-[white] ">
            <Prac onButtonClick={handleButtonClick} />
          </div>
          <div className="lg:w-[80%] lg:h-full w-full h-[80%] overflow-y-auto bg-[#181717] shadow-[#f0f0ef] shadow-lg">
            {renderContent()}
          </div>
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
