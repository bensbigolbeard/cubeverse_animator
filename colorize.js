const toggleColorsButton = document.getElementById('toggleColors');
const colorsInput = document.getElementById('colors');
const errorMsg = document.getElementById('errorMsg');
const updateColorsButton = document.getElementById('updateColors');
const optionsWrapper = document.getElementById('optionsWrapper');
const instructions = document.getElementById('instructions');
const toggleInstructions = document.getElementById('toggleInstructions');

// Colors that can be updated by the form
let COLORS = DefaultColors;

// init event handlers
updateColorsButton.addEventListener('click', (e) => {
  let newColors
  try {
    newColors = JSON.parse(colorsInput.value)
  } catch (e) {
    errorMsg.innerText = 'Your color options are not valid JSON. Please review your entries and try agian.'
    errorMsg.classList.remove('hide');
    return;
  }
  errorMsg.innerText = '';
  errorMsg.classList.add('hide');
  COLORS = newColors;
})

toggleColorsButton.addEventListener('click', (e) => {
  colorsInput.value = JSON.stringify(COLORS, null, 2);
  if (optionsWrapper.classList.contains('hide')) {
    optionsWrapper.classList.remove('hide');
  } else {
    optionsWrapper.classList.add('hide');
  }
})

toggleInstructions.addEventListener('click', (e) => {
  if (instructions.classList.contains('hide')) {
    instructions.classList.remove('hide');
  } else {
    instructions.classList.add('hide');
  }
})


// color utils
function generateColors(totalColorCount) {
  const refColors = getRefColors(totalColorCount);
  let colors = [];
  for (let i = 0; i < totalColorCount; i++) {
    const amt = i / (totalColorCount - 1);
    const rgb = lerpColors(refColors, amt).map((color) => Math.round(color));
    colors.push(`rgb(${rgb})`);
    colors = Options.randomizeColorOrder ? randomizeArray(colors) : colors;
  }
  return colors;
}

function getRefColors(totalColorCount) {
  const normalizedColors = COLORS.map(color => typeof color === 'string' ? hexRgb(color, { format: 'array' }).slice(0, 3) : color)
  if (Options.interpolateColors) {
    return normalizedColors;
  }

  if (totalColorCount >= normalizedColors.length) {
    let colors = [];
    let srcColorIdx = 0
    while (colors.length < totalColorCount) {
      colors.push(normalizedColors[srcColorIdx]);
      srcColorIdx++
      console.log(colors)
      if (srcColorIdx === normalizedColors.length) {
        srcColorIdx = 0
      }
    }
    return colors;
  }
}

// linear interpolation logic pulled from some svg animation references; not my work.
function lerpColor(start, end, amt) {
  const rgb = [];
  for (let i = 0; i < start.length; i++) {
    rgb[i] = start[i] + (end[i] - start[i]) * amt;
  }
  return rgb;
}

function lerpColors(colors, amt) {
  if (amt >= 1) return colors[colors.length - 1];
  amt *= colors.length - 1;
  const i = amt >> 0;
  return lerpColor(colors[i], colors[i + 1], amt - i);
}

function randomizeArray(ary) {
  let rando = [...ary];
  for (let i = rando.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = rando[i];
    rando[i] = rando[j];
    rando[j] = temp;
  }
  return rando;
}


