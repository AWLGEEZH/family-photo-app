# Family Photo Sharing App

A secure, family-focused photo and video sharing application built with React and Node.js. Share precious family moments with immediate family members in a private, secure environment.

## Features

### 🔐 Security First
- JWT-based authentication
- Family-based access control
- Secure file upload with Cloudinary integration
- Rate limiting and security headers
- Input validation and sanitization

### 👨‍👩‍👧‍👦 Family-Centered Design
- Family code system for secure member invitation
- Support for multiple children and pets profiles
- Tag family members in photos and videos
- Private family galleries

### 📸 Media Sharing
- Photo and video upload support
- Modern responsive gallery interface
- Like and comment system
- Drag and drop file upload
- Multiple file selection

### 📱 User Experience
- Modern, clean interface with Tailwind CSS
- Responsive design (mobile-ready for future iterations)
- Real-time interactions
- Intuitive navigation

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **Cloudinary** for media storage
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **Helmet** for security headers
- **Rate limiting** for API protection

### Frontend
- **React** 18 with functional components
- **React Router** for navigation
- **Axios** for API communication
- **Tailwind CSS** for styling
- **Heroicons** for icons
- **date-fns** for date formatting

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Cloudinary account for media storage

### Environment Setup

1. Clone and navigate to the project:
```bash
cd family-photo-app
```

2. Install dependencies:
```bash
npm run install-all
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/family-photo-app
JWT_SECRET=your-super-secret-jwt-key-here
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
NODE_ENV=development
```

### Database Setup
Make sure MongoDB is running on your system or configure a cloud MongoDB URI.

### Cloudinary Setup
1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret from the dashboard
3. Add these credentials to your `.env` file

### Running the Application

1. Development mode (runs both client and server):
```bash
npm run dev
```

2. Or run separately:
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

3. Open your browser to `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/join-family` - Join family with code

### Profile Management
- `GET /api/profile/children` - Get user's children/pets
- `POST /api/profile/children` - Add child/pet
- `PUT /api/profile/children/:id` - Update child/pet
- `DELETE /api/profile/children/:id` - Remove child/pet
- `GET /api/profile/family` - Get family members

### Posts
- `GET /api/posts` - Get family posts
- `POST /api/posts` - Create new post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comments` - Add comment
- `DELETE /api/posts/:id` - Delete post

## Security Features

### Authentication & Authorization
- Secure JWT token implementation
- Password hashing with bcrypt
- Protected routes requiring authentication
- Family-based access control

### Data Protection
- Input validation on all endpoints
- Rate limiting to prevent abuse
- Secure headers with Helmet
- File type validation for uploads
- Image optimization and processing

### Privacy Controls
- Family-only content sharing
- Private post options
- Secure family invitation system
- No public access to content

## Usage Guide

### Getting Started
1. **Register**: Create your account as a parent or guardian
2. **Family Code**: You'll receive a unique family code to share with family members
3. **Add Children/Pets**: Create profiles for your children and pets
4. **Upload Photos**: Share your precious family moments
5. **Invite Family**: Share your family code with other family members

### Sharing Content
1. Click "Upload" in the navigation
2. Select photos or videos (multiple files supported)
3. Add a caption describing the moment
4. Tag family members who appear in the content
5. Choose privacy settings
6. Share with your family

### Family Management
1. Go to your Profile page
2. Add children and pet profiles
3. Share your family code with relatives
4. View all family members

## Future Enhancements

### Mobile App
- React Native mobile application
- Push notifications for new posts
- Offline photo viewing
- Mobile-optimized camera integration

### Advanced Features
- Video calling integration
- Photo albums and collections
- Advanced search and filtering
- Photo editing tools
- Automatic photo organization
- Face recognition for auto-tagging

### Social Features
- Photo challenges and themes
- Family timeline and memories
- Birthday and anniversary reminders
- Family tree integration

## Contributing

This is a family project focused on privacy and security. If you'd like to contribute:

1. Ensure all security best practices are followed
2. Maintain the family-friendly focus
3. Test thoroughly before submitting changes
4. Document any new features or changes

## License

MIT License - Feel free to use this for your own family!

## Support

For questions or issues, please check the documentation or create an issue in the repository.

---

**Built with ❤️ for families who want to share their precious moments securely.**