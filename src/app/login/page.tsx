'use client';
import { useState } from 'react';
import AuthForm from '../../../Components/AuthForm';

export default function LoginPage() {
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold text-center mb-4">
          {authType === 'login' ? 'Login' : 'Sign Up'}
        </h2>
        <AuthForm authType={authType} />
        <p className="text-sm mt-4 text-center">
          {authType === 'login' ? (
            <>
              {"Don't have an account? "}
              <button
                onClick={() => setAuthType('signup')}
                className="text-blue-600 underline hover:text-black cursor-pointer"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              {"Already have an account? "}
              <button
                onClick={() => setAuthType('login')}
                className="text-blue-600 underline hover:text-black cursor-pointer"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
