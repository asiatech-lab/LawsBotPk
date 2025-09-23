# LawPlan AI

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, you'll need to set up your environment variables.

1.  Create a file named `.env` in the root of the project.
2.  Add your Gemini API key to it. See `.env.example` for the format.

```
GEMINI_API_KEY=your_api_key_here
```

Next, install the dependencies:

```bash
npm install
```

Then, run the development servers. You'll need two terminals for this.

In your first terminal, run the Next.js development server:

```bash
npm run dev
```

In your second terminal, run the Genkit development server:

```bash
npm run genkit:watch
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.
