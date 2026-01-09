/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts,md}'],
	theme: {
		extend: {
			// Colors and fonts are defined in src/app.css using CSS custom properties
			// for easier customization without touching this config file.
			// See the "THEME CONFIGURATION" section in app.css.
		}
	},
	plugins: []
};
