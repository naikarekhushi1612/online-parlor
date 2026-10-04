/* =========================================================
   SG MAKEOVERS - BOOKING SYSTEM
   Real Supabase Appointment Booking
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    console.log("SG MAKEOVERS Booking System Started");

    /* =====================================================
       HELPERS
       ===================================================== */

    const getEl = (...ids) => {
        for (const id of ids) {
            const element = document.getElementById(id);
            if (element) return element;
        }
        return null;
    };

    const showMessage = (message, type = "error") => {

        const existing =
            document.getElementById("bookingMessage");

        if (existing) {

            existing.textContent = message;

            existing.style.display = "block";

            existing.style.padding = "12px 15px";
            existing.style.borderRadius = "10px";
            existing.style.marginTop = "12px";
            existing.style.fontSize = "13px";

            if (type === "success") {
                existing.style.background = "#eaf8f2";
                existing.style.color = "#16865a";
                existing.style.border =
                    "1px solid #bce8d3";
            } else {
                existing.style.background = "#fff0f1";
                existing.style.color = "#c53d45";
                existing.style.border =
                    "1px solid #f0c5c9";
            }

            return;
        }

        alert(message);
    };


    const setButtonLoading = (button, loading) => {

        if (!button) return;

        if (loading) {

            button.dataset.originalText =
                button.innerHTML;

            button.disabled = true;

            button.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Booking...';

            button.style.opacity = "0.7";

        } else {

            button.disabled = false;

            button.innerHTML =
                button.dataset.originalText ||
                "Confirm Booking";

            button.style.opacity = "1";
        }
    };


    /* =====================================================
       SUPABASE CHECK
       ===================================================== */

    if (
        typeof supabaseClient === "undefined" ||
        !supabaseClient
    ) {

        console.error(
            "Supabase client is not available."
        );

        showMessage(
            "Supabase connection is not available. Please check supabase-config.js."
        );

        return;
    }


    /* =====================================================
       GET LOGGED-IN USER
       ===================================================== */

    let currentUser = null;

    try {

        const {
            data,
            error
        } = await supabaseClient.auth.getUser();

        if (error) {
            throw error;
        }

        currentUser = data?.user || null;

    } catch (error) {

        console.error(
            "Authentication error:",
            error
        );

        showMessage(
            "Unable to verify your login session."
        );

        return;
    }


    /* =====================================================
       CUSTOMER LOGIN REQUIRED
       ===================================================== */

    if (!currentUser) {

        const returnUrl =
            window.location.href;

        localStorage.setItem(
            "bookingReturnUrl",
            returnUrl
        );

        alert(
            "Please login first to book an appointment."
        );

        window.location.href =
            "login.html";

        return;
    }


    /* =====================================================
       GET SERVICE ID FROM URL
       
       Example:
       book-appointment.html?service=1
       ===================================================== */

    const params =
        new URLSearchParams(
            window.location.search
        );

    const serviceId =
        params.get("service");


    /* =====================================================
       PAGE ELEMENTS
       ===================================================== */

    const bookingForm =
        getEl(
            "bookingForm",
            "appointmentForm",
            "bookForm"
        );

    const dateInput =
        getEl(
            "appointmentDate",
            "bookingDate",
            "date"
        );

    const timeInput =
        getEl(
            "appointmentTime",
            "bookingTime",
            "time"
        );

    const notesInput =
        getEl(
            "notes",
            "appointmentNotes",
            "bookingNotes"
        );

    const submitButton =
        getEl(
            "confirmBooking",
            "submitBooking",
            "bookBtn",
            "submitBtn"
        );


    /* =====================================================
       SERVICE DISPLAY ELEMENTS
       ===================================================== */

    const serviceNameElements = [
        getEl("selectedServiceName"),
        getEl("serviceName"),
        getEl("summaryServiceName")
    ].filter(Boolean);

    const servicePriceElements = [
        getEl("selectedServicePrice"),
        getEl("servicePrice"),
        getEl("summaryServicePrice")
    ].filter(Boolean);

    const serviceDurationElements = [
        getEl("selectedServiceDuration"),
        getEl("serviceDuration"),
        getEl("summaryServiceDuration")
    ].filter(Boolean);


    /* =====================================================
       DATE MINIMUM = TODAY
       ===================================================== */

    if (dateInput) {

        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                today.getDate()
            ).padStart(2, "0");

        dateInput.min =
            `${year}-${month}-${day}`;
    }


    /* =====================================================
       LOAD SELECTED SERVICE
       ===================================================== */

    let selectedService = null;

    async function loadService() {

        if (!serviceId) {

            showMessage(
                "No service was selected. Please choose a service first."
            );

            if (submitButton) {
                submitButton.disabled = true;
            }

            return;
        }

        try {

            const {
                data,
                error
            } = await supabaseClient
                .from("services")
                .select("*")
                .eq("id", serviceId)
                .eq("is_active", true)
                .maybeSingle();

            if (error) {
                throw error;
            }

            if (!data) {

                showMessage(
                    "This service is unavailable or has been removed."
                );

                if (submitButton) {
                    submitButton.disabled = true;
                }

                return;
            }

            selectedService = data;

            console.log(
                "Selected service:",
                selectedService
            );

            updateServiceUI();

        } catch (error) {

            console.error(
                "Service loading error:",
                error
            );

            showMessage(
                "Unable to load selected service: " +
                error.message
            );

            if (submitButton) {
                submitButton.disabled = true;
            }
        }
    }


    /* =====================================================
       UPDATE SERVICE INFORMATION ON PAGE
       ===================================================== */

    function updateServiceUI() {

        if (!selectedService) {
            return;
        }

        const name =
            selectedService.name ||
            "Beauty Service";

        const price =
            Number(
                selectedService.price || 0
            );

        const duration =
            Number(
                selectedService.duration_minutes || 0
            );

        serviceNameElements
            .forEach(element => {

                element.textContent =
                    name;
            });

        servicePriceElements
            .forEach(element => {

                element.textContent =
                    `₹${price.toLocaleString("en-IN")}`;
            });

        serviceDurationElements
            .forEach(element => {

                element.textContent =
                    duration
                        ? `${duration} min`
                        : "—";
            });

        /*
         * Some existing versions of the page
         * use these generic IDs.
         */

        const genericName =
            getEl(
                "serviceTitle",
                "selectedService"
            );

        if (genericName) {
            genericName.textContent =
                name;
        }

        const genericPrice =
            getEl(
                "price",
                "totalAmount"
            );

        if (
            genericPrice &&
            genericPrice.tagName !== "INPUT"
        ) {
            genericPrice.textContent =
                `₹${price.toLocaleString("en-IN")}`;
        }
    }


    /* =====================================================
       LOAD CUSTOMER PROFILE
       ===================================================== */

    let customerProfile = null;

    async function loadCustomerProfile() {

        try {

            const {
                data,
                error
            } = await supabaseClient
                .from("profiles")
                .select("*")
                .eq("id", currentUser.id)
                .maybeSingle();

            if (error) {

                console.warn(
                    "Profile could not be loaded:",
                    error
                );

                return;
            }

            customerProfile = data || null;

        } catch (error) {

            console.warn(
                "Profile loading failed:",
                error
            );
        }
    }


    /* =====================================================
       BASIC VALIDATION
       ===================================================== */

    function validateDate(dateValue) {

        if (!dateValue) {

            return {
                valid: false,
                message:
                    "Please select an appointment date."
            };
        }

        const selectedDate =
            new Date(
                `${dateValue}T00:00:00`
            );

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );

        if (selectedDate < today) {

            return {
                valid: false,
                message:
                    "Please select today or a future date."
            };
        }

        return {
            valid: true
        };
    }


    function validateTime(timeValue) {

        if (!timeValue) {

            return {
                valid: false,
                message:
                    "Please select an appointment time."
            };
        }

        return {
            valid: true
        };
    }


    /* =====================================================
       OPTIONAL AVAILABILITY CHECK
       
       We check existing appointments for the
       same date/time before inserting.
       ===================================================== */

    async function checkExistingBooking(
        appointmentDate,
        appointmentTime
    ) {

        try {

            const {
                data,
                error
            } = await supabaseClient
                .from("appointments")
                .select("id,status")
                .eq(
                    "appointment_date",
                    appointmentDate
                )
                .eq(
                    "appointment_time",
                    appointmentTime
                )
                .neq(
                    "status",
                    "cancelled"
                )
                .limit(1);

            if (error) {

                /*
                 * If RLS prevents this read,
                 * don't block the customer unnecessarily.
                 * The actual INSERT will still be protected
                 * by the database policies.
                 */
                console.warn(
                    "Availability check skipped:",
                    error
                );

                return true;
            }

            return !(
                data &&
                data.length > 0
            );

        } catch (error) {

            console.warn(
                "Availability check failed:",
                error
            );

            return true;
        }
    }


    /* =====================================================
       BOOK APPOINTMENT
       ===================================================== */

    async function createAppointment() {

        if (!selectedService) {

            showMessage(
                "Please select a valid service."
            );

            return;
        }

        const appointmentDate =
            dateInput
                ? dateInput.value
                : "";

        const appointmentTime =
            timeInput
                ? timeInput.value
                : "";

        const notes =
            notesInput
                ? notesInput.value.trim()
                : "";


        /* DATE */

        const dateValidation =
            validateDate(
                appointmentDate
            );

        if (!dateValidation.valid) {

            showMessage(
                dateValidation.message
            );

            if (dateInput) {
                dateInput.focus();
            }

            return;
        }


        /* TIME */

        const timeValidation =
            validateTime(
                appointmentTime
            );

        if (!timeValidation.valid) {

            showMessage(
                timeValidation.message
            );

            if (timeInput) {
                timeInput.focus();
            }

            return;
        }


        /* AVAILABILITY */

        const available =
            await checkExistingBooking(
                appointmentDate,
                appointmentTime
            );

        if (!available) {

            showMessage(
                "This date and time is already booked. Please choose another time."
            );

            return;
        }


        /* BUTTON */

        setButtonLoading(
            submitButton,
            true
        );


        try {

            /*
             * Appointment table structure:
             *
             * id
             * customer_id
             * service_id
             * staff_id
             * appointment_date
             * appointment_time
             * status
             * notes
             * total_amount
             * created_at
             * updated_at
             */

            const appointmentPayload = {

                customer_id:
                    currentUser.id,

                service_id:
                    selectedService.id,

                staff_id:
                    null,

                appointment_date:
                    appointmentDate,

                appointment_time:
                    appointmentTime,

                status:
                    "pending",

                notes:
                    notes || null,

                total_amount:
                    Number(
                        selectedService.price || 0
                    )
            };


            console.log(
                "Creating appointment:",
                appointmentPayload
            );


            const {
                data,
                error
            } = await supabaseClient
                .from("appointments")
                .insert(
                    appointmentPayload
                )
                .select()
                .single();


            if (error) {

                console.error(
                    "Appointment insert error:",
                    error
                );

                throw error;
            }


            if (!data) {

                throw new Error(
                    "Appointment was not created."
                );
            }


            console.log(
                "Appointment created:",
                data
            );


            /* =================================================
               SAVE LATEST BOOKING LOCALLY
               ================================================= */

            const latestAppointment = {

                id:
                    data.id,

                appointment_id:
                    data.id,

                customer_id:
                    currentUser.id,

                service_id:
                    selectedService.id,

                service_name:
                    selectedService.name,

                appointment_date:
                    appointmentDate,

                appointment_time:
                    appointmentTime,

                status:
                    data.status || "pending",

                total_amount:
                    Number(
                        selectedService.price || 0
                    ),

                notes:
                    notes || "",

                created_at:
                    data.created_at ||
                    new Date().toISOString()
            };


            localStorage.setItem(
                "latestAppointment",
                JSON.stringify(
                    latestAppointment
                )
            );


            /*
             * Keep a simple booking history
             * locally as a fallback for UI.
             */

            let bookingHistory = [];

            try {

                bookingHistory =
                    JSON.parse(
                        localStorage.getItem(
                            "bookingHistory"
                        )
                    ) || [];

            } catch {
                bookingHistory = [];
            }


            bookingHistory.unshift(
                latestAppointment
            );


            /*
             * Keep only the latest 20
             * local fallback records.
             */

            bookingHistory =
                bookingHistory.slice(
                    0,
                    20
                );


            localStorage.setItem(
                "bookingHistory",
                JSON.stringify(
                    bookingHistory
                )
            );


            /* =================================================
               SUCCESS
               ================================================= */

            showMessage(
                "Appointment booked successfully!",
                "success"
            );


            /*
             * Redirect to real appointment
             * details page using DB ID.
             */

            setTimeout(() => {

                window.location.href =
                    `appointment-details.html?id=${encodeURIComponent(data.id)}`;

            }, 500);


        } catch (error) {

            console.error(
                "Booking failed:",
                error
            );


            let message =
                "Unable to create appointment.";


            if (
                error &&
                error.message
            ) {

                message =
                    error.message;
            }


            /*
             * Friendly messages for common
             * Supabase errors.
             */

            if (
                error?.code === "42501"
            ) {

                message =
                    "Booking permission is not configured correctly. Please contact the administrator.";
            }

            if (
                error?.code === "23503"
            ) {

                message =
                    "The selected service is no longer available. Please choose another service.";
            }

            if (
                error?.code === "23505"
            ) {

                message =
                    "This appointment already exists. Please choose another time.";
            }


            showMessage(
                message
            );

        } finally {

            setButtonLoading(
                submitButton,
                false
            );
        }
    }


    /* =====================================================
       FORM SUBMIT
       ===================================================== */

    if (bookingForm) {

        bookingForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                await createAppointment();

            }
        );

    } else if (submitButton) {

        /*
         * Fallback if the existing page does not
         * wrap the fields inside a form.
         */

        submitButton.addEventListener(
            "click",
            async event => {

                event.preventDefault();

                await createAppointment();

            }
        );
    }


    /* =====================================================
       PREVENT PAST TIME WHEN BOOKING TODAY
       ===================================================== */

    function validateTodayTime() {

        if (
            !dateInput ||
            !timeInput ||
            !dateInput.value ||
            !timeInput.value
        ) {
            return;
        }

        const today =
            new Date();

        const selected =
            new Date(
                `${dateInput.value}T${timeInput.value}`
            );

        /*
         * Only block past times if the
         * selected date is today.
         */

        const selectedDate =
            new Date(
                `${dateInput.value}T00:00:00`
            );

        const todayDate =
            new Date();

        todayDate.setHours(
            0,
            0,
            0,
            0
        );

        if (
            selectedDate.getTime() ===
            todayDate.getTime()
        ) {

            if (
                selected.getTime() <
                today.getTime()
            ) {

                showMessage(
                    "Please choose a future time for today's appointment."
                );

                timeInput.value = "";

            }
        }
    }


    if (dateInput) {

        dateInput.addEventListener(
            "change",
            validateTodayTime
        );
    }


    if (timeInput) {

        timeInput.addEventListener(
            "change",
            validateTodayTime
        );
    }


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    await loadCustomerProfile();

    await loadService();


    console.log(
        "Booking system ready."
    );

});