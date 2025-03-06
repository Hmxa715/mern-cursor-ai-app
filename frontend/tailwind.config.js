/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4f46e5",
          hover: "#4338ca"
        },
        secondary: "#64748b",
        background: "#f8fafc",
        text: "#1e293b",
        "text-light": "#64748b",
        border: "#e2e8f0",
        error: "#ef4444",
        success: "#22c55e"
      }
    }
  },
  plugins: []
};
