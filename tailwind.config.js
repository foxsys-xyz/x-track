const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', './src/index.html'
  ],
  theme: {
    extend: {
			fontSize: {
				sm: ['0.775rem', '1.15rem'],
			},
			colors: {
				gray: colors.zinc,
			},
		},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
