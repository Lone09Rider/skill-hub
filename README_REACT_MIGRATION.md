# SkillSwap AI - React + Django Setup

## 🚀 Migration to React Complete!

Your Django application has been successfully migrated from Django templates to React frontend with Django REST API backend.

## 🏗️ Architecture

- **Backend**: Django REST API with JWT authentication
- **Frontend**: React with Tailwind CSS
- **Database**: MySQL
- **Authentication**: JWT tokens with refresh mechanism

## 📁 Project Structure

```
My Project - Skill swap/
├── core/                    # Django app
│   ├── models.py           # Database models
│   ├── serializers.py      # DRF serializers (NEW)
│   ├── api_views.py        # API endpoints (NEW)
│   ├── views.py            # Traditional Django views (kept for backward compatibility)
│   └── urls.py             # URL routing (updated with API endpoints)
├── frontend/               # React application (NEW)
│   ├── src/
│   │   ├── pages/          # React page components
│   │   ├── contexts/       # React context (Auth)
│   │   ├── services/       # API client utilities
│   │   └── App.jsx         # Main React app
│   ├── tailwind.config.js  # Tailwind configuration
│   └── package.json        # React dependencies
├── skillswap/              # Django project
│   ├── settings.py         # Updated with DRF & CORS
│   └── urls.py             # Added JWT token endpoints
└── manage.py
```

## 🛠️ Running the Application

### 1. Start Django Backend (Terminal 1)

```powershell
# Activate virtual environment
.venv\Scripts\Activate.ps1

# Start Django development server
python manage.py runserver
```

Django API will be available at: `http://127.0.0.1:8000/`

### 2. Start React Frontend (Terminal 2)

```powershell
# Navigate to frontend directory
cd frontend

# Start React development server
npm run dev
```

React app will be available at: `http://localhost:5173/` (Vite default port)

## 🔗 API Endpoints

### Authentication
- `POST /api/signup/` - User registration
- `POST /api/login/` - User login
- `POST /api/logout/` - User logout
- `POST /api/token/` - Get JWT token pair
- `POST /api/token/refresh/` - Refresh JWT token

### Profile Management
- `GET /api/profile/` - Get user profile
- `PUT /api/profile/update/` - Update user profile

### Skills & Offers
- `GET /api/skills/` - List skills
- `POST /api/skills/` - Create skill
- `GET /api/offers/` - List offers
- `POST /api/offers/` - Create offer
- `GET /api/my-offers/` - Get user's offers

## 🎨 Frontend Features

### Completed Pages
- **Home** (`/`) - Landing page with login form
- **Signup** (`/signup`) - User registration
- **Profile** (`/profile`) - User profile management (protected route)

### Authentication Flow
1. User lands on home page
2. Can login directly or navigate to signup
3. After successful authentication, redirected to profile
4. JWT tokens stored in localStorage with auto-refresh
5. Protected routes require authentication

## 🔧 Key Features Implemented

### Backend (Django)
- ✅ Django REST Framework setup
- ✅ JWT authentication with SimpleJWT
- ✅ CORS headers for React integration
- ✅ API serializers for all models
- ✅ Comprehensive API endpoints
- ✅ Token refresh mechanism

### Frontend (React)
- ✅ Modern React with hooks
- ✅ React Router for navigation
- ✅ Authentication context
- ✅ Axios API client with interceptors
- ✅ Tailwind CSS styling
- ✅ Responsive design
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling

## 🚀 Next Steps

To continue development, consider implementing:

1. **Skills Management Pages**
   - Create/edit skills
   - Browse available skills
   - Skill matching interface

2. **Offers & Matching**
   - Create skill exchange offers
   - AI-powered matching algorithm
   - Match browsing and acceptance

3. **Real-time Chat**
   - WebSocket integration
   - Chat between matched users
   - File sharing capabilities

4. **Enhanced Profile**
   - Profile picture upload
   - Portfolio/work samples
   - Reviews and ratings

5. **Search & Filtering**
   - Advanced search functionality
   - Location-based filtering
   - Skill category browsing

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure both Django and React are running, and CORS settings are correct in Django settings.

2. **Authentication Issues**: Check that JWT tokens are being saved to localStorage and API endpoints are correct.

3. **Database Errors**: Ensure MySQL is running and migrations are applied.

4. **Styling Issues**: Make sure Tailwind CSS is properly configured and the build process is running.

## 📝 Development Notes

- The original Django templates are preserved for reference
- API endpoints follow REST conventions
- Authentication uses JWT with refresh tokens
- React components use functional components with hooks
- Responsive design implemented with Tailwind CSS
- Error boundaries and loading states included

Your SkillSwap AI application is now a modern, scalable React + Django REST API application! 🎉