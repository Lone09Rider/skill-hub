// Backend API integration for SkillSwap
const API_BASE_URL = 'http://localhost:8000';

// Get token from localStorage (matching the auth context)
const getToken = () => localStorage.getItem('accessToken');

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    ...options
  };

  try {
    console.log(`Making API request to: ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    console.log(`API response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`API response data:`, data);
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Skills API
const skillsApi = {
  // Get all skills for browsing with filters
  getAllSkills: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.proficiency) queryParams.append('proficiency', filters.proficiency);
    if (filters.search) queryParams.append('search', filters.search);
    
    const endpoint = `/api/skills/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await apiRequest(endpoint);
  },

  // Create a new skill
  createSkill: async (skillData) => {
    return await apiRequest('/api/skills/', {
      method: 'POST',
      body: JSON.stringify(skillData)
    });
  },

  // Get current user's skills
  getMySkills: async () => {
    return await apiRequest('/api/my-skills/');
  },

  // Update a skill
  updateSkill: async (skillId, skillData) => {
    return await apiRequest(`/api/skills/${skillId}/`, {
      method: 'PUT',
      body: JSON.stringify(skillData)
    });
  },

  // Delete a skill
  deleteSkill: async (skillId) => {
    return await apiRequest(`/api/skills/${skillId}/`, {
      method: 'DELETE'
    });
  },

  // Apply to a skill
  applyToSkill: async (applicationData) => {
    return await apiRequest('/api/apply/', {
      method: 'POST',
      body: JSON.stringify(applicationData)
    });
  },

  // Get user applications (sent and received)
  getMyApplications: async () => {
    return await apiRequest('/api/my-applications/');
  },

  // Update application status
  updateApplicationStatus: async (applicationId, status) => {
    return await apiRequest(`/api/applications/${applicationId}/status/`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }
};

// Mock data for testing (will be replaced by real API calls)
export const mockSkills = [
  {
    id: 1,
    title: "React Development",
    description: "Learn modern React with hooks, context, and best practices",
    category: "Programming",
    proficiency: "advanced",
    total_price: 1500,
    email: "john@example.com",
    phone: "+1234567890",
    location: "Remote",
    availability: "weekends",
    skills_wanted: "Python, Node.js",
    user: { username: "john_doe", email: "john@example.com" },
    username: "john_doe",
    user_email: "john@example.com",
    is_active: true,
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    title: "Python Programming",
    description: "Complete Python course from basics to advanced concepts",
    category: "Programming",
    proficiency: "expert",
    total_price: 2000,
    email: "sarah@example.com",
    phone: "+1987654321",
    location: "New York",
    availability: "flexible",
    skills_wanted: "React, Vue.js",
    user: { username: "sarah_smith", email: "sarah@example.com" },
    username: "sarah_smith",
    user_email: "sarah@example.com",
    is_active: true,
    created_at: "2024-01-14T14:30:00Z"
  }
];

export const mockApplications = {
  received: [
    {
      id: 1,
      applicant: { username: "jane_doe", email: "jane@example.com" },
      skill: { title: "React Development", id: 1 },
      skill_title: "React Development",
      skill_owner: "john_doe",
      message: "I'm interested in learning React and have Python experience to offer in exchange.",
      offering_skill: "Python Development",
      status: "pending",
      created_at: "2024-01-16T12:00:00Z"
    }
  ],
  sent: []
};

export default skillsApi;