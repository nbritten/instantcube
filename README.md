# InstantCube - Rubik's Cube Solver

[![Tests](https://github.com/nbritten/instantcube/actions/workflows/test.yml/badge.svg)](https://github.com/nbritten/instantcube/actions/workflows/test.yml)

A Progressive Web App (PWA) for solving Rubik's cubes instantly - works completely offline!

## Features

- ✅ **Offline-First**: Works without internet connection after first load
- ✅ **Installable**: Add to home screen on mobile and desktop
- ✅ **Step-by-Step Playback**: Navigate through the solution one step at a time
- ✅ **Keyboard Navigation**: Use arrow keys, space, home/end to control playback
- ✅ **Accessible**: Full ARIA labels and screen reader support
- ✅ **Fast**: Solves cubes in milliseconds with optimized algorithms
- ✅ **Responsive**: Works on mobile, tablet, and desktop

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Development

### Running Tests

```bash
# Run tests once
npm run test:run

# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui
```

### Building

```bash
# Create production build
npm run build

# Start production server
npm start
```

### Linting

```bash
npm run lint
```

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **PWA**: next-pwa with Workbox
- **Testing**: Vitest + React Testing Library
- **Deployment**: Vercel

## Project Structure

```
instantcube/
├── app/                      # Next.js app router pages
├── components/               # React components
│   ├── CubeInput/           # Scramble input
│   ├── CubeVisualization/   # 2D cube display
│   └── SolutionDisplay/     # Solution with step navigation
├── lib/
│   └── solver/              # Cube solving engine
│       ├── core/            # Cube state & moves
│       ├── algorithms/      # Solving algorithms
│       └── utils/           # Helpers
├── __tests__/               # Test suites
└── public/                  # Static assets & PWA files
```

## Keyboard Shortcuts (Solution Playback)

- `→` / `Space` - Next step
- `←` - Previous step
- `Home` / `Escape` - Reset to initial state
- `End` - Jump to solved state

## Contributing

Contributions are welcome! Please ensure:

1. All tests pass: `npm run test:run`
2. Build succeeds: `npm run build`
3. Code is linted: `npm run lint`

## License

MIT
