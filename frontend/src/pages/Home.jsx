import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 grid-rows-12 h-full w-full gap-px">
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

      <div className="container mx-auto px-4 py-4 h-full flex flex-col relative z-10">
        {/* Header */}
        <header className="text-center mb-4">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2 drop-shadow-2xl">
            SkillHub
          </h1>
          <p className="text-lg md:text-xl text-cyan-100 max-w-3xl mx-auto drop-shadow-lg">
            Connect, Learn, and Grow with AI-Powered Skill Matching
          </p>
        </header>

        {/* Main Content - Centered */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <div className="max-w-6xl w-full mx-auto">
            {/* Welcome Section */}
            <div className="text-center">
              <div className="bg-gray-800/70 backdrop-blur-sm border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/20 p-6 mb-4 relative overflow-hidden">
                {/* Neon border glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-xl"></div>
                
                <div className="relative z-10">
                  <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 mb-4">
                    Welcome to SkillHub ⚡
                  </h2>
                  <p className="text-base text-cyan-100 mb-6">
                    Join our community of learners and teachers. Share your skills, 
                    learn new ones, and grow together with our dynamic skill marketplace.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {isAuthenticated ? (
                      <Link
                        to="/search"
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold py-3 px-10 text-base rounded-lg transition duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 border border-green-400/50 text-center"
                      >
                        Browse Skills
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 px-10 text-base rounded-lg transition duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 border border-cyan-400/50 text-center"
                        >
                          Log In
                        </Link>
                        <Link
                          to="/signup"
                          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-semibold py-3 px-10 text-base rounded-lg transition duration-300 text-center shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 border border-purple-400/50"
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-800/60 backdrop-blur-sm border border-cyan-400/30 rounded-lg shadow-lg shadow-cyan-400/20 p-5 hover:shadow-cyan-400/40 hover:border-cyan-400/50 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-3 mx-auto shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-cyan-300 mb-2">AI-Powered Matching</h3>
                  <p className="text-cyan-100 text-sm">Our intelligent system matches you with the perfect learning partners.</p>
                </div>

                <div className="bg-gray-800/60 backdrop-blur-sm border border-green-400/30 rounded-lg shadow-lg shadow-green-400/20 p-5 hover:shadow-green-400/40 hover:border-green-400/50 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mb-3 mx-auto shadow-lg">
                    {/* Modern community/group icon */}
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                      {/* Center person */}
                      <circle cx="12" cy="10" r="2.2" />
                      <path d="M12 13c-2.5 0-4.5 1.2-4.5 2.7V18h9v-2.3C16.5 14.2 14.5 13 12 13z" />
                      {/* Left person */}
                      <circle cx="7.2" cy="11.2" r="1.5" />
                      <path d="M7.2 13.5c-1.7 0-3 0.8-3 1.8V17h4.2" />
                      {/* Right person */}
                      <circle cx="16.8" cy="11.2" r="1.5" />
                      <path d="M16.8 13.5c1.7 0 3 0.8 3 1.8V17h-4.2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-300 mb-2">Community Driven</h3>
                  <p className="text-green-100 text-sm">Join a vibrant community of learners and skill sharers.</p>
                </div>

                <div className="bg-gray-800/60 backdrop-blur-sm border border-purple-400/30 rounded-lg shadow-lg shadow-purple-400/20 p-5 hover:shadow-purple-400/40 hover:border-purple-400/50 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mb-3 mx-auto shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-purple-300 mb-2">Skill Exchange</h3>
                  <p className="text-purple-100 text-sm">Trade skills, learn together, and grow your expertise.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;