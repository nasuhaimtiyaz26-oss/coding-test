document.addEventListener("DOMContentLoaded", function () {

    const menuDots = document.getElementById("menuDots");
    const navMenu = document.getElementById("navMenu");

    if (menuDots && navMenu) {

        menuDots.addEventListener("click", function () {

            navMenu.classList.toggle("show");

            const isOpen =
                navMenu.classList.contains("show");

            menuDots.setAttribute(
                "aria-expanded",
                isOpen
            );

        });


        document.addEventListener("click", function (event) {

            if (
                !navMenu.contains(event.target) &&
                !menuDots.contains(event.target)
            ) {

                navMenu.classList.remove("show");

                menuDots.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        });

    }


    /* Close menu when selecting a page */

    const navLinks =
        document.querySelectorAll(".nav-menu a");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            if (navMenu) {
                navMenu.classList.remove("show");
            }

            if (menuDots) {
                menuDots.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

        });

    });

});
