const authSwitchLinks = document.querySelectorAll('.switch');
const errorContainers = document.querySelectorAll('.error-container');
const authModals = document.querySelectorAll('.auth-modal');
const registerForm = document.querySelector('.registerForm');
const loginForm = document.querySelector('.loginForm');

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
    if (e.target.classList[0] === 'close') {
      errorMessage.classList.remove('active');
    }
  });
});

// Handle new user registration
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
      registerForm.querySelector('.error-container').classList.add('active');
      registerForm.reset();
    });
});

// Handle user login
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((user) => {
      console.log('logged in', user);
      loginForm.reset();
    })
    .catch((error) => {
      loginForm.querySelector('.error-message').textContent = error.message;
      loginForm.querySelector('.error-container').classList.add('active');
      loginForm.reset();
    });
});
