# CoachIQ Local Setup Script
# Run this in PowerShell to create all CoachIQ files locally

param(
    [Parameter(Mandatory=$true)]
    [string]$TargetPath
)

Write-Host "Creating CoachIQ project at: $TargetPath" -ForegroundColor Green

# Create directory structure
$directories = @(
    "src",
    "src/components", 
    "src/hooks",
    "src/services",
    "src/lib",
    "src/types",
    "public",
    "supabase",
    "supabase/functions",
    "supabase/migrations"
)

foreach ($dir in $directories) {
    $fullPath = Join-Path $TargetPath $dir
    if (!(Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Host "Created directory: $dir" -ForegroundColor Yellow
    }
}

# Create package.json
$packageJson = @'
{
  "name": "coachiq-interview-coaching",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@emailjs/browser": "^4.4.1",
    "@supabase/supabase-js": "^2.50.6",
    "@types/jspdf": "^1.3.3",
    "html2canvas": "^1.4.2",
    "jspdf": "^2.5.2",
    "lucide-react": "^0.344.0",
    "mammoth": "^1.8.0",
    "openai": "^4.67.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.10"
  }
}
'@

Set-Content -Path (Join-Path $TargetPath "package.json") -Value $packageJson -Encoding UTF8
Write-Host "Created package.json" -ForegroundColor Green

# Create index.html
$indexHtml = @'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CoachIQ - AI-Powered Interview Coaching</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
'@

Set-Content -Path (Join-Path $TargetPath "index.html") -Value $indexHtml -Encoding UTF8
Write-Host "Created index.html" -ForegroundColor Green

# Create vite.config.ts
$viteConfig = @'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
});
'@

Set-Content -Path (Join-Path $TargetPath "vite.config.ts") -Value $viteConfig -Encoding UTF8
Write-Host "Created vite.config.ts" -ForegroundColor Green

# Create tailwind.config.js
$tailwindConfig = @'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
'@

Set-Content -Path (Join-Path $TargetPath "tailwind.config.js") -Value $tailwindConfig -Encoding UTF8
Write-Host "Created tailwind.config.js" -ForegroundColor Green

# Create src/index.css
$indexCss = @'
@tailwind base;
@tailwind components;
@tailwind utilities;
'@

Set-Content -Path (Join-Path $TargetPath "src/index.css") -Value $indexCss -Encoding UTF8
Write-Host "Created src/index.css" -ForegroundColor Green

# Create src/main.jsx
$mainJsx = @'
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
'@

Set-Content -Path (Join-Path $TargetPath "src/main.jsx") -Value $mainJsx -Encoding UTF8
Write-Host "Created src/main.jsx" -ForegroundColor Green

# Create .gitignore
$gitignore = @'
# Dependencies
node_modules/
.pnp
.pnp.js

# Production
/dist
/build

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# Temporary folders
tmp/
temp/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# Build files
dist/
build/
*.tsbuildinfo

# Supabase
.branches
.temp
'@

Set-Content -Path (Join-Path $TargetPath ".gitignore") -Value $gitignore -Encoding UTF8
Write-Host "Created .gitignore" -ForegroundColor Green

# Create netlify.toml
$netlifyToml = @'
[build]
  publish = "dist"
  command = "npm run build"
  
[build.processing]
  skip_processing = false

[build.processing.css]
  bundle = true
  minify = true

[build.processing.js]
  bundle = true
  minify = true

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--production=false"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = false
  headers = {X-From = "Netlify"}

[context.production.environment]
  NODE_ENV = "production"

[context.deploy-preview.environment]
  NODE_ENV = "development"
'@

Set-Content -Path (Join-Path $TargetPath "netlify.toml") -Value $netlifyToml -Encoding UTF8
Write-Host "Created netlify.toml" -ForegroundColor Green

Write-Host "Basic CoachIQ structure created!" -ForegroundColor Green
Write-Host "Next: Run the React components script to add the main app files" -ForegroundColor Yellow
Write-Host "Then run: npm install" -ForegroundColor Cyan