import { Class } from "./class.js";
import { Singleton } from "./singleton.js";

export const Theme = Class.extend().include({
  meta() {
    this.assignProps({ name: 'Theme' });

    this.include(Singleton);
  },

  get reset(){
    return reset.call(this);
  },

  colors: {
    accent: '#FF1A75',
    primaryText: '#000',
    secondaryText: '#757575',
    lighterGray: '#f6f6f6',
    lightGray: '#e6e6e6',
    midGray: '#ccc',
    darkGray: '#444',
    darkerGray: '#15171a'
  },

  fonts: {},

  spacing: {},

  breakpoints: {},

  remify,
});

function remify(value) {
  return `${parseInt(value) / 16}rem`;
}

function reset(){
    return `
        /* Box sizing rules */
        *,
        *::before,
        *::after {
            box-sizing: border-box;
        }

        /* Remove the default font size and weight for headings */

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
        font-size: inherit;
        font-weight: inherit;
        }

        /* Reset links to optimize for opt-in styling instead of opt-out*/

        a {
        color: inherit;
        -webkit-text-decoration: inherit;
        text-decoration: inherit;
        }

        /* Remove default margin */
        body,
        h1,
        h2,
        h3,
        h4,
        p,
        figure,
        blockquote,
        dl,
        dd {
            margin: 0;
        }

        /* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
        ul[role="list"],
        ol[role="list"] {
            list-style: none;
        }

        /* Set core root defaults */
        html:focus-within {
            scroll-behavior: smooth;
        }

        /* Set core body defaults */
        body {
            min-height: 100vh;
            line-height: 1.5;
            text-rendering: optimizespeed;
        }

        /* A elements that don't have a class get default styles */
        a:not([class]) {
            text-decoration-skip-ink: auto;
        }

        /* Make images easier to work with */
        img,
        picture {
            display: block;
            max-width: 100%;
        }

        /* Inherit fonts for inputs and buttons */
        input,
        button,
        textarea,
        select {
            font: inherit;
        }

        /* Remove all animations and transitions for people that prefer not to see them */
        @media (prefers-reduced-motion: reduce) {
            html:focus-within {
                scroll-behavior: auto;
            }

            *,
            *::before,
            *::after {
                transition-duration: 0.01ms !important;
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                scroll-behavior: auto !important;
            }
        }

        html {
            font-size: 62.5%;
        }

        body {
            font-family: var(--font-sans);
            font-size: 1.6rem;
            line-height: 1.6;
            color: var(--color-primary-text);
            background-color: #fff;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
    `;
}
