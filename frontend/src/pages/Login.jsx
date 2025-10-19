import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/search');
    return null;
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    const result = await login(loginForm.username, loginForm.password);
    
    if (result.success) {
      navigate('/search');
    } else {
      setLoginError(result.error);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-12 grid-rows-8 sm:grid-rows-10 lg:grid-rows-12 h-full w-full gap-px">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="border border-cyan-400"></div>
          ))}
        </div>
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="w-2 h-2 bg-cyan-400 rounded-full absolute top-1/4 left-1/4 animate-pulse"></div>
        <div className="w-1 h-1 bg-purple-400 rounded-full absolute top-3/4 left-3/4 animate-ping"></div>
        <div className="w-3 h-3 bg-pink-400 rounded-full absolute top-1/2 right-1/4 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 h-full flex flex-col relative z-10">
        {/* Header */}
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2 drop-shadow-2xl">
            SkillHub
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-cyan-100 max-w-3xl mx-auto drop-shadow-lg px-4">
            Welcome Back! Log in to continue your learning journey
          </p>
        </header>

        {/* Main Content - Centered */}
        <div className="flex-1 flex items-center justify-center min-h-0 px-4 sm:px-0">
          <div className="max-w-md w-full mx-auto">
            <div className="bg-gray-800/70 backdrop-blur-sm border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/20 p-6 sm:p-8 relative overflow-hidden">
              {/* Neon border glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-xl"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                    Log In
                  </h2>
                </div>

                {loginError && (
                  <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg backdrop-blur-sm text-sm">
                    {loginError}
                  </div>
                )}

                <form onSubmit={handleLoginSubmit}>
                  <div className="mb-4">
                    <label className="block text-cyan-200 text-sm font-medium mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={loginForm.username}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 sm:py-2 text-base bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                      placeholder="Enter your username"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-cyan-200 text-sm font-medium mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={loginForm.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 sm:py-2 text-base bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 sm:py-2 px-4 text-base rounded-lg transition duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 border border-cyan-400/50 touch-manipulation"
                  >
                    {loading ? 'Logging in...' : 'Log In'}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-cyan-200 text-sm sm:text-base">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-purple-300 hover:text-purple-200 font-medium">
                      Sign Up
                    </Link>
                  </p>
                </div>

                <div className="mt-4 text-center">
                  <Link to="/" className="text-cyan-300 hover:text-cyan-200 font-medium text-sm">
                    ← Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;