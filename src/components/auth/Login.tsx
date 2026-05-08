import { apiStorage } from '../../utils/apiStorage';
import React, { useState } from 'react';
import { Shield, Lock, User as UserIcon, AlertCircle, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (user: any) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // Fetch users
      const storedUsers = apiStorage.getItem('aqm_users');
      let users: any[] = [];
      if (storedUsers) {
        try {
          users = JSON.parse(storedUsers);
          if (!Array.isArray(users)) users = [];
        } catch (e) {
          console.error("Invalid users JSON in localStorage:", e);
        }
      }
      
      if (users.length === 0) {
        // Init default admin if no users
        users = [
          {
            id: '1',
            name: 'Admin User',
            username: 'admin',
            email: 'admin@example.com',
            role: 'Super Admin',
            status: 'Active',
            password: 'password123',
            lastActive: 'Just now',
          }
        ];
        apiStorage.setItem('aqm_users', JSON.stringify(users));
      }

      const searchId = identifier.trim().toLowerCase();
      const user = users.find((u: any) => {
        const uEmail = (u.email || '').toLowerCase();
        const uName = (u.username || '').toLowerCase();
        return (uEmail === searchId || uName === searchId) && u.password === password;
      });

      if (user) {
        if (user.status !== 'Active') {
          setError('This account is inactive. Please contact your administrator.');
        } else {
          onLogin(user);
        }
      } else {
        setError('Invalid username/email or password.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
            <Shield className="w-8 h-8 text-white transform rotate-6" />
          </div>
        </div>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Sign in to your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-sm text-rose-700 font-medium">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-colors bg-slate-50 focus:bg-white"
                  placeholder="admin or admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-colors bg-slate-50 focus:bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 mb-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 font-medium">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-all"
              >
                {isLoading ? (
                  <span className="animate-pulse">Signing in...</span>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500 font-medium">Testing Credentials</span>
              </div>
            </div>
            
            <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-600 space-y-2">
               <p className="flex justify-between">
                <span className="font-semibold text-slate-700">Username:</span> 
                <span className="font-mono text-xs bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">admin</span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold text-slate-700">Email:</span> 
                <span className="font-mono text-xs bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">admin@example.com</span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold text-slate-700">Password:</span> 
                <span className="font-mono text-xs bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">password123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
