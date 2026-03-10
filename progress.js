// progress.js
async function initProgress() {
	const page = document.querySelector('[data-topic]');
	if (!page) return;

	const current = parseInt(page.dataset.topic);
	const listUrl = page.dataset.list; // e.g. "/numerical-analysis"

	try {
		const res = await fetch(listUrl);
		const html = await res.text();
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');
		const total = doc.querySelectorAll('.content-item').length;
		const pct = Math.round((current / total) * 100);

		document.querySelector('.progress-label .topic-count').textContent =
		`topic ${current} of ${total}`;
		document.querySelector('.progress-label .pct-count').textContent =
		`${pct}%`;

		const fill = document.querySelector('.progress-fill');
		fill.style.setProperty('--target-width', pct + '%');
		fill.style.width = pct + '%';

	} catch(e) {
		console.warn('Progress bar could not load:', e);
	}
}

document.addEventListener('DOMContentLoaded', initProgress);

const fill = document.querySelector('.progress-fill');
fill.style.width = '0%'; 
setTimeout(() => {
  	fill.style.width = pct + '%'; 
}, 100);