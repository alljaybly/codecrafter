# 🚀 CodeCrafter

A full-stack web application for generating code from natural language descriptions, built for the Code with Kiro Hackathon.

## ✨ Features

- **React Frontend**: Modern React with TypeScript and Tailwind CSS
- **Voice Input**: AWS Transcribe integration for voice-to-text
- **Code Generation**: AI-powered code generation from descriptions
- **Supabase Backend**: Real-time database for storing generated code
- **Netlify Deployment**: Serverless functions for production deployment

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Supabase
- **Cloud Services**: AWS Transcribe, Netlify Functions
- **Database**: Supabase (PostgreSQL)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- AWS account (for Transcribe)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/alljaybly/codecrafter.git
cd codecrafter
```

2. **Install dependencies:**
```bash
# Frontend dependencies
cd frontend && npm install

# Backend dependencies
cd ../backend && npm install
```

3. **Set up environment variables:**
```bash
# Copy environment templates
cp .env.example .env
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

4. **Configure your credentials** in the `.env` files with your Supabase and AWS details.

5. **Set up the database:**
   - Go to your Supabase project SQL editor
   - Run the script from `database/setup.sql`

### 🏃‍♂️ Development

1. **Start the backend:**
```bash
cd backend && node server.js
```

2. **Start the frontend:**
```bash
cd frontend && npm start
```

3. **Test the setup:**
```bash
node test-local.js
```

4. Visit `http://localhost:3000` to use the application.

## 🌐 Deployment

### Netlify Deployment

1. **Connect to Netlify:**
   - Link your GitHub repository to Netlify
   - Set base directory: `frontend`
   - Build command: `npm ci && npm run build`
   - Publish directory: `build`
   - Functions directory: `netlify/functions`

2. **Environment Variables:**
   Add these in your Netlify dashboard:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_REGION=us-east-1
   ```

## 📁 Project Structure

```
codecrafter/
├── frontend/                    # React TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── InputForm.tsx   # Main form with voice input
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── netlify/
│   │   └── functions/          # Serverless functions
│   │       └── generate-code.js
│   ├── package.json
│   └── tailwind.config.js
├── backend/                     # Node.js Express backend
│   ├── server.js               # Main server with API endpoints
│   └── package.json
├── database/
│   └── setup.sql              # Supabase database schema
├── netlify.toml               # Netlify configuration
├── test-local.js              # Local testing script
└── .env.example               # Environment template
```

## 🔌 API Endpoints

### POST `/generate-code`
Generate code from a natural language description.

**Request:**
```json
{
  "idea": "Create a todo app with user authentication"
}
```

**Response:**
```json
{
  "id": 1,
  "idea": "Create a todo app with user authentication",
  "code": "// Generated React component code...",
  "generated_at": "2024-01-01T00:00:00Z"
}
```

### POST `/transcribe`
Transcribe audio to text using AWS Transcribe.

**Request:**
```json
{
  "audio": "base64_encoded_audio_data"
}
```

**Response:**
```json
{
  "transcription": "Create a todo app with user authentication"
}
```

## 🧪 Testing

Run the local test suite:
```bash
node test-local.js
```

This will verify:
- Backend server health
- Code generation endpoint
- Audio transcription endpoint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🎯 Built for Code with Kiro Hackathon

This project demonstrates a complete full-stack application with:
- Modern React frontend with TypeScript
- Voice input capabilities
- Serverless backend functions
- Database integration
- Production-ready deployment configuration