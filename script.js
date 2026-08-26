/* =========================================================
   SAFE ENERGY
   MASTER JAVASCRIPT
========================================================= */


/* =========================================================
   01. JAVASCRIPT ENABLED
========================================================= */

document.documentElement.classList.add("js-enabled");


/* =========================================================
   02. DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       03. MOBILE NAVIGATION
    ===================================================== */

    const menuDots =
        document.getElementById("menuDots");

    const navMenu =
        document.getElementById("navMenu");


    if (menuDots && navMenu) {

        menuDots.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                const isOpen =
                    navMenu.classList.toggle("open");

                menuDots.setAttribute(
                    "aria-expanded",
                    isOpen ? "true" : "false"
                );

            }
        );


        /* Close menu after selecting a page */

        navMenu
            .querySelectorAll("a")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        navMenu.classList.remove("open");

                        menuDots.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );

            });

    }


    /* =====================================================
       04. NAVBAR SCROLL EFFECT
    ===================================================== */

    const navbar =
        document.getElementById("navbar");


    function updateNavbar() {

        if (!navbar) {
            return;
        }

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


    /* =====================================================
       05. REVEAL ANIMATION
    ===================================================== */

    const animatedElements =
        document.querySelectorAll(".reveal");


    if (
        animatedElements.length > 0 &&
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target
                                    .classList
                                    .add("show");

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.08
                }
            );


        animatedElements.forEach(
            function (element) {

                observer.observe(element);

            }
        );


    } else {

        /* Fallback */

        animatedElements.forEach(
            function (element) {

                element.classList.add("show");

            }
        );

    }


    /* =====================================================
       06. ACTIVE NAVIGATION
    ===================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop() || "index.html";


    document
        .querySelectorAll(".nav-menu a")
        .forEach(function (link) {

            const linkPage =
                link.getAttribute("href");


            if (
                linkPage === currentPage
            ) {

                link.classList.add("active");

            } else {

                link.classList.remove("active");

            }

        });


    /* =====================================================
       07. CLOSE MOBILE MENU OUTSIDE
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (
                navMenu &&
                menuDots &&
                !navMenu.contains(event.target) &&
                !menuDots.contains(event.target)
            ) {

                navMenu.classList.remove("open");

                menuDots.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );


    /* =====================================================
       08. ESC KEY CLOSE MENU
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                if (navMenu) {

                    navMenu.classList.remove("open");

                }

                if (menuDots) {

                    menuDots.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }

        }
    );


});
