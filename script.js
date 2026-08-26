/* =========================================================
   SAFE ENERGY
   MASTER JAVASCRIPT
   ========================================================= */


/* =========================================================
   01. NAVIGATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const menuDots = document.getElementById("menuDots");
    const navMenu = document.getElementById("navMenu");

    if (menuDots && navMenu) {

        menuDots.addEventListener("click", function () {

            const isOpen = navMenu.classList.toggle("open");

            menuDots.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

        });


        /* Close menu after clicking a link */

        navMenu.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                navMenu.classList.remove("open");

                menuDots.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

    }


    /* =====================================================
       02. NAVBAR SCROLL
    ===================================================== */

    const navbar = document.getElementById("navbar");

    if (navbar) {

        window.addEventListener("scroll", function () {

            if (window.scrollY > 30) {

                navbar.classList.add("scrolled");

            } else {

                navbar.classList.remove("scrolled");

            }

        });

    }


    /* =====================================================
       03. REVEAL ANIMATION
    ===================================================== */

    const animatedElements = document.querySelectorAll(
        ".data-card, " +
        ".chart-card, " +
        ".benefit-card, " +
        ".renewable-type-card, " +
        ".effect-card, " +
        ".save-card, " +
        ".team-card, " +
        ".research-source-card, " +
        ".source-detail-card"
    );


    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("show");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.08
            }
        );


        animatedElements.forEach(function (element) {

            element.classList.add("reveal");

            observer.observe(element);

        });

    }


    /* =====================================================
       04. ACTIVE PAGE NAVIGATION
    ===================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop() || "index.html";


    document.querySelectorAll(".nav-menu a").forEach(
        function (link) {

            const linkPage =
                link.getAttribute("href");

            if (linkPage === currentPage) {

                link.classList.add("active");

            }

        }
    );


    /* =====================================================
       05. CLOSE MENU WHEN CLICKING OUTSIDE
    ===================================================== */

    document.addEventListener("click", function (event) {

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

    });

});
