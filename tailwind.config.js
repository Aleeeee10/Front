/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': 'var(--color-black)', // Fondo en modo oscuro
        'bg-light': 'var(--color-white)', // Fondo en modo claro
        'border-dark': 'var(--border-color-dark)', // Bordes en modo oscuro
        'border-light': 'var(--border-color-light)', // Bordes en modo claro
        'primary-dark': 'var(--primary-color-dark)', // Color primario oscuro
        'primary-light': 'var(--primary-color-light)', // Color primario claro
        'card-border': 'var(--border-color-card)', // Bordes de las cards
        
        // **Manteniendo los colores de las cards intactos**
        'bg-cards-dark': 'var(--bg-cards-dark)', 
        'bg-cards': 'var(--bg-cards)', 
      },
      transitionProperty: {
        'bg': 'background-color',
        'border': 'border-color',
        'colors': 'color, background-color, border-color',
      },
    },
  },
  plugins: [],
}
