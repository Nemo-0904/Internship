// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  // The 'content' array is crucial. It tells Tailwind where to look for your CSS class names.
  // Make sure it includes all file types and locations where you use Tailwind classes.
  content: [
    // This line includes your main HTML file if you have one at the root
    // For Vite React apps, 'index.html' is usually at the project root (e.g., 'frontend/index.html')
    "./index.html",
    // This line is essential for scanning your React components in the 'src' directory
    // It looks for files with .js, .jsx, .ts, or .tsx extensions
    "./src/**/*.{js,jsx,ts,tsx}",
    // If you have other directories with files using Tailwind classes, add them here.
    // Example: "./public/**/*.html",
  ],
  theme: {
    extend: {
      // --- ADD THESE CUSTOM COLORS HERE ---
      colors: {
        dark: {
          'bg-primary': '#1A202C',   // Deepest background (e.g., whole page)
          'bg-secondary': '#2D3748', // Lighter background for main panels/cards
          'bg-tertiary': '#4A5568',  // For interactive elements like accordion headers
          'text-light': '#E2E8F0',   // Main text color
          'text-muted': '#A0AEC0',   // Muted text, hints, status messages
          'accent-blue': '#63B3ED',  // A vibrant blue for accents, titles
          'border-dark': '#4A5568',  // Border color for subtle separation
        },
      },
      // --- END OF CUSTOM COLORS ---
    },
  },
  plugins: [require('tailwind-scrollbar')],
}