/* =====================================================
   SAFE ENERGY
   STABLE JAVASCRIPT FOR GITHUB PAGES
===================================================== */

/* =====================================================
   MOBILE NAVIGATION
===================================================== */

const mobileMenu = document.getElementById("mobileMenu");
const navLinks = document.getElementById("navLinks");
const navbar = document.getElementById("navbar");

if (mobileMenu && navLinks) {
    mobileMenu.addEventListener("click", () => {
        navLinks.classList.toggle("open");

        const icon = mobileMenu.querySelector("i");

        if (navLinks.classList.contains("open")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");
        } else {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");

            const icon = mobileMenu.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
        });
    });
}


/* =====================================================
   STICKY NAVBAR
===================================================== */

window.addEventListener("scroll", () => {

    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

});


/* =====================================================
   CHART.JS SETTINGS
===================================================== */

if (typeof Chart !== "undefined") {

    Chart.defaults.font.family = "Inter, Arial, sans-serif";

    Chart.defaults.animation.duration = 1000;

}


/* =====================================================
   GLOBAL CHART OPTIONS
===================================================== */

const chartTextColor = "#50635a";
const gridColor = "rgba(80,99,90,0.10)";


/* =====================================================
   1. RENEWABLE ENERGY VS FOSSIL FUELS
   Stable embedded dataset
===================================================== */

function createRenewableFossilChart() {

    const canvas =
        document.getElementById("renewableFossilChart");

    if (!canvas || typeof Chart === "undefined") {
        return;
    }

    new Chart(canvas, {

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
                        86,
                        108,
                        132,
                        171,
                        240,
                        290
                    ],

                    borderColor: "#32c982",

                    backgroundColor:
                        "rgba(50,201,130,0.12)",

                    borderWidth: 3,

                    tension: 0.35,

                    fill: true,

                    pointRadius: 3,

                    pointHoverRadius: 6
                },

                {
                    label: "Fossil Fuels",

                    data: [
                        302,
                        335,
                        365,
                        390,
                        370,
                        410
                    ],

                    borderColor: "#d8924a",

                    backgroundColor:
                        "rgba(216,146,74,0.08)",

                    borderWidth: 3,

                    tension: 0.35,

                    fill: true,

                    pointRadius: 3,

                    pointHoverRadius: 6
                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            interaction: {
                mode: "index",
                intersect: false
            },

            plugins: {

                legend: {

                    labels: {
                        color: "#ffffff",
                        usePointStyle: true,
                        padding: 20
                    }

                },

                tooltip: {

                    backgroundColor: "#032c1d",

                    padding: 12,

                    cornerRadius: 10

                }

            },

            scales: {

                x: {

                    ticks: {
                        color: "rgba(255,255,255,0.65)"
                    },

                    grid: {
                        color: "rgba(255,255,255,0.07)"
                    }

                },

                y: {

                    beginAtZero: true,

                    ticks: {
                        color: "rgba(255,255,255,0.65)"
                    },

                    grid: {
                        color: "rgba(255,255,255,0.07)"
                    }

                }

            }

        }

    });

}


/* =====================================================
   2. GLOBAL ENERGY CONSUMPTION
   Stable embedded dataset
===================================================== */

function createEnergyConsumptionChart() {

    const canvas =
        document.getElementById("energyConsumptionChart");

    if (!canvas || typeof Chart === "undefined") {
        return;
    }

    new Chart(canvas, {

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

                    label:
                        "Global Primary Energy Consumption",

                    data: [
                        100000,
                        115000,
                        130000,
                        145000,
                        150000,
                        165000
                    ],

                    borderColor: "#159765",

                    backgroundColor:
                        "rgba(21,151,101,0.12)",

                    borderWidth: 3,

                    fill: true,

                    tension: 0.35,

                    pointRadius: 3,

                    pointHoverRadius: 6

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            interaction: {

                mode: "index",

                intersect: false

            },

            plugins: {

                legend: {

                    labels: {
                        color: chartTextColor,
                        usePointStyle: true
                    }

                },

                tooltip: {

                    backgroundColor: "#062c20",

                    padding: 12,

                    callbacks: {

                        label: function(context) {

                            return (
                                " Energy: " +
                                context.parsed.y.toLocaleString() +
                                " TWh"
                            );

                        }

                    }

                }

            },

            scales: {

                x: {

                    ticks: {
                        color: "#7b8b84"
                    },

                    grid: {
                        display: false
                    }

                },

                y: {

                    beginAtZero: false,

                    ticks: {

                        color: "#7b8b84",

                        callback: function(value) {

                            return (
                                value.toLocaleString() +
                                " TWh"
                            );

                        }

                    },

                    grid: {
                        color: gridColor
                    }

                }

            }

        }

    });

}


/* =====================================================
   3. ELECTRICITY GENERATION
   Renewable / Fossil / Nuclear
===================================================== */

function createElectricityChart() {

    const canvas =
        document.getElementById("electricityChart");

    if (!canvas || typeof Chart === "undefined") {
        return;
    }

    new Chart(canvas, {

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

                    label: "Renewables",

                    data: [
                        3000,
                        3900,
                        4700,
                        6000,
                        7600,
                        9000
                    ],

                    borderColor: "#159765",

                    borderWidth: 3,

                    tension: 0.35,

                    pointRadius: 3

                },

                {

                    label: "Fossil Fuels",

                    data: [
                        10500,
                        12000,
                        14000,
                        15500,
                        16000,
                        17500
                    ],

                    borderColor: "#d8924a",

                    borderWidth: 3,

                    tension: 0.35,

                    pointRadius: 3

                },

                {

                    label: "Nuclear",

                    data: [
                        2600,
                        2700,
                        2750,
                        2750,
                        2700,
                        2800
                    ],

                    borderColor: "#579bc4",

                    borderWidth: 3,

                    tension: 0.35,

                    pointRadius: 3

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            interaction: {

                mode: "index",

                intersect: false

            },

            plugins: {

                legend: {

                    labels: {

                        color: chartTextColor,

                        usePointStyle: true,

                        padding: 15

                    }

                },

                tooltip: {

                    backgroundColor: "#062c20",

                    padding: 12,

                    cornerRadius: 10,

                    callbacks: {

                        label: function(context) {

                            return (
                                " " +
                                context.dataset.label +
                                ": " +
                                context.parsed.y.toLocaleString() +
                                " TWh"
                            );

                        }

                    }

                }

            },

            scales: {

                x: {

                    ticks: {
                        color: "#7b8b84"
                    },

                    grid: {
                        display: false
                    }

                },

                y: {

                    beginAtZero: true,

                    ticks: {

                        color: "#7b8b84",

                        callback: function(value) {

                            return (
                                value.toLocaleString() +
                                " TWh"
                            );

                        }

                    },

                    grid: {
                        color: gridColor
                    }

                }

            }

        }

    });

}


/* =====================================================
   SCROLL REVEAL EFFECT
===================================================== */

const revealElements =
    document.querySelectorAll(
        ".benefit-card, .chart-card, .source-box"
    );


const revealObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },

        {
            threshold: 0.12
        }

    );


revealElements.forEach(element => {

    element.classList.add("reveal");

    revealObserver.observe(element);

});


/* =====================================================
   START ALL CHARTS
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        createRenewableFossilChart();

        createEnergyConsumptionChart();

        createElectricityChart();

    }
);
