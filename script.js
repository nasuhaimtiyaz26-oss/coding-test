
/* =========================================================
   SAFE ENERGY
   MAIN JAVASCRIPT
========================================================= */

"use strict";


/* =========================================================
   WAIT FOR PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initNavigation();

    initRevealAnimation();

    initNavbarScroll();

    initCounterAPI();

});


/* =========================================================
   NAVIGATION
========================================================= */

function initNavigation() {

    const menuDots =
        document.getElementById("menuDots");

    const navMenu =
        document.getElementById("navMenu");


    if (!menuDots || !navMenu) {
        return;
    }


    menuDots.addEventListener("click", function (event) {

        event.stopPropagation();

        const isOpen =
            navMenu.classList.toggle("active");


        menuDots.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

    });


    /*
       Close menu when clicking outside
    */

    document.addEventListener("click", function (event) {

        if (
            !navMenu.contains(event.target) &&
            !menuDots.contains(event.target)
        ) {

            navMenu.classList.remove("active");

            menuDots.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    });


    /*
       Close menu after clicking a link
    */

    const navLinks =
        navMenu.querySelectorAll("a");


    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            navMenu.classList.remove("active");

            menuDots.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

}


/* =========================================================
   REVEAL ANIMATION
========================================================= */

function initRevealAnimation() {

    const revealElements =
        document.querySelectorAll(".reveal");


    if (!revealElements.length) {
        return;
    }


    /*
       Fallback for browsers without
       IntersectionObserver
    */

    if (!("IntersectionObserver" in window)) {

        revealElements.forEach(function (element) {

            element.classList.add("active");

        });

        return;
    }


    const observer =
        new IntersectionObserver(

            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("active");

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },

            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }

        );


    revealElements.forEach(function (element) {

        observer.observe(element);

    });

}


/* =========================================================
   NAVBAR SCROLL EFFECT
========================================================= */

function initNavbarScroll() {

    const navbar =
        document.getElementById("navbar");


    if (!navbar) {
        return;
    }


    function updateNavbar() {

        if (window.scrollY > 30) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }

    }


    updateNavbar();


    window.addEventListener(
        "scroll",
        updateNavbar,
        {
            passive: true
        }
    );

}


/* =========================================================
   COUNTERAPI V2
========================================================= */

async function initCounterAPI() {

    const viewCount =
        document.getElementById("viewCount");

    const errorMessage =
        document.getElementById(
            "viewCounterError"
        );


    /*
       Make sure counter elements exist
    */

    if (!viewCount) {

        console.warn(
            "CounterAPI: #viewCount not found."
        );

        return;

    }


    /*
       =====================================================
       COUNTERAPI SETTINGS
       =====================================================
    */

    const WORKSPACE =
        "nasuhaimtiyaz26-osss-team-5294";


    /*
       This MUST match your CounterAPI counter:
       
       first-counter-5294
    */

    const COUNTER_NAME =
        "first-counter-5294";


    /*
       IMPORTANT:
       Paste your NEW CounterAPI V2 access token here.

       Do NOT use the token previously exposed in chat.
    */

    const ACCESS_TOKEN =
        "ut_duuv7i5dT1nhk73hWEjvx8UF9PMgjDmmKjiTf0KP";


    /*
       =====================================================
       CHECK TOKEN
       =====================================================
    */

    if (
        !ACCESS_TOKEN ||
        ACCESS_TOKEN ===
        "ut_duuv7i5dT1nhk73hWEjvx8UF9PMgjDmmKjiTf0KP"
    ) {

        console.error(
            "CounterAPI: Access token has not been added."
        );


        viewCount.textContent =
            "Unavailable";


        if (errorMessage) {

            errorMessage.textContent =
                "CounterAPI token is not configured.";

        }

        return;

    }


    /*
       =====================================================
       CHECK COUNTER LIBRARY
       =====================================================
    */

    if (
        typeof window.Counter ===
        "undefined"
    ) {

        console.error(
            "CounterAPI library failed to load."
        );


        viewCount.textContent =
            "Unavailable";


        if (errorMessage) {

            errorMessage.textContent =
                "CounterAPI library unavailable.";

        }

        return;

    }


    try {

        /*
           Show loading state
        */

        viewCount.textContent =
            "Loading...";


        if (errorMessage) {

            errorMessage.textContent =
                "";

        }


        /*
           =================================================
           CREATE COUNTERAPI V2 CLIENT
           =================================================
        */

        const counter =
            new Counter({

                workspace:
                    WORKSPACE,

                accessToken:
                    ACCESS_TOKEN,

                timeout:
                    10000,

                debug:
                    false

            });


        /*
           =================================================
           INCREMENT WEBSITE VIEW
           =================================================
        */

        const result =
            await counter.up(
                COUNTER_NAME
            );


        console.log(
            "CounterAPI result:",
            result
        );


        /*
           =================================================
           DISPLAY TOTAL VIEWS
           =================================================
        */

        if (
            result &&
            typeof result.value !==
            "undefined"
        ) {

            viewCount.textContent =
                Number(
                    result.value
                ).toLocaleString();

        } else {

            throw new Error(
                "CounterAPI returned an invalid response."
            );

        }

    } catch (error) {

        /*
           =================================================
           ERROR HANDLING
        =================================================
        */

        console.error(
            "CounterAPI error:",
            error
        );


        viewCount.textContent =
            "Unavailable";


        if (errorMessage) {

            /*
               Different messages for
               common CounterAPI errors
            */

            if (
                error.status === 401
            ) {

                errorMessage.textContent =
                    "Invalid CounterAPI token.";

            }

            else if (
                error.status === 403
            ) {

                errorMessage.textContent =
                    "CounterAPI permission denied.";

            }

            else if (
                error.status === 404
            ) {

                errorMessage.textContent =
                    "Counter or workspace not found.";

            }

            else if (
                error.status === 429
            ) {

                errorMessage.textContent =
                    "Too many requests. Try again later.";

            }

            else {

                errorMessage.textContent =
                    "Unable to load view count.";

            }

        }

    }

}


/* =========================================================
   OPTIONAL:
   GET CURRENT COUNTER VALUE
========================================================= */

async function getWebsiteViews() {

    const WORKSPACE =
        "nasuhaimtiyaz26-osss-team-5294";


    const COUNTER_NAME =
        "first-counter-5294";


    const ACCESS_TOKEN =
        "PASTE_NEW_COUNTERAPI_TOKEN_HERE";


    if (
        typeof window.Counter ===
        "undefined"
    ) {

        throw new Error(
            "CounterAPI library is not loaded."
        );

    }


    const counter =
        new Counter({

            workspace:
                WORKSPACE,

            accessToken:
                ACCESS_TOKEN

        });


    const result =
        await counter.get(
            COUNTER_NAME
        );


    return result.value;

}


/* =========================================================
   OPTIONAL:
   REFRESH DISPLAY WITHOUT INCREMENTING
========================================================= */

async function refreshWebsiteViews() {

    const viewCount =
        document.getElementById(
            "viewCount"
        );


    const errorMessage =
        document.getElementById(
            "viewCounterError"
        );


    if (!viewCount) {
        return;
    }


    try {

        const value =
            await getWebsiteViews();


        viewCount.textContent =
            Number(value)
                .toLocaleString();


        if (errorMessage) {

            errorMessage.textContent =
                "";

        }

    } catch (error) {

        console.error(
            "CounterAPI refresh error:",
            error
        );


        viewCount.textContent =
            "Unavailable";


        if (errorMessage) {

            errorMessage.textContent =
                "Unable to refresh view count.";

        }

    }

}


/* =========================================================
   OPTIONAL:
   PAGE VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.visibilityState ===
            "visible"
        ) {

            /*
               Do not increment again here.
               Only the initial page load counts
               as a website view.
            */

        }

    }
);

