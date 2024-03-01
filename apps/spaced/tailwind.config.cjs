/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			spacing: {
				18: '4.5rem'
			}
		}
	},
	plugins: [
		require('@tailwindcss/line-clamp'),
		require('@tailwindcss/typography'),
		require('daisyui')
	],
	daisyui: {
		themes: [
			{
				light: {
					...require('daisyui/src/theming/themes')['[data-theme=light]'],
					'base-content': colors.slate[700],
					'base-200': '#F8F8F8',
					primary: colors.indigo[500],
					'primary-content': colors.white,
					secondary: colors.slate[700],
					'secondary-content': colors.white,
					'accent-content': colors.indigo[800]
				}
			},
			{
				dark: {
					...require('daisyui/src/theming/themes')['[data-theme=dark]'],
					'base-content': '#FCFCFC',
					'base-200': '#272D33',
					'base-300': '#30363C',
					primary: colors.indigo[500],
					secondary: '#FCFCFC',
					'secondary-content': colors.slate[800],
					'accent-content': colors.indigo[200]
				}
			}
		]
	}
};
