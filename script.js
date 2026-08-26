/* =========================================================
   SAFE ENERGY
   GLOBAL JAVASCRIPT
   ========================================================= */


/* =========================================================
   01. NAVIGATION MENU
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const menuDots = document.getElementById("menuDots");
    const navMenu = document.getElementById("navMenu");

    if (menuDots && navMenu) {

        menuDots.addEventListener("click", function () {

            navMenu.classList.toggle("show");

            const isOpen = navMenu.classList.contains("show");

            menuDots.setAttribute(
                "aria-expanded",
                isOpen
            );

        });


        /* Close menu when clicking a link */

        const navLinks = navMenu.querySelectorAll("a");

        navLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                navMenu.classList.remove("show");

                menuDots.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });


        /* Close menu when clicking outside */

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


    /* =====================================================
       02. NAVBAR SCROLL EFFECT
       ===================================================== */

    const navbar = document.getElementById("navbar");

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
        updateNavbar
    );


    /* =====================================================
       03. ENERGY DATA CHARTS
       ===================================================== */

    if (
        typeof Chart !== "undefined" &&
        document.getElementById("renewableFossilChart")
    ) {

        createEnergyCharts();

    }

});


/* =========================================================
   ENERGY CHART FUNCTION
   ========================================================= */

function createEnergyCharts() {

    /*
        The charts are illustrative visualisations
        for the website layout.

        Replace the values with your selected
        Our World in Data dataset if required.
    */


    /* =====================================================
       CHART 1
       Renewable vs Fossil Fuels
       ===================================================== */

    const renewableFossilCanvas =
        document.getElementById(
            "renewableFossilChart"
        );

    if (renewableFossilCanvas) {

        new Chart(
            renewableFossilCanvas,
            {

                type: "line",

                data: {

                    labels: [
                        "2000",
                        "2005",
                        "2010",
                        "2015",
                        "2020",
                        "2024"
                    ],

                    datasets: [

                        {
                            label: "Renewable Energy",

                            data: [
                                7,
                                9,
                                11,
                                14,
                                18,
                                22
                            ],

                            borderWidth: 3,

                            tension: 0.35,

                            fill: false
                        },

                        {
                            label: "Fossil Fuels",

                            data: [
                                82,
                                81,
                                79,
                                76,
                                72,
                                69
                            ],

                            borderWidth: 3,

                            tension: 0.35,

                            fill: false
                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            display: true
                        }

                    },

                    scales: {

                        y: {
                            beginAtZero: true
                        }

                    }

                }

            }
        );

    }


    /* =====================================================
       CHART 2
       Global Energy Consumption
       ===================================================== */

    const consumptionCanvas =
        document.getElementById(
            "energyConsumptionChart"
        );

    if (consumptionCanvas) {

        new Chart(
            consumptionCanvas,
            {

                type: "line",

                data: {

                    labels: [
                        "2000",
                        "2005",
                        "2010",
                        "2015",
                        "2020",
                        "2024"
                    ],

                    datasets: [

                        {
                            label: "Global Primary Energy",

                            data: [
                                105,
                                118,
                                132,
                                145,
                                150,
                                165
                            ],

                            borderWidth: 3,

                            tension: 0.35,

                            fill: true
                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            display: true
                        }

                    },

                    scales: {

                        y: {
                            beginAtZero: true
                        }

                    }

                }

            }
        );

    }


    /* =====================================================
       CHART 3
       Electricity Generation
       ===================================================== */

    const electricityCanvas =
        document.getElementById(
            "electricityChart"
        );

    if (electricityCanvas) {

        new Chart(
            electricityCanvas,
            {

                type: "bar",

                data: {

                    labels: [
                        "Renewable",
                        "Fossil",
                        "Nuclear"
                    ],

                    datasets: [

                        {
                            label: "Electricity Generation",

                            data: [
                                30,
                                60,
                                10
                            ],

                            borderWidth: 1

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            display: true
                        }

                    },

                    scales: {

                        y: {
                            beginAtZero: true
                        }

                    }

                }

            }
        );

    }

}
