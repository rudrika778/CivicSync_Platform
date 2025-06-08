import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, Home, MapPin, Calendar, MessageSquare, HelpCircle, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const citizenNavItems = [
    { path: '/citizen-dashboard', icon: Home, label: 'Dashboard' },
    { path: '/events', icon: Calendar, label: 'Events' },
    { path: '/help', icon: HelpCircle, label: 'Help' },
  ];

  const adminNavItems = [
    { path: '/admin-dashboard', icon: Settings, label: 'Dashboard' },
    { path: '/events', icon: Calendar, label: 'Events' },
    { path: '/help', icon: HelpCircle, label: 'Help' },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : citizenNavItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CivicSync</h1>
                <p className="text-xs text-blue-600 font-medium">Syncing Citizens. Solving Cities.</p>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{user?.name}</span>
              </span>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                user?.role === 'admin' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {user?.role}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}