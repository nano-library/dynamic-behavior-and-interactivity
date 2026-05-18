document.querySelectorAll('.example').forEach(card => {
  const header   = card.querySelector('.example-header');
  const problem  = card.querySelector('.example-block.problem');
  const solution = card.querySelector('.example-block.solution');

  solution.style.overflow   = 'hidden';
  solution.style.maxHeight  = '0';
  solution.style.transition = 'max-height 0.6s cubic-bezier(0.4,0,0.2,1)';

  header.style.cursor  = 'pointer';
  problem.style.cursor = 'pointer';

  let open = false;
  let typeset = false;

  function toggle() {
    open = !open;

    if (open) {
      solution.style.maxHeight = '9999px';

      if (!typeset && window.MathJax) {
        typeset = true;
        MathJax.typesetPromise([card]);
      }
    } else {
      solution.style.maxHeight = '0';
    }
  }

  header.addEventListener('click', toggle);
  problem.addEventListener('click', toggle);
});