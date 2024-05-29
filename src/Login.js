import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      onLogin(); // Callback to parent component after successful login
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 bg-gray-100">
      <div className="text-[40px] mb-10">ADMIN PANEL</div>
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="grid gap-4">
          <label className="block text-lg font-medium">Email</label>
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
        </div>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full mt-6 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;