/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@spartan-ng/ui-core/hlm-tailwind-preset")],
  content: ["./src/**/*.{html,ts}", "./libs/ui/**/*.{html,ts}",],
  safelist: [
    {
      pattern: /grid-cols-(2|3|4|5|6|7|8|9|10|11|12)/,
    },
  ],
  theme: {

    extend: {
      fontSize: {
        xxs: '0.55rem',
      },
    },
  },
  plugins: [],
};
