const authSwitchLinks = document.querySelectorAll('.switch');
const authModals = document.querySelectorAll('.auth-modal');

authSwitchLinks.forEach((link) => {
  link.addEventListener('click', () => {
    authModals.forEach((modal) => {
      modal.classList.toggle('active');
    });
  });
});
