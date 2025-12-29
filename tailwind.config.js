/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#00d9ff',
                    dark: '#00a3c2',
                    light: '#70eaff'
                },
                secondary: {
                    DEFAULT: '#ff006e',
                    dark: '#c90056',
                    light: '#ff4d9a'
                },
                panel: 'rgba(10, 14, 39, 0.7)',
                'panel-border': 'rgba(0, 217, 255, 0.2)',
                dark: '#0a0e27',
                darker: '#050714',
                'arc-yellow': '#f9d423',
                'arc-cyan': '#00f2ff',
                'arc-panel': '#0c0e14',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
                display: ['Space Grotesk', 'Inter', 'sans-serif'],
            },
            backgroundImage: {
                'cyber-grid': "radial-gradient(circle at 2px 2px, rgba(0, 217, 255, 0.05) 1px, transparent 0)",
            },
            boxShadow: {
                'neon': '0 0 10px rgba(0, 217, 255, 0.3), 0 0 20px rgba(0, 217, 255, 0.1)',
                'neon-strong': '0 0 15px rgba(0, 217, 255, 0.5), 0 0 30px rgba(0, 217, 255, 0.2)',
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
        require('@tailwindcss/typography'),
    ],
}
