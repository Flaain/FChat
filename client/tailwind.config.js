/** @type {import('tailwindcss').Config} */

export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                "primary-white": "#F9F9F9",
                "primary-blue": "#5181B8",
                "secondary-blue": "#E5EBF1",
                "primary-gray": "#55677D",
                "primary-commerce": "#4BB34B",
                "primary-destructive": "#E64646",
                "primary-dark-50": "#424242",
                "primary-dark-100": "#222222",
                "primary-dark-200": "#141414",
                "dark-side-panel": "#161718",
                "dark-conversation-panel": "#18191B",
                modal: "rgba(0, 0, 0, .5)",
            },
            keyframes: {
                shimmer: {
                    "100%": {
                        transform: "translateX(100%)",
                    },
                },
                loading: {
                    "0%": { transform: "rotate(0)" },
                    "100%": { transform: "rotate(360deg)" },
                },
            },
            transitionProperty: {
                height: "height",
            },
            animation: {
                loading: "loading .5s linear infinite",
            },
        },
    },
    plugins: [],
};