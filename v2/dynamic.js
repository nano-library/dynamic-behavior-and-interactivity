document.addEventListener('DOMContentLoaded', function () {
  // ═══════════════════════════════════════════════════════
  // 1. SCROLL REVEAL (keep this)
  // ═══════════════════════════════════════════════════════
  (function () {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

    reveals.forEach((el, i) => {
      el.style.transitionDelay = ((i % 4) * 0.06) + 's';
      observer.observe(el);
    });
  })();

  // ═══════════════════════════════════════════════════════
  // 2. MODULE & CHAPTER PROGRESS + NAVIGATION PILLS
  // ═══════════════════════════════════════════════════════
  async function init() {
    const path = window.location.pathname;
    const root = path.substring(0, path.lastIndexOf('/') + 1);
    const indexUrl = root + '../index.html';

    try {
      const res    = await fetch(indexUrl);
      const html   = await res.text();
      const parser = new DOMParser();
      const doc    = parser.parseFromString(html, 'text/html');

      // ── All module blocks (each is a <div class="module-block">) ──
      const moduleBlocks = [...doc.querySelectorAll('.module-block')];
      if (!moduleBlocks.length) return;

      // ── Build data: for each module, its array of content-item links ──
      const moduleData = moduleBlocks.map((block, idx) => {
        const items = [...block.querySelectorAll('.content-item')];
        return {
          index: idx + 1,                // module number (1‑based)
          label: block.querySelector('.section-label')?.textContent?.trim() || `Module ${idx + 1}`,
          items: items
        };
      });

      // ── All content-item links in order across modules ──
      const allItems = moduleData.flatMap(m => m.items);
      const allHrefs = allItems.map(item => item.getAttribute('href').trim());

      // ── Current page relative to site root ──
      let currentRel = path.replace(/^\//, '');
      if (currentRel === 'index.html' || currentRel === '') return;

      let globalIndex = allHrefs.indexOf(currentRel);
      if (globalIndex === -1) {
        const currentFile = currentRel.split('/').pop();
        globalIndex = allHrefs.findIndex(href => href.endsWith(currentFile));
      }
      if (globalIndex === -1) return;

      const totalChapters = allItems.length;            // all topics across modules
      const chapterNum    = globalIndex + 1;            // 1‑based
      const chapterPct    = Math.round((chapterNum / totalChapters) * 100);

      // ── Which module does the current page belong to? ──
      let moduleNum = 0;
      let moduleTotal = moduleData.length;
      for (let m = 0; m < moduleData.length; m++) {
        const start = moduleData.slice(0, m).reduce((sum, md) => sum + md.items.length, 0);
        const end   = start + moduleData[m].items.length;
        if (globalIndex >= start && globalIndex < end) {
          moduleNum = m + 1;
          break;
        }
      }
      // Fallback (shouldn't happen)
      if (moduleNum === 0) moduleNum = 1;

      const modulePct = Math.round((moduleNum / moduleTotal) * 100);

      // ── Update the two progress bars ──
      // Top bar (module): originally had classes "topic-count" and "pct-count"
      const moduleCountEl = document.querySelector('.topic-count');   // re‑used
      const modulePctEl   = document.querySelector('.pct-count');     // re‑used
      const moduleFill    = document.getElementById('topic-fill');    // re‑used
      if (moduleCountEl) moduleCountEl.textContent = `Module ${moduleNum} of ${moduleTotal}`;
      if (modulePctEl)   modulePctEl.textContent   = `${modulePct}%`;
      if (moduleFill)    moduleFill.style.width    = modulePct + '%';

      // Bottom bar (chapter): "chapter-count", "chapter-pct", "chapter-fill"
      const chapterCountEl = document.querySelector('.chapter-count');
      const chapterPctEl   = document.querySelector('.chapter-pct');
      const chapterFill    = document.getElementById('chapter-fill');
      if (chapterCountEl) chapterCountEl.textContent = `Chapter ${chapterNum} of ${totalChapters}`;
      if (chapterPctEl)   chapterPctEl.textContent   = `${chapterPct}%`;
      if (chapterFill)    chapterFill.style.width    = chapterPct + '%';

      // ── Navigation Pills ──
      const prevItem = allItems[globalIndex - 1] || null;
      const nextItem = allItems[globalIndex + 1] || null;

      const prevBtn = document.querySelector('.nav-prev');
      const nextBtn = document.querySelector('.nav-next');
      const listBtn = document.querySelector('.nav-list');

      function resolveHref(rootRelHref) {
        if (!rootRelHref) return '#';
        const curFolder = currentRel.substring(0, currentRel.lastIndexOf('/'));
        const parts = rootRelHref.split('/');
        const tgtFolder = parts.length > 1 ? parts[0] : curFolder;
        const tgtFile   = parts[parts.length - 1];
        return tgtFolder === curFolder ? tgtFile : `../${tgtFolder}/${tgtFile}`;
      }

      if (listBtn) listBtn.href = indexUrl;

      if (prevBtn) {
        if (!prevItem) {
          prevBtn.classList.add('is-first');
          prevBtn.removeAttribute('href');
          prevBtn.title = 'First topic';
        } else {
          prevBtn.classList.remove('is-first');
          prevBtn.href = resolveHref(prevItem.getAttribute('href'));
          const title = prevItem.querySelector('.item-title')?.textContent?.trim();
          prevBtn.title = title ? `Prev: ${title}` : '';
        }
      }

      if (nextBtn) {
        if (!nextItem) {
          nextBtn.classList.add('is-last');
          nextBtn.removeAttribute('href');
          nextBtn.title = 'Last topic';
        } else {
          nextBtn.classList.remove('is-last');
          nextBtn.href = resolveHref(nextItem.getAttribute('href'));
          const title = nextItem.querySelector('.item-title')?.textContent?.trim();
          nextBtn.title = title ? `Next: ${title}` : '';
        }
      }

    } catch (e) {
      console.warn('Could not load index for progress/nav:', e);
    }
  }

  init();
});