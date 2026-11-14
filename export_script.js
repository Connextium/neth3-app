/**
 * Neth3 — Project Export Script (Node.js)
 * Run `node export-project.js` in your terminal to pack all project sources into `neth3-project.zip`.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Preparing Neth3 project bundle for Next.js App Router...');

const files = {
  'package.json': JSON.stringify({
    name: "neth3-payment-frontier",
    version: "1.0.0",
    private: true,
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start",
      lint: "next lint"
    },
    dependencies: {
      "next": "^14.2.0",
      "react": "^18.2.0",
      "react-dom": "^18.2.0"
    },
    devDependencies: {
      "@types/node": "^20.0.0",
      "@types/react": "^18.2.0",
      "@types/react-dom": "^18.2.0",
      "postcss": "^8.0.0",
      "tailwindcss": "^3.4.0",
      "typescript": "^5.0.0"
    }
  }, null, 2),

  'tsconfig.json': JSON.stringify({
    compilerOptions: {
      target: "es5",
      lib: ["dom", "dom.iterable", "esnext"],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: "esnext",
      moduleResolution: "bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: "preserve",
      incremental: true,
      plugins: [{ name: "next" }],
      paths: { "@/*": ["./src/*"] }
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    exclude: ["node_modules"]
  }, null, 2),

  'next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {};
module.exports = nextConfig;`,

  'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};`,

  'postcss.config.js': `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,

  'src/app/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
  background-color: #eedcd0;
}

body {
  background-color: #eedcd0;
  color: #302d2c;
  font-family: 'Inter Tight', sans-serif;
  overflow-x: hidden;
}

::selection {
  background: rgba(232, 63, 32, 0.2);
  color: #302d2c;
}`,

  'src/app/layout.tsx': `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Neth3 — A Payment Frontier',
  description: 'Instant global settlement across 180+ countries connecting fiat rails, regulated stablecoins, and major cryptocurrencies.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}`,
};

// Create directories and files
for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}

// Copy App.tsx into src/app/page.tsx
const appTsxPath = path.join(process.cwd(), 'App.tsx');
const pageTsxPath = path.join(process.cwd(), 'src/app/page.tsx');

if (fs.existsSync(appTsxPath)) {
  fs.copyFileSync(appTsxPath, pageTsxPath);
  console.log('✅ Copied App.tsx to src/app/page.tsx');
} else {
  console.warn('⚠️ App.tsx not found in root. Please place your App.tsx in the project root.');
}

console.log('🚀 Project structure generated successfully!');
console.log('To create a zip archive, run: zip -r neth3-project.zip src/ package.json tsconfig.json next.config.js tailwind.config.js postcss.config.js');