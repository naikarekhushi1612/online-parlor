/* =========================================================
   SG MAKEOVERS
   MAIN WEBSITE SCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* =======================================================
     ACTIVE NAVIGATION
     ======================================================= */

  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll("a[href]").forEach(function (link) {

    const href = link.getAttribute("href");

    if (!href || href.startsWith("#")) return;

    const cleanHref = href.split("?")[0];

    if (cleanHref === currentPage) {
      link.classList.add("active");
    }

  });


  /* =======================================================
     MOBILE MENU
     ======================================================= */

  const menuButton =
    document.querySelector(".menu-toggle");

  const navLinks =
    document.querySelector(".nav-links");

  if (menuButton && navLinks) {

    menuButton.addEventListener("click", function () {

      navLinks.classList.toggle("mobile-open");

      const icon =
        menuButton.querySelector("i");

      if (icon) {

        if (navLinks.classList.contains("mobile-open")) {

          icon.classList.remove("fa-bars");
          icon.classList.add("fa-xmark");

        } else {

          icon.classList.remove("fa-xmark");
          icon.classList.add("fa-bars");

        }

      }

    });

  }


  /* =======================================================
     CLOSE MOBILE MENU
     ======================================================= */

  document.querySelectorAll(".nav-links a").forEach(function (link) {

    link.addEventListener("click", function () {

      if (navLinks) {
        navLinks.classList.remove("mobile-open");
      }

      if (menuButton) {

        const icon =
          menuButton.querySelector("i");

        if (icon) {

          icon.classList.remove("fa-xmark");
          icon.classList.add("fa-bars");

        }

      }

    });

  });


  /* =======================================================
     SMOOTH SCROLL
     ======================================================= */

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {

    link.addEventListener("click", function (event) {

      const targetId =
        link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target =
        document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });


  /* =======================================================
     SCROLL REVEAL
     ======================================================= */

  const revealElements =
    document.querySelectorAll(
      ".service-card, .why-card, .feature-card, .about-card, .section-card, .reveal-item"
    );

  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        function (entries) {

          entries.forEach(function (entry) {

            if (entry.isIntersecting) {

              entry.target.classList.add("show");

              observer.unobserve(entry.target);

            }

          });

        },
        {
          threshold: 0.12
        }
      );

    revealElements.forEach(function (element) {

      element.classList.add("reveal");

      observer.observe(element);

    });

  }


  /* =======================================================
     CURRENT YEAR
     ======================================================= */

  document.querySelectorAll(".current-year").forEach(function (element) {

    element.textContent =
      new Date().getFullYear();

  });


  /* =======================================================
     CUSTOMER NAME
     ======================================================= */

  loadCustomerName();


  /* =======================================================
     PROTECTED CUSTOMER LINKS
     ======================================================= */

  setupCustomerNavigation();


  /* =======================================================
     SERVICE BOOKING BUTTONS
     ======================================================= */

  setupBookingButtons();


  /* =======================================================
     BACK TO TOP
     ======================================================= */

  setupBackToTop();

});


/* =========================================================
   LOAD CUSTOMER NAME
   ========================================================= */

function loadCustomerName() {

  const customer =
    JSON.parse(
      localStorage.getItem("sgMakeoversCustomer")
    );

  if (!customer) {
    return;
  }

  const firstName =
    customer.firstName || "";

  const lastName =
    customer.lastName || "";

  const fullName =
    `${firstName} ${lastName}`.trim();

  document.querySelectorAll(".customer-name").forEach(function (element) {

    element.textContent =
      fullName || "Beautiful";

  });

  document.querySelectorAll(".customer-first-name").forEach(function (element) {

    element.textContent =
      firstName || "Beautiful";

  });

}


/* =========================================================
   CUSTOMER NAVIGATION
   ========================================================= */

function setupCustomerNavigation() {

  const loggedIn =
    localStorage.getItem("sgMakeoversLoggedIn") === "true";

  const customerPages = [
    "customer-dashboard.html",
    "my-appointments.html",
    "appointment-details.html",
    "profile.html",
    "bills.html"
  ];

  document.querySelectorAll("a[href]").forEach(function (link) {

    const href =
      link.getAttribute("href");

    if (!href) {
      return;
    }

    const page =
      href.split("?")[0];

    if (!customerPages.includes(page)) {
      return;
    }

    link.addEventListener("click", function (event) {

      if (!loggedIn) {

        event.preventDefault();

        window.location.href =
          "login.html?redirect=" +
          encodeURIComponent(page);

      }

    });

  });

}


/* =========================================================
   BOOKING BUTTONS
   ========================================================= */

function setupBookingButtons() {

  document.querySelectorAll("[data-service]").forEach(function (button) {

    button.addEventListener("click", function () {

      const service =
        button.getAttribute("data-service");

      if (!service) {
        return;
      }

      window.location.href =
        "book-appointment.html?service=" +
        encodeURIComponent(service);

    });

  });

}


/* =========================================================
   BOOK SERVICE
   ========================================================= */

function bookService(serviceName) {

  if (!serviceName) {
    window.location.href = "services.html";
    return;
  }

  window.location.href =
    "book-appointment.html?service=" +
    encodeURIComponent(serviceName);

}


/* =========================================================
   LOGIN CHECK
   ========================================================= */

function isLoggedIn() {

  return (
    localStorage.getItem("sgMakeoversLoggedIn") === "true"
  );

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logoutCustomer() {

  localStorage.removeItem(
    "sgMakeoversLoggedIn"
  );

  window.location.href =
    "login.html";

}


/* =========================================================
   BACK TO TOP
   ========================================================= */

function setupBackToTop() {

  const button =
    document.querySelector(".back-to-top");

  if (!button) {
    return;
  }

  window.addEventListener("scroll", function () {

    if (window.scrollY > 450) {

      button.classList.add("visible");

    } else {

      button.classList.remove("visible");

    }

  });

  button.addEventListener("click", function () {

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  });

}


/* =========================================================
   TOAST MESSAGE
   ========================================================= */

function showToast(message, type = "success") {

  let toast =
    document.querySelector(".sg-toast");

  if (!toast) {

    toast =
      document.createElement("div");

    toast.className =
      "sg-toast";

    document.body.appendChild(toast);

  }

  toast.textContent =
    message;

  toast.className =
    "sg-toast " + type + " show";

  setTimeout(function () {

    toast.classList.remove("show");

  }, 3000);

}


/* =========================================================
   CONFIRM LOGOUT
   ========================================================= */

function confirmLogout() {

  const answer =
    confirm(
      "Are you sure you want to logout?"
    );

  if (!answer) {
    return;
  }

  logoutCustomer();

}


/* =========================================================
   FORMAT PRICE
   ========================================================= */

function formatPrice(price) {

  const number =
    Number(
      String(price)
        .replace(/[₹,]/g, "")
        .trim()
    );

  if (isNaN(number)) {
    return price;
  }

  return "₹" +
    number.toLocaleString("en-IN");

}


/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatDate(dateValue) {

  if (!dateValue) {
    return "";
  }

  const date =
    new Date(dateValue);

  if (isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  );

}


/* =========================================================
   GET CUSTOMER
   ========================================================= */

function getCustomer() {

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


/* =========================================================
   SAVE CUSTOMER
   ========================================================= */

function saveCustomer(customer) {

  if (!customer) {
    return false;
  }

  localStorage.setItem(
    "sgMakeoversCustomer",
    JSON.stringify(customer)
  );

  return true;

}


/* =========================================================
   GET LATEST APPOINTMENT
   ========================================================= */

function getLatestAppointment() {

  try {

    return JSON.parse(
      localStorage.getItem(
        "latestAppointment"
      )
    );

  } catch (error) {

    return null;

  }

}


/* =========================================================
   SAVE APPOINTMENT
   ========================================================= */

function saveLatestAppointment(appointment) {

  if (!appointment) {
    return false;
  }

  localStorage.setItem(
    "latestAppointment",
    JSON.stringify(appointment)
  );

  return true;

}


/* =========================================================
   REMOVE APPOINTMENT
   ========================================================= */

function removeLatestAppointment() {

  localStorage.removeItem(
    "latestAppointment"
  );

}


/* =========================================================
   SERVICE DATA
   ========================================================= */

const SG_SERVICES = {

  facial: {
    name: "Signature Glow Facial",
    price: 799,
    duration: "60 minutes",
    category: "FACIAL",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85"
  },

  hair: {
    name: "Signature Hair Styling",
    price: 599,
    duration: "45 minutes",
    category: "HAIR",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=85"
  },

  manicure: {
    name: "Classic Manicure",
    price: 499,
    duration: "40 minutes",
    category: "NAILS",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85"
  },

  makeup: {
    name: "Soft Glam Makeup",
    price: 1299,
    duration: "75 minutes",
    category: "MAKEUP",
    image:
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=900&q=85"
  },

  hydration: {
    name: "Hydration Ritual",
    price: 899,
    duration: "50 minutes",
    category: "FACIAL",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=85"
  },

  hairspa: {
    name: "Hair Spa Ritual",
    price: 999,
    duration: "60 minutes",
    category: "HAIR",
    image:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=85"
  }

};


/* =========================================================
   FIND SERVICE
   ========================================================= */

function findService(service) {

  if (!service) {
    return null;
  }

  const search =
    String(service)
      .toLowerCase()
      .trim();

  const keys =
    Object.keys(SG_SERVICES);

  for (let i = 0; i < keys.length; i++) {

    const item =
      SG_SERVICES[keys[i]];

    if (
      keys[i] === search ||
      item.name.toLowerCase() === search ||
      item.category.toLowerCase() === search
    ) {

      return item;

    }

  }

  return null;

}


/* =========================================================
   ADD CSS FOR COMMON JS FEATURES
   ========================================================= */

(function addCommonStyles() {

  const style =
    document.createElement("style");

  style.textContent = `

    .reveal {
      opacity: 0;
      transform: translateY(20px);
      transition:
        opacity .6s ease,
        transform .6s ease;
    }

    .reveal.show {
      opacity: 1;
      transform: translateY(0);
    }

    .nav-links.mobile-open {
      display: flex;
      position: absolute;
      top: 78px;
      left: 0;
      right: 0;
      background: white;
      padding: 20px 6%;
      flex-direction: column;
      align-items: flex-start;
      gap: 18px;
      border-bottom: 1px solid #eee4eb;
      box-shadow: 0 15px 30px rgba(40,20,35,.08);
    }

    .sg-toast {
      position: fixed;
      right: 25px;
      bottom: 25px;
      z-index: 9999;
      min-width: 260px;
      max-width: 360px;
      padding: 14px 18px;
      border-radius: 13px;
      background: #211a24;
      color: white;
      font-size: 13px;
      box-shadow: 0 12px 30px rgba(0,0,0,.18);
      opacity: 0;
      transform: translateY(15px);
      pointer-events: none;
      transition: .3s;
    }

    .sg-toast.show {
      opacity: 1;
      transform: translateY(0);
    }

    .sg-toast.success {
      border-left: 4px solid #e83e8c;
    }

    .sg-toast.error {
      border-left: 4px solid #d94c65;
    }

    .back-to-top {
      opacity: 0;
      pointer-events: none;
      transition: .25s;
    }

    .back-to-top.visible {
      opacity: 1;
      pointer-events: auto;
    }

    @media (max-width:760px) {

      .nav-links.mobile-open {
        top: 70px;
      }

    }

  `;

  document.head.appendChild(style);

})();