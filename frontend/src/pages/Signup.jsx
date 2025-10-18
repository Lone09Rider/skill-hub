import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    bio: '',
    phone: '',
    date_of_birth: '',
    location: '', // Optional field
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!formData.password_confirm) newErrors.password_confirm = 'Please confirm your password';
    else if (formData.password !== formData.password_confirm) newErrors.password_confirm = 'Passwords do not match';
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) newErrors.phone = 'Phone number is invalid';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }
    const result = await signup(formData);
    if (result.success) {
      navigate('/');
    } else {
      if (typeof result.error === 'object') setErrors(result.error);
      else setErrors({ general: result.error });
    }
    setLoading(false);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative flex">
      {/* Animated tech grid background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-20 h-full">
          {Array.from({length: 400}).map((_, i) => (
            <div 
              key={i} 
              className="border border-cyan-500/20 animate-pulse"
              style={{
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Dynamic floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({length: 15}).map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full animate-bounce ${
              i % 3 === 0 ? 'bg-cyan-400' : i % 3 === 1 ? 'bg-purple-400' : 'bg-pink-400'
            }`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-gradient-to-r from-pink-500/20 to-violet-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Left side - Decorative content */}
      <div className="flex-1 flex flex-col justify-center items-center p-12 relative z-10">
        <div className="text-center max-w-lg">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 mb-4 animate-pulse">
              ⚡ SkillHub
            </h1>
            <p className="text-2xl text-cyan-100 mb-6">Where Knowledge Meets Opportunity</p>
            <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto animate-pulse"></div>
          </div>
          
          <div className="space-y-6 text-cyan-200">
            <div className="flex items-center justify-center space-x-4 opacity-80 hover:opacity-100 transition-opacity duration-300">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-lg">Connect with skill masters worldwide</span>
            </div>
            <div className="flex items-center justify-center space-x-4 opacity-80 hover:opacity-100 transition-opacity duration-300">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <span className="text-lg">Learn new skills from experts</span>
            </div>
            <div className="flex items-center justify-center space-x-4 opacity-80 hover:opacity-100 transition-opacity duration-300">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              <span className="text-lg">Share your expertise and earn</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-lg">
          <div className="bg-gray-800/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 p-6 relative overflow-hidden">
            {/* Animated border glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent rounded-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
            
            <div className="relative z-10">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 mb-1">
                  Join the Revolution
                </h2>
                <p className="text-cyan-100 text-sm">Create your account to start skill sharing</p>
              </div>

              {errors.general && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg backdrop-blur-sm animate-shake text-sm">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-cyan-200 text-xs font-medium mb-1">First Name *</label>
                    <input 
                      type="text" 
                      name="first_name" 
                      value={formData.first_name} 
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm text-sm ${errors.first_name ? 'border-red-500/50 animate-pulse' : 'border-cyan-400/30'}`}
                      placeholder="First name"
                      required
                    />
                    {errors.first_name && <p className="mt-1 text-xs text-red-300 animate-pulse">{errors.first_name}</p>}
                  </div>
                  <div className="group">
                    <label className="block text-cyan-200 text-xs font-medium mb-1">Last Name *</label>
                    <input 
                      type="text" 
                      name="last_name" 
                      value={formData.last_name} 
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm text-sm ${errors.last_name ? 'border-red-500/50 animate-pulse' : 'border-cyan-400/30'}`}
                      placeholder="Last name"
                      required
                    />
                    {errors.last_name && <p className="mt-1 text-xs text-red-300 animate-pulse">{errors.last_name}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-cyan-200 text-xs font-medium mb-1 transition-colors duration-200">Username *</label>
                    <input 
                      type="text" 
                      name="username" 
                      value={formData.username} 
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm transition-all duration-300 text-sm ${errors.username ? 'border-red-500/50 animate-pulse' : 'border-cyan-400/30'}`}
                      placeholder="Choose a unique username"
                      required 
                    />
                    {errors.username && <p className="mt-1 text-xs text-red-300 animate-pulse">{errors.username}</p>}
                  </div>

                  <div className="group">
                    <label className="block text-cyan-200 text-xs font-medium mb-1 transition-colors duration-200">Email *</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm transition-all duration-300 text-sm ${errors.email ? 'border-red-500/50 animate-pulse' : 'border-cyan-400/30'}`}
                      placeholder="Enter your email address"
                      required 
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-300 animate-pulse">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-cyan-200 text-xs font-medium mb-1 group-hover:text-cyan-100 transition-colors duration-200">Phone Number *</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm transition-all duration-300 hover:bg-gray-900/70 text-sm ${errors.phone ? 'border-red-500/50 animate-pulse' : 'border-cyan-400/30 hover:border-cyan-400/50'}`}
                      placeholder="Your phone number"
                      required 
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-300 animate-pulse">{errors.phone}</p>}
                  </div>
                  <div className="group">
                    <label className="block text-cyan-200 text-xs font-medium mb-1 transition-colors duration-200">Date of Birth *</label>
                    <input 
                      type="date" 
                      name="date_of_birth" 
                      value={formData.date_of_birth} 
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm transition-all duration-300 text-sm ${errors.date_of_birth ? 'border-red-500/50 animate-pulse' : 'border-cyan-400/30'}`}
                      required 
                    />
                    {errors.date_of_birth && <p className="mt-1 text-xs text-red-300 animate-pulse">{errors.date_of_birth}</p>}
                  </div>
                </div>

                <div className="group">
                  <label className="block text-cyan-200 text-xs font-medium mb-1 transition-colors duration-200">Bio *</label>
                  <textarea 
                    name="bio" 
                    value={formData.bio} 
                    onChange={handleInputChange}
                    rows={2}
                    className={`w-full px-3 py-2 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm resize-none transition-all duration-300 text-sm ${errors.bio ? 'border-red-500/50 animate-pulse' : 'border-cyan-400/30'}`}
                    placeholder="Tell us about yourself and your skills..."
                    required 
                  />
                  {errors.bio && <p className="mt-1 text-xs text-red-300 animate-pulse">{errors.bio}</p>}
                </div>

                <div className="group">
                  <label className="block text-cyan-200 text-xs font-medium mb-1 transition-colors duration-200">Location</label>
                  <input 
                    type="text" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm transition-all duration-300 text-sm ${errors.location ? 'border-red-500/50 animate-pulse' : 'border-cyan-400/30'}`}
                    placeholder="Your location (optional)"
                  />
                  {errors.location && <p className="mt-1 text-xs text-red-300 animate-pulse">{errors.location}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-cyan-200 text-xs font-medium mb-1 transition-colors duration-200">Password *</label>
                    <input 
                      type="password" 
                      name="password" 
                      value={formData.password} 
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm transition-all duration-300 text-sm ${errors.password ? 'border-red-500/50 animate-pulse' : 'border-cyan-400/30'}`}
                      placeholder="Create password"
                      required 
                    />
                    {errors.password && <p className="mt-1 text-xs text-red-300 animate-pulse">{errors.password}</p>}
                  </div>
                  <div className="group">
                    <label className="block text-cyan-200 text-xs font-medium mb-1 transition-colors duration-200">Confirm Password *</label>
                    <input 
                      type="password" 
                      name="password_confirm" 
                      value={formData.password_confirm} 
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm transition-all duration-300 text-sm ${errors.password_confirm ? 'border-red-500/50 animate-pulse' : 'border-cyan-400/30'}`}
                      placeholder="Confirm password"
                    />
                    {errors.password_confirm && <p className="mt-1 text-xs text-red-300 animate-pulse">{errors.password_confirm}</p>}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/30 border border-purple-400/50 text-sm"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>Create Account</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  )}
                </button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-cyan-200 text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-purple-300 font-medium transition-colors duration-300">
                    Log In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
