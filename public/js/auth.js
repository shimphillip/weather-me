const authSwitchLinks = document.querySelectorAll('.switch');
const errorContainers = document.querySelectorAll('.error-container');
const authModals = document.querySelectorAll('.auth-modal');
const registerForm = document.querySelector('.registerForm');
const loginForm = document.querySelector('.loginForm');
const dashBoard = document.querySelector('.dashboard');
const logout = document.querySelector('.logout');
const deleteAccount = document.querySelector('.deleteAccount');

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
      errorContainers.forEach((errorMessage) => {
        errorMessage.classList.remove('active');
      });
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
      errorContainers.forEach((errorMessage) => {
        errorMessage.classList.remove('active');
      });
    })
    .catch((error) => {
      loginForm.querySelector('.error-message').textContent = error.message;
      loginForm.querySelector('.error-container').classList.add('active');
      loginForm.reset();
    });
});

// logout
logout.addEventListener('click', () => {
  console.log('clicking');

  firebase
    .auth()
    .signOut()
    .then(() => console.log('user signed out'))
    .catch((error) => console.log(error));
});

// delete user
deleteAccount.addEventListener('click', () => {
  const user = firebase.auth().currentUser;

  user
    .delete()
    .then(() => {
      // TODO: alert user
    })
    .catch((error) => {
      // An error happened.
    });
});

// auth listener
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // open dashboard
    authModals.forEach((modal) => modal.classList.remove('active'));
    dashBoard.classList.add('active');
    document.querySelector('.navbar-brand').textContent = trimEmail(user.email);

    // load vue instance
    const app = document.createElement('script');
    app.setAttribute('src', './js/app.js');
    app.setAttribute('id', 'appScript');
    document.head.appendChild(app);
  } else {
    console.log('user logged out');
    // open login form
    authModals[1].classList.add('active');
    dashBoard.classList.remove('active');

    // unload vue instance
    document.head.removeChild(document.querySelector('#appScript'));
    setTimeout(() => {
      location.reload();
    }, 200);
  }
});
