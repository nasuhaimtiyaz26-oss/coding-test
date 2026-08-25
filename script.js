/* =====================================================
   SAFE ENERGY
   MAIN JAVASCRIPT
===================================================== */


/* =====================================================
   MOBILE NAVIGATION
===================================================== */

const mobileMenu = document.getElementById("mobileMenu");
const navLinks = document.getElementById("navLinks");

if (mobileMenu && navLinks) {

    mobileMenu.addEventListener("click", function () {

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


    document.querySelectorAll(".nav-links a").forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.classList.remove("open");

            const icon = mobileMenu.querySelector("i");

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        });

    });

}


/* =====================================================
   STICKY NAVBAR
===================================================== */

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", function () {

    if (!navbar) return;

    if (window.scrollY > 50) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});


/* =====================================================
   OWID
===================================================== */

const OWID = "https://ourworldindata.org/grapher/";


/* =====================================================
   DOWNLOAD CSV
===================================================== */

async function getOWIDData(slug) {

    try {

        const response = await fetch(
            OWID + slug + ".csv"
        );

        if (!response.ok) {

            throw new Error(
                "OWID dataset unavailable: " + slug
            );

        }

        const text = await response.text();

        return parseCSV(text);

    } catch (error) {

        console.error(error);

        return [];

    }

}


/* =====================================================
   CSV PARSER
   Handles quoted CSV values
===================================================== */

function parseCSV(text) {

    const rows = [];

    let row = [];
    let value = "";
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {

        const char = text[i];
        const next = text[i + 1];

        if (char === '"' && insideQuotes && next === '"') {

            value += '"';

            i++;

        } else if (char === '"') {

            insideQuotes = !insideQuotes;

        } else if (char === "," && !insideQuotes) {

            row.push(value);

            value = "";

        } else if (
            (char === "\n" || char === "\r") &&
            !insideQuotes
        ) {

            if (value !== "" || row.length > 0) {

                row.push(value);

                rows.push(row);

            }

            value = "";
            row = [];

            if (char === "\r" && next === "\n") {

                i++;

            }

        } else {

            value += char;

        }

    }

    if (value !== "" || row.length > 0) {

        row.push(value);
        rows.push(row);

    }

    if (rows.length < 2) {

        return [];

    }

    const headers = rows[0];

    return rows.slice(1).map(function (values) {

        const object = {};

        headers.forEach(function (header, index) {

            object[header] =
                values[index] ?? "";

        });

        return object;

    });

}


/* =====================================================
   WORLD DATA
===================================================== */

function worldData(data) {

    return data.filter(function (row) {

        return row.Entity === "World";

    });

}


/* =====================================================
   FIND COLUMN
===================================================== */

function findColumn(row, words) {

    if (!row) return null;

    const keys = Object.keys(row);

    return keys.find(function (key) {

        const lower = key.toLowerCase();

        return words.some(function (word) {

            return lower.includes(word.toLowerCase());

        });

    });

}


/* =====================================================
   NUMBER HELPER
===================================================== */

function validNumber(value) {

    if (value === undefined || value === null) {

        return false;

    }

    const number = Number(value);

    return Number.isFinite(number);

}


/* =====================================================
   CHART DEFAULTS
===================================================== */

if (typeof Chart !== "undefined") {

    Chart.defaults.font.family =
        "Inter, Arial, sans-serif";

    Chart.defaults.animation.duration = 1000;

}


/* =====================================================
   CHART 1
   RENEWABLE VS FOSSIL
===================================================== */

async function renewableFossilChart() {

    const canvas =
        document.getElementById(
            "renewableFossilChart"
        );

    if (!canvas || typeof Chart === "undefined") {

        return;

    }


    const data = worldData(
        await getOWIDData(
            "primary-energy-from-fossil-nuclear-renewables"
        )
    );


    if (!data.length) {

        console.error(
            "Renewable/Fossil dataset could not be loaded."
        );

        return;

    }


    const renewableColumn =
        findColumn(data[0], ["renewables"]);


    const fossilColumn =
        findColumn(data[0], ["fossil"]);


    if (!renewableColumn || !fossilColumn) {

        console.error(
            "Required renewable/fossil columns not found."
        );

        return;

    }


    const filtered = data.filter(function (row) {

        return (
            Number(row.Year) >= 1965 &&
            validNumber(row[renewableColumn]) &&
            validNumber(row[fossilColumn])
        );

    });


    if (!filtered.length) return;


    new Chart(canvas, {

        type: "line",

        data: {

            labels: filtered.map(
                row => row.Year
            ),

            datasets: [

                {
                    label: "Renewable Energy",

                    data: filtered.map(
                        row =>
                            Number(
                                row[renewableColumn]
                            )
                    ),

                    borderColor: "#48d597",

                    backgroundColor:
                        "rgba(72,213,151,.12)",

                    fill: true,

                    tension: .35,

                    borderWidth: 3,

                    pointRadius: 0

                },

                {
                    label: "Fossil Fuels",

                    data: filtered.map(
                        row =>
                            Number(
                                row[fossilColumn]
                            )
                    ),

                    borderColor: "#e2a45c",

                    backgroundColor:
                        "rgba(226,164,92,.08)",

                    fill: true,

                    tension: .35,

                    borderWidth: 3,

                    pointRadius: 0

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

                    backgroundColor:
                        "rgba(3,20,14,.95)",

                    padding: 14,

                    cornerRadius: 10

                }

            },

            scales: {

                x: {

                    ticks: {

                        color:
                            "rgba(255,255,255,.55)",

                        maxTicksLimit: 8

                    },

                    grid: {

                        color:
                            "rgba(255,255,255,.07)"

                    }

                },

                y: {

                    ticks: {

                        color:
                            "rgba(255,255,255,.55)"

                    },

                    grid: {

                        color:
                            "rgba(255,255,255,.07)"

                    }

                }

            }

        }

    });

}


/* =====================================================
   CHART 2
   GLOBAL ENERGY CONSUMPTION
===================================================== */

async function energyConsumptionChart() {

    const canvas =
        document.getElementById(
            "energyConsumptionChart"
        );

    if (!canvas || typeof Chart === "undefined") {

        return;

    }


    /*
       OWID dataset containing global primary
       energy consumption by source.
    */

    const data = worldData(
        await getOWIDData(
            "global-primary-energy"
        )
    );


    if (!data.length) {

        console.error(
            "Global energy consumption dataset unavailable."
        );

        return;

    }


    const firstRow = data[0];


    /*
       Look specifically for total primary energy.
    */

    let totalColumn =
        findColumn(
            firstRow,
            [
                "primary energy consumption",
                "primary energy"
            ]
        );


    /*
       If a suitable column is not found,
       try total.
    */

    if (!totalColumn) {

        totalColumn =
            findColumn(
                firstRow,
                ["total"]
            );

    }


    if (!totalColumn) {

        console.error(
            "Global energy total column not found."
        );

        return;

    }


    const filtered = data.filter(function (row) {

        return (
            validNumber(row[totalColumn]) &&
            Number(row.Year) >= 1965
        );

    });


    if (!filtered.length) return;


    new Chart(canvas, {

        type: "line",

        data: {

            labels: filtered.map(
                row => row.Year
            ),

            datasets: [

                {

                    label:
                        "Global Primary Energy",

                    data:
                        filtered.map(
                            row =>
                                Number(
                                    row[totalColumn]
                                )
                        ),

                    borderColor: "#12a36d",

                    backgroundColor:
                        "rgba(18,163,109,.12)",

                    fill: true,

                    tension: .35,

                    borderWidth: 3,

                    pointRadius: 0

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

                    display: true

                },

                tooltip: {

                    backgroundColor: "#062c20",

                    padding: 12,

                    callbacks: {

                        label: function (context) {

                            return (
                                " Energy: " +
                                Number(
                                    context.raw
                                ).toLocaleString()
                            );

                        }

                    }

                }

            },

            scales: {

                x: {

                    ticks: {

                        color: "#7b8b84",

                        maxTicksLimit: 8

                    },

                    grid: {

                        display: false

                    }

                },

                y: {

                    beginAtZero: true,

                    ticks: {

                        color: "#7b8b84"

                    },

                    grid: {

                        color:
                            "rgba(0,0,0,.06)"

                    }

                }

            }

        }

    });

}


/* =====================================================
   CHART 3
   ELECTRICITY GENERATION
===================================================== */

async function electricityChart() {

    const canvas =
        document.getElementById(
            "electricityChart"
        );

    if (!canvas || typeof Chart === "undefined") {

        return;

    }


    const data = worldData(
        await getOWIDData(
            "electricity-prod-source-stacked"
        )
    );


    if (!data.length) {

        console.error(
            "Electricity generation dataset unavailable."
        );

        return;

    }


    const firstRow = data[0];


    const fossilColumn =
        findColumn(
            firstRow,
            ["fossil"]
        );


    const nuclearColumn =
        findColumn(
            firstRow,
            ["nuclear"]
        );


    const renewableColumn =
        findColumn(
            firstRow,
            ["renewables"]
        );


    if (
        !fossilColumn ||
        !nuclearColumn ||
        !renewableColumn
    ) {

        console.error(
            "Electricity generation columns not found."
        );

        return;

    }


    const filtered = data.filter(function (row) {

        return (
            Number(row.Year) >= 1965 &&
            validNumber(row[fossilColumn]) &&
            validNumber(row[nuclearColumn]) &&
            validNumber(row[renewableColumn])
        );

    });


    if (!filtered.length) return;


    new Chart(canvas, {

        type: "line",

        data: {

            labels: filtered.map(
                row => row.Year
            ),

            datasets: [

                {

                    label: "Renewables",

                    data: filtered.map(
                        row =>
                            Number(
                                row[renewableColumn]
                            )
                    ),

                    borderColor: "#12a36d",

                    backgroundColor:
                        "rgba(18,163,109,.08)",

                    borderWidth: 3,

                    tension: .35,

                    pointRadius: 0

                },

                {

                    label: "Fossil Fuels",

                    data: filtered.map(
                        row =>
                            Number(
                                row[fossilColumn]
                            )
                    ),

                    borderColor: "#d9984f",

                    backgroundColor:
                        "rgba(217,152,79,.06)",

                    borderWidth: 3,

                    tension: .35,

                    pointRadius: 0

                },

                {

                    label: "Nuclear",

                    data: filtered.map(
                        row =>
                            Number(
                                row[nuclearColumn]
                            )
                    ),

                    borderColor: "#65b9e8",

                    backgroundColor:
                        "rgba(101,185,232,.06)",

                    borderWidth: 3,

                    tension: .35,

                    pointRadius: 0

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

                        color: "#50635a",

                        usePointStyle: true

                    }

                },

                tooltip: {

                    padding: 12

                }

            },

            scales: {

                x: {

                    ticks: {

                        color: "#7b8b84",

                        maxTicksLimit: 8

                    },

                    grid: {

                        display: false

                    }

                },

                y: {

                    beginAtZero: true,

                    ticks: {

                        color: "#7b8b84"

                    },

                    grid: {

                        color:
                            "rgba(0,0,0,.06)"

                    }

                }

            }

        }

    });

}


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renewableFossilChart();

        energyConsumptionChart();

        electricityChart();

    }
);
