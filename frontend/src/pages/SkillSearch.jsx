import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import skillsApi from '../services/skillsApi';
import { generateBookCoverDataURL } from '../utils/bookCoverGenerator';
import Header from '../components/Header';

const SkillSearch = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priceRange: '',
    location: '',
    proficiency: '',
    availability: ''
  });
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [applicationData, setApplicationData] = useState({
    message: '',
    proposedPrice: '',
    mySkillOffer: '',
    preferredContact: 'email'
  });

  const skillCategories = [
    'Programming', 'Design', 'Marketing', 'Languages', 'Music', 
    'Photography', 'Cooking', 'Fitness', 'Writing', 'Business'
  ];

  useEffect(() => {
    const loadSkills = async () => {
      try {
        setLoading(true);
        
        // Load only real skills from API
        const allSkills = await skillsApi.getAllSkills();
        console.log('Loaded skills from API:', allSkills);
        
        // Ensure we have an array, if not set empty array
        setSkills(Array.isArray(allSkills) ? allSkills : []);
      } catch (error) {
        console.error('Error loading skills:', error);
        // Set empty array if API fails
        setSkills([]);
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, []);



  // Separate effect to handle filtering
  useEffect(() => {
    console.log('Filters changed:', filters);
  }, [filters]);

  const refreshSkills = async () => {
    try {
      setLoading(true);
      const allSkills = await skillsApi.getAllSkills();
      console.log('Refreshed skills from API:', allSkills);
      
      // Set only real skills, empty array if none
      setSkills(Array.isArray(allSkills) ? allSkills : []);
    } catch (error) {
      console.error('Failed to refresh skills:', error);
      // Set empty array if API fails
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredSkills = skills.filter(skill => {
    return (
      (!filters.search || skill.title.toLowerCase().includes(filters.search.toLowerCase()) ||
       skill.description.toLowerCase().includes(filters.search.toLowerCase())) &&
      (!filters.category || skill.category === filters.category) &&
      (!filters.proficiency || skill.proficiency === filters.proficiency) &&
      (!filters.location || skill.location.toLowerCase().includes(filters.location.toLowerCase()))
    );
  });

  const handleApply = (skill) => {
    setSelectedSkill(skill);
    setShowApplicationModal(true);
  };

  const handleSendEmail = (skill) => {
    // Get the skill owner's email - you may need to adjust this based on your data structure
    const recipientEmail = skill.user?.email || skill.email || 'contact@example.com';
    const subject = `Interested in learning ${skill.title}`;
    const body = `Hi ${skill.user?.username || 'there'},

I'm interested in learning ${skill.title} from you. I found your skill listing on SkillHub and would like to connect with you.

Skill Details:
- Title: ${skill.title}
- Description: ${skill.description}
- Price: ₹${skill.price}

Please let me know if you're available to teach this skill.

Best regards,
${user?.username || 'A SkillHub user'}`;

    // Create Gmail web compose URL
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open Gmail compose in a new tab
    window.open(gmailComposeUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
  };

  const submitApplication = async () => {
    try {
      // Validate required fields
      if (!applicationData.message.trim()) {
        alert('Please enter a message');
        return;
      }
      
      if (!applicationData.proposedPrice) {
        alert('Please enter a proposed price');
        return;
      }

      // Prepare application data
      const applicationPayload = {
        skill_id: selectedSkill.id,
        message: applicationData.message,
        proposed_price: parseFloat(applicationData.proposedPrice),
        offering_skill: applicationData.mySkillOffer,
        preferred_contact: applicationData.preferredContact
      };

      console.log('Submitting application:', applicationPayload);

      // Send application to backend
      const response = await skillsApi.applyToSkill(applicationPayload);
      console.log('Application submitted successfully:', response);

      // Close modal and reset form
      setShowApplicationModal(false);
      setApplicationData({
        message: '',
        proposedPrice: '',
        mySkillOffer: '',
        preferredContact: 'email'
      });

      alert('Application submitted successfully! The skill owner will be notified and can contact you soon.');
      
    } catch (error) {
      console.error('Failed to submit application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-800 via-purple-800 to-indigo-800 relative flex flex-col">
      {/* Tech grid background */}
      <div className="absolute inset-0 opacity-15">
        <div className="grid grid-cols-12 h-full">
          {Array.from({length: 144}).map((_, i) => (
            <div key={i} className="border border-cyan-400/25"></div>
          ))}
        </div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-pulse absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full"></div>
        <div className="animate-pulse absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full" style={{animationDelay: '1s'}}></div>
        <div className="animate-pulse absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full" style={{animationDelay: '2s'}}></div>
      </div>

      <Header currentPage="search" />

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search and Filters */}
          <div className="bg-gray-800/70 backdrop-blur-sm border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/20 p-6 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-xl"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                  Discover Skills & Find Your Perfect Learning Partner
                </h2>
                <button
                  onClick={refreshSkills}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-4 py-2 rounded-lg transition duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 border border-green-400/50 disabled:opacity-50"
                >
                  {loading ? 'Refreshing...' : 'Refresh Skills'}
                </button>
              </div>
              
              {/* Search Bar */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search skills, topics, or keywords..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm text-lg"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 backdrop-blur-sm"
                >
                  <option value="">All Categories</option>
                  {skillCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <select
                  value={filters.proficiency}
                  onChange={(e) => handleFilterChange('proficiency', e.target.value)}
                  className="px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 backdrop-blur-sm"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>

                <input
                  type="text"
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                />

                <select
                  value={filters.availability}
                  onChange={(e) => handleFilterChange('availability', e.target.value)}
                  className="px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 backdrop-blur-sm"
                >
                  <option value="">Any Time</option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="Weekends">Weekends</option>
                  <option value="Evenings">Evenings</option>
                </select>
              </div>
            </div>
          </div>

          {/* Skills Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
              <p className="text-cyan-300">Loading skills...</p>
            </div>
          ) : filteredSkills.length === 0 ? (
            <div className="text-center py-12">
              {skills.length === 0 ? (
                <>
                  <p className="text-cyan-300 text-lg">No skills available yet.</p>
                  <p className="text-cyan-100 text-sm mt-2">Be the first to add a skill and start teaching!</p>
                </>
              ) : (
                <>
                  <p className="text-cyan-300 text-lg">No skills found matching your criteria.</p>
                  <p className="text-cyan-100 text-sm mt-2">Try adjusting your filters or search terms.</p>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map(skill => (
              <div key={skill.id} className="bg-gray-800/70 backdrop-blur-sm border border-purple-500/30 rounded-xl shadow-2xl shadow-purple-500/20 overflow-hidden hover:border-purple-400/50 transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  {/* Book Cover */}
                  <div className="h-48 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden flex items-center justify-center">
                    <img 
                      src={generateBookCoverDataURL(skill)} 
                      alt={`${skill.title} book cover`}
                      className="h-40 w-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
                      style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-purple-500/80 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                        {skill.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-purple-300 mb-2">{skill.title}</h3>
                    <p className="text-cyan-100 text-sm mb-4 line-clamp-2">{skill.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-cyan-300">Mentor:</span>
                        <span className="text-cyan-100">{skill.username || skill.user?.username || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-cyan-300">Total Price:</span>
                        <span className="text-green-300">
                          ₹{skill.total_price || skill.price} <span className="text-yellow-300">(Negotiable)</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-cyan-300">Level:</span>
                        <span className="text-cyan-100">{skill.proficiency || skill.level || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-cyan-300">Location:</span>
                        <span className="text-cyan-100">{skill.location || 'Not specified'}</span>
                      </div>
                    </div>

                    {/* Mentor's Wanted Skills */}
                    {skill.skills_wanted && (
                      <div className="mb-4">
                        <p className="text-xs text-cyan-300 mb-2">Mentor wants to learn:</p>
                        <div className="flex flex-wrap gap-1">
                          {skill.skills_wanted.split(',').map(wantedSkill => (
                            <span key={wantedSkill.trim()} className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded border border-green-400/30">
                              {wantedSkill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <button
                        onClick={() => handleApply(skill)}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 border border-purple-400/50"
                      >
                        Apply to Learn
                      </button>
                      <button
                        onClick={() => handleSendEmail(skill)}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 border border-blue-400/50 flex items-center justify-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>Send Message</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </main>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800/90 backdrop-blur-sm border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/20 max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                  Apply for: {selectedSkill?.title}
                </h3>
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="text-cyan-300 hover:text-cyan-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-cyan-200 text-sm font-medium mb-2">
                    Message to Mentor
                  </label>
                  <textarea
                    value={applicationData.message}
                    onChange={(e) => setApplicationData(prev => ({...prev, message: e.target.value}))}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                    placeholder="Introduce yourself and explain why you want to learn this skill..."
                  />
                </div>

                <div>
                  <label className="block text-cyan-200 text-sm font-medium mb-2">
                    Proposed Price (₹/hour)
                  </label>
                  <input
                    type="number"
                    value={applicationData.proposedPrice}
                    onChange={(e) => setApplicationData(prev => ({...prev, proposedPrice: e.target.value}))}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                    placeholder="Your proposed rate or original price"
                  />
                </div>

                <div>
                  <label className="block text-cyan-200 text-sm font-medium mb-2">
                    Skill Exchange Offer (Optional)
                  </label>
                  <input
                    type="text"
                    value={applicationData.mySkillOffer}
                    onChange={(e) => setApplicationData(prev => ({...prev, mySkillOffer: e.target.value}))}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                    placeholder="What skill can you teach in exchange?"
                  />
                </div>

                <div>
                  <label className="block text-cyan-200 text-sm font-medium mb-2">
                    Preferred Contact Method
                  </label>
                  <select
                    value={applicationData.preferredContact}
                    onChange={(e) => setApplicationData(prev => ({...prev, preferredContact: e.target.value}))}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 backdrop-blur-sm"
                  >
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="both">Both Email & WhatsApp</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={submitApplication}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 border border-green-400/50"
                  >
                    Send Application
                  </button>
                  <button
                    onClick={() => setShowApplicationModal(false)}
                    className="px-6 py-3 border border-purple-400/50 text-purple-300 rounded-lg hover:bg-purple-500/20 transition duration-300 backdrop-blur-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillSearch;