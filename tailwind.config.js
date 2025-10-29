/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom green palette
        'green-gray': '#B0BEA9',
        'light-dull-green': '#92AA83',
        'lighter-dull-green': '#E0EDC5',
        'fern-green': '#4B6E32',
        'dark-green': '#0A4421',
        'super-dark-green': '#033316',
        'green-green': '#3F7131',
        'brighter-green': '#65AE5B',
        'jade': '#56A074',
        'darker-blue-green': '#48825F',
        'matcha-green': '#549F3F',
        
        // Pink accents
        'cherry-blossom': '#FCB2C5',
        'darker-light-pink': '#F1A4B7',
        
        // Brown tones
        'light-red-brown-gray': '#6E5A5A',
        'brown': '#4C3535',
        'very-light-brown': '#BF9B9B',
        
        // Semantic color mapping for easier use
        matcha: {
          50: '#E0EDC5',  // lighter-dull-green
          100: '#B0BEA9', // green-gray
          200: '#92AA83', // light-dull-green
          300: '#65AE5B', // brighter-green
          400: '#549F3F', // matcha-green
          500: '#4B6E32', // fern-green
          600: '#3F7131', // green-green
          700: '#48825F', // darker-blue-green
          800: '#0A4421', // dark-green
          900: '#033316', // super-dark-green
        },
        accent: {
          pink: '#FCB2C5',
          'pink-dark': '#F1A4B7',
        }
      },
      fontFamily: {
        'poller': ['"Poller One"', 'sans-serif'],
        'artifika': ['"Artifika"', 'serif'],
        'leckerli': ['"Leckerli One"', 'cursive'],
        'montserrat': ['"Montserrat"', 'sans-serif'],
        'rowdies': ['"Rowdies"', 'sans-serif'],
        'bungee': ['"Bungee"', 'sans-serif'],
        'barlow': ['"Barlow"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
