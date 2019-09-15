# HiveTek jQuery Toolkit

[![Tested with jQuery 1.5+](https://img.shields.io/badge/jQuery-1.5+-0769AD.svg)](https://jquery.com/)
[![Tested with fancyBox 2.x](https://img.shields.io/badge/fancyBox-2.x-FF5268.svg)](https://fancyapps.com/fancybox/)
[![Version 1.0.1](https://img.shields.io/badge/Version-1.0.1-success.svg)](#)

This is a simple jQuery function wrapper used at [HiveTek](https://www.hivetek.com/) and [Trinary](https://www.trinary.ca/).

## Requirements

- [jQuery](https://jquery.com/) 1.5+
- [fancyBox](https://fancyapps.com/fancybox/) 2.x (optional)

## Install

You can load the script from the CDN.

```html
<script src="//cdn.jsdelivr.net/gh/milhouse1337/hivetek-js/dist/hivetek.min.js"></script>
```

## Usage

Here is a few basic functions you can use.

```html
<script>
$(document).ready(function() {

    $.hivetek.fixAjaxToken(); // Add `X-CSRF-TOKEN` header on all AJAX requests.
    $.hivetek.loadLegacy(); // Inject some functions on the `window` object.

    $.hivetek.config('fadein_delay', 200); // Update fadeIn animation delay.
    $.hivetek.config('text_loading', 'Loading...'); // Update the loading text.

});
</script>
```

### AJAX

```javascript
// Simple GET request.
$.hivetek.doAjaxGet('/example', {'foo': 'bar'}, function(data) {
    // console.log(data);
}, function(error) {
    // console.log(error);
});
```

```javascript
// Simple POST request.
$.hivetek.doAjaxPOST('/example', {'foo': 'bar'}, function(data) {
    // console.log(data);
}, function(error) {
    // console.log(error);
});
```

### Modal (with fancyBox)

```javascript
$.hivetek.doAjaxFancybox('/example', {'foo': 'bar'}, false); // Open modal.
$.hivetek.closeModal(); // Close modal.
```

### Modal (with Bootstrap)

```javascript
$.hivetek.doAjaxModal('/example', {'foo': 'bar'}, false); // WIP.
```

## Build

```bash
npm install
npx gulp
```

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
