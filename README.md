# Block Query

<div align="center">
  <p><em>Accurate blockchain information at your fingertips</em></p>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/next.js-15.3-black" alt="Next.js" />
  <img src="https://img.shields.io/badge/react-19-blue" alt="React" />
  <img src="https://img.shields.io/badge/tailwindcss-4-38B2AC" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/typescript-5-3178C6" alt="TypeScript" />
  <img src="https://img.shields.io/badge/prisma-6-2D3748" alt="Prisma" />
  <img src="https://img.shields.io/badge/clerk-auth-6C47FF" alt="Clerk" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
</div>

<br />

Block Query is an elegant, AI-powered interface for interacting with blockchain data. It provides natural language querying capabilities for blockchain information, making complex data accessible through conversational interactions.

## ✨ Features

- **Conversational AI Interface** - Ask questions in natural language about blockchain concepts
- **Multiple AI Models** - Choose between different models for varied responses
- **Chat History** - View, search, and return to previous conversations
- **User Authentication** - Secure user accounts with [Clerk](https://clerk.com)
- **Responsive Design** - Beautiful interface that works across devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.9+ (for the backend server)
- PostgreSQL database

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/block-query-web.git
cd block-query-web
```

2. **Install frontend dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/blockquery"

# Backend server
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. **Set up the database**

```bash
npx prisma generate
npx prisma migrate dev
```

5. **Set up the backend server**

```bash
cd server
pip install -r requirements.txt
```

Create a `.env` file in the server directory:

```
MODEL_PATH="./models"
DATABASE_URL="postgresql://user:password@localhost:5432/blockquery"
ALLOWED_ORIGINS=http://localhost:3000
```

### Running the application

You can run the frontend and backend separately:

1. **Start the frontend**

```bash
npm run dev
# Uses turbopack for faster development
```

2. **Start the backend**

```bash
npm run server
# Runs the FastAPI server with hot reloading
```

Or run both concurrently:

```bash
npm run dev:all
# Starts both frontend and backend with color-coded logs
```

Visit `http://localhost:3000` to access the application.

## 🧩 Project Structure

```
block-query-web/
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── server/               # Python backend server
│   ├── models/           # AI models
│   └── main.py           # FastAPI server
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── ui/           # Base UI components
│   │   └── ...           # Feature components
│   ├── lib/              # Utility functions and libraries
│   └── types/            # TypeScript type definitions
└── ...
```

## 🔧 Technical Architecture

### Frontend

- **Next.js 15.3** - React framework with App Router and Turbopack
- **React 19** - Latest React version with concurrent features
- **TypeScript 5** - Type safety and better developer experience
- **Tailwind CSS 4** - Latest utility-first CSS framework
- **Clerk** - Authentication and user management
- **Prisma 6** - Type-safe database client
- **Framer Motion** - Animations and transitions
- **Shadcn UI** - Accessible component primitives based on Radix UI
- **Lucide React** - Beautiful SVG icon components

### Backend

- **FastAPI** - High-performance Python web framework
- **PyTorch** - Deep learning framework
- **Hugging Face Transformers** - NLP models for blockchain information
- **PostgreSQL** - Relational database for storing chats and messages
- **Uvicorn** - ASGI server for running the FastAPI application

## 🧠 AI Models

Block Query uses specialized language models trained on blockchain information. Available models include:

- **BART** - Bidirectional Auto-Regressive Transformer
- **T5** - Text-to-Text Transfer Transformer
- **Flan-T5** - T5 fine-tuned on instructional tasks
- **Pegasus** - Optimized for abstractive summarization

## 🔄 API Endpoints

### Frontend to Backend

- `POST /predict` - Send a question to the AI models
- `GET /health` - Check server status

### Frontend to Database (via Next.js API routes)

- `GET /api/chats` - Get all chats for the current user
- `POST /api/chats` - Create a new chat
- `GET /api/chats/:id` - Get a specific chat
- `POST /api/chats/:id/messages` - Add messages to a chat

## 📦 Package Scripts

```bash
# Development
npm run dev          # Start Next.js with Turbopack
npm run server       # Start the Python backend server
npm run dev:all      # Run both frontend and backend concurrently

# Production
npm run build        # Build the Next.js application
npm run start        # Start the production Next.js server

# Quality
npm run lint         # Run ESLint on the codebase
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Clerk](https://clerk.com) for authentication
- [Vercel](https://vercel.com) for hosting
- [Shadcn UI](https://ui.shadcn.com) for accessible UI primitives
- [Lucide Icons](https://lucide.dev) for beautiful icons
- [Next.js](https://nextjs.org) for the framework
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Prisma](https://www.prisma.io) for database access
- [FastAPI](https://fastapi.tiangolo.com) for the backend

<div align="center">
  <p>Built with ❤️ by Pratyush Sharma</p>
</div>
