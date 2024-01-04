CopyID = (function () {
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
			stylesheet.href = 'resources/copyId.css';
			stylesheet.addEventListener('load', () => {
				this.addCopyIcons();
				this.addEventListeners();
			}, {once: true});
			
			const linkTags = document.querySelectorAll('link[rel="stylesheet"]');
			document.getElementsByTagName('head')[0].insertBefore(stylesheet, linkTags[linkTags.length - 1]);
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

function addDiagIcons() {
	document.querySelectorAll('.dialogue-continue').forEach((a) => {
		const svgIconDiagContinue = document.createElement('div');
		svgIconDiagContinue.classList.add('svg-icon', 'svg-icon--diagContinue');
		
		a.appendChild(svgIconDiagContinue);
	});
	
	document.querySelectorAll('.dialogue-next').forEach((a) => {
		const svgIconDiagNext = document.createElement('div');
		svgIconDiagNext.classList.add('svg-icon', 'svg-icon--diagNext');
		
		a.appendChild(svgIconDiagNext);
	});

	document.querySelectorAll('.dialogue-end').forEach((span) => {
		const svgIconDiagEnd = document.createElement('div');
		svgIconDiagEnd.classList.add('svg-icon', 'svg-icon--diagEnd');
		
		span.appendChild(svgIconDiagEnd);
	});
};

function loadIconsStylesheet() {
	const stylesheet = document.createElement('link');
	stylesheet.rel = 'stylesheet';
	stylesheet.href = 'resources/icons.css';
	stylesheet.addEventListener('load', () => {
		addDiagIcons();
	}, {once: true});
			
	const linkTags = document.querySelectorAll('link[rel="stylesheet"]');
	document.getElementsByTagName('head')[0].insertBefore(stylesheet, linkTags[linkTags.length - 1]);
};

document.addEventListener('DOMContentLoaded', function() {
	(new CopyID()).init();
	loadIconsStylesheet();
});
