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
		
		loadCopyIdStylesheet: function() {
			const stylesheet = document.createElement('link');
			stylesheet.rel = 'stylesheet';
			stylesheet.href = 'resources/copyId.min.css';
			stylesheet.addEventListener('load', () => {
				this.addCopyIcons();
				this.addEventListeners();
			}, {once: true});
			
			const linkTags = document.querySelectorAll('link[rel="stylesheet"]');
			linkTags[linkTags.length - 1].after(stylesheet);
		},
		
		addCopyIcons: function() {
			document.querySelectorAll('tr[id] td:first-child').forEach((td) => {
				const svgIconCopy = document.createElement('div');
				svgIconCopy.classList.add('svg-icon', 'svg-icon--copy');
				
				td.appendChild(svgIconCopy);
			});
			
			const copyMessage = document.createElement('div');
			copyMessage.classList.add('copy-message');
			copyMessage.innerHTML = 'URL copied to clipboard.';
			document.body.appendChild(copyMessage);
		},
		
		addEventListeners: function() {
			document.querySelectorAll('.svg-icon--copy').forEach((td) => {
				td.addEventListener('click', (event) => this.onClick(event));
			});
		},
		
    onClick: function(event) {
			this.copyIdToClipboard(event.target.closest('tr'));
		},
		
		copyIdToClipboard: function(tr) {
			if (!tr.id) {
				return;
			}
			
			let url = document.location.href;
			if (document.location.hash) {
				url = url.substring(0, url.length - document.location.hash.length);
			}
			url += '#' + tr.id
			
			navigator.clipboard.writeText(url).then(() => {
				this.showCopyMessage();
			});
		},
		
		showCopyMessage: function() {
			const copyMessage = document.querySelector('.copy-message');
			copyMessage.classList.add('copy-message--visible');
			window.setTimeout(this.hideCopyMessage, 1250);
		},
		
		hideCopyMessage: function() {
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
			document.querySelectorAll('.divinersDeckCard a').forEach((cardImg) =>{
				cardImg.addEventListener('click', (event) => this.onCardClick(event));
			});
    },
    
    onCardClick: function(event) {
			event.preventDefault();
			
			let cardFront;
			let cardBack = document.getElementById('DivinersDeckCardBackSide');
			if (cardBack === event.target) {
				cardFront = cardBack.cloneNode(false);
				cardBack = this.getRandomCardFront();
			} else {
				cardFront = event.target.cloneNode(false);
				cardBack = cardBack.cloneNode(false);
			}
			cardFront.classList.add('card-front');
			cardBack.classList.add('card-back');
			
			const cardWrapper = document.createElement('div');
			cardWrapper.classList.add('card-wrapper');
			cardWrapper.appendChild(cardBack);
			cardWrapper.appendChild(cardFront);
			
			const overlayCloseBtn = document.createElement('div');
			overlayCloseBtn.classList.add('overlay--closeBtn');
			overlayCloseBtn.ariaLabel = 'close';
			overlayCloseBtn.innerText = '×';
			
			const overlay = document.createElement('div');
			overlay.classList.add('overlay');
			overlay.addEventListener('click', (event) => this.onOverlayClick(event));
			overlay.appendChild(overlayCloseBtn);
			overlay.appendChild(cardWrapper);
			
			document.body.appendChild(overlay);
		},
		
    onOverlayClick: function(event) {
    	const overlay = document.querySelector('.overlay');
    	const cardWrapper = document.querySelector('.card-wrapper');
    	
			overlay.addEventListener('transitionend', () => document.body.removeChild(overlay), {passive: true, once: true});
			overlay.style.opacity = 0;
			cardWrapper.style.opacity = 0;
		},
		
		getRandomCardFront: function() {
			const cardImages = document.querySelectorAll('.divinersDeckCard img');
			
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
	};
	
	Object.assign(SectionHighlight.prototype, {
		init: function () {
			document.querySelector("#Table_of_Contents > ul").addEventListener("click", this.addAnimClass);

		},
		
		addAnimClass: function (event) {
			if (event.target.tagName !== "A" || !event.target.href) {return};

			const section = document.getElementById(event.target.getAttribute("href").slice(1));
			if (!section.classList.contains("anim-highlight-blink")) {
				section.classList.add("anim-highlight-blink");
				section.addEventListener("animationend", cleanup);
				section.addEventListener("animationcancel", cleanup);
			};
		},
		
		cleanup: function (event) {
			if(event.animationName === "highlight-blink") {
				event.target.classList.remove("anim-highlight-blink");
				event.target.removeEventListener("animationend", cleanup);
				event.target.removeEventListener("animationcancel", cleanup);
			};
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
			document.querySelector('.scrollToTopLink').addEventListener('click', (event) => this.onClick(event));
    },
    
    onClick: function(event) {
			event.preventDefault();
    	window.scrollTo({top: 0, behavior: 'smooth'});
		},
	});
	
	return ScrollToTop;
})();

document.addEventListener('DOMContentLoaded', function() {
	(new CopyID()).init();
	(new DivinersDeck()).init();
	(new SectionHighlight()).init();
	(new ScrollToTop()).init();
});
