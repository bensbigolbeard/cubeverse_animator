/**
 * Credit: Vivus-instant, where i just yanked this util. not my creation
 *
 * UploaderController class
 * Cheap controller for the uploader.
 * It takes a DOM element as parameter which is
 * supposed to content all the required items of
 * a uploader :
 * - an input:checkbox as theme switcher
 * - an .introbox to welcome people (no, I won't rename it Consuela, noooo...)
 *
 * @param {DOM} el Uploader element
 */
function UploaderController(el, form) {
  this.el = el;
  this.form = form;
  this.svgTag = null;
  this.svgFileName = null;
  this.newSvgCb = null;

  this.svgWrap = document.createElement('div');
  el.appendChild(this.svgWrap);

  // Create the 'a' tag to download
  this.downloadAnchor = document.createElement('a');
  this.downloadAnchor.style = 'display: none';
  this.el.appendChild(this.downloadAnchor);

  // Listen for upload
  this.form.addEventListener('change', this.upload.bind(this), true);
}

/**
 * SVG content type
 * This is what we are looking for.
 * @type {String}
 */
UploaderController.prototype.SVG_CONTENT_TYPE = 'image/svg+xml';


/* SETTERS */

/**
 * Set the callback to be triggered when a new SVG
 * is dropped. The callback will be executed with
 * the new SVG element as parameter.
 * Of course you can only have one callback set per
 * UploaderController instance.
 * Sorry, not sorry.
 *
 * @param  {Function} callback
 */
UploaderController.prototype.onNewSVG = function (callback) {
  this.newSvgCb = callback;
}


/**
 * Listener for when an item is uploaded.
 * It will load the first file uploaded
 * then provide the loaded event to `buildSVG`.
 * @param  {Event} event Drop event
 */
UploaderController.prototype.upload = function (event) {

  var file, data = event.target;
  if (!data || !data.files || !data.files[0]) {
    console.log(" They see me droppin'...  they hatin'.....", event)

    return;
  }

  file = new FileReader();
  file.addEventListener('load', this.buildSVG.bind(this), false);
  file.readAsDataURL(data.files[0]);
  this.svgFileName = data.files[0].name || 'cube.svg';
};

/**
 * Set up the SVG contained in the 'load' event.
 * And make sure it's valid.
 * @param  {event} event Load event
 */
UploaderController.prototype.buildSVG = function (event) {
  var fileContent = event.currentTarget.result;

  if (!fileContent) {
    throw new Error('Empty file dropped. Or maybe invisible SVG? If so no animation needed.');
  }

  // Transform base64 to XML
  // fileContent = atob(fileContent);
  if (!~fileContent.indexOf(this.SVG_CONTENT_TYPE)) {
    throw new Error('Invalid file dropped. It is not a SVG.');
  }
  fileContent = atob(fileContent.substr(fileContent.indexOf('base64,') + 7));

  this.el.innerHTML = fileContent;

  var svgTags = this.el.querySelectorAll('svg');
  if (svgTags.length === 0) {
    throw new Error('Cannot find the SVG tag in your file. You sure it\'s an SVG and not a cat picture?');
  }
  else if (svgTags.length > 1) {
    throw new Error('Wow! Wait a minute! There\'s more than one SVG in your file. Sorry the rule is one person per ticket.');
  }

  // strip old styles
  svgTags[0].querySelector('style').remove()
  svgTags[0].querySelector('path').classList = 'draw path';

  this.svgWrap.innerHTML = fileContent;
  svgTags = this.svgWrap.querySelectorAll('svg');

  // Delete previous SVG if existing
  if (this.svgTag) {
    this.svgTag.remove();
  }
  this.svgTag = svgTags[0];
  this.newSvgCb && this.newSvgCb(this.svgTag);
};

UploaderController.prototype.refreshSVG = function () {
  let temp = this.el.innerHTML;
  this.el.innerHTML = ''
  this.el.innerHTML = temp;
};

/**
 * Simulate download to provide the SVG.
 * It shouldn't destroy the content, thats why
 * it's using a div wrap. If there's some extra
 * DOM elements (like Illustrator signature
 * or other stuff..) it will be kept in the output.
 */
UploaderController.prototype.download = function () {
  var blob = new Blob([this.svgWrap.innerHTML], { type: this.SVG_CONTENT_TYPE }),
    url = window.URL.createObjectURL(blob);
  this.downloadAnchor.href = url;
  this.downloadAnchor.download = this.svgFileName.replace(/\.svg$/i, '_animated.svg');
  this.downloadAnchor.click();
  window.setTimeout(function () {
    window.URL.revokeObjectURL(url);
  }, 10);
};