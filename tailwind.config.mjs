/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '6px',
        lg: '12px',
        xl: '20px',
      },
      boxShadow: {
        glass: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.1), 0 10px 30px rgba(255,255,255,0.05)',
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at top left, rgba(255,255,255,0.2), transparent)',
        'radial-soft': 'radial-gradient(circle, rgba(255,255,255,0.08), rgba(255,255,255,0))',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
      },
      keyframes: {
        blob: {
          '0%':   { transform: 'translate(0px, 0px) scale(1)' },
          '33%':  { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%':  { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        'gradient-x': {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }
    },
  },
  plugins: [],
};
