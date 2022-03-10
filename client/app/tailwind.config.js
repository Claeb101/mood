module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          darkest: '#001B2F',
          dark: '#002846',
          DEFAULT: '#1E6091'
        },
        green: {
          DEFAULT: '#52B69A'
        }
      },
      fontFamily: {
        'sans': ['Montserrat', '"Noto Sans Arabic"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
}
