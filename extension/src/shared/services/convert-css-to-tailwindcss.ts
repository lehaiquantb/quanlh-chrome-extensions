import { TailwindConverter, TailwindConverterConfig } from "css-to-tailwindcss"
import postCSSPlugins from "postcss-nested"
import CustomTailwindConfig from "./tailwind.config"
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
  `

const DEFAULT_CONVERTER_CONFIG: TailwindConverterConfig = {
  remInPx: 4,
  postCSSPlugins: [postCSSPlugins],
  tailwindConfig: {
    content: [],
    theme: {
      extend: {
        colors: {
          "custom-color": {
            100: "#123456",
            200: "hsla(210, 100%, 51.0%, 0.016)",
            300: "#654321",
            gold: "hsl(41, 28.3%, 79.8%)",
            marine: "rgb(4, 55, 242, 0.75)",
          },
        },
        screens: {
          "custom-screen": { min: "768px", max: "1024px" },
        },
      },
      supports: {
        grid: "display: grid",
        flex: "display: flex",
      },
    },
  },
  arbitraryPropertiesIsEnabled: false,
}

export class TailwindCssConverter {
  constructor(config = DEFAULT_CONVERTER_CONFIG) {
    try {
      this.converter = new TailwindConverter({ ...DEFAULT_CONVERTER_CONFIG, ...config })
    } catch (error) {
      this.converter = new TailwindConverter(DEFAULT_CONVERTER_CONFIG)
    }
  }

  converter: TailwindConverter

  convertCss(cssText: string) {
    this.converter.convertCSS(cssText).then(({ convertedRoot, nodes }) => {
      console.log(convertedRoot.toString())
      console.log(nodes)
    })
  }
}

export const tailwindCssConverter = new TailwindCssConverter()
