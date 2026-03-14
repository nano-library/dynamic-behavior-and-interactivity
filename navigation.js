async function initNavigation() {
	const page = document.querySelector('[data-topic]');
	if (!page) return;

	const current = parseInt(page.dataset.topic);
	const listUrl = page.dataset.list;

	try {
		const res    = await fetch(listUrl);
		const html   = await res.text();
		const parser = new DOMParser();
		const doc    = parser.parseFromString(html, 'text/html');

		const allItems = [...doc.querySelectorAll('.content-item')];
		const index    = current - 1; // 0-based

		const prevItem = allItems[index - 1] || null;
		const nextItem = allItems[index + 1] || null;

		const prevBtn = document.querySelector('.nav-prev');
		const nextBtn = document.querySelector('.nav-next');
		const listBtn = document.querySelector('.nav-list');

		// helper: resolve href relative to current page ──
		// index.html has href="module-1/size-dependence.html"
		// current page is at module-1/size-dependence.html
		// so we need to go "../module-2/next-topic.html" if crossing folders
		function resolveHref(itemHref) {
			if (!itemHref) return '#';

			// get current folder e.g. "module-1"
			const currentFolder = window.location.pathname
				.split('/').slice(0, -1).pop();

			// get target folder e.g. "module-2"
			const parts         = itemHref.split('/');
			const targetFolder  = parts.length > 1 ? parts[0] : currentFolder;
			const targetFile    = parts[parts.length - 1];

			if (targetFolder === currentFolder) {
				// same folder — just filename
				return targetFile;
			} else {
				// different folder — go up one then into target
				return `../${targetFolder}/${targetFile}`;
			}
		}

		// list button
		if (listBtn) {
			listBtn.href = listUrl;
		}

		// prev button
		if (prevBtn) {
			if (!prevItem) {
				prevBtn.classList.add('is-first');
				prevBtn.href = '#';
				prevBtn.setAttribute('onclick', 'return false;');
				prevBtn.title = 'No previous';
			} else {
				prevBtn.classList.remove('is-first');
				prevBtn.removeAttribute('onclick');
				prevBtn.href  = resolveHref(prevItem.getAttribute('href'));
				prevBtn.title = `Prev: ${prevItem.querySelector('.item-title')?.textContent?.trim()}`;
			}
		}

		// next button
		if (nextBtn) {
			if (!nextItem) {
				nextBtn.classList.add('is-last');
				nextBtn.href = '#';
				nextBtn.setAttribute('onclick', 'return false;');
				nextBtn.title = 'Last page';
			} else {
				nextBtn.classList.remove('is-last');
				nextBtn.removeAttribute('onclick');
				nextBtn.href  = resolveHref(nextItem.getAttribute('href'));
				nextBtn.title = `Next: ${nextItem.querySelector('.item-title')?.textContent?.trim()}`;
			}
		}

	} catch(e) {
		console.warn('Navigation could not load:', e);
	}
}

document.addEventListener('DOMContentLoaded', initNavigation);