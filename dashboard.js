/* =========================================================
   SG MAKEOVERS
   CUSTOMER DASHBOARD SCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  const customer = getCustomer();
  const appointments = getAppointments();

  if (customer) {
    loadCustomer(customer);
  }

  updateStats(appointments);
  loadUpcoming(appointments);
  loadRecent(appointments);
  loadProfile(customer);
  setupLogout();

});


/* =========================================================
   CUSTOMER
   ========================================================= */

function getCustomer() {
  try {
    return JSON.parse(
      localStorage.getItem("sgMakeoversCustomer")
    );
  } catch (error) {
    return null;
  }
}


/* =========================================================
   APPOINTMENTS
   ========================================================= */

function getAppointments() {

  let appointments = [];

  try {
    appointments =
      JSON.parse(
        localStorage.getItem("sgMakeoversAppointments")
      ) || [];
  } catch (error) {
    appointments = [];
  }

  if (!Array.isArray(appointments)) {
    appointments = [];
  }

  let latest = null;

  try {
    latest =
      JSON.parse(
        localStorage.getItem("latestAppointment")
      );
  } catch (error) {
    latest = null;
  }

  if (latest) {

    const exists = appointments.some(function (item) {
      return item.id && latest.id &&
        item.id === latest.id;
    });

    if (!exists) {
      appointments.unshift(latest);
    }

  }

  return appointments;
}


/* =========================================================
   LOAD CUSTOMER
   ========================================================= */

function loadCustomer(customer) {

  const firstName =
    customer.firstName || "Beautiful";

  const fullName =
    `${customer.firstName || ""} ${customer.lastName || ""}`
      .trim();


  setText(
    [
      "customerName",
      "welcomeName",
      "dashboardName",
      "customerFirstName"
    ],
    firstName
  );


  setText(
    [
      "fullName",
      "profileName",
      "customerFullName"
    ],
    fullName
  );


  setText(
    [
      "customerEmail",
      "profileEmail"
    ],
    customer.email || ""
  );


  setText(
    [
      "customerPhone",
      "profilePhone"
    ],
    customer.phone || ""
  );


  const initials =
    getInitials(
      customer.firstName,
      customer.lastName
    );


  document
    .querySelectorAll(
      ".customer-avatar, .profile-avatar, .avatar-initials"
    )
    .forEach(function (element) {
      element.textContent = initials;
    });


  setInput(
    "firstName",
    customer.firstName
  );

  setInput(
    "lastName",
    customer.lastName
  );

  setInput(
    "email",
    customer.email
  );

  setInput(
    "phone",
    customer.phone
  );

}


/* =========================================================
   DASHBOARD STATS
   ========================================================= */

function updateStats(appointments) {

  const total =
    appointments.length;


  const upcoming =
    appointments.filter(function (item) {

      return (
        item.status === "Upcoming" ||
        item.status === "Confirmed"
      );

    }).length;


  const completed =
    appointments.filter(function (item) {

      return item.status === "Completed";

    }).length;


  const cancelled =
    appointments.filter(function (item) {

      return item.status === "Cancelled";

    }).length;


  setText(
    [
      "totalAppointments",
      "appointmentsCount",
      "totalBookings"
    ],
    total
  );


  setText(
    [
      "upcomingAppointments",
      "upcomingCount"
    ],
    upcoming
  );


  setText(
    [
      "completedAppointments",
      "completedCount"
    ],
    completed
  );


  setText(
    [
      "cancelledAppointments",
      "cancelledCount"
    ],
    cancelled
  );

}


/* =========================================================
   UPCOMING APPOINTMENT
   ========================================================= */

function loadUpcoming(appointments) {

  const upcoming =
    appointments
      .filter(function (item) {

        return (
          item.status !== "Cancelled" &&
          item.status !== "Completed"
        );

      })
      .sort(function (a, b) {

        return (
          getDateValue(a) -
          getDateValue(b)
        );

      });


  const appointment =
    upcoming[0];


  if (!appointment) {

    setText(
      [
        "upcomingService",
        "nextService"
      ],
      "No upcoming appointment"
    );

    setText(
      [
        "upcomingDate",
        "nextDate"
      ],
      "Book your next beauty moment"
    );

    setText(
      [
        "upcomingTime",
        "nextTime"
      ],
      ""
    );

    return;
  }


  setText(
    [
      "upcomingService",
      "nextService",
      "appointmentService"
    ],
    appointment.serviceName ||
    "Beauty Service"
  );


  setText(
    [
      "upcomingDate",
      "nextDate",
      "appointmentDate"
    ],
    formatDate(
      appointment.date
    )
  );


  setText(
    [
      "upcomingTime",
      "nextTime",
      "appointmentTime"
    ],
    formatTime(
      appointment.time
    )
  );


  setText(
    [
      "upcomingPrice",
      "appointmentPrice"
    ],
    formatPrice(
      appointment.price
    )
  );


  setText(
    [
      "upcomingDuration",
      "appointmentDuration"
    ],
    appointment.duration || ""
  );


  const image =
    document.getElementById(
      "upcomingImage"
    );


  if (image && appointment.image) {

    image.src =
      appointment.image;

    image.alt =
      appointment.serviceName;

  }


  const status =
    document.getElementById(
      "upcomingStatus"
    );


  if (status) {

    status.textContent =
      appointment.status ||
      "Upcoming";

  }


  /* Store current appointment */

  localStorage.setItem(
    "currentAppointment",
    JSON.stringify(
      appointment
    )
  );

}


/* =========================================================
   RECENT APPOINTMENTS
   ========================================================= */

function loadRecent(appointments) {

  const container =
    document.getElementById(
      "recentAppointments"
    );


  if (!container) {
    return;
  }


  if (!appointments.length) {

    container.innerHTML = `
      <div style="
        padding:30px;
        text-align:center;
        color:#8d7d88;
      ">
        <i class="fa-regular fa-calendar"
           style="font-size:28px;margin-bottom:10px;"></i>
        <p>No appointments yet.</p>
        <a href="book-appointment.html"
           style="
             color:#d83b8d;
             font-weight:700;
             text-decoration:none;
           ">
          Book your first appointment
        </a>
      </div>
    `;

    return;
  }


  const recent =
    appointments.slice(0, 5);


  container.innerHTML =
    recent.map(function (item) {

      return `
        <div class="recent-appointment"
             style="
               display:flex;
               align-items:center;
               justify-content:space-between;
               gap:15px;
               padding:16px 0;
               border-bottom:1px solid #eee7eb;
             ">

          <div style="
            display:flex;
            align-items:center;
            gap:13px;
          ">

            <img
              src="${item.image || ""}"
              alt="${item.serviceName || "Service"}"
              style="
                width:55px;
                height:55px;
                object-fit:cover;
                border-radius:14px;
              "
            >

            <div>

              <div style="
                font-weight:700;
                color:#291e28;
                font-size:14px;
              ">
                ${item.serviceName || "Beauty Service"}
              </div>

              <div style="
                color:#91828d;
                font-size:12px;
                margin-top:4px;
              ">
                ${formatDate(item.date)}
                ${item.time ? " • " + formatTime(item.time) : ""}
              </div>

            </div>

          </div>

          <div style="
            text-align:right;
          ">

            <div style="
              font-weight:700;
              color:#30232e;
              font-size:13px;
            ">
              ${formatPrice(item.price)}
            </div>

            <span style="
              display:inline-block;
              margin-top:5px;
              padding:4px 9px;
              border-radius:20px;
              font-size:10px;
              font-weight:700;
              background:${getStatusBackground(item.status)};
              color:${getStatusColor(item.status)};
            ">
              ${item.status || "Upcoming"}
            </span>

          </div>

        </div>
      `;

    }).join("");

}


/* =========================================================
   PROFILE SUMMARY
   ========================================================= */

function loadProfile(customer) {

  if (!customer) {
    return;
  }


  setText(
    ["profileFirstName"],
    customer.firstName || ""
  );


  setText(
    ["profileLastName"],
    customer.lastName || ""
  );


  setText(
    ["profileEmail"],
    customer.email || ""
  );


  setText(
    ["profilePhone"],
    customer.phone || ""
  );

}


/* =========================================================
   LOGOUT
   ========================================================= */

function setupLogout() {

  document
    .querySelectorAll(
      ".logout-btn, [data-logout]"
    )
    .forEach(function (button) {

      button.addEventListener(
        "click",
        function (event) {

          event.preventDefault();

          localStorage.removeItem(
            "sgMakeoversLoggedIn"
          );

          localStorage.removeItem(
            "sgMakeoversLoginTime"
          );

          window.location.href =
            "login.html";

        }
      );

    });

}


/* =========================================================
   TEXT HELPER
   ========================================================= */

function setText(
  ids,
  value
) {

  ids.forEach(function (id) {

    const element =
      document.getElementById(id);


    if (element) {
      element.textContent =
        value ?? "";
    }

  });

}


/* =========================================================
   INPUT HELPER
   ========================================================= */

function setInput(
  id,
  value
) {

  const element =
    document.getElementById(id);


  if (
    element &&
    !element.value
  ) {

    element.value =
      value || "";

  }

}


/* =========================================================
   INITIALS
   ========================================================= */

function getInitials(
  firstName,
  lastName
) {

  const first =
    (firstName || "")
      .charAt(0)
      .toUpperCase();

  const last =
    (lastName || "")
      .charAt(0)
      .toUpperCase();


  return (
    first +
    last
  ) || "SG";

}


/* =========================================================
   DATE
   ========================================================= */

function formatDate(
  value
) {

  if (!value) {
    return "";
  }


  const date =
    new Date(
      value + "T00:00:00"
    );


  if (
    isNaN(
      date.getTime()
    )
  ) {

    return value;

  }


  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );

}


/* =========================================================
   TIME
   ========================================================= */

function formatTime(
  value
) {

  if (!value) {
    return "";
  }


  const parts =
    value.split(":");


  let hour =
    Number(parts[0]);


  const minute =
    parts[1] || "00";


  const period =
    hour >= 12
      ? "PM"
      : "AM";


  hour =
    hour % 12 || 12;


  return (
    hour +
    ":" +
    minute +
    " " +
    period
  );

}


/* =========================================================
   PRICE
   ========================================================= */

function formatPrice(
  value
) {

  const price =
    Number(
      String(value || 0)
        .replace(/[₹,]/g, "")
    );


  return (
    "₹" +
    price.toLocaleString(
      "en-IN"
    )
  );

}


/* =========================================================
   DATE VALUE FOR SORTING
   ========================================================= */

function getDateValue(
  appointment
) {

  if (!appointment.date) {
    return Number.MAX_SAFE_INTEGER;
  }


  const date =
    new Date(
      appointment.date +
      "T" +
      (appointment.time || "00:00")
    );


  return (
    isNaN(date.getTime())
      ? Number.MAX_SAFE_INTEGER
      : date.getTime()
  );

}


/* =========================================================
   STATUS COLORS
   ========================================================= */

function getStatusBackground(
  status
) {

  if (status === "Completed") {
    return "#eaf8ef";
  }


  if (status === "Cancelled") {
    return "#fff0f2";
  }


  return "#fff1f8";

}


/* =========================================================
   STATUS TEXT COLORS
   ========================================================= */

function getStatusColor(
  status
) {

  if (status === "Completed") {
    return "#287b49";
  }


  if (status === "Cancelled") {
    return "#b52e50";
  }


  return "#d43684";

}


/* =========================================================
   DASHBOARD REFRESH
   ========================================================= */

function refreshDashboard() {

  const appointments =
    getAppointments();


  updateStats(
    appointments
  );

  loadUpcoming(
    appointments
  );

  loadRecent(
    appointments
  );

}


/* =========================================================
   CANCEL APPOINTMENT
   ========================================================= */

function cancelDashboardAppointment(
  appointmentId
) {

  if (!appointmentId) {
    return;
  }


  let appointments =
    getAppointments();


  appointments =
    appointments.map(
      function (item) {

        if (
          item.id ===
          appointmentId
        ) {

          item.status =
            "Cancelled";

        }

        return item;

      }
    );


  localStorage.setItem(
    "sgMakeoversAppointments",
    JSON.stringify(
      appointments
    )
  );


  const latest =
    getLatestAppointment();


  if (
    latest &&
    latest.id ===
    appointmentId
  ) {

    latest.status =
      "Cancelled";


    localStorage.setItem(
      "latestAppointment",
      JSON.stringify(
        latest
      )
    );

  }


  refreshDashboard();

}


/* =========================================================
   LATEST APPOINTMENT
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