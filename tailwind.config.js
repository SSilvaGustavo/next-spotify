/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        zinc: {
          750: '#282828',
          950: '#121212'
        }
      },
      animation: {
        'fade-in-top': 'fade-in-top 0.2s ease-out both',
        'fade-in': 'fade-in 0.3s ease-in-out',
      },
      keyframes: {
        'fade-in-top': {
          "0%": {
            opacity: '0',
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: '1',
            transform: "translateY(0)",
          },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
