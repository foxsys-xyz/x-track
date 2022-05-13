const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', './src/index.html'
  ],
  theme: {
    extend: {
      fontFamily: {
				'mono': ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
			},
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
