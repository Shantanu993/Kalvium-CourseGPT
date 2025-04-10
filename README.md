# CourseGPT: AI-Powered Course Authoring Platform

CourseGPT is an intelligent authoring tool that empowers educators and content creators to efficiently create, organize, and enhance educational content through AI-assisted content generation, structured templates, and intuitive organization tools.

## Features

- **AI-Powered Content Generation**: Generate complete lessons, learning objectives, and activities with advanced AI technology
- **Modular Organization**: Organize your content into logical modules and lessons with intelligent sequencing
- **Interactive Editor**: Fine-tune AI-generated content with our intuitive editing interface
- **Educational Templates**: Start with professionally designed templates optimized for different learning contexts
- **Comprehensive Activities**: Generate quizzes, discussions, assignments, and interactive exercises automatically

## Technologies Used

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes (serverless functions)
- **Database**: MongoDB
- **AI Integration**: OpenAI API
- **Authentication**: NextAuth.js
- **PWA Features**: Service workers, manifest file, offline capabilities

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database
- OpenAI API key
- Google OAuth credentials (optional, for social login)

### Installation

1. Clone the repository:
   git clone https://github.com/Shantanu993/Kalvium-CourseGPT.git
   cd coursegpt

2. Install dependencies:
   npm install

3. Create a `.env.local` file in the root directory with the following variables:

   - MONGODB_URI=your-mongodb-connection-string
   - NEXTAUTH_URL=http://localhost:3000
   - NEXTAUTH_SECRET=your-nextauth-secret
   - GOOGLE_CLIENT_ID=your-google-client-id
   - GOOGLE_CLIENT_SECRET=your-google-client-secret
   - OPENAI_API_KEY=your-openai-api-key

4. Run the development server:
   npm run dev

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

The application is deployed on Vercel. To deploy your own instance:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure the environment variables in the Vercel dashboard
4. Deploy!

## Usage

1. Sign in to your account
2. Create a new course by providing basic information
3. Generate module structure using AI
4. Add lessons to modules with AI assistance
5. Edit and refine the generated content
6. Organize your course structure as needed

### Platform Overview

CourseGPT platform with the following features:

- AI-Powered Content Generation: The platform uses OpenAI's API to generate educational content, including lesson structures, learning outcomes, and activities.

- Modular Course Organization: Users can create courses with modules and lessons in a hierarchical structure.

- Interactive Content Editor: The platform includes a rich editor for refining AI-generated content with real-time preview.

- User Authentication: Secure user accounts with NextAuth.js, supporting both credential and social logins.

- Responsive Design: The UI is fully responsive and works on all device sizes.

- Progressive Web App: The application functions as a PWA with offline capabilities.

- Database Integration: MongoDB is used for storing course content and user data.

This implementation provides a solid foundation that can be extended with additional features like:

- Collaborative editing

- Content export options (PDF, SCORM, etc.)

- More advanced AI-powered features like content recommendations

- Analytics and insights on course effectiveness

- Integration with LMS platforms

The modular architecture makes it easy to add these features in the future.
