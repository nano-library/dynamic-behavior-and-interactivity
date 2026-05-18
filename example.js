document.querySelectorAll('.example').forEach(card => {
  const header  = card.querySelector('.example-header');
  const body    = card.querySelector('.example-body');
  const problem = card.querySelector('.example-block.problem');

  body.style.overflow   = 'hidden';
  body.style.transition = 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)';

  header.style.cursor = 'pointer';

  let open = false;
  let typeset = false;

  body.style.maxHeight = problem.scrollHeight + 'px';

  header.addEventListener('click', () => {
    open = !open;

    if (open) {
      body.style.maxHeight = body.scrollHeight + 'px';

      if (!typeset && window.MathJax) {
        typeset = true;
        MathJax.typesetPromise([card]).then(() => {
          body.style.maxHeight = body.scrollHeight + 'px';
        });
      }
    } else {
      body.style.maxHeight = problem.scrollHeight + 'px';
    }
  });
});