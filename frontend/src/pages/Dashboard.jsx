import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import skillsApi from '../services/skillsApi';
import { generateMiniCoverDataURL } from '../utils/bookCoverGenerator';
import Header from '../components/Header';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('received'); // 'received', 'sent', 'mySkills'
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [mySkills, setMySkills] = useState([]);
  const [editingSkill, setEditingSkill] = useState(null);
  const [showEditSkillModal, setShowEditSkillModal] = useState(false);
  const [applications, setApplications] = useState({
    received: [],
    sent: []
  });
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [customMessage, setCustomMessage] = useState('');
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
    // Load user's skills and applications
    loadMySkills();
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoadingApplications(true);
      const applicationsData = await skillsApi.getMyApplications();
      console.log('Loaded applications:', applicationsData);
      
      // Set real applications data
      setApplications({
        received: Array.isArray(applicationsData.received) ? applicationsData.received : [],
        sent: Array.isArray(applicationsData.sent) ? applicationsData.sent : []
      });
    } catch (error) {
      console.error('Failed to load applications:', error);
      // Set empty arrays if API fails
      setApplications({
        received: [],
        sent: []
      });
    } finally {
      setLoadingApplications(false);
    }
  };

  const loadMySkills = async () => {
    try {
      const skills = await skillsApi.getMySkills();
      console.log('Loaded my skills:', skills);
      setMySkills(Array.isArray(skills) ? skills : []);
    } catch (error) {
      console.error('Failed to load skills:', error);
      setMySkills([]);
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
      
      // Call the actual API
      const response = await skillsApi.createSkill(skillData);
      console.log('Skill created:', response);
      
      // Reload the skills list
      await loadMySkills();
      
      // Close modal and reset form
      setShowAddSkillModal(false);
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

  const handleApplicationAction = async (applicationId, action, applicantEmail, applicantName, skillTitle) => {
    try {
      // Update application status in backend
      await skillsApi.updateApplicationStatus(applicationId, action);
      
      // Update local state
      setApplications(prev => ({
        ...prev,
        received: prev.received.map(app => 
          app.id === applicationId 
            ? { ...app, status: action }
            : app
        )
      }));

      // Send email notification
      await sendEmailNotification(applicantEmail, applicantName, skillTitle, action);
      
      alert(`Application ${action} successfully! Email notification sent to ${applicantName}.`);
    } catch (error) {
      console.error(`Failed to ${action} application:`, error);
      alert(`Failed to ${action} application. Please try again.`);
    }
  };

  const sendEmailNotification = async (recipientEmail, recipientName, skillTitle, action) => {
    try {
      const emailData = {
        to_email: recipientEmail,
        to_name: recipientName,
        from_name: user?.username || 'SkillHub User',
        skill_title: skillTitle,
        action: action,
        message: action === 'accepted' 
          ? `Great news! Your application for "${skillTitle}" has been accepted. The mentor will contact you soon to start your learning journey!`
          : `Thank you for your interest in "${skillTitle}". Unfortunately, your application was not selected this time. Keep exploring other skills on SkillHub!`
      };

      const response = await fetch('http://localhost:8000/api/send-notification/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      console.log('Email notification sent successfully');
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  };

  const sendCustomMessage = async (applicationId, applicantEmail, applicantName, customMessage) => {
    try {
      const emailData = {
        to_email: applicantEmail,
        to_name: applicantName,
        from_name: user?.username || 'SkillHub User',
        skill_title: 'Custom Message',
        action: 'message',
        message: customMessage
      };

      const response = await fetch('http://localhost:8000/api/send-notification/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      alert(`Message sent successfully to ${applicantName}!`);
    } catch (error) {
      console.error('Failed to send custom message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleSendMessage = (application) => {
    setSelectedApplication(application);
    setShowMessageModal(true);
  };

  const submitCustomMessage = async () => {
    if (!customMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    await sendCustomMessage(
      selectedApplication.id,
      selectedApplication.applicant_email || selectedApplication.applicant?.email,
      selectedApplication.applicant_name || selectedApplication.applicant?.username || selectedApplication.applicant,
      customMessage
    );

    setShowMessageModal(false);
    setCustomMessage('');
    setSelectedApplication(null);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
      accepted: 'bg-green-500/20 text-green-300 border-green-400/30',
      rejected: 'bg-red-500/20 text-red-300 border-red-400/30'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
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

      <Header currentPage="dashboard" />

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 mb-2">
              Your Dashboard
            </h2>
            <p className="text-cyan-100">Manage your skill exchange applications and opportunities</p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-gray-800/70 backdrop-blur-sm border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/20 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-xl"></div>
            <div className="relative z-10 p-6">
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setActiveTab('received')}
                  className={`px-6 py-3 rounded-lg font-medium transition duration-300 ${
                    activeTab === 'received'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 border border-cyan-400/50'
                      : 'bg-gray-700/50 text-cyan-300 hover:bg-gray-600/50 border border-gray-600/50'
                  }`}
                >
                  Applications Received ({applications.received.length})
                </button>
                <button
                  onClick={() => setActiveTab('sent')}
                  className={`px-6 py-3 rounded-lg font-medium transition duration-300 ${
                    activeTab === 'sent'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30 border border-purple-400/50'
                      : 'bg-gray-700/50 text-cyan-300 hover:bg-gray-600/50 border border-gray-600/50'
                  }`}
                >
                  Applications Sent ({applications.sent.length})
                </button>
                <button
                  onClick={() => setActiveTab('mySkills')}
                  className={`px-6 py-3 rounded-lg font-medium transition duration-300 ${
                    activeTab === 'mySkills'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 border border-green-400/50'
                      : 'bg-gray-700/50 text-cyan-300 hover:bg-gray-600/50 border border-gray-600/50'
                  }`}
                >
                  My Skills
                </button>
              </div>

              {/* Applications Received Tab */}
              {activeTab === 'received' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-cyan-300 mb-4">Applications for Your Skills</h3>
                  {loadingApplications ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                      <p className="text-cyan-100">Loading applications...</p>
                    </div>
                  ) : applications.received.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-cyan-100">No applications received yet.</p>
                      <p className="text-cyan-300/60 text-sm mt-2">Applications will appear here when someone applies to learn your skills.</p>
                    </div>
                  ) : (
                    applications.received.map(app => (
                      <div key={app.id} className="bg-gray-900/40 border border-cyan-400/20 rounded-lg p-6 hover:border-cyan-400/40 transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-purple-300">
                              {typeof (app.skill_title || app.skill) === 'object' 
                                ? (app.skill_title || app.skill)?.title || 'Unknown Skill'
                                : (app.skill_title || app.skill) || 'Unknown Skill'
                              }
                            </h4>
                            <p className="text-cyan-200">
                              from {typeof (app.applicant_name || app.applicant) === 'object' 
                                ? (app.applicant_name || app.applicant)?.username || 'Unknown User'
                                : (app.applicant_name || app.applicant) || 'Unknown User'
                              }
                            </p>
                            <p className="text-cyan-300/60 text-sm">{formatDate(app.created_at || app.appliedAt)}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            {getStatusBadge(app.status)}
                            <span className="text-green-300 font-semibold">₹{app.proposed_price || app.proposedPrice}</span>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-cyan-100 mb-2">
                            {typeof app.message === 'object' ? JSON.stringify(app.message) : app.message || 'No message'}
                          </p>
                          {app.offering_skill && (
                            <p className="text-green-300 text-sm">
                              💡 Skill Exchange Offer: {typeof app.offering_skill === 'object' ? JSON.stringify(app.offering_skill) : app.offering_skill}
                            </p>
                          )}
                          <p className="text-blue-300 text-sm mt-2">
                            📱 Preferred Contact: {typeof (app.preferred_contact || app.preferredContact) === 'object' ? JSON.stringify(app.preferred_contact || app.preferredContact) : (app.preferred_contact || app.preferredContact) || 'Not specified'}
                          </p>
                          <p className="text-cyan-300 text-sm">
                            📧 Email: {typeof (app.applicant_email || app.applicant) === 'object' 
                              ? (app.applicant_email || app.applicant)?.email || 'No email'
                              : (app.applicant_email || app.applicant) || 'No email'
                            }
                          </p>
                        </div>

                        {app.status === 'pending' && (
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleApplicationAction(
                                app.id, 
                                'accepted',
                                typeof (app.applicant_email || app.applicant) === 'object' 
                                  ? (app.applicant_email || app.applicant)?.email 
                                  : (app.applicant_email || app.applicant),
                                typeof (app.applicant_name || app.applicant) === 'object' 
                                  ? (app.applicant_name || app.applicant)?.username 
                                  : (app.applicant_name || app.applicant),
                                typeof (app.skill_title || app.skill) === 'object' 
                                  ? (app.skill_title || app.skill)?.title 
                                  : (app.skill_title || app.skill)
                              )}
                              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-4 py-2 rounded-lg transition duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 border border-green-400/50"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleApplicationAction(
                                app.id, 
                                'rejected',
                                typeof (app.applicant_email || app.applicant) === 'object' 
                                  ? (app.applicant_email || app.applicant)?.email 
                                  : (app.applicant_email || app.applicant),
                                typeof (app.applicant_name || app.applicant) === 'object' 
                                  ? (app.applicant_name || app.applicant)?.username 
                                  : (app.applicant_name || app.applicant),
                                typeof (app.skill_title || app.skill) === 'object' 
                                  ? (app.skill_title || app.skill)?.title 
                                  : (app.skill_title || app.skill)
                              )}
                              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white px-4 py-2 rounded-lg transition duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 border border-red-400/50"
                            >
                              Decline
                            </button>
                            <button 
                              onClick={() => handleSendMessage(app)}
                              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white px-4 py-2 rounded-lg transition duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 border border-blue-400/50"
                            >
                              Message
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Applications Sent Tab */}
              {activeTab === 'sent' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-purple-300 mb-4">Your Skill Learning Applications</h3>
                  {applications.sent.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-cyan-100">No applications sent yet.</p>
                    </div>
                  ) : (
                    applications.sent.map(app => (
                      <div key={app.id} className="bg-gray-900/40 border border-purple-400/20 rounded-lg p-6 hover:border-purple-400/40 transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-cyan-300">
                              {typeof app.skill === 'object' ? app.skill?.title || JSON.stringify(app.skill) : app.skill || 'Unknown Skill'}
                            </h4>
                            <p className="text-purple-200">
                              to {typeof app.mentor === 'object' ? app.mentor?.username || JSON.stringify(app.mentor) : app.mentor || 'Unknown Mentor'}
                            </p>
                            <p className="text-purple-300/60 text-sm">{formatDate(app.appliedAt)}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            {getStatusBadge(app.status)}
                            <span className="text-green-300 font-semibold">₹{app.proposedPrice}</span>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-cyan-100 mb-2">
                            {typeof app.message === 'object' ? JSON.stringify(app.message) : app.message || 'No message'}
                          </p>
                          {app.skillOffer && (
                            <p className="text-green-300 text-sm">
                              💡 Your Skill Offer: {typeof app.skillOffer === 'object' ? JSON.stringify(app.skillOffer) : app.skillOffer}
                            </p>
                          )}
                          <p className="text-blue-300 text-sm mt-2">
                            📱 Contact: {typeof app.preferredContact === 'object' ? JSON.stringify(app.preferredContact) : app.preferredContact || 'Not specified'}
                          </p>
                        </div>

                        {app.status === 'accepted' && (
                          <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3 mt-4">
                            <p className="text-green-300 font-semibold">🎉 Congratulations! Your application was accepted.</p>
                            <p className="text-green-200 text-sm">
                              The mentor will contact you soon via {typeof app.preferredContact === 'object' ? JSON.stringify(app.preferredContact) : app.preferredContact || 'your preferred contact method'}.
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* My Skills Tab */}
              {activeTab === 'mySkills' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-green-300 mb-4">Skills You're Teaching</h3>
                    <button 
                      onClick={() => setShowAddSkillModal(true)}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-4 py-2 rounded-lg transition duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 border border-green-400/50"
                    >
                      + Add New Skill
                    </button>
                  </div>
                  
                  {mySkills.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-cyan-100">No skills posted yet. Add your first skill to start teaching!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mySkills.map(skill => (
                        <div key={skill.id} className="bg-gray-900/40 border border-green-400/20 rounded-lg p-6 hover:border-green-400/40 transition-all duration-300">
                          <div className="flex items-start space-x-4 mb-4">
                            {/* Mini Book Cover */}
                            <div className="flex-shrink-0">
                              <img 
                                src={generateMiniCoverDataURL(skill)} 
                                alt={`${skill.title} book cover`}
                                className="w-16 h-20 object-contain drop-shadow-lg"
                              />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="text-lg font-semibold text-green-300">
                                    {typeof skill.title === 'object' ? JSON.stringify(skill.title) : skill.title || 'Unknown Skill'}
                                  </h4>
                                  <p className="text-cyan-200">
                                    {typeof skill.category === 'object' ? JSON.stringify(skill.category) : skill.category || 'Unknown Category'}
                                  </p>
                                  <p className="text-green-300 font-semibold">
                                    ₹{skill.totalPrice || skill.total_price || 0}
                                  </p>
                                </div>
                                <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded border border-green-400/30">
                                  {typeof skill.proficiency === 'object' ? JSON.stringify(skill.proficiency) : skill.proficiency || 'Unknown'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-cyan-100 text-sm mb-3">
                            {typeof skill.description === 'object' ? JSON.stringify(skill.description) : skill.description || 'No description'}
                          </p>
                          
                          <div className="flex justify-between items-center text-xs text-cyan-300 mb-4">
                            <span>{typeof skill.location === 'object' ? JSON.stringify(skill.location) : skill.location || 'Unknown'}</span>
                            <span>{typeof skill.availability === 'object' ? JSON.stringify(skill.availability) : skill.availability || 'Unknown'}</span>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditSkill(skill)}
                              className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 py-2 px-3 rounded text-sm transition duration-300"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteSkill(skill.id)}
                              className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 py-2 px-3 rounded text-sm transition duration-300"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
                      Total Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="totalPrice"
                      value={skillFormData.totalPrice}
                      onChange={handleSkillFormChange}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                      placeholder="Total price for the skill"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cyan-200 text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={skillFormData.email}
                      onChange={handleSkillFormChange}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-cyan-200 text-sm font-medium mb-2">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={skillFormData.phone}
                      onChange={handleSkillFormChange}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                      placeholder="+1 (555) 123-4567"
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
                      placeholder="e.g., Remote, New York, etc."
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
                      <option value="weekdays">Weekdays</option>
                      <option value="weekends">Weekends</option>
                      <option value="evenings">Evenings</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-cyan-200 text-sm font-medium mb-2">
                    Skills You Want to Learn (Optional)
                  </label>
                  <input
                    type="text"
                    name="skillsWanted"
                    value={skillFormData.skillsWanted}
                    onChange={handleSkillFormChange}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                    placeholder="e.g., Python, UI Design, Photography (comma separated)"
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
                      Total Price (₹) *
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
                      Phone (Optional)
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
                      Email (Optional)
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
                      placeholder="e.g., Remote, New York, etc."
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
                      <option value="weekdays">Weekdays</option>
                      <option value="weekends">Weekends</option>
                      <option value="evenings">Evenings</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-cyan-200 text-sm font-medium mb-2">
                    Skills You Want to Learn (Optional)
                  </label>
                  <input
                    type="text"
                    name="skillsWanted"
                    value={skillFormData.skillsWanted}
                    onChange={handleSkillFormChange}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                    placeholder="e.g., Python, UI Design, Photography (comma separated)"
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

      {/* Custom Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800/90 backdrop-blur-sm border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/20 max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                  Send Message
                </h3>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="text-cyan-300 hover:text-cyan-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <p className="text-cyan-200 text-sm mb-2">
                  Sending to: {typeof (selectedApplication?.applicant_name || selectedApplication?.applicant) === 'object' 
                    ? (selectedApplication?.applicant_name || selectedApplication?.applicant)?.username || 'Unknown User'
                    : (selectedApplication?.applicant_name || selectedApplication?.applicant) || 'Unknown User'
                  }
                </p>
                <p className="text-cyan-300/60 text-xs">
                  Email: {typeof (selectedApplication?.applicant_email || selectedApplication?.applicant) === 'object' 
                    ? (selectedApplication?.applicant_email || selectedApplication?.applicant)?.email || 'No email'
                    : (selectedApplication?.applicant_email || selectedApplication?.applicant) || 'No email'
                  }
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-cyan-200 text-sm font-medium mb-2">
                  Your Message
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 placeholder-cyan-300/60 backdrop-blur-sm"
                  placeholder="Type your message here..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={submitCustomMessage}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 border border-blue-400/50"
                >
                  Send Message
                </button>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="px-6 py-3 border border-purple-400/50 text-purple-300 rounded-lg hover:bg-purple-500/20 transition duration-300 backdrop-blur-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;