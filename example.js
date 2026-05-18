document.querySelectorAll('.example').forEach(card => {
  const header   = card.querySelector('.example-header');
  const solution = card.querySelector('.example-block.solution');

  solution.style.overflow   = 'hidden';
  solution.style.maxHeight  = '0';
  solution.style.transition = 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)';

  header.style.cursor = 'pointer';

  let open = false;
  let typeset = false;

  header.addEventListener('click', () => {
    open = !open;

    if (open) {
      solution.style.maxHeight = solution.scrollHeight + 'px';

      if (!typeset && window.MathJax) {
        typeset = true;
        MathJax.typesetPromise([card]).then(() => {
          solution.style.maxHeight = solution.scrollHeight + 'px';
        });
      }
    } else {
      solution.style.maxHeight = '0';
    }
  });
});