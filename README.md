How to use:
 - Download your cube in SVG format from OpenSea (should be in this format by default)
 - Open the "cubeverse_animator.html" page in your browser
 - Click the "Browse" button on the top left
 - Select your downloaded cube and watch it animate with the preset color and animation options
 - You can customize the default colors found in the "config.js" file. The format is an array of [r,g,b] number value arrays or hex codes wrapped in quotes (eg - like using your own colors from your OpenPalette).

Customization:
 - There are some additional options in the config that can affect some basic aspects of the animation, but for now you'll need to manually modify the "Options" value in the terminal or download the app and manually update the config file yourself and run it locally. 
 - CSS animations being what they are, the config only exposes a handful of options, so that there would be two fairly dependable animations you can see for most any cube size.
 - If you're familiar with CSS keyframes, you can make timeline changes in "animate.js" to try to get some additional effects. 