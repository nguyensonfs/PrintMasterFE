/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  prefix: 'tw-',
  important: true,
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        sacramento: ['Sacramento', 'cursive'],
      },
      backgroundImage: {
        notfound: "url('./imgs/bg-notfound.jpg')",
        auth: "url('./imgs/bg-auth.png')",
        drawer: "url('https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg')",
      },
    },
  },
  plugins: [],
}
