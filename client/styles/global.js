var vars = require('./vars')
var theme = vars.theme
var colors = vars.colors
var fonts = vars.fonts
var css = require('csjs').noScope

var globalCss = css`
  html {
    color: ${theme.baseColor};
    background-color: ${theme.background};
    -webkit-font-smoothing: antialiased;
  }

  body {
    margin: 0px;
    font-family: ${fonts.monoFont};
  }

  ul {
    list-style-type: none;
  }

  ul li:before {
    content: "-";
    position: absolute;
    margin-left: -1.1em;
  }

  a { transition: background-color 200ms, color 200ms; text-decoration: none; }
  a:link { color: ${theme.link}; background-color: ${colors.black}; } /* unvisited links */
  a:visited { color: ${theme.link}; } /* visited links */
  a:hover { color: ${colors.black}; background-color: ${colors.red}; } /* user hovers */
  a:visited:hover { color: ${colors.white}; background-color: ${colors.black}; }
  a:active { color: ${colors.red}; background-color: transparent; } /* active links */

  main {
    margin: 1.2em 1.2em;
    word-wrap: break-word;
  }

  @media only screen and (min-device-height: 480px) {
    body { max-width: 100%; }
  }

  @media only screen and (-webkit-min-device-pixel-ratio: 2) {}
`

module.exports = globalCss
