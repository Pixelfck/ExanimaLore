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
    	document.body.removeChild(document.querySelector('.overlay'));
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

document.addEventListener('DOMContentLoaded', function() {
	(new CopyID()).init();
	(new DivinersDeck()).init();
});
