# JusticeAI Pakistan - Legal Assistant

An AI-powered legal strategy assistant that provides legal analysis and action plans for Pakistani law cases. Built with Next.js, TypeScript, and Tailwind CSS.

## Features
<img width="1920" height="2010" alt="image" src="https://github.com/user-attachments/assets/961cb4ea-5542-486e-a994-00f8200c468a" />


- 🤖 AI-powered legal analysis
- 📋 Step-by-step action plans
- 🛡️ Rights analysis
- 🌐 Multi-language support (English & Urdu)
- 📱 Responsive design
- ⚡ Fast and modern UI

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **AI**: Google Genkit AI
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd agentic-rag
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Add your API keys to .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:9002](http://localhost:9002) in your browser.

## Deployment

This project is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Deploy automatically

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # Reusable UI components
├── ai/                  # AI flows and configurations
├── hooks/               # Custom React hooks
└── lib/                 # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
