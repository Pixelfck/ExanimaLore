/**
 * Copy an anchor location to the clip board.
 * @type {CopyID}
 */
const CopyID = (function () {
  function CopyID() {
    // empty
  }
  
  Object.assign(CopyID.prototype, {
    init: function () {
      if (!navigator.clipboard) {
        return;
      }
      
      this.loadCopyIdStylesheet();
    },
    
    loadCopyIdStylesheet: function () {
      const stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = 'resources/copyId.min.css';
      stylesheet.addEventListener('load', () => {
        this.addCopyIcons();
      }, {once: true});
      
      const linkTags = document.querySelectorAll('link[rel="stylesheet"]');
      linkTags[linkTags.length - 1].after(stylesheet);
    },
    
    addCopyIcons: function () {
      document.querySelectorAll('tr[id] td:first-child, .diviners-deck-card[id] div').forEach((element) => {
        const svgIconCopy = document.createElement('div');
        svgIconCopy.classList.add('svg-icon', 'svg-icon--copy');
        svgIconCopy.addEventListener('click', (event) => this.onClick(event));
        
        element.appendChild(svgIconCopy);
      });
      
      const copyMessage = document.createElement('div');
      copyMessage.classList.add('copy-message');
      copyMessage.innerHTML = 'URL copied to clipboard.';
      document.body.appendChild(copyMessage);
    },
    
    onClick: function (event) {
      this.copyIdToClipboard(event.target.closest('[id]'));
    },
    
    copyIdToClipboard: function (element) {
      if (!element.id) {
        return;
      }
      
      let url = document.location.href;
      if (document.location.hash) {
        url = url.substring(0, url.length - document.location.hash.length);
      }
      url += '#' + element.id
      
      navigator.clipboard.writeText(url).then(() => {
        this.showCopyMessage();
      });
    },
    
    showCopyMessage: function () {
      const copyMessage = document.querySelector('.copy-message');
      copyMessage.classList.add('copy-message--visible');
      window.setTimeout(this.hideCopyMessage, 1250);
    },
    
    hideCopyMessage: function () {
      const copyMessage = document.querySelector('.copy-message');
      copyMessage.classList.remove('copy-message--visible');
    },
  });
  
  return CopyID;
})();

/**
 * Slide into view and flip the cards in the Díviner's Deck
 * @type {DivinersDeck}
 */
const DivinersDeck = (function () {
  function DivinersDeck() {
    // empty
  }
  
  Object.assign(DivinersDeck.prototype, {
    init: function () {
      window.addEventListener('hashchange', () => this.onHashChange());
      
      document.querySelectorAll('.diviners-deck-card a').forEach((cardImg) => {
        cardImg.addEventListener('click', (event) => this.onCardClick(event));
      });
      
      this.onHashChange(); // check if we need to popup a cart upon page load
    },
    
    onHashChange: function () {
      if (!document.location.hash) return;
      
      const cardImg = this.getTargetCardImage(document.location.hash);
      
      if (cardImg) {
        window.setTimeout(() => this.popupCart(cardImg), 400);
      }
    },
    
    onCardClick: function (event) {
      event.preventDefault();
      
      this.popupCart(event.target);
    },
    
    onOverlayClick: function (event) {
      const overlay = event.target.classList.contains('.overlay') ? event.target : event.target.closest('.overlay');
      const cardWrapper = document.querySelector('.card-wrapper');
      
      overlay.addEventListener('transitionend', () => document.body.removeChild(overlay), {passive: true, once: true});
      overlay.style.opacity = 0;
      cardWrapper.style.opacity = 0;
    },
    
    popupCart: function (cardImg) {
      let cardFront;
      let cardBack = document.getElementById('DivinersDeckCardBackSide');
      if (cardBack === cardImg) {
        cardFront = cardBack.cloneNode(false);
        cardBack = this.getRandomCardFront();
      } else {
        cardFront = cardImg.cloneNode(false);
        cardBack = cardBack.cloneNode(false);
      }
      cardFront.classList.add('card-front');
      cardBack.classList.add('card-back');
      
      const cardWrapper = document.createElement('div');
      cardWrapper.classList.add('card-wrapper');
      cardWrapper.appendChild(cardBack);
      cardWrapper.appendChild(cardFront);
      
      const overlayCloseBtn = document.createElement('div');
      overlayCloseBtn.classList.add('overlay--close-btn');
      overlayCloseBtn.ariaLabel = 'close';
      overlayCloseBtn.innerText = '×';
      
      const overlay = document.createElement('div');
      overlay.classList.add('overlay');
      overlay.addEventListener('click', (event) => this.onOverlayClick(event));
      overlay.appendChild(overlayCloseBtn);
      overlay.appendChild(cardWrapper);
      
      document.body.appendChild(overlay);
    },
    
    getTargetCardImage: function (urlHash) {
      const target = document.querySelector(urlHash);
      if (target.classList.contains('diviners-deck-card')) {
        return cardImg = target.querySelector('img');
      }
      
      return null;
    },
    
    getRandomCardFront: function () {
      const cardImages = document.querySelectorAll('.diviners-deck-card img');
      
      return cardImages[this.getRandomIntInclusive(1, cardImages.length - 1)].cloneNode(false);
    },
    
    getRandomIntInclusive: function (min, max) {
      const randomBuffer = new Uint32Array(1);
      window.crypto.getRandomValues(randomBuffer);
      
      const randomNumber = randomBuffer[0] / (0xffffffff + 1); // Convert from a random integer to a floating point number, within the range 0 to 1 inclusive
      
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(randomNumber * (max - min + 1)) + min;
    },
  });
  
  return DivinersDeck;
})();

const SectionHighlight = (function () {
  function SectionHighlight() {
    // empty
  }
  
  Object.assign(SectionHighlight.prototype, {
    init: function () {
      document.querySelector('#Table_of_Contents > ul').addEventListener('click', this.addAnimClass);

    },
    
    addAnimClass: function (event) {
      if (!event.target.href) return;

      const section = document.getElementById(event.target.getAttribute('href').slice(1));
      if (!section.classList.contains('anim-highlight-blink')) {
        section.classList.add('anim-highlight-blink');
        section.addEventListener('animationend', cleanup);
        section.addEventListener('animationcancel', cleanup);
      }
    },
    
    cleanup: function (event) {
      if(event.animationName === 'highlight-blink') {
        event.target.classList.remove('anim-highlight-blink');
        event.target.removeEventListener('animationend', cleanup);
        event.target.removeEventListener('animationcancel', cleanup);
      }
    }
  });
  
  const cleanup = SectionHighlight.prototype.cleanup;
  
  return SectionHighlight;
})();

/**
 * Scroll to top *without* adding the anchor to the URL, as a javascript supported improvement over the no-script base functionality
 * @type {ScrollToTop}
 */
const ScrollToTop = (function () {
  function ScrollToTop() {
    // empty
  }
  
  Object.assign(ScrollToTop.prototype, {
    init: function () {
      document.querySelector('.scroll-to-top-link').addEventListener('click', (event) => this.onClick(event));
    },
    
    onClick: function (event) {
      event.preventDefault();
      history.pushState('', document.title, window.location.pathname + window.location.search);
      document.documentElement.scrollTo({top: 0, behavior: 'smooth'});
    },
  });
  
  return ScrollToTop;
})();

/**
 * Show spoiler warning popup, and don't show again for 3 months
 * @type {ScrollToTop}
 */
const SpoilerWarning = (function () {

  const settings = {
    cookieName: 'spoilerWarning',
    cookieMaxAge: 7889238, // 3 months in seconds
  };

  function SpoilerWarning() {
    // empty
  }
  
  Object.assign(SpoilerWarning.prototype, {
    init: function () {
      const cookie = this.getCookie(settings.cookieName);
      if (!cookie) {
       this.loadSpoilerWarningStylesheet();
      }
    },
    
    loadSpoilerWarningStylesheet: function () {
      const stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = 'resources/spoilerWarning.min.css';
      stylesheet.addEventListener('load', () => this.showWarning(), {once: true});
      
      const linkTags = document.querySelectorAll('link[rel="stylesheet"]');
      linkTags[linkTags.length - 1].after(stylesheet);
    },
    
    showWarning: function() {
      const warningTitle = document.createElement('h1');
      warningTitle.classList.add('spoiler-warning--title');
      warningTitle.innerText = 'Here be spoilers!';
      
      const warningBtn = document.createElement('button');
      warningBtn.classList.add('spoiler-warning--btn');
      warningBtn.innerText = 'OK, I understand';
      warningBtn.addEventListener('click', (event) => this.onBtnClick(event), {passive: true, once: true});
      
      const warning = document.createElement('div');
      warning.classList.add('spoiler-warning');
      warning.appendChild(warningTitle);
      warning.innerHTML += '<p>Exploration and stumbling upon things is an important part of Exanima.</p><p>This document spoils that fun.</p>';
      warning.appendChild(warningBtn);
      
      const warningWrapper = document.createElement('div');
      warningWrapper.classList.add('spoiler-warning--wrapper', 'fancy-border');
      warningWrapper.appendChild(warning);
      
      const overlay = document.createElement('div');
      overlay.classList.add('overlay', 'overlay--blur');
      overlay.appendChild(warningWrapper);
      
      document.body.appendChild(overlay);
    },
    
    closeOverlay: function(event) {
      const overlay = event.target.classList.contains('.overlay') ? event.target : event.target.closest('.overlay');
      const warningWrapper = document.querySelector('.spoiler-warning--wrapper');
      
      overlay.addEventListener('transitionend', () => document.body.removeChild(overlay), {passive: true, once: true});
      overlay.style.opacity = 0;
      warningWrapper.opacity = 0;
    },
    
    onBtnClick: function (event) {
      this.setCookie(settings.cookieName, 'warningDismissed', settings.cookieMaxAge);
      this.closeOverlay(event);
    },
    
    getCookie: function(cookieName) {
			const cookieString = RegExp(cookieName + "=[^;]+").exec(document.cookie);
			return !!cookieString ? decodeURIComponent(cookieString.toString().replace(/^[^=]+./, '')) : null;
    },
    
    setCookie: function(cookieName, value, cookieMaxAge) {
      document.cookie = cookieName + '=' + value + '; path=/; max-age=' + cookieMaxAge; // set session cookie
    },
  });
  
  return SpoilerWarning;
})();

document.addEventListener('DOMContentLoaded', function() {;
	(new SpoilerWarning()).init();
	(new CopyID()).init();
	(new ScrollToTop()).init();
	(new DivinersDeck()).init();
  (new SectionHighlight()).init();
});
