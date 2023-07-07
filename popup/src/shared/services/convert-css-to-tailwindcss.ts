import { TailwindConverter, TailwindConverterConfig } from "css-to-tailwindcss";
import postCSSPlugins from "postcss-nested";
import CustomTailwindConfig from "./tailwind.config";
import { PluginAPI } from "tailwindcss/types/config";
const inputCSS = `
  :root {
    --some-color: #090909;
  }
  
  .foo {
    padding: 0.875em 256px;
    margin-left: 16px;
    text-align: center;
    font-size: 12px;
    transition: color, background-color, border-color, text-decoration-color, fill,
      stroke 200ms cubic-bezier(0, 0, 0.2, 1);
    animation-delay: 200ms;
  
    &:hover {
      filter: blur(4px) brightness(0.5) sepia(100%) contrast(1) hue-rotate(30deg)
        invert(0) opacity(0.05) saturate(1.5);
      color: hsl(41, 28.3%, 79.8%);
      font-size: 1.25rem;
    }
  
    &[aria-disabled="true"] {
      width: 25%;
      color: var(--some-color);
      font-size: 1em;
    }
  
    @media screen and (min-width: 768px) {
      top: auto;
      bottom: auto;
      left: 25%;
      right: 25%;
    }
  
    @media (min-width: 768px) and (max-width: 1024px) {
      min-width: 100%;
      margin-right: -24px;
    }
  
    @supports (display: grid) {
      display: grid;
      grid-column: span 1 / span 1;
    }
  }
  
  .foo.bar {
    padding: 0.875rem 256px 15%;
    transform: translateX(12px) translateY(-0.5em) skew(1deg, 3deg)
      scale(-0.75, 1.05) rotate(-0.25turn);
  
    &::after {
      content: "*";
      animation: spin 1s linear infinite;
    }
  }
  `;

const DEFAULT_CONVERTER_CONFIG: TailwindConverterConfig = {
  remInPx: 4,
  postCSSPlugins: [postCSSPlugins],
  tailwindConfig: {
    mode: "jit",
    // purge: ['./**/*.{js,jsx,ts,tsx}', './public/index.html'],
    content: [],
    theme: {
      extend: {
        spacing: {},
        colors: {
          gradient:
            "linear-gradient(179.96deg, #134E56 0.03%, rgba(32, 111, 131, 0.48) 98.79%)",
          pri: "#EE4600",
          greenB7: "#B7EB8F",
          greenF6: "#F6FFED",
          green73: "#73D13D",
          primary: "#0050B3",
          primary6: "#1890FF",
          yellowFD: "#FDFAF7",
          grayF2: "#F2F2F2",
          blueF6: "#F6F8FA",
          primary1: "#D7A367",
          grayD3: "#D3D3D3",
          black00: "#000000D9",
          blueF0: "#F0F4F4",
          gray00: "#00000040",
          gray1A: "#0000001A",
          black0C: "#0C2F36",
          blue09: "#096DD9",
          gray59: "#595959",
          blueD0: "#D0DCDE",
          orangeF5: "#F5CFB0",
          grayE9: "#E9E9E9",
          white80: "#FFFFFFCC",
          yellowF7: "#F7EDE1",
          yellow81: "#81623E",
          blue72: "#72959C",
          orangeB8: "#B86B2E",
          gray7C: "#7C7C7C",
          second: "#00000073",
          blueEB: "#EBF3FE",
          orangeE6: "#E6863A",
          blueF5: "#F5F9FF",
          black: "#000000",
          black29: "#292D32",
          grayD9: "#D9D9D9",
          green14: "#144E5A",
          black25: "#252525",
          grayF5: "#F5F5F5",
          grayF0: "#F0F0F0",
          grayBF: "#BFBFBF",
          white: "#FFFFFF",
          whiteF0: "#F0F0F0",
          white045: "#00000073",
          error: "#F5222D",
          red2D: "#F5222D",
          redF0: "#FFF1F0",
          red9E: "#FFA39E",
          grayFA: "#FAFAFA",
          orange40: "#FFA940",
          orangeFF: "#FFD591",
          blueCD: "#CDE5FB",
          blue1: "#E6F7FF",
          green38: "#389E0D",
          yellowFF: "#FFF7E6",
          redFF: "#FF4D4F",
          blue18: "#1890FF",
          yellowFE: "#FEE8D0",
          purpleD3: "#D3ADF7",
          purpleF9: "#F9F0FF",
          blue91: "#91D5FF",
          blueE6: "#E6F7FF",
          purple72: "#722ED1",
          grayEE: "#EEEEEE",
          gray43: "#434343",
          transparent: "transparent",
          blue8: "#0050B3",
          blacko25: "rgba(0, 0, 0, 0.25)",
          blacko45: "rgba(0, 0, 0, 0.45)",
          black33: "#333",
          "gray-04": "#424242",
          blue_1: "#E6F7FF",
          blue_3: "#91D5FF",
          blue_7: "#096DD9",
        },
        backgroundImage: {
          gradient:
            "linear-gradient(179.96deg, #134E56 0.03%, rgba(32, 111, 131, 0.48) 98.79%)",
        },
        boxShadow: {
          20: "0px 2px 20px rgba(20, 19, 19, 0.05)",
          30: "0px 2px 30px rgba(20, 19, 19, 0.05)",
          40: "0px 2px 40px rgba(0, 0, 0, 0.05)",
          form: "0px 2px 30px rgba(20, 19, 19, 0.05)",
          "40-08": " 0px 2px 40px rgba(0, 0, 0, 0.08)",
          "008": "0px 2px 40px rgba(0, 0, 0, 0.08)",
          "010": "0px 2px 16px 0px rgba(0, 0, 0, 0.10)",
          tail: "-4px -1px 4px 0px rgba(0, 0, 0, 0.04)",
          center: "4px -2px 4px 0px rgba(0, 0, 0, 0.04)",
          head: "4px -2px 4px 0px rgba(0, 0, 0, 0.04)",
        },
        blur: {
          shadow: "drop-shadow(0px 2px 30px rgba(20, 19, 19, 0.05))",
        },
        screens: {
          xl: { max: "1279px" },
          // => @media (max-width: 1279px) { ... }

          lg: { max: "1023px" },
          // => @media (max-width: 1023px) { ... }

          md: { max: "767px" },
          // => @media (max-width: 767px) { ... }

          sm: { max: "639px" },
          // => @media (max-width: 639px) { ... }
        },
      },
      borderRadius: {
        none: "0",
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        full: "9999px",
        2: "8px",
        large: "12px",
      },
      fontWeight: {
        thin: "100",
        hairline: "100",
        extralight: "200",
        light: "300",
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        "extra-bold": "800",
        black: "900",
      },
      fontSize: {
        "1c": "10",
      },
    },
    plugins: [
      ({ addBase, addComponents, addUtilities, theme }: PluginAPI) => {
        addBase({
          h1: {
            fontSize: theme("fontSize.2xl"),
          },
          h2: {
            fontSize: theme("fontSize.xl"),
          },
        });
        addComponents({
          ".card": {
            backgroundColor: theme("colors.white"),
            borderRadius: theme("borderRadius.lg"),
            padding: theme("spacing.6"),
            boxShadow: theme("boxShadow.xl"),
          },
          ".hello1": {
            padding: "11px",
            margin: "10px",
          },
        });
        addUtilities({
          ".content-auto": {
            contentVisibility: "auto",
          },
          ".hello": {
            padding: "2px",
            margin: "2px",
          },
          ".hic": {
            padding: "1rem",
          },
        });
      },
    ],
  },
  arbitraryPropertiesIsEnabled: false,
};

export class TailwindCssConverter {
  constructor(config = DEFAULT_CONVERTER_CONFIG) {
    try {
      this.converter = new TailwindConverter({
        ...DEFAULT_CONVERTER_CONFIG,
        ...config,
      });
    } catch (error) {
      this.converter = new TailwindConverter(DEFAULT_CONVERTER_CONFIG);
    }
  }

  converter: TailwindConverter;

  convertCss(cssText: string) {
    try {
      this.converter.convertCSS(cssText).then(({ convertedRoot, nodes }) => {
        console.log(convertedRoot.toString());
        console.log(nodes?.[0]?.tailwindClasses);
      });
    } catch (error) {
      console.log("Error in convertCss", error);
    }
  }
}

export const tailwindCssConverter = new TailwindCssConverter();
