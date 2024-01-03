CopyID = (function () {
	function CopyID() {
	  // empty
	}
	
	Object.assign(CopyID.prototype, {
		init: function () {
			if (!navigator.clipboard) {
				return;
			}
			
			this.addCopyIcon();
			this.addEvenListeners();
    },
		
		addCopyIcon: function() {
			document.querySelectorAll('tr[id] td:first-child').forEach((td) => {
				const copyIcon = document.createElement('div');
				copyIcon.classList.add('copy-icon');
				copyIcon.innerHTML = '⎘';
				
				td.appendChild(copyIcon);
			});
			
			const copyMessage = document.createElement('div');
			copyMessage.classList.add('copy-message');
			copyMessage.innerHTML = 'URL copied to clipboard.';
			document.body.appendChild(copyMessage);
		},
		
		addEvenListeners: function() {
			document.querySelectorAll('.copy-icon').forEach((td) => {
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

document.addEventListener('DOMContentLoaded', function() {
	(new CopyID()).init();
});
