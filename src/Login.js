import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false); // Add state for tracking submission

  const handleLogin = async (event) => {
    event.preventDefault();
    setSubmitted(true); // Set submitted to true when form is submitted

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      onLogin(); // Callback to parent component after successful login
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:w-[480px] w-[300px]">
      <div className="text-3xl mb-4">SIGN IN</div>
      <form
        onSubmit={handleLogin}
        className={`bg-white rounded-lg shadow-md py-4 w-full `}
      >
        <div className="grid grid-cols-1 px-10">
          <label className="block text-lg  font-medium">Email</label>
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block text-lg font-medium">Password</label>
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
          type="submit"
          className="w-full mt-6 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Login
        </button>
        </div>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        
      </form>
    </div>
  );
};

export default Login;
