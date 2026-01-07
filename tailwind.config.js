/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts,md}'],
	theme: {
		extend: {
			colors: {
				red: {
					DEFAULT: '#d01c1f',
					dark: '#b01819',
				},
				parchment: {
					DEFAULT: '#f3eee5',
					dark: '#e9e4db',
				},
				cream: '#faf8f4',
				ink: {
					DEFAULT: '#000000',
					light: '#333333',
				}
			},
			fontFamily: {
				heading: ['"Kyrios Standard"', 'cursive'],
				body: ['Merriweather', 'Georgia', 'serif'],
			}
		}
	},
	plugins: []
};
