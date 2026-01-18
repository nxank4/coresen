# CoreSen

A modern blog, AI guide, portfolio, and knowledge base built with Next.js, featuring low poly 3D morphing animations and a monochrome design system.

## Features

- **Blog**: In-depth articles on AI, data science, and machine learning
- **AI Guide**: Comprehensive guides and tutorials for AI practitioners
- **Portfolio**: Showcase of projects and work
- **Knowledge Base**: Curated resources and insights

## Tech Stack

- **Framework**: Next.js 16.1.3 (App Router)
- **Styling**: Tailwind CSS with custom monochrome theme
- **UI Components**: Ant Design
- **3D Graphics**: Three.js, React Three Fiber
- **Content**: MDX with syntax highlighting
- **Typography**: Inter (body) + JetBrains Mono (headings/code)
- **Deployment**: Vercel

## Design

- **Theme**: Monochrome (black/white) with seamless dark/light mode
- **3D Animation**: Low poly wireframe morphing blob (Platonic solids)
- **Style**: Minimalist, professional, code-focused aesthetic

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
app/
├── components/
│   ├── features/     # Feature components (3D blob, homepage, etc.)
│   ├── layout/       # Layout components (nav, footer)
│   └── ui/           # UI components (theme switch, MDX renderer)
├── lib/              # Utilities and helpers
├── blog/             # Blog posts (MDX)
├── profile/          # Profile page
└── [pages]/          # Other pages (projects, photos)
```

## Live Site

Visit [coresen.vercel.app](https://coresen.vercel.app)

## License

MIT  
