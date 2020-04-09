const authSwitchLinks = document.querySelectorAll('.switch');
const errorContainers = document.querySelectorAll('.error-container');
const authModals = document.querySelectorAll('.auth-modal');

const registerForm = document.querySelector('.registerForm');
const registerFormErrorMessage = document.querySelector(
  '.registerForm .error-container'
);

// toggle visibility of login and register forms
authSwitchLinks.forEach((link) => {
  link.addEventListener('click', () => {
    authModals.forEach((modal) => {
      modal.classList.toggle('active');
    });
  });
});

// close error messages clicking on 'x' buttons
errorContainers.forEach((errorMessage) => {
  errorMessage.addEventListener('click', (e) => {
    console.log(e.target);
    console.log(e.target.classList);
    if (e.target.classList[0] === 'close') {
      errorMessage.classList.remove('active');
    }
  });
});

// New user registration on the front-end
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = registerForm.email.value;
  const password = registerForm.password.value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((user) => {
      console.log('registered', user);
      registerForm.reset();
    })
    .catch((error) => {
      registerForm.querySelector('.error-message').textContent = error.message;
      registerFormErrorMessage.classList.add('active');
      registerForm.reset();
    });
});
