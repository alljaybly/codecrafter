# CodeCrafter

A full-stack web application that generates code snippets from user ideas using text input or voice commands.

## Features

- **Text Input**: Enter your app idea in a textarea
- **Voice Input**: Use AWS Transcribe to convert speech to text
- **Code Generation**: Generate React components based on your ideas
- **Database Storage**: Store all generated ideas in Supabase
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Axios for API calls
- AWS SDK for voice transcription
- Hosted on Netlify

### Backend
- Node.js with Express
- Supabase for database
- AWS Transcribe for voice processing
- CORS enabled for cross-origin requests

### Database
- Supabase PostgreSQL
- Table: `generated_code` with columns:
  - `id` (bigint, primary key)
  - `idea` (text)
  - `generated_at` (timestamp)

## Project Structure

\`\`\`
codecrafter/
├── frontend/              # React TypeScript application
│   ├── src/
│   │   ├── components/
│   │   │   └── InputForm.tsx
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.tsx
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── netlify.toml
├── backend/               # Express.js API server
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── database/              # Supabase setup
│   └── setup.sql
└── docs/                  # Documentation
    └── README.md
\`\`\`

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- AWS account (for Transcribe service)

### Backend Setup

1. Navigate to the backend directory:
   \`\`\`bash
   cd backend
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create environment file:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. Configure your environment variables in \`.env\`:
   \`\`\`
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_REGION=us-east-1
   PORT=3001
   \`\`\`

5. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

### Frontend Setup

1. Navigate to the frontend directory:
   \`\`\`bash
   cd frontend
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create environment file:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. Configure your API URL in \`.env\`:
   \`\`\`
   REACT_APP_API_URL=http://localhost:3001
   \`\`\`

5. Start the development server:
   \`\`\`bash
   npm start
   \`\`\`

### Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. In your Supabase dashboard, go to the SQL editor

3. Run the setup script from \`database/setup.sql\`:
   \`\`\`sql
   -- Create the generated_code table
   CREATE TABLE IF NOT EXISTS generated_code (
       id BIGSERIAL PRIMARY KEY,
       idea TEXT NOT NULL,
       generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   \`\`\`

4. Get your project URL and anon key from Settings > API

## API Endpoints

### POST /generate-code
Generates code based on user idea and stores it in the database.

**Request Body:**
\`\`\`json
{
  "idea": "Create a todo app with user authentication"
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": 1,
  "idea": "Create a todo app with user authentication",
  "code": "// Generated React component code...",
  "generated_at": "2024-01-01T12:00:00Z"
}
\`\`\`

### POST /transcribe
Transcribes audio to text using AWS Transcribe.

**Request Body:**
\`\`\`json
{
  "audio": "base64_encoded_audio_data"
}
\`\`\`

**Response:**
\`\`\`json
{
  "transcription": "Create a todo application with user authentication"
}
\`\`\`

## Deployment

### Frontend (Netlify)

1. Build the project:
   \`\`\`bash
   cd frontend
   npm run build
   \`\`\`

2. Deploy to Netlify:
   - Connect your GitHub repository to Netlify
   - Set build command: \`npm run build\`
   - Set publish directory: \`build\`
   - Add environment variable: \`REACT_APP_API_URL\`

### Backend (Heroku/Railway/Render)

1. Create a new app on your preferred platform

2. Set environment variables:
   - \`SUPABASE_URL\`
   - \`SUPABASE_ANON_KEY\`
   - \`AWS_ACCESS_KEY_ID\`
   - \`AWS_SECRET_ACCESS_KEY\`
   - \`AWS_REGION\`

3. Deploy the backend directory

## Usage

1. Open the application in your browser
2. Enter your app idea in the textarea or use voice input
3. Click "Generate Code" to create a React component
4. View the generated code in the output section
5. All ideas are automatically saved to the database

## Code Templates

The application includes several pre-built templates:

- **Todo App**: Task management with add/toggle functionality
- **Weather App**: Weather display with city search
- **Counter App**: Simple increment/decrement counter
- **Default**: Basic React component template

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details