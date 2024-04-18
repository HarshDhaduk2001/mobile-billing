import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      proxima: ["Proxima Nova"],
    },
    extend: {
      colors: {
        primary: "#0281B9",
        secondary: "#02B89D",
        pureWhite: "#FFF",
        pureBlack: "#000",
        defaultRed: "#DC3545",
        darkCharcoal: "#333333",
        whiteSmoke: "#F6F6F6",
        slatyGrey: "#6E6D7A",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;