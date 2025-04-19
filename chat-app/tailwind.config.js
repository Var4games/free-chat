/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scans all your src files for class names
  ],
  darkMode: "class", // Enables class-based dark mode (toggle via 'dark' class)
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // Blue-600
        secondary: "#1e293b", // Slate-800
        accent: "#f59e0b", // Amber-500
        chatBgLight: "#f3f4f6", // Gray-100
        chatBgDark: "#1f2937", // Gray-800
      },
    },
  },
  plugins: [],
};
