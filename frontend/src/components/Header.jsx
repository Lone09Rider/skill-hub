import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ currentPage = '' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log('Starting logout process...');
      // Navigate to home BEFORE logout to avoid route protection issues
      navigate('/', { replace: true });
      await logout();
      console.log('Logout completed');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/', { replace: true });
    }
  };

  const handleNavigation = (path) => {
    console.log('Navigating to:', path);
    navigate(path);
  };

  return (
    <header className="bg-gradient-to-r from-gray-900/90 via-purple-900/90 to-gray-900/90 backdrop-blur-lg border-b border-cyan-400/30 shadow-2xl shadow-cyan-500/20 relative z-10 flex-shrink-0">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/10 to-pink-500/5 animate-pulse"></div>
      
      {/* Glowing border effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
      
      <div className="w-full px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="flex justify-between items-center py-4">
          {/* Left corner - Logo positioned at absolute left */}
          <div className="flex items-center">
            <button onClick={() => handleNavigation('/')} className="group flex-shrink-0 relative mr-16">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
              <h1 className="relative text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 group-hover:from-cyan-200 group-hover:via-pink-300 group-hover:to-yellow-300 transition-all duration-700 transform group-hover:scale-110 drop-shadow-2xl">
                ⚡ SkillHub
              </h1>
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          </div>

          {/* Center - Navigation buttons with corner-aligned design */}
          <div className="flex-1 flex justify-center">
            <nav className="flex space-x-2">
              <button 
                onClick={() => handleNavigation('/search')} 
                className={`group relative px-6 py-3 font-bold text-sm tracking-wide uppercase transition-all duration-500 transform hover:scale-105 ${
                  currentPage === 'search' 
                    ? 'text-white shadow-lg shadow-cyan-500/30' 
                    : 'text-cyan-200 hover:text-white'
                }`}
              >
                <span className="relative z-20 drop-shadow-lg">Browse Skills</span>
                {currentPage === 'search' ? (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-lg shadow-lg animate-pulse"></div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent group-hover:from-cyan-500/30 group-hover:via-blue-500/30 group-hover:to-purple-500/30 rounded-lg transition-all duration-500"></div>
                )}
                <div className="absolute inset-0 border border-cyan-400/20 group-hover:border-cyan-400/60 rounded-lg transition-all duration-300"></div>
              </button>
              
              <button 
                onClick={() => handleNavigation('/dashboard')} 
                className={`group relative px-6 py-3 font-bold text-sm tracking-wide uppercase transition-all duration-500 transform hover:scale-105 ${
                  currentPage === 'dashboard' 
                    ? 'text-white shadow-lg shadow-purple-500/30' 
                    : 'text-cyan-200 hover:text-white'
                }`}
              >
                <span className="relative z-20 drop-shadow-lg">Dashboard</span>
                {currentPage === 'dashboard' ? (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-lg shadow-lg animate-pulse"></div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent group-hover:from-purple-500/30 group-hover:via-pink-500/30 group-hover:to-red-500/30 rounded-lg transition-all duration-500"></div>
                )}
                <div className="absolute inset-0 border border-purple-400/20 group-hover:border-purple-400/60 rounded-lg transition-all duration-300"></div>
              </button>
              
              <button 
                onClick={() => handleNavigation('/profile')} 
                className={`group relative px-6 py-3 font-bold text-sm tracking-wide uppercase transition-all duration-500 transform hover:scale-105 ${
                  currentPage === 'profile' 
                    ? 'text-white shadow-lg shadow-pink-500/30' 
                    : 'text-cyan-200 hover:text-white'
                }`}
              >
                <span className="relative z-20 drop-shadow-lg">Profile</span>
                {currentPage === 'profile' ? (
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 rounded-lg shadow-lg animate-pulse"></div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent group-hover:from-pink-500/30 group-hover:via-rose-500/30 group-hover:to-orange-500/30 rounded-lg transition-all duration-500"></div>
                )}
                <div className="absolute inset-0 border border-pink-400/20 group-hover:border-pink-400/60 rounded-lg transition-all duration-300"></div>
              </button>
            </nav>
          </div>
          
          {/* Right corner - User info and logout positioned at absolute right */}
          <div className="flex items-center space-x-4 ml-16">
            {/* Welcome message with enhanced corner styling */}
            <div className="relative">
              <span className="text-sm font-semibold text-cyan-200 drop-shadow-lg tracking-wide">
                Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 font-bold text-base">{user?.username || 'User'}!</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-purple-400/5 blur-lg"></div>
            </div>
            
            {/* Corner-styled logout button */}
            <button 
              onClick={handleLogout}
              className="relative group bg-gradient-to-br from-red-500 via-red-600 to-pink-600 hover:from-red-400 hover:via-red-500 hover:to-pink-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-red-500/40 hover:shadow-red-500/60 border border-red-400/50 hover:border-red-300/80 transform hover:scale-110 hover:-translate-y-1"
            >
              <span className="relative z-20 flex items-center space-x-2 text-sm tracking-wide uppercase">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/30 to-pink-500/30 rounded-xl blur-md group-hover:blur-lg transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Floating particles for extra flair */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-pulse absolute top-1/2 left-1/4 w-1 h-1 bg-cyan-400/60 rounded-full" style={{animationDelay: '0s'}}></div>
        <div className="animate-pulse absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-400/40 rounded-full" style={{animationDelay: '1s'}}></div>
        <div className="animate-pulse absolute top-2/3 left-1/2 w-0.5 h-0.5 bg-pink-400/50 rounded-full" style={{animationDelay: '2s'}}></div>
      </div>
    </header>
  );
};

export default Header;