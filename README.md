# IndusGPT - Full Stack Project

This is a modern, full-stack AI Chat application built with Next.js (frontend) and Express.js (backend).

## Project Structure

```
indusgpt/
├── frontend/          # Next.js frontend application
│   ├── app/          # Next.js app directory
│   ├── components/   # React components
│   ├── lib/          # Utility functions
│   ├── package.json  # Frontend dependencies
│   └── next.config.mjs
│
├── backend/          # Express.js backend API
│   ├── server.js     # Main server file
│   ├── package.json  # Backend dependencies
│   └── .env.example  # Environment variables template
│
└── README.md         # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm installed
- Git (optional, for version control)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend will be available at `http://localhost:5000`

## Features

- **Smart Conversations** - Natural language understanding for contextual AI chat
- **Code Generation** - Write and debug code in any language
- **Research Assistant** - Summarize and analyze documents
- **Document Analysis** - Parse and extract data from PDFs and spreadsheets
- **Lightning Fast** - Sub-second response times
- **Privacy First** - End-to-end encryption and secure data handling

## Architecture

### Frontend (Next.js 16)
- Modern React 19 with Server Components
- Tailwind CSS for styling
- Shadcn/UI components
- TypeScript for type safety
- Responsive design (mobile-first approach)

### Backend (Express.js)
- RESTful API structure
- CORS enabled for frontend communication
- Environment-based configuration
- Ready for AI service integration

## Available Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend
```bash
npm run dev      # Start development server
npm start        # Start production server
npm run lint     # Run ESLint
```

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=IndusGPT
```

### Backend (.env)
```
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

## API Endpoints

### Health Check
- `GET /api/health` - Returns server status

### Chat
- `POST /api/chat` - Send a message and get AI response
  - Request: `{ "message": "your message" }`
  - Response: `{ "id": number, "message": string, "response": string, "timestamp": string }`

## Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication and authorization
- [ ] Message history and persistence
- [ ] AI service integration (OpenAI, Anthropic, etc.)
- [ ] Real-time chat with WebSockets
- [ ] File upload and processing
- [ ] Advanced analytics and monitoring

## Development Guidelines

- **Frontend**: Use React hooks, Server Components where possible, and maintain component modularity
- **Backend**: Follow RESTful conventions, use middleware for cross-cutting concerns
- **Database**: Plan for scalability with proper indexing and query optimization
- **Security**: Always validate and sanitize user input, use HTTPS in production

## Deployment

### Frontend
Can be deployed to Vercel, Netlify, or any Node.js hosting service.

### Backend
Can be deployed to Heroku, AWS, DigitalOcean, or any Node.js hosting service.

## Contributing

When adding features:
1. Keep frontend and backend code separate and independent
2. Update relevant documentation
3. Follow the existing code style and patterns
4. Test thoroughly before committing

## License

MIT

## Support

For issues and questions, please open an issue on the repository or contact the development team.
