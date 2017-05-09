import videojs from 'video.js';

const registerPlugin = videojs.registerPlugin || videojs.plugin;
let Component = videojs.getComponent('Component');


function getMainTemplate(options) {
  return `
    <div class="vjs-upnext-top">
      <span class="vjs-upnext-headtext">${options.headText}</span>
      <div class="vjs-upnext-title"></div>
    </div>
    <div class="vjs-upnext-autoplay-icon">
      <svg height="100%" version="1.1" viewbox="0 0 98 98" width="100%">
        <circle class="vjs-upnext-svg-autoplay-circle" cx="49" cy="49" fill="#000" fill-opacity="0.8" r="48"></circle>
        <circle class="vjs-upnext-svg-autoplay-ring" cx="-49" cy="49" fill-opacity="0" r="46.5" stroke="#FFFFFF" stroke-width="4" transform="rotate(-90)"></circle>
        <polygon class="vjs-upnext-svg-autoplay-triangle" fill="#fff" points="32,27 72,49 32,71"></polygon></svg>
    </div>
    <span class="vjs-upnext-bottom">
      <span class="vjs-upnext-cancel">
        <button class="vjs-upnext-cancel-button" tabindex="0" aria-label="Cancel autoplay">${options.cancelText}</button>
      </span>
    </span>
  `;
}

/**
 * EndCard Component
 */
export class EndCard extends Component {

  constructor(player, options) {
    super(player, options);

    this.getTitle = this.options_.getTitle;
    this.next = this.options_.next;

    this.upNextEvents = new videojs.EventTarget();

    this.dashOffsetTotal = 586;
    this.dashOffsetStart = 293;
    this.interval = 50;
    this.chunkSize = (this.dashOffsetTotal - this.dashOffsetStart) / (this.options_.timeout / this.interval);

    player.on('ended', (event) => {
      player.addClass('vjs-upnext');
      this.showCard((canceled) => {
        player.removeClass('vjs-upnext');
        this.container.style.display = 'none';
        if (!canceled) {
          this.next();
        }
      });
    });

    player.on('playing', function() {
      this.upNextEvents.trigger('playing');
    }.bind(this));
  }

  createEl() {

    let container = super.createEl('div', {
      className: 'vjs-upnext-content',
      innerHTML: getMainTemplate(this.options_)
    });

    this.container = container;
    container.style.display = 'none';

    this.autoplayRing = container.getElementsByClassName('vjs-upnext-svg-autoplay-ring')[0];
    this.title = container.getElementsByClassName('vjs-upnext-title')[0];
    this.cancelButton = container.getElementsByClassName('vjs-upnext-cancel-button')[0];
    this.nextButton = container.getElementsByClassName('vjs-upnext-autoplay-icon')[0];

    this.cancelButton.onclick = function() {
      this.upNextEvents.trigger('cancel');
    }.bind(this);

    this.nextButton.onclick = function() {
      this.upNextEvents.trigger('next');
    }.bind(this);

    return container;
  }

  showCard(cb) {

    let timeout;
    let start;
    let now;
    let newOffset;

    this.autoplayRing.setAttribute('stroke-dasharray', this.dashOffsetStart);
    this.autoplayRing.setAttribute('stroke-dashoffset', -this.dashOffsetStart);

    this.title.innerHTML = this.getTitle();

    this.upNextEvents.one('cancel', () => {
      clearTimeout(timeout);
      cb(true);
    });

    this.upNextEvents.one('playing', () => {
      clearTimeout(timeout);
      cb(true);
    });

    this.upNextEvents.one('next', () => {
      clearTimeout(timeout);
      cb(false);
    });

    let update = function() {
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
}

videojs.registerComponent('EndCard', EndCard);

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
const upnext = function(options) {
  let opts = options || {};
  let settings = {
    next: opts.next,
    getTitle: opts.getTitle,
    timeout: opts.timeout || 5000,
    cancelText: opts.cancelText || 'Cancel',
    headText: opts.headText || 'Up Next'
  };

  this.addChild('endCard', settings);

};

// Register the plugin with video.js.
registerPlugin('upnext', upnext);

export default upnext;
