/* =====================================================
   SAFE ENERGY
   MAIN JAVASCRIPT

   DATA:
   Our World in Data Grapher CSV endpoints

   Charts:
   1. Renewable vs Fossil
   2. Global Energy Consumption
   3. Electricity Generation
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


    document.querySelectorAll(".nav-links a").forEach(link => {

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
   CHART DEFAULTS
===================================================== */

Chart.defaults.font.family = "Inter, Arial, sans-serif";

Chart.defaults.animation.duration = 1200;

Chart.defaults.animation.easing = "easeOutQuart";


/* =====================================================
   OWID DATA FUNCTION
===================================================== */

async function loadOWID(slug) {

    const url =
        `https://ourworldindata.org/grapher/${slug}.csv`;

    try {

        const response = await fetch(url);

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }

        const text = await response.text();

        return parseCSV(text);

    } catch (error) {

        console.error(
            "OWID data loading error:",
            slug,
            error
        );

        return [];

    }

}


/* =====================================================
   ROBUST CSV PARSER
   Handles commas inside quoted values
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

            continue;

        }


        if (char === '"') {

            insideQuotes = !insideQuotes;

            continue;

        }


        if (char === "," && !insideQuotes) {

            row.push(value);

            value = "";

            continue;

        }


        if (
            (char === "\n" || char === "\r") &&
            !insideQuotes
        ) {

            if (char === "\r" && next === "\n") {
                i++;
            }

            row.push(value);

            value = "";

            if (row.some(cell => cell.trim() !== "")) {
                rows.push(row);
            }

            row = [];

            continue;

        }


        value += char;

    }


    if (value.length > 0 || row.length > 0) {

        row.push(value);

        rows.push(row);

    }


    if (rows.length < 2) {

        return [];

    }


    const headers = rows[0].map(
        header => header.trim()
    );


    return rows.slice(1).map(values => {

        const object = {};

        headers.forEach((header, index) => {

            object[header] =
                values[index] !== undefined
                    ? values[index].trim()
                    : "";

        });

        return object;

    });

}


/* =====================================================
   WORLD ONLY
===================================================== */

function getWorldData(data) {

    return data.filter(row => {

        return (
            String(row.Entity).toLowerCase() === "world"
        );

    });

}


/* =====================================================
   FIND COLUMN
===================================================== */

function findColumn(row, terms) {

    const keys = Object.keys(row);

    return keys.find(key => {

        const lower = key.toLowerCase();

        return terms.some(term =>
            lower.includes(term.toLowerCase())
        );

    });

}


/* =====================================================
   NUMBER CHECK
===================================================== */

function validNumber(value) {

    return (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        Number.isFinite(Number(value))
    );

}


/* =====================================================
   STATUS MESSAGE
===================================================== */

function setStatus(id, message) {

    const element = document.getElementById(id);

    if (element) {

        element.textContent = message;

    }

}


/* =====================================================
   COMMON CHART OPTIONS
===================================================== */

function lineOptions(dark = false) {

    const textColor =
        dark
            ? "rgba(255,255,255,.65)"
            : "#7b8b84";


    const gridColor =
        dark
            ? "rgba(255,255,255,.08)"
            : "rgba(0,0,0,.06)";


    return {

        responsive: true,

        maintainAspectRatio: false,

        interaction: {

            mode: "index",

            intersect: false

        },

        plugins: {

            legend: {

                labels: {

                    color: dark
                        ? "#ffffff"
                        : "#50635a",

                    usePointStyle: true,

                    padding: 20

                }

            },

            tooltip: {

                backgroundColor:
                    dark
                        ? "rgba(3,20,14,.96)"
                        : "rgba(3,27,18,.95)",

                padding: 12,

                cornerRadius: 10

            }

        },

        scales: {

            x: {

                ticks: {

                    color: textColor,

                    maxTicksLimit: 8

                },

                grid: {

                    color: gridColor

                }

            },

            y: {

                beginAtZero: true,

                ticks: {

                    color: textColor

                },

                grid: {

                    color: gridColor

                }

            }

        }

    };

}


/* =====================================================
   CHART 1
   RENEWABLE VS FOSSIL
===================================================== */

async function createRenewableFossilChart() {

    const canvas =
        document.getElementById(
            "renewableFossilChart"
        );

    if (!canvas) return;


    setStatus(
        "renewableFossilStatus",
        "Loading official OWID data..."
    );


    const data =
        await loadOWID(
            "primary-energy-from-fossil-nuclear-renewables"
        );


    const world =
        getWorldData(data);


    if (!world.length) {

        setStatus(
            "renewableFossilStatus",
            "Unable to load the data. Please check your internet connection."
        );

        return;

    }


    const renewableColumn =
        findColumn(
            world[0],
            ["renewables"]
        );


    const fossilColumn =
        findColumn(
            world[0],
            ["fossil"]
        );


    if (!renewableColumn || !fossilColumn) {

        console.error(
            "Columns not found:",
            Object.keys(world[0])
        );

        setStatus(
            "renewableFossilStatus",
            "The required dataset columns could not be identified."
        );

        return;

    }


    const filtered =
        world.filter(row => {

            return (
                Number(row.Year) >= 1965 &&
                validNumber(row[renewableColumn]) &&
                validNumber(row[fossilColumn])
            );

        });


    const recent =
        filtered.slice(-50);


    if (!recent.length) {

        setStatus(
            "renewableFossilStatus",
            "No usable data points were found."
        );

        return;

    }


    new Chart(canvas, {

        type: "line",

        data: {

            labels:
                recent.map(
                    row => row.Year
                ),

            datasets: [

                {

                    label:
                        "Renewable Energy",

                    data:
                        recent.map(
                            row =>
                                Number(
                                    row[renewableColumn]
                                )
                        ),

                    borderColor:
                        "#48d597",

                    backgroundColor:
                        "rgba(72,213,151,.12)",

                    fill: true,

                    tension: .35,

                    borderWidth: 3,

                    pointRadius: 0

                },


                {

                    label:
                        "Fossil Fuels",

                    data:
                        recent.map(
                            row =>
                                Number(
                                    row[fossilColumn]
                                )
                        ),

                    borderColor:
                        "#e2a45c",

                    backgroundColor:
                        "rgba(226,164,92,.08)",

                    fill: true,

                    tension: .35,

                    borderWidth: 3,

                    pointRadius: 0

                }

            ]

        },

        options:
            lineOptions(true)

    });


    setStatus(
        "renewableFossilStatus",
        "Data source: Our World in Data"
    );

}


/* =====================================================
   CHART 2
   GLOBAL ENERGY CONSUMPTION

   Uses OWID's global-primary-energy-by-source
   and sums the source columns to create the
   global primary energy total.

   This avoids depending on a fragile "total"
   column name.
===================================================== */

async function createEnergyConsumptionChart() {

    const canvas =
        document.getElementById(
            "energyConsumptionChart"
        );

    if (!canvas) return;


    setStatus(
        "energyConsumptionStatus",
        "Loading official OWID energy data..."
    );


    const data =
        await loadOWID(
            "global-primary-energy-by-source"
        );


    const world =
        getWorldData(data);


    if (!world.length) {

        setStatus(
            "energyConsumptionStatus",
            "Unable to load the data. Please check your internet connection."
        );

        return;

    }


    /*
       Find the likely energy-source columns.

       We intentionally exclude:
       - Entity
       - Code
       - Year
       - population
       - GDP
       - share columns
    */

    const excluded = [
        "entity",
        "code",
        "year",
        "share",
        "per capita",
        "growth"
    ];


    const numericColumns =
        Object.keys(world[0]).filter(key => {

            const lower =
                key.toLowerCase();

            if (
                excluded.some(
                    word => lower.includes(word)
                )
            ) {

                return false;

            }

            return world.some(
                row => validNumber(row[key])
            );

        });


    /*
       Calculate total energy from all
       energy-source columns.
    */

    const totals = world.map(row => {

        let total = 0;

        numericColumns.forEach(column => {

            const number =
                Number(row[column]);

            if (Number.isFinite(number)) {

                total += number;

            }

        });

        return {

            year:
                Number(row.Year),

            total: total

        };

    }).filter(item => {

        return (
            Number.isFinite(item.year) &&
            item.total > 0
        );

    });


    const recent =
        totals
            .filter(item => item.year >= 1965)
            .slice(-50);


    if (!recent.length) {

        setStatus(
            "energyConsumptionStatus",
            "No usable energy-consumption data was found."
        );

        return;

    }


    new Chart(canvas, {

        type: "line",

        data: {

            labels:
                recent.map(
                    item => item.year
                ),

            datasets: [

                {

                    label:
                        "Global Primary Energy",

                    data:
                        recent.map(
                            item => item.total
                        ),

                    borderColor:
                        "#12a36d",

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

            ...lineOptions(false),

            plugins: {

                ...lineOptions(false).plugins,

                legend: {
                    display: false
                }

            }

        }

    });


    setStatus(
        "energyConsumptionStatus",
        "Data source: Our World in Data • Unit: TWh"
    );

}


/* =====================================================
   CHART 3
   ELECTRICITY GENERATION
===================================================== */

async function createElectricityChart() {

    const canvas =
        document.getElementById(
            "electricityChart"
        );

    if (!canvas) return;


    setStatus(
        "electricityStatus",
        "Loading official electricity data..."
    );


    const data =
        await loadOWID(
            "elec-fossil-nuclear-renewables"
        );


    const world =
        getWorldData(data);


    if (!world.length) {

        setStatus(
            "electricityStatus",
            "Unable to load the data. Please check your internet connection."
        );

        return;

    }


    const fossilColumn =
        findColumn(
            world[0],
            ["fossil"]
        );


    const nuclearColumn =
        findColumn(
            world[0],
            ["nuclear"]
        );


    const renewableColumn =
        findColumn(
            world[0],
            ["renewable"]
        );


    if (
        !fossilColumn ||
        !nuclearColumn ||
        !renewableColumn
    ) {

        console.error(
            "Electricity columns:",
            Object.keys(world[0])
        );

        setStatus(
            "electricityStatus",
            "The required electricity columns could not be identified."
        );

        return;

    }


    const filtered =
        world.filter(row => {

            return (
                Number(row.Year) >= 1965 &&
                validNumber(row[fossilColumn]) &&
                validNumber(row[nuclearColumn]) &&
                validNumber(row[renewableColumn])
            );

        });


    const recent =
        filtered.slice(-45);


    if (!recent.length) {

        setStatus(
            "electricityStatus",
            "No usable electricity-generation data was found."
        );

        return;

    }


    new Chart(canvas, {

        type: "line",

        data: {

            labels:
                recent.map(
                    row => row.Year
                ),

            datasets: [

                {

                    label:
                        "Renewables",

                    data:
                        recent.map(
                            row =>
                                Number(
                                    row[renewableColumn]
                                )
                        ),

                    borderColor:
                        "#12a36d",

                    backgroundColor:
                        "rgba(18,163,109,.08)",

                    borderWidth: 3,

                    tension: .35,

                    pointRadius: 0

                },


                {

                    label:
                        "Fossil Fuels",

                    data:
                        recent.map(
                            row =>
                                Number(
                                    row[fossilColumn]
                                )
                        ),

                    borderColor:
                        "#d9984f",

                    backgroundColor:
                        "rgba(217,152,79,.06)",

                    borderWidth: 3,

                    tension: .35,

                    pointRadius: 0

                },


                {

                    label:
                        "Nuclear",

                    data:
                        recent.map(
                            row =>
                                Number(
                                    row[nuclearColumn]
                                )
                        ),

                    borderColor:
                        "#65b9e8",

                    backgroundColor:
                        "rgba(101,185,232,.06)",

                    borderWidth: 3,

                    tension: .35,

                    pointRadius: 0

                }

            ]

        },

        options:
            lineOptions(false)

    });


    setStatus(
        "electricityStatus",
        "Data source: Our World in Data • Unit: TWh"
    );

}


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        createRenewableFossilChart();

        createEnergyConsumptionChart();

        createElectricityChart();

    }
);
