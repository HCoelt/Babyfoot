/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Convert all hex values to include content paths
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                // Team Colors
                red: {
                    DEFAULT: '#E53935', // primary
                    light: '#FF6F60',
                    dark: '#AB000D',
                    transparent: 'rgba(229, 57, 53, 0.15)',
                    glow: 'rgba(229, 57, 53, 0.3)',
                },
                blue: {
                    DEFAULT: '#1E88E5', // primary
                    light: '#6AB7FF',
                    dark: '#005CB2',
                    transparent: 'rgba(30, 136, 229, 0.15)',
                    glow: 'rgba(30, 136, 229, 0.3)',
                },
                // Dark theme neutrals
                background: '#0A0A0F',
                surface: '#12121A',
                card: {
                    DEFAULT: 'rgba(255, 255, 255, 0.05)',
                    border: 'rgba(255, 255, 255, 0.1)',
                },
                text: {
                    DEFAULT: '#FFFFFF',
                    secondary: 'rgba(255, 255, 255, 0.7)',
                    muted: 'rgba(255, 255, 255, 0.5)',
                },
                // Status
                success: '#22C55E',
                warning: '#F59E0B',
                error: '#EF4444',
                // Medals
                medal: {
                    gold: '#FFD700',
                    silver: '#C0C0C0',
                    bronze: '#CD7F32',
                },
            },
            borderRadius: {
                sm: '8px',
                md: '12px',
                lg: '16px',
                xl: '24px',
                full: '9999px',
            },
        },
    },
    plugins: [],
}
