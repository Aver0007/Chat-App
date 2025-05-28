'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

type Props = {
  authType: 'login' | 'signup';
};

export default function AuthForm({ authType }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (authType === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return setError(error.message);

    
      const response = await fetch('/api/users/insertcurrent', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || 'Failed to sync user with database');
        return;
      }

      router.push('/'); 
    } 

    else 
    {
      const { error, data: { session } } = await supabase.auth.signUp({ email, password });
      if (error) return setError(error.message);

      if (session) {
        const response = await fetch('/api/users/insertcurrent', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();
        if (!response.ok) {
          setError(result.error || 'Failed to add user to database');
          return;
        }
      }

      alert('Signup successful. Please login.');
      router.push('/login'); 
    }
  };

  return (
    <form onSubmit={handleAuth} className="flex flex-col">
      <input
        className="w-full mb-2 p-2 border border-gray-300 rounded "
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="w-full mb-2 p-2 border border-gray-300 rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {authType === 'login' ? 'Login' : 'Sign Up'}
      </button>
    </form>
  );
}