/* =====================================================
   SAFE ENERGY JAVASCRIPT
===================================================== */

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


    /* =================================================
       CHARTS
    ================================================= */

    if (typeof Chart !== "undefined") {

        const renewableFossil =
            document.getElementById(
                "renewableFossilChart"
            );

        if (renewableFossil) {

            new Chart(renewableFossil, {

                type: "line",

                data: {

                    labels: [
                        "2000",
                        "2005",
                        "2010",
                        "2015",
                        "2020",
                        "2023"
                    ],

                    datasets: [

                        {
                            label: "Renewable Energy",
                            data: [
                                8,
                                10,
                                12,
                                15,
                                18,
                                21
                            ],

                            borderColor: "#42b866",
                            backgroundColor:
                                "rgba(66,184,102,.12)",

                            fill: true,
                            tension: .35
                        },

                        {
                            label: "Fossil Fuels",
                            data: [
                                80,
                                79,
                                77,
                                74,
                                70,
                                68
                            ],

                            borderColor: "#65756b",
                            backgroundColor:
                                "rgba(101,117,107,.08)",

                            fill: true,
                            tension: .35
                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            position: "bottom"
                        }

                    }

                }

            });

        }


        const energyConsumption =
            document.getElementById(
                "energyConsumptionChart"
            );

        if (energyConsumption) {

            new Chart(energyConsumption, {

                type: "line",

                data: {

                    labels: [
                        "2000",
                        "2005",
                        "2010",
                        "2015",
                        "2020",
                        "2023"
                    ],

                    datasets: [

                        {
                            label: "Global Energy Consumption",
                            data: [
                                95,
                                103,
                                111,
                                121,
                                125,
                                135
                            ],

                            borderColor: "#17823b",

                            backgroundColor:
                                "rgba(23,130,59,.12)",

                            fill: true,

                            tension: .35

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            position: "bottom"
                        }

                    }

                }

            });

        }


        const electricityChart =
            document.getElementById(
                "electricityChart"
            );

        if (electricityChart) {

            new Chart(electricityChart, {

                type: "doughnut",

                data: {

                    labels: [
                        "Fossil Fuels",
                        "Renewables",
                        "Nuclear"
                    ],

                    datasets: [

                        {
                            data: [
                                60,
                                30,
                                10
                            ],

                            backgroundColor: [
                                "#5f6d64",
                                "#17823b",
                                "#91b69c"
                            ]

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            position: "bottom"
                        }

                    }

                }

            });

        }

    }

});
