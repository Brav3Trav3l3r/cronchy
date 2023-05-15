/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				poppins: ['Poppins', 'sans-serif']
			}
		}
	},
	daisyui: {
		themes: [
			{
				mytheme: {
					
					primary: '#e0aaff',
					secondary: '#c77dff',
					accent: '#ffce1f',
					neutral: '#1c1c1c',
					'base-100': '#111111',
					info: '#2abdbb',
					success: '#3dff7f',
					warning: '#FBBD23',
					error: '#d93636'
				}
			}
		]
	},

	plugins: [
		require('daisyui'),
		require('tailwind-scrollbar-hide'),
		// require('@tailwindcss/forms'),
		require('@tailwindcss/line-clamp'),
		require('vidstack/tailwind.cjs')
	]
};
