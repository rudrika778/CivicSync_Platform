import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Users, Mail, Lock, UserCheck, Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginForm {
  email: string;
  password: string;
}

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [userType, setUserType] = useState<'citizen' | 'admin'>('citizen');
  const [error, setError] = useState('');
  const { login, signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const loginForm = useForm<LoginForm>();
  const signupForm = useForm<SignupForm>();

  const handleLogin = async (data: LoginForm) => {
    setError('');
    const success = await login(data.email, data.password, userType);
    if (success) {
      navigate(userType === 'citizen' ? '/citizen-dashboard' : '/admin-dashboard');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleSignup = async (data: SignupForm) => {
    setError('');
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const success = await signup(data.name, data.email, data.password);
    if (success) {
      navigate('/citizen-dashboard');
    } else {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">CivicSync</h1>
            <p className="text-blue-600 font-medium">Syncing Citizens. Solving Cities.</p>
          </div>

          {/* User Type Selection */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            <button
              onClick={() => setUserType('citizen')}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                userType === 'citizen'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Citizen
            </button>
            <button
              onClick={() => setUserType('admin')}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                userType === 'admin'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="text-center mb-6">
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {mode === 'login' 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Login'
              }
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {userType === 'admin' && mode === 'login' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-700 text-sm">
                <strong>Demo Admin Credentials:</strong><br />
                Email: admin@civicsync.com<br />
                Password: any password
              </p>
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...loginForm.register('email', { required: true })}
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...loginForm.register('password', { required: true })}
                    type="password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : `Sign in as ${userType}`}
              </button>
            </form>
          )}

          {/* Signup Form */}
          {mode === 'signup' && userType === 'citizen' && (
            <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  {...signupForm.register('name', { required: true })}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...signupForm.register('email', { required: true })}
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...signupForm.register('password', { required: true, minLength: 6 })}
                    type="password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Create a password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...signupForm.register('confirmPassword', { required: true })}
                    type="password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          {mode === 'signup' && userType === 'admin' && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Registration</h3>
              <p className="text-gray-600 mb-4">
                Admin accounts require special approval. Please contact your system administrator.
              </p>
              <button
                onClick={() => setMode('login')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}