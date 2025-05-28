'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { error, data: { session } } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

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

    router.push('/login'); 
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-3 p-6">
      <h1 className="text-xl font-semibold">Signup</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
      <button type="submit" className="bg-green-500 text-white p-2  hover:text-black cursor-pointer">Sign Up</button>
    </form>
  );
}