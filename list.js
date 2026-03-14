document.querySelectorAll('.contents-list .content-item .item-num').forEach((el, i) => {
    el.textContent = i + 1;
});

function initContentItemColors() {
    const colors = [
        { border: 'var(--h2)',        background: 'var(--highlight)', num_bg: 'var(--highlight)', num_border: 'var(--border)',  num_color: 'var(--h2)' },
        { border: 'var(--h4)',        background: '#EEF6FD',          num_bg: '#EEF6FD',          num_border: '#cce3f6',        num_color: 'var(--h4)' },
        { border: 'var(--h3)',        background: '#F0FAF0',          num_bg: '#F0FAF0',          num_border: '#c5e8c4',        num_color: 'var(--h3)' },
        { border: 'var(--blockquote)',background: '#F3EFFE',          num_bg: '#F3EFFE',          num_border: '#ddd0f7',        num_color: 'var(--blockquote)' },
    ];

    document.querySelectorAll('.content-item').forEach((item, i) => {
        const c = colors[i % colors.length];

        // hover color via CSS variable on the element
        item.style.setProperty('--item-hover-border', c.border);
        item.style.setProperty('--item-hover-bg', c.background);

        // num bubble
        const num = item.querySelector('.item-num');
        if (num) {
        num.style.background = c.num_bg;
        num.style.borderColor = c.num_border;
        num.style.color = c.num_color;
        }
    });
}
document.addEventListener('DOMContentLoaded', initContentItemColors);