# videojs-upnext

Youtube like plugin for up next videos

## Installation

```sh
npm install --save videojs-upnext-card
```

## Usage

To include videojs-upnext on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/upnext.min.js"></script>
<script>
  var player = videojs('my-video');
  player.upnext({
    timeout : 5000,
    headText : 'Up Next',
    cancelText: 'Cancel',
    getTitle : function() { return 'Next video title' },
    next : function () { performActionAfterTimeout() }
  });
</script>
```

### Browserify / Webpack

When using with Browserify, install videojs-upnext via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-upnext-card');

var player = videojs('my-video');

player.upnext({
  timeout : 5000,
  headText : 'Up Next',
  cancelText: 'Cancel',
  getTitle : function() { return 'Next video title' },
  next : function () { performActionAfterTimeout() }
});
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', 'videojs-upnext-card'], function(videojs) {
  var player = videojs('my-video');

  player.upnext({
    timeout : 5000,
    headText : 'Up Next',
    cancelText: 'Cancel',
    getTitle : function() { return 'Next video title' },
    next : function () { performActionAfterTimeout() }
  });
});
```

## License

Apache-2.0. Copyright (c) Fernando Godino <fernando@varsityviews.com>


[videojs]: http://videojs.com/
