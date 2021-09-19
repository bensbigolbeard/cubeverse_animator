// You can tweak these a bit, to get some variation, but not a whole lot in this version. 
// More work would be needed to materially change the animation in any significant way. 
// Refresh the page after changing any of these values.
const Options = {
    // if you set `totalColorCount` higher than the number of colors in `SourceColors`, 
    // colors will be interpolated in between the SourceColors to make up the difference
    interpolateColors: true,

    // randomizes SourceColors to create more stark color transitions
    randomizeColorOrder: true,

    // eg -"complex" cubes
    xlarge: {
        totalColorCount: 4,             // - hopefully self explanatory. Set low for xlarge because it can freeze your browser otherwise :P
        spaceBetweenSegments: 31,       // - an svg animation setting that adjusts how the colors overlap one another
        newLayerTimeout: 60,            // - each color is added separately on slight delay to create the layering
        animationLengthRatio: 26,       // - larger number === slower animations
        animationStartPointRatio: 4, // - animation starts roughly 15% into the timeline, so if you increase animationLenthRatio, you'll need to bump this along with it
    },
    // ie - hearts, stars, etc
    large: {
        totalColorCount: 12,
        spaceBetweenSegments: 41,
        newLayerTimeout: 80,
        animationLengthRatio: 27,
        animationStartPointRatio: 3.95,
    },
    // ie - towers, islands, cylinders (ew)
    medium: {
        totalColorCount: 12,
        spaceBetweenSegments: 40,
        newLayerTimeout: 100,
        animationLengthRatio: 27,
        animationStartPointRatio: 3.8,
    },
    // eg - tiny bois
    tiny: {
        totalColorCount: 16,
        spaceBetweenSegments: 100,
        newLayerTimeout: 120,
        animationLengthRatio: 42,
        animationStartPointRatio: 8.5,
    },
};

// These can be [r, g, b] arrays or hex strings (eg - '#ffffff')
const DefaultColors = [
    [255, 0, 0],
    [255, 255, 0],
    [0, 255, 0],
    [0, 255, 255],
    [0, 0, 255],
    [255, 0, 255],
    [255, 255, 255],
];
