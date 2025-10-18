import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { profileAPI } from '../services/api';
import skillsApi from '../services/skillsApi';
import { generateMiniCoverDataURL } from '../utils/bookCoverGenerator';
import Header from '../components/Header';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [userSkills, setUserSkills] = useState([]);
  const [editingSkill, setEditingSkill] = useState(null);
  const [showEditSkillModal, setShowEditSkillModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    location: '',
    phone: '',
    date_of_birth: '',
    is_mentor: false,
  });
  const [skillFormData, setSkillFormData] = useState({
    title: '',
    description: '',
    category: '',
    proficiency: 'beginner',
    totalPrice: '',
    phone: '',
    email: '',
    location: '',
    availability: '',
    skillsWanted: ''
  });

  useEffect(() => {
    fetchProfile();
    loadMySkills();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Small delay to ensure smooth transition
      await new Promise(resolve => setTimeout(resolve, 100));
      const response = await profileAPI.getProfile();
      setProfile(response.data);
      setFormData({
        username: response.data.username || user?.username || '',
        email: response.data.email || user?.email || '',
        bio: response.data.bio || '',
        location: response.data.location || '',
        phone: response.data.phone || '',
        date_of_birth: response.data.date_of_birth || '',
        is_mentor: response.data.is_mentor || false,
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      // If profile fetch fails, use auth context data
      setFormData({
        username: user?.username || '',
        email: user?.email || '',
        bio: '',
        location: '',
        phone: '',
        date_of_birth: '',
        is_mentor: false,
      });
    } finally {
      // Minimum loading time to prevent flash
      setTimeout(() => setLoading(false), 200);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await profileAPI.updateProfile(formData);
      setProfile(response.data);
      setIsEditing(false);
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };



  const loadMySkills = async () => {
    try {
      const skills = await skillsApi.getMySkills();
      console.log('Loaded my skills:', skills);
      setUserSkills(Array.isArray(skills) ? skills : []);
    } catch (error) {
      console.error('Failed to load skills:', error);
      setUserSkills([]);
    }
  };

  const handleSkillFormChange = (e) => {
    const { name, value } = e.target;
    setSkillFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      const skillData = {
        title: skillFormData.title,
        description: skillFormData.description,
        category: skillFormData.category,
        proficiency: skillFormData.proficiency,
        total_price: parseFloat(skillFormData.totalPrice),
        phone: skillFormData.phone,
        email: skillFormData.email,
        location: skillFormData.location,
        availability: skillFormData.availability,
        skills_wanted: skillFormData.skillsWanted
      };

      console.log('Adding skill:', skillData);
      const newSkill = await skillsApi.createSkill(skillData);
      console.log('Skill added successfully:', newSkill);
      
      // Reload skills and close modal
      await loadMySkills();
      setShowAddSkillModal(false);
      
      // Reset form
      setSkillFormData({
        title: '',
        description: '',
        category: '',
        proficiency: 'beginner',
        totalPrice: '',
        phone: '',
        email: '',
        location: '',
        availability: '',
        skillsWanted: ''
      });
      
      alert('Skill added successfully! It will now be visible to everyone in the skill search.');
    } catch (error) {
      console.error('Failed to add skill:', error);
      alert('Failed to add skill. Please check your connection and try again.');
    }
  };

  const handleEditSkill = (skill) => {
    setEditingSkill(skill);
    setSkillFormData({
      title: skill.title || '',
      description: skill.description || '',
      category: skill.category || '',
      proficiency: skill.proficiency || 'beginner',
      totalPrice: skill.total_price || skill.totalPrice || '',
      phone: skill.phone || '',
      email: skill.email || '',
      location: skill.location || '',
      availability: skill.availability || '',
      skillsWanted: skill.skills_wanted || skill.skillsWanted || ''
    });
    setShowEditSkillModal(true);
  };

  const handleUpdateSkill = async (e) => {
    e.preventDefault();
    try {
      const skillData = {
        title: skillFormData.title,
        description: skillFormData.description,
        category: skillFormData.category,
        proficiency: skillFormData.proficiency,
        total_price: parseFloat(skillFormData.totalPrice),
        phone: skillFormData.phone,
        email: skillFormData.email,
        location: skillFormData.location,
        availability: skillFormData.availability,
        skills_wanted: skillFormData.skillsWanted
      };

      await skillsApi.updateSkill(editingSkill.id, skillData);
      await loadMySkills();
      setShowEditSkillModal(false);
      setEditingSkill(null);
      
      alert('Skill updated successfully!');
    } catch (error) {
      console.error('Failed to update skill:', error);
      alert('Failed to update skill. Please try again.');
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await skillsApi.deleteSkill(skillId);
        await loadMySkills();
        alert('Skill deleted successfully!');
      } catch (error) {
        console.error('Failed to delete skill:', error);
        alert('Failed to delete skill. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-800 via-purple-800 to-indigo-800 relative flex flex-col">
        {/* Tech grid background pattern */}
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

        <Header currentPage="profile" />

        {/* Loading content */}
        <div className="flex-1 flex justify-center items-center relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto shadow-lg shadow-cyan-400/50"></div>
            <p className="mt-4 text-cyan-100">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-800 via-purple-800 to-indigo-800 relative flex flex-col">
      {/* Tech grid background pattern */}
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

      <Header currentPage="profile" />

      <main className="flex-1 py-6 px-6 relative z-10 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            {/* Profile Card - Left Side */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/70 backdrop-blur-sm border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/20 overflow-hidden relative h-full">
                {/* Neon border glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-xl"></div>
              
              <div className="relative z-10">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                        Profile Information
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-cyan-100">Personal details and application.</p>
                    </div>
                    {!isEditing ? (
                      <button 
                        onClick={() => setIsEditing(true)} 
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2 rounded-lg transition duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 border border-cyan-400/50"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <div className="space-x-2">
                        <button 
                          onClick={handleSave} 
                          disabled={saving} 
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 text-white px-4 py-2 rounded-lg transition duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 border border-green-400/50"
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button 
                          onClick={() => setIsEditing(false)} 
                          className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-4 py-2 rounded-lg transition duration-300 shadow-lg shadow-gray-500/30 hover:shadow-gray-500/50 border border-gray-400/50"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-cyan-500/30">
                  <dl>
                    <div className="bg-gray-800/40 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-cyan-300">Username</dt>
                      <dd className="mt-1 text-sm text-cyan-100 sm:mt-0 sm:col-span-2">
                        {!isEditing ? (
                          user?.username || profile?.username || 'N/A'
                        ) : (
                          <input 
                            type="text" 
                            name="username" 
                            value={formData.username} 
                            onChange={handleInputChange} 
                            className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm" 
                            placeholder="Your username" 
                          />
                        )}
                      </dd>
                    </div>
                    <div className="bg-gray-900/40 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-cyan-300">Email</dt>
                      <dd className="mt-1 text-sm text-cyan-100 sm:mt-0 sm:col-span-2">
                        {!isEditing ? (
                          user?.email || profile?.email || 'N/A'
                        ) : (
                          <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleInputChange} 
                            className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm" 
                            placeholder="Your email address" 
                          />
                        )}
                      </dd>
                    </div>
                    <div className="bg-gray-800/40 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-cyan-300">Bio</dt>
                      <dd className="mt-1 text-sm text-cyan-100 sm:mt-0 sm:col-span-2">
                        {!isEditing ? (
                          profile?.bio || 'No bio provided'
                        ) : (
                          <textarea 
                            name="bio" 
                            value={formData.bio} 
                            onChange={handleInputChange} 
                            rows={3} 
                            className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm" 
                            placeholder="Tell us about yourself..." 
                          />
                        )}
                      </dd>
                    </div>
                    <div className="bg-gray-900/40 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-cyan-300">Location</dt>
                      <dd className="mt-1 text-sm text-cyan-100 sm:mt-0 sm:col-span-2">
                        {!isEditing ? (
                          profile?.location || 'No location provided'
                        ) : (
                          <input 
                            type="text" 
                            name="location" 
                            value={formData.location} 
                            onChange={handleInputChange} 
                            className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm" 
                            placeholder="Your location" 
                          />
                        )}
                      </dd>
                    </div>
                    <div className="bg-gray-800/40 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-cyan-300">Phone</dt>
                      <dd className="mt-1 text-sm text-cyan-100 sm:mt-0 sm:col-span-2">
                        {!isEditing ? (
                          profile?.phone || 'No phone provided'
                        ) : (
                          <input 
                            type="tel" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleInputChange} 
                            className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm" 
                            placeholder="Your phone number" 
                          />
                        )}
                      </dd>
                    </div>
                    <div className="bg-gray-900/40 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-cyan-300">Date of Birth</dt>
                      <dd className="mt-1 text-sm text-cyan-100 sm:mt-0 sm:col-span-2">
                        {!isEditing ? (
                          profile?.date_of_birth ? 
                            new Date(profile.date_of_birth).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'No date provided'
                        ) : (
                          <input 
                            type="date" 
                            name="date_of_birth" 
                            value={formData.date_of_birth} 
                            onChange={handleInputChange} 
                            className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm" 
                          />
                        )}
                      </dd>
                    </div>
                    <div className="bg-gray-800/40 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-cyan-300">Mentor Status</dt>
                      <dd className="mt-1 text-sm text-cyan-100 sm:mt-0 sm:col-span-2">
                        {!isEditing ? (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${profile?.is_mentor ? 'bg-green-500/20 text-green-300 border border-green-400/50' : 'bg-gray-500/20 text-gray-300 border border-gray-400/50'}`}>
                            {profile?.is_mentor ? 'Mentor' : 'Learner'}
                          </span>
                        ) : (
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              name="is_mentor" 
                              checked={formData.is_mentor} 
                              onChange={handleInputChange} 
                              className="mr-2 h-4 w-4 text-cyan-400 focus:ring-cyan-500 bg-gray-900/50 border-cyan-400/30 rounded" 
                            />
                            <span className="text-sm text-cyan-200">I want to be a mentor</span>
                          </label>
                        )}
                      </dd>
                    </div>
                    <div className="bg-gray-900/40 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-cyan-300">Rating</dt>
                      <dd className="mt-1 text-sm text-cyan-100 sm:mt-0 sm:col-span-2">
                        {profile?.rating ? (
                          <div className="flex items-center">
                            <span className="text-yellow-400">★★★★★</span>
                            <span className="ml-2">{profile.rating}/5</span>
                            <span className="ml-2 text-cyan-300/60 text-xs">({profile.total_reviews || 0} reviews)</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Not rated yet</span>
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
            </div>

            {/* Skills & Activity Panel - Right Side */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Skills Section */}
                <div className="bg-gray-800/70 backdrop-blur-sm border border-purple-500/30 rounded-xl shadow-2xl shadow-purple-500/20 p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 rounded-xl"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                        My Skills ({userSkills.length})
                      </h3>
                      <button 
                        onClick={() => setShowAddSkillModal(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white px-3 py-1 rounded-lg transition duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 border border-purple-400/50 text-sm"
                      >
                        + Add Skill
                      </button>
                    </div>
                    
                    {userSkills.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-cyan-100 text-sm">No skills added yet</p>
                        <p className="text-cyan-300/60 text-xs mt-2">Add your first skill to start teaching!</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {userSkills.map(skill => (
                          <div key={skill.id} className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300">
                            <div className="flex items-center space-x-3">
                              <img 
                                src={generateMiniCoverDataURL(skill)} 
                                alt={`${skill.title} book cover`}
                                className="w-10 h-12 object-contain drop-shadow-lg"
                              />
                              <div>
                                <h4 className="text-purple-300 font-medium text-sm">{skill.title}</h4>
                                <p className="text-cyan-200 text-xs">{skill.category} • ₹{skill.total_price || skill.totalPrice}</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEditSkill(skill)}
                                className="text-blue-300 hover:text-blue-200 text-xs bg-blue-500/20 hover:bg-blue-500/30 px-2 py-1 rounded transition duration-300"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteSkill(skill.id)}
                                className="text-red-300 hover:text-red-200 text-xs bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded transition duration-300"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Activity Feed */}
                <div className="bg-gray-800/70 backdrop-blur-sm border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/20 p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-xl"></div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 mb-4">
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-900/30 rounded-lg border border-cyan-400/20">
                        <p className="text-cyan-100 text-sm">Welcome to SkillHub! ⚡</p>
                        <p className="text-cyan-300/60 text-xs mt-1">Complete your profile to get started</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-800/70 backdrop-blur-sm border border-green-500/30 rounded-xl shadow-2xl shadow-green-500/20 p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-cyan-500/10 rounded-xl"></div>
                  <div className="relative z-10">
                    <h3 style={{textAlign: 'center'}} className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300 mb-4">
                      What We Provide
                    </h3>
                    <div className="space-y-3">
                      <button className="w-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-400/30 text-green-300 py-2 px-4 rounded-lg transition duration-300 text-sm">
                        Find Learning Partners
                      </button>
                      <button className="w-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border border-blue-400/30 text-blue-300 py-2 px-4 rounded-lg transition duration-300 text-sm">
                        Browse Skills
                      </button>
                      <button className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-400/30 text-purple-300 py-2 px-4 rounded-lg transition duration-300 text-sm">
                        Create Skill Offer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Skill Modal */}
      {showAddSkillModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800/90 backdrop-blur-sm border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/20 max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                  Add New Skill
                </h3>
                <button
                  onClick={() => setShowAddSkillModal(false)}
                  className="text-cyan-300 hover:text-cyan-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAddSkill} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cyan-200 text-sm font-medium mb-2">
                      Skill Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={skillFormData.title}
                      onChange={handleSkillFormChange}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                      placeholder="e.g., React Development"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-cyan-200 text-sm font-medium mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={skillFormData.category}
                      onChange={handleSkillFormChange}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 backdrop-blur-sm"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Programming">Programming</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Languages">Languages</option>
                      <option value="Music">Music</option>
                      <option value="Photography">Photography</option>
                      <option value="Cooking">Cooking</option>
                      <option value="Fitness">Fitness</option>
                      <option value="Writing">Writing</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-cyan-200 text-sm font-medium mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={skillFormData.description}
                    onChange={handleSkillFormChange}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                    placeholder="Describe what you'll teach and your experience..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cyan-200 text-sm font-medium mb-2">
                      Proficiency Level *
                    </label>
                    <select
                      name="proficiency"
                      value={skillFormData.proficiency}
                      onChange={handleSkillFormChange}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 backdrop-blur-sm"
                      required
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-cyan-200 text-sm font-medium mb-2">
                      Total Price ($) *
                    </label>
                    <input
                      type="number"
                      name="totalPrice"
                      value={skillFormData.totalPrice}
                      onChange={handleSkillFormChange}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                      placeholder="100"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cyan-200 text-sm font-medium mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={skillFormData.phone}
                      onChange={handleSkillFormChange}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                      placeholder="+1234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-cyan-200 text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={skillFormData.email}
                      onChange={handleSkillFormChange}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cyan-200 text-sm font-medium mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={skillFormData.location}
                      onChange={handleSkillFormChange}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                      placeholder="City, State/Online"
                    />
                  </div>

                  <div>
                    <label className="block text-cyan-200 text-sm font-medium mb-2">
                      Availability
                    </label>
                    <select
                      name="availability"
                      value={skillFormData.availability}
                      onChange={handleSkillFormChange}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 backdrop-blur-sm"
                    >
                      <option value="">Select Availability</option>
                      <option value="Weekdays">Weekdays</option>
                      <option value="Weekends">Weekends</option>
                      <option value="Evenings">Evenings</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-cyan-200 text-sm font-medium mb-2">
                    Skills You Want to Learn (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="skillsWanted"
                    value={skillFormData.skillsWanted}
                    onChange={handleSkillFormChange}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                    placeholder="Python, Machine Learning, Data Science"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 border border-green-400/50"
                  >
                    Add Skill
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddSkillModal(false)}
                    className="px-6 py-3 border border-purple-400/50 text-purple-300 rounded-lg hover:bg-purple-500/20 transition duration-300 backdrop-blur-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Skill Modal */}
      {showEditSkillModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800/90 backdrop-blur-sm border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/20 max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                  Edit Skill
                </h3>
                <button
                  onClick={() => setShowEditSkillModal(false)}
                  className="text-cyan-300 hover:text-cyan-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleUpdateSkill} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cyan-200 text-sm font-medium mb-2">
                      Skill Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={skillFormData.title}
                      onChange={handleSkillFormChange}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                      placeholder="e.g., React Development"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-cyan-200 text-sm font-medium mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={skillFormData.category}
                      onChange={handleSkillFormChange}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 backdrop-blur-sm"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Programming">Programming</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Languages">Languages</option>
                      <option value="Music">Music</option>
                      <option value="Photography">Photography</option>
                      <option value="Cooking">Cooking</option>
                      <option value="Fitness">Fitness</option>
                      <option value="Writing">Writing</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-cyan-200 text-sm font-medium mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={skillFormData.description}
                    onChange={handleSkillFormChange}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                    placeholder="Describe what you'll teach and your experience..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cyan-200 text-sm font-medium mb-2">
                      Proficiency Level *
                    </label>
                    <select
                      name="proficiency"
                      value={skillFormData.proficiency}
                      onChange={handleSkillFormChange}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 backdrop-blur-sm"
                      required
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-cyan-200 text-sm font-medium mb-2">
                      Total Price ($) *
                    </label>
                    <input
                      type="number"
                      name="totalPrice"
                      value={skillFormData.totalPrice}
                      onChange={handleSkillFormChange}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                      placeholder="100"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cyan-200 text-sm font-medium mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={skillFormData.phone}
                      onChange={handleSkillFormChange}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                      placeholder="+1234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-cyan-200 text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={skillFormData.email}
                      onChange={handleSkillFormChange}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cyan-200 text-sm font-medium mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={skillFormData.location}
                      onChange={handleSkillFormChange}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                      placeholder="City, State/Online"
                    />
                  </div>

                  <div>
                    <label className="block text-cyan-200 text-sm font-medium mb-2">
                      Availability
                    </label>
                    <select
                      name="availability"
                      value={skillFormData.availability}
                      onChange={handleSkillFormChange}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 backdrop-blur-sm"
                    >
                      <option value="">Select Availability</option>
                      <option value="Weekdays">Weekdays</option>
                      <option value="Weekends">Weekends</option>
                      <option value="Evenings">Evenings</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-cyan-200 text-sm font-medium mb-2">
                    Skills You Want to Learn (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="skillsWanted"
                    value={skillFormData.skillsWanted}
                    onChange={handleSkillFormChange}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                    placeholder="Python, Machine Learning, Data Science"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 border border-blue-400/50"
                  >
                    Update Skill
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditSkillModal(false)}
                    className="px-6 py-3 border border-purple-400/50 text-purple-300 rounded-lg hover:bg-purple-500/20 transition duration-300 backdrop-blur-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
