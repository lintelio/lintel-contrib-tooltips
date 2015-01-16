lintel-contrib-tooltips
=======================

> Tooltips for lintel.

[![npm](https://img.shields.io/npm/v/lintel-contrib-tooltips.svg)](https://www.npmjs.com/package/lintel-contrib-tooltips)
[![Bower](https://img.shields.io/bower/v/lintel-contrib-tooltips.svg)](https://github.com/lintelio/lintel-contrib-tooltips)


## Getting Started
This module requires Lintel.

If you haven't used [Lintel](http://lintel.io/) before, be sure to check out the [Getting Started](http://lintel.io/getting-started) guide, as it explains how to install and use this module. Once you're familiar with that process, you may install this module with this command:

```shell
bower install lintel-contrib-tooltips --save
```

Once the module has been installed, you will have to load it in your main SASS file:

```scss
@import "bower_components/lintel-contrib-tooltips/sass/tooltips.scss"
```

This module also includes a JavaScript component, which you will have to load separately.

```html
<script src="bower_components/lintel-contrib-tooltips/dist/tooltips.min.js" type="text/javascript"></script>
```

You can use [wiredep](https://github.com/taptapship/wiredep) or [grunt-wiredep](https://github.com/stephenplusplus/grunt-wiredep) to automatically inject files in your build process.


## Variables
Check the vars file in the `sass` folder to see the full list of variables you can customize.

#### $tooltip-padding-y
Default value: `3px`  

Tooltip padding-top and padding-bottom.

#### $tooltip-padding-x
Default value: `6px`  

Tooltip padding-left and padding-right.

#### $tooltip-arrow-width
Default value: `10px`  

#### $tooltip-border-radius
Default value: `$border-radius-base`  

#### $tooltip-font-size
Default value: `$font-size-xs`  

#### $tooltip-include-states
Default value: `true`  

Enable or disable styles for the default states.

#### $tooltip-base-bg
Default value: `rgba(0,0,0,.9)`  

#### $tooltip-base-border
Default value: `$tooltip-base-bg`  

#### $tooltip-base-text
Default value: `#fff`  

#### $tooltip-*-bg
Default value: `transparentize($state-*, 0.1)`  

#### $tooltip-*-border
Default value: `$tooltip-*-bg`  

#### $tooltip-*-text
Default value: `null`  

Inherits from `$tooltip-base-text`.


## Mixins
Check the mixins file in the `sass` folder to see how you can extend this module.

#### tooltip-state($bg, $border, $text)
Creates a new tooltip state, including arrow colors for each placement.

```scss
.tooltip-primary {
  @include tooltip-state(
    $bg: $tooltip-primary-bg, 
    $border: $tooltip-primary-border, 
    $text: $tooltip-primary-text
  );
}
```

## JavaScript

You will have to call the jQuery plugin on each element you want to have a tooltip. 

One way to do that would be to add `data-toggle="tooltip"` to all elements that should have a tooltip and call the following from your javascript:
```js
$('[data-toggle="tooltip"]').tooltip();
```

### Methods

Name      | Type                           | Default             | Description
--------- | ------------------------------ | ------------------- | -----------
callback  | function                       |                     | Function to execute every time tooltip is shown / hidden.
html      | Boolean                        | false               | Display HTML content. Note: you must sanitize user input.
state     | string                         |                     | Tooltip type (ex. `primary`, `error`, `success`).
placement | string                         | 'top'               | Top, right, bottom, or left.
title     | string, function, $.Deferred() |                     | Can be a string, function, function that returns a deferred, or a deferred. <br><br> If using a function, result will be cached. To run function again, reset `this.options.title` to the same function in `callback`. See `test/fixtures/tooltip.html` for example.
template  | string                         | see `js/tooltip.js` | Template must contain these elements: `.tooltip > .tooltip-content`. The content of `.tooltip-content` will only be visible if a promise is used.

## Examples

#### String Title
```js
$('#myButton').tooltip({
  title: 'Tooltip Title'
});
```

#### Placement and State
```js
$('#myButton').tooltip({
  title: 'Tooltip Title',
  placement: 'right',
  state: 'success'
});
```

#### HTML Content
**NOTE: You must sanitize user input.**
```js
$('#myButton').tooltip({
  title: '<h1>Big Title</h1>',
  html: true
});
```

#### Function 
```js
$('#myButton').tooltip({
  title: function() {
    return 'Tooltip Title';
  }
});
```

#### Async Function
```js
$('#myButton').tooltip({
  title: function() {
    var deferred = $.Deferred();

    // Async action...
    setTimeout(function() {
      deferred.resolve({
        title: 'Tooltip Title',
        state: 'success'
      });
    }, 500);

    return deferred;
  }
});
```

#### Async Function without Cache
```js
var myTooltipGetter = function(tooltip, button) {
  var deferred = $.Deferred();

  setTimeout(function() {
    deferred.resolve({
      title: 'Tooltip Title',
      state: 'success',
      callback: function() {
        // reset state
        this.options.state = null;
        // reset title after displaying tooltip
        this.options.title = myTooltipGetter;
      }
    });
  }.bind(this), 500);

  return deferred;
};

$('#myButton').tooltip({
  title: myTooltipGetter
});
```

#### Deferred
```js
var deferred = $.Deferred();

$('#myButton').tooltip({
  title: deferred
});

setTimeout(function() {
  deferred.resolve({
    title: 'Deferred Success',
    state: 'success'
  });
}.bind(this), 1000);
```

#### Font Awesome Loading Icon
```js
$('#myButton').tooltip({
  title: deferred,
  template: `<div class="tooltip"><div class="tooltip-content"><i class="fa-li fa fa-spinner fa-spin"></i></div></div>`
});
```

#### Data-Attributes
```html
<button data-title="Tooltip Title" data-placement="bottom" data-state="warning" data-toggle="tooltip" type="button">I have a tooltip.</button>
``` 
```js
$('[data-toggle="tooltip"]').tooltip();
```

#### Title Attribute
```html
<button title="Tooltip Title" type="button">I have a tooltip.</button>
``` 
```js
$('[data-toggle="tooltip"]').tooltip();
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).


## License
Copyright (c) 2015 Marius Craciunoiu. Licensed under the MIT license.
