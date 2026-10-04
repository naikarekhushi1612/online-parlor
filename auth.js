/* =========================================================
   SG MAKEOVERS
   AUTHENTICATION SCRIPT
   Frontend Demo / LocalStorage Version
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* =======================================================
     PASSWORD TOGGLE
     ======================================================= */

  setupPasswordToggle(
    "togglePassword",
    "password"
  );

  setupPasswordToggle(
    "toggleConfirmPassword",
    "confirmPassword"
  );

  /* =======================================================
     LOGIN FORM
     ======================================================= */

  const loginForm =
    document.getElementById("loginForm");

  if (loginForm) {

    loginForm.addEventListener(
      "submit",
      handleLogin
    );

  }

  /* =======================================================
     REGISTER FORM
     ======================================================= */

  const registerForm =
    document.getElementById("registerForm");

  if (registerForm) {

    registerForm.addEventListener(
      "submit",
      handleRegister
    );

  }

  /* =======================================================
     PASSWORD STRENGTH
     ======================================================= */

  const password =
    document.getElementById("password");

  if (password) {

    password.addEventListener(
      "input",
      updatePasswordStrength
    );

  }

  /* =======================================================
     PHONE VALIDATION
     ======================================================= */

  const phone =
    document.getElementById("phone");

  if (phone) {

    phone.addEventListener(
      "input",
      function () {

        this.value =
          this.value
            .replace(/\D/g, "")
            .slice(0, 10);

      }
    );

  }

  /* =======================================================
     SHOW CURRENT USER
     ======================================================= */

  loadAuthUser();

});


/* =========================================================
   PASSWORD TOGGLE FUNCTION
   ========================================================= */

function setupPasswordToggle(
  toggleId,
  inputId
) {

  const toggle =
    document.getElementById(toggleId);

  const input =
    document.getElementById(inputId);

  if (!toggle || !input) {
    return;
  }

  toggle.addEventListener(
    "click",
    function () {

      const icon =
        toggle.querySelector("i");

      if (input.type === "password") {

        input.type = "text";

        if (icon) {
          icon.classList.remove("fa-eye");
          icon.classList.add("fa-eye-slash");
        }

      } else {

        input.type = "password";

        if (icon) {
          icon.classList.remove("fa-eye-slash");
          icon.classList.add("fa-eye");
        }

      }

    }
  );

}


/* =========================================================
   REGISTER
   ========================================================= */

function handleRegister(event) {

  event.preventDefault();

  const firstName =
    getValue("firstName");

  const lastName =
    getValue("lastName");

  const email =
    getValue("email").toLowerCase();

  const phone =
    getValue("phone");

  const password =
    getValue("password");

  const confirmPassword =
    getValue("confirmPassword");

  const terms =
    document.getElementById("terms");


  /* -------------------------------------------------------
     BASIC VALIDATION
     ------------------------------------------------------- */

  if (!firstName) {

    showAuthMessage(
      "Please enter your first name.",
      "error"
    );

    return;

  }


  if (!lastName) {

    showAuthMessage(
      "Please enter your last name.",
      "error"
    );

    return;

  }


  if (!isValidEmail(email)) {

    showAuthMessage(
      "Please enter a valid email address.",
      "error"
    );

    return;

  }


  if (!/^[0-9]{10}$/.test(phone)) {

    showAuthMessage(
      "Please enter a valid 10-digit phone number.",
      "error"
    );

    return;

  }


  if (password.length < 6) {

    showAuthMessage(
      "Password must contain at least 6 characters.",
      "error"
    );

    return;

  }


  if (password !== confirmPassword) {

    showAuthMessage(
      "Passwords do not match.",
      "error"
    );

    return;

  }


  if (terms && !terms.checked) {

    showAuthMessage(
      "Please accept the terms and conditions.",
      "error"
    );

    return;

  }


  /* -------------------------------------------------------
     CUSTOMER OBJECT
     ------------------------------------------------------- */

  const customer = {

    firstName: firstName,

    lastName: lastName,

    email: email,

    phone: phone,

    createdAt:
      new Date().toISOString()

  };


  /* -------------------------------------------------------
     SAVE CUSTOMER
     ------------------------------------------------------- */

  localStorage.setItem(
    "sgMakeoversCustomer",
    JSON.stringify(customer)
  );


  /* -------------------------------------------------------
     SAVE FRONTEND DEMO PASSWORD
     ------------------------------------------------------- */

  localStorage.setItem(
    "sgMakeoversPassword",
    password
  );


  /* -------------------------------------------------------
     NOT LOGGED IN YET
     ------------------------------------------------------- */

  localStorage.removeItem(
    "sgMakeoversLoggedIn"
  );


  showAuthMessage(
    "Account created successfully! Redirecting to login...",
    "success"
  );


  /* -------------------------------------------------------
     REDIRECT
     ------------------------------------------------------- */

  setTimeout(function () {

    window.location.href =
      "login.html";

  }, 1200);

}


/* =========================================================
   LOGIN
   ========================================================= */

function handleLogin(event) {

  event.preventDefault();


  const email =
    getValue("email").toLowerCase();

  const password =
    getValue("password");


  if (!isValidEmail(email)) {

    showAuthMessage(
      "Please enter a valid email address.",
      "error"
    );

    return;

  }


  if (!password) {

    showAuthMessage(
      "Please enter your password.",
      "error"
    );

    return;

  }


  /* -------------------------------------------------------
     GET REGISTERED CUSTOMER
     ------------------------------------------------------- */

  let customer = null;

  try {

    customer =
      JSON.parse(
        localStorage.getItem(
          "sgMakeoversCustomer"
        )
      );

  } catch (error) {

    customer = null;

  }


  const savedPassword =
    localStorage.getItem(
      "sgMakeoversPassword"
    );


  /* -------------------------------------------------------
     NO ACCOUNT
     ------------------------------------------------------- */

  if (!customer || !savedPassword) {

    showAuthMessage(
      "No account found. Please register first.",
      "error"
    );

    return;

  }


  /* -------------------------------------------------------
     CHECK EMAIL
     ------------------------------------------------------- */

  if (
    customer.email.toLowerCase() !==
    email
  ) {

    showAuthMessage(
      "Email address is not registered.",
      "error"
    );

    return;

  }


  /* -------------------------------------------------------
     CHECK PASSWORD
     ------------------------------------------------------- */

  if (savedPassword !== password) {

    showAuthMessage(
      "Incorrect password. Please try again.",
      "error"
    );

    return;

  }


  /* -------------------------------------------------------
     LOGIN SUCCESS
     ------------------------------------------------------- */

  localStorage.setItem(
    "sgMakeoversLoggedIn",
    "true"
  );


  localStorage.setItem(
    "sgMakeoversLoginTime",
    new Date().toISOString()
  );


  showAuthMessage(
    "Welcome back! Redirecting...",
    "success"
  );


  /* -------------------------------------------------------
     REDIRECT PARAMETER
     ------------------------------------------------------- */

  const params =
    new URLSearchParams(
      window.location.search
    );

  const redirect =
    params.get("redirect");


  setTimeout(function () {

    if (
      redirect &&
      isSafeRedirect(redirect)
    ) {

      window.location.href =
        redirect;

    } else {

      window.location.href =
        "customer-dashboard.html";

    }

  }, 900);

}


/* =========================================================
   GET INPUT VALUE
   ========================================================= */

function getValue(id) {

  const element =
    document.getElementById(id);

  if (!element) {
    return "";
  }

  return element.value.trim();

}


/* =========================================================
   EMAIL VALIDATION
   ========================================================= */

function isValidEmail(email) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(email);

}


/* =========================================================
   PASSWORD STRENGTH
   ========================================================= */

function updatePasswordStrength() {

  const password =
    document.getElementById("password");

  const strengthText =
    document.getElementById("passwordStrength");

  if (!password || !strengthText) {
    return;
  }


  const value =
    password.value;


  if (!value) {

    strengthText.textContent =
      "";

    strengthText.className =
      "password-strength";

    return;

  }


  let score = 0;


  if (value.length >= 6) {
    score++;
  }

  if (value.length >= 10) {
    score++;
  }

  if (/[A-Z]/.test(value)) {
    score++;
  }

  if (/[0-9]/.test(value)) {
    score++;
  }

  if (/[^A-Za-z0-9]/.test(value)) {
    score++;
  }


  if (score <= 1) {

    strengthText.textContent =
      "Weak password";

    strengthText.className =
      "password-strength weak";

  }

  else if (score <= 3) {

    strengthText.textContent =
      "Medium password";

    strengthText.className =
      "password-strength medium";

  }

  else {

    strengthText.textContent =
      "Strong password";

    strengthText.className =
      "password-strength strong";

  }

}


/* =========================================================
   AUTH MESSAGE
   ========================================================= */

function showAuthMessage(
  message,
  type = "error"
) {

  let messageBox =
    document.querySelector(
      ".auth-message"
    );


  if (!messageBox) {

    messageBox =
      document.createElement("div");

    messageBox.className =
      "auth-message";

    const form =
      document.querySelector("form");

    if (form) {

      form.prepend(
        messageBox
      );

    } else {

      document.body.prepend(
        messageBox
      );

    }

  }


  messageBox.textContent =
    message;

  messageBox.className =
    "auth-message " +
    type;


  messageBox.style.padding =
    "12px 14px";

  messageBox.style.marginBottom =
    "15px";

  messageBox.style.borderRadius =
    "12px";

  messageBox.style.fontSize =
    "13px";


  if (type === "success") {

    messageBox.style.background =
      "#e9f8ef";

    messageBox.style.color =
      "#247545";

  } else {

    messageBox.style.background =
      "#fff0f3";

    messageBox.style.color =
      "#b52e4f";

  }


  setTimeout(function () {

    if (messageBox) {
      messageBox.style.opacity =
        "0";

      messageBox.style.transition =
        "opacity .3s";
    }

  }, 3500);

}


/* =========================================================
   CHECK LOGIN
   ========================================================= */

function isCustomerLoggedIn() {

  return (
    localStorage.getItem(
      "sgMakeoversLoggedIn"
    ) === "true"
  );

}


/* =========================================================
   REQUIRE LOGIN
   ========================================================= */

function requireCustomerLogin() {

  if (isCustomerLoggedIn()) {
    return true;
  }


  const currentPage =
    window.location.pathname
      .split("/")
      .pop();


  window.location.href =
    "login.html?redirect=" +
    encodeURIComponent(
      currentPage
    );


  return false;

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logoutCustomer() {

  localStorage.removeItem(
    "sgMakeoversLoggedIn"
  );

  localStorage.removeItem(
    "sgMakeoversLoginTime"
  );


  window.location.href =
    "login.html";

}


/* =========================================================
   SAFE REDIRECT
   ========================================================= */

function isSafeRedirect(page) {

  const allowedPages = [

    "customer-dashboard.html",
    "my-appointments.html",
    "appointment-details.html",
    "profile.html",
    "bills.html",
    "book-appointment.html"

  ];


  return allowedPages.includes(
    page
  );

}


/* =========================================================
   LOAD USER INTO AUTH PAGE
   ========================================================= */

function loadAuthUser() {

  const customer =
    getStoredCustomer();


  if (!customer) {
    return;
  }


  document
    .querySelectorAll(".logged-user-name")
    .forEach(function (element) {

      element.textContent =
        (
          customer.firstName +
          " " +
          customer.lastName
        ).trim();

    });


  document
    .querySelectorAll(".logged-user-email")
    .forEach(function (element) {

      element.textContent =
        customer.email;

    });

}


/* =========================================================
   GET STORED CUSTOMER
   ========================================================= */

function getStoredCustomer() {

  try {

    return JSON.parse(
      localStorage.getItem(
        "sgMakeoversCustomer"
      )
    );

  } catch (error) {

    return null;

  }

}