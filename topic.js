async function initProgress() {
	const page = document.querySelector('[data-topic]');
	if (!page) return;

	const current = parseInt(page.dataset.topic);
	const listUrl = page.dataset.list;

	try {
		const res    = await fetch(listUrl);
		const html   = await res.text();
		const parser = new DOMParser();
		const doc    = parser.parseFromString(html, 'text/html');

		// all content items
		const allItems = [...doc.querySelectorAll('.content-item')];
		const totalAll = allItems.length;
		const pctAll   = Math.round((current / totalAll) * 100);

		// find this page's item by matching href 
		const currentPath = window.location.pathname;
		const matchedItem = allItems.find(item => {
		const href       = item.getAttribute('href') || '';
		const normalised = href.replace(/^\.\.\//, '').replace(/^\.\//, '');
		return currentPath.endsWith(normalised);
		});

		// walk backwards through siblings to find nearest section-label
		// use textContent for reliable matching
		let sectionLabelText = null;
		let sectionLabelEl   = null;
		if (matchedItem) {
		let sibling = matchedItem.previousElementSibling;
		while (sibling) {
			if (sibling.classList.contains('section-label')) {
			sectionLabelText = sibling.textContent.trim();
			sectionLabelEl   = sibling;
			break;
			}
			sibling = sibling.previousElementSibling;
		}
		}

		// collect all items under the same section-label
		let chapterItems = [];
		let counting     = false;
		[...doc.querySelectorAll('.section-label, .content-item')].forEach(el => {
		if (el.classList.contains('section-label')) {
			// textContent match — not innerHTML, avoids MathJax/whitespace issues
			counting = el.textContent.trim() === sectionLabelText;
		} else if (counting) {
			chapterItems.push(el);
		}
		});

		const totalChapter = chapterItems.length;
		const posInChapter = matchedItem ? chapterItems.indexOf(matchedItem) + 1 : 0;
		const pctChapter   = Math.round((posInChapter / totalChapter) * 100);

		// fill page header
		const titleEl = document.querySelector('h1');
		const metaEl  = document.querySelector('.page-meta');
		const chipEl  = document.querySelector('.topic-chip');

		if (matchedItem) {
		if (titleEl && !titleEl.dataset.manual) {
			titleEl.textContent =
			matchedItem.querySelector('.item-title')?.textContent?.trim() || '';
		}
		if (metaEl && !metaEl.dataset.manual) {
			metaEl.textContent =
			matchedItem.querySelector('.item-meta')?.textContent?.trim() || '';
		}
		}

		// use innerHTML for chip so MathJax renders correctly
		if (chipEl && sectionLabelText && !chipEl.dataset.manual) {
		const labelEl = [...doc.querySelectorAll('.section-label')]
			.find(el => el.textContent.trim() === sectionLabelText);
		chipEl.innerHTML = labelEl ? labelEl.innerHTML : sectionLabelText;
		if (window.MathJax) MathJax.typesetPromise([chipEl]);
		}

		// overall progress
		const topicCount = document.querySelector('.topic-count');
		const pctCount   = document.querySelector('.pct-count');
		const fillAll    = document.querySelector('.progress-fill');

		if (topicCount) topicCount.textContent = `topic ${current} of ${totalAll}`;
		if (pctCount)   pctCount.textContent   = `${pctAll}%`;

		if (fillAll) {
		fillAll.style.width = '0%';
		setTimeout(() => { fillAll.style.width = pctAll + '%'; }, 100);
		}

		// chapter progress
		const chapterCount = document.querySelector('.chapter-count');
		const chapterPct   = document.querySelector('.chapter-pct');
		const fillChapter  = document.querySelector('.progress-fill-chapter');

		if (chapterCount) chapterCount.textContent = `${posInChapter} of ${totalChapter} in module`;
		if (chapterPct)   chapterPct.textContent   = `${pctChapter}%`;

		if (fillChapter) {
		fillChapter.style.width = '0%';
		setTimeout(() => { fillChapter.style.width = pctChapter + '%'; }, 150);
		}

	} catch(e) {
		console.warn('Progress could not load:', e);
	}
}

document.addEventListener('DOMContentLoaded', initProgress);

function initSections() {
    const page = document.querySelector('[data-topic]');
    const colors = [
        { background: 'var(--highlight)', border: 'var(--border)',  color: 'var(--h2)' },
        { background: '#EEF6FD',          border: '#cce3f6',        color: 'var(--h4)' },
        { background: '#F0FAF0',          border: '#c5e8c4',        color: 'var(--h3)' },
        { background: '#F3EFFE',          border: '#ddd0f7',        color: 'var(--blockquote)' },
    ];

    document.querySelectorAll('.section-head-number').forEach((el, i) => {
        if (page) el.textContent = `${page.dataset.topic}.${i + 1}`;

        const c = colors[i % colors.length];
        el.style.background = c.background;
        el.style.border     = `1.5px solid ${c.border}`;
        el.style.color      = c.color;
    });
}
document.addEventListener('DOMContentLoaded', initSections);

function initFigcaptionNumbers() {
  const page = document.querySelector('[data-topic]');
  if (!page) return;

  const topic = page.dataset.topic;

  document.querySelectorAll('figcaption strong').forEach((el, i) => {
    el.textContent = `Fig.${topic}.${i + 1} `;
  });
}
document.addEventListener('DOMContentLoaded', initFigcaptionNumbers);

function initFormulaNumber() {
	const page = document.querySelector('[data-topic]');
	if (!page) return;

	const topic = page.dataset.topic;

	document.querySelectorAll('.formula-number').forEach((el, i) => {
		el.textContent = `✦ Equation (${topic}.${i + 1}) `;
	});
}
document.addEventListener('DOMContentLoaded', initFormulaNumber);