/**
 * videojs-upnext
 * @version 2.0.5
 * @copyright 2017 Fernando Godino <fernando@varsityviews.com>
 * @license Apache-2.0
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.videojsUpnext = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _videoJs = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _videoJs2 = _interopRequireDefault(_videoJs);

var registerPlugin = _videoJs2['default'].registerPlugin || _videoJs2['default'].plugin;
var Component = _videoJs2['default'].getComponent('Component');

function getMainTemplate(options) {
  return '\n    <div class="vjs-upnext-top">\n      <span class="vjs-upnext-headtext">' + options.headText + '</span>\n      <div class="vjs-upnext-title"></div>\n    </div>\n    <div class="vjs-upnext-autoplay-icon">\n      <svg height="100%" version="1.1" viewbox="0 0 98 98" width="100%">\n        <circle class="vjs-upnext-svg-autoplay-circle" cx="49" cy="49" fill="#000" fill-opacity="0.8" r="48"></circle>\n        <circle class="vjs-upnext-svg-autoplay-ring" cx="-49" cy="49" fill-opacity="0" r="46.5" stroke="#FFFFFF" stroke-width="4" transform="rotate(-90)"></circle>\n        <polygon class="vjs-upnext-svg-autoplay-triangle" fill="#fff" points="32,27 72,49 32,71"></polygon></svg>\n    </div>\n    <span class="vjs-upnext-bottom">\n      <span class="vjs-upnext-cancel">\n        <button class="vjs-upnext-cancel-button" tabindex="0" aria-label="Cancel autoplay">Cancel</button>\n      </span>\n    </span>\n  ';
}

/**
 * EndCard Component
 */

var EndCard = (function (_Component) {
  _inherits(EndCard, _Component);

  function EndCard(player, options) {
    var _this = this;

    _classCallCheck(this, EndCard);

    _get(Object.getPrototypeOf(EndCard.prototype), 'constructor', this).call(this, player, options);

    this.getTitle = this.options_.getTitle;
    this.next = this.options_.next;

    this.upNextEvents = new _videoJs2['default'].EventTarget();

    this.dashOffsetTotal = 586;
    this.dashOffsetStart = 293;
    this.interval = 50;
    this.chunkSize = (this.dashOffsetTotal - this.dashOffsetStart) / (this.options_.timeout / this.interval);

    player.on('ended', function (event) {
      player.addClass('vjs-upnext');
      _this.showCard(function (canceled) {
        player.removeClass('vjs-upnext');
        _this.container.style.display = 'none';
        if (!canceled) {
          _this.next();
        }
      });
    });

    player.on('playing', (function () {
      this.upNextEvents.trigger('playing');
    }).bind(this));
  }

  _createClass(EndCard, [{
    key: 'createEl',
    value: function createEl() {

      var container = _get(Object.getPrototypeOf(EndCard.prototype), 'createEl', this).call(this, 'div', {
        className: 'vjs-upnext-content',
        innerHTML: getMainTemplate(this.options_)
      });

      this.container = container;
      container.style.display = 'none';

      this.autoplayRing = container.getElementsByClassName('vjs-upnext-svg-autoplay-ring')[0];
      this.title = container.getElementsByClassName('vjs-upnext-title')[0];
      this.cancelButton = container.getElementsByClassName('vjs-upnext-cancel-button')[0];
      this.nextButton = container.getElementsByClassName('vjs-upnext-autoplay-icon')[0];

      this.cancelButton.onclick = (function () {
        this.upNextEvents.trigger('cancel');
      }).bind(this);

      this.nextButton.onclick = (function () {
        this.upNextEvents.trigger('next');
      }).bind(this);

      return container;
    }
  }, {
    key: 'showCard',
    value: function showCard(cb) {

      var timeout = undefined;
      var start = undefined;
      var now = undefined;
      var newOffset = undefined;

      this.autoplayRing.setAttribute('stroke-dasharray', this.dashOffsetStart);
      this.autoplayRing.setAttribute('stroke-dashoffset', -this.dashOffsetStart);

      this.title.innerHTML = this.getTitle();

      this.upNextEvents.one('cancel', function () {
        clearTimeout(timeout);
        cb(true);
      });

      this.upNextEvents.one('playing', function () {
        clearTimeout(timeout);
        cb(true);
      });

      this.upNextEvents.one('next', function () {
        clearTimeout(timeout);
        cb(false);
      });

      var update = function update() {
        now = this.options_.timeout - (new Date().getTime() - start);

        if (now <= 0) {
          clearTimeout(timeout);
          cb(false);
        } else {
          newOffset = Math.max(-this.dashOffsetTotal, this.autoplayRing.getAttribute('stroke-dashoffset') - this.chunkSize);
          this.autoplayRing.setAttribute('stroke-dashoffset', newOffset);
          timeout = setTimeout(update.bind(this), this.interval);
        }
      };

      this.container.style.display = 'block';
      start = new Date().getTime();
      timeout = setTimeout(update.bind(this), this.interval);
    }
  }]);

  return EndCard;
})(Component);

exports.EndCard = EndCard;

_videoJs2['default'].registerComponent('EndCard', EndCard);

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function upnext
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
var upnext = function upnext(options) {
  var opts = options || {};
  var settings = {
    next: opts.next,
    getTitle: opts.getTitle,
    timeout: opts.timeout || 5000,
    headText: opts.headText || 'Up Next'
  };

  this.addChild('endCard', settings);
};

// Register the plugin with video.js.
registerPlugin('upnext', upnext);

exports['default'] = upnext;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});