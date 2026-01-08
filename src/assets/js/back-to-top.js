document.addEventListener('DOMContentLoaded', () => {
  const backToTopButtons = document.querySelectorAll('[data-back-to-top]');

  backToTopButtons.forEach(button => {
    button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });
});
