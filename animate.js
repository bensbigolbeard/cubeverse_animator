TweenLite.defaultEase = Linear.easeNone;

const form = document.getElementById('f');
const restart = document.getElementById('restart');
const svgWrapper = document.getElementById('svg-wrapper');
const uploader = new UploaderController(svgWrapper, form);

// init event handlers
uploader.onNewSVG(() => {
  restart.classList.remove('hide');
  startAnimating()
});
restart.addEventListener('click', uploader.refreshSVG.bind(uploader))
updateColorsButton.addEventListener('click', () => {
  setTimeout(() => {
    svgWrapper.querySelectorAll('path').forEach((el, i) => { if (i > 0) el.remove() })
    svgWrapper.querySelector('style').remove();
    startAnimating()
  }, 50);
})

function getOptions(length) {
  switch (true) {
    case length > 50000:
      return Options.xlarge
    case length > 10000:
      return Options.large
    case length > 4500:
      console.log('med')
      return Options.medium

    default:
      return Options.tiny
  }
}

function startAnimating() {
  const root = document.querySelector('svg');
  const rootGroup = root.querySelector('g');
  const path = document.querySelector('.path');
  const styleTag = document.createElement('style');

  const length = path.getTotalLength();

  const { totalColorCount, spaceBetweenSegments, newLayerTimeout, animationLengthRatio, animationStartPointRatio } =
    getOptions(length);
  const offset = length / totalColorCount;

  // setup animation styles
  const primaryAnimation = `
    .draw:nth-child(even) {
      animation: draw_even ${animationLengthRatio * length}ms ease-in-out -${animationStartPointRatio * length
    }ms infinite;
    }
  `;

  const secondaryAnimation = `
    .draw:nth-child(odd) {
      animation: draw_odd ${animationLengthRatio * length + 30}ms ease-in-out -${animationStartPointRatio * length
    }ms infinite;
    }
  `;

  const tertiaryAnimation = `
    .draw:nth-child(3) {
      animation: draw_odd ${animationLengthRatio * length + 100}ms ease-in-out -${animationStartPointRatio * length
    }ms infinite;
    }
  `;

  const keyframesEven = `
    @keyframes draw_even {
      ${animationLengthRatio * 0.6}% {
        stroke-dashoffset: ${length};
      }

      ${animationLengthRatio * 0.75}% {
        stroke-dashoffset: 0;
      }
    }
  `;

  const keyframesOdd = `
    @keyframes draw_odd {
      ${animationLengthRatio * 0.6 + 1}% {
        stroke-dashoffset: ${length};
      }
    
      ${animationLengthRatio * 0.75 + 1}% {
        stroke-dashoffset: 0;
      }
    }
  `;

  const styles = [
    primaryAnimation,
    secondaryAnimation,
    tertiaryAnimation,
    keyframesEven,
    keyframesOdd,
  ];

  // add styles to wrapping svg
  styles
    .map((style) => document.createTextNode(style))
    .forEach((node) => styleTag.appendChild(node));
  svgWrapper.appendChild(styleTag);

  const sourceColors = generateColors(totalColorCount);

  // set dash array to original path
  TweenLite.set(path, {
    strokeDasharray: `${offset + spaceBetweenSegments},${length - offset - spaceBetweenSegments}`,
  });

  // create cloned paths with random offsets and staggered rendering
  // for more distinction between layers
  let i = 0;
  const int = setInterval(() => {
    const stroke = sourceColors[i];
    const clone = path.cloneNode(true);
    (rootGroup || root).appendChild(clone);

    TweenLite.to(clone, 0, {
      stroke, strokeDashoffset: -i *
        Math.random() * offset
    });
    if (i === sourceColors.length - 1) {
      return clearInterval(int);
    }
    i++;
  }, newLayerTimeout);
}
