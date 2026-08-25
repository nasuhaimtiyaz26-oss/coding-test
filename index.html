/* =====================================================
   SAFE ENERGY
   MAIN JAVASCRIPT
===================================================== */


/* =====================================================
   CONFIGURATION
===================================================== */

/*
   Official Our World in Data Energy Dataset.

   This single dataset contains:
   - Primary energy consumption
   - Fossil energy
   - Renewable energy
   - Nuclear energy
   - Electricity generation
   - Electricity by source
*/

const OWID_ENERGY_DATA =
    "https://raw.githubusercontent.com/owid/energy-data/master/owid-energy-data.csv";


/* =====================================================
   MOBILE NAVIGATION
===================================================== */

const mobileMenu =
    document.getElementById("mobileMenu");

const navLinks =
    document.getElementById("navLinks");


if (mobileMenu && navLinks) {

    mobileMenu.addEventListener("click", function () {

        navLinks.classList.toggle("open");

        const icon =
            mobileMenu.querySelector("i");

        if (navLinks.classList.contains("open")) {

            icon.classList.remove("fa-bars");

            icon.classList.add("fa-xmark");

        } else {

            icon.classList.remove("fa-xmark");

            icon.classList.add("fa-bars");

        }

    });


    document.querySelectorAll(".nav-links a")
        .forEach(function (link) {

            link.addEventListener("click", function () {

                navLinks.classList.remove("open");

                const icon =
                    mobileMenu.querySelector("i");

                icon.classList.remove("fa-xmark");

                icon.classList.add("fa-bars");

            });

        });

}


/* =====================================================
   STICKY NAVBAR
===================================================== */

const navbar =
    document.getElementById("navbar");


window.addEventListener("scroll", function () {

    if (!navbar) return;

    if (window.scrollY > 50) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});


/* =====================================================
   CSV PARSER
===================================================== */

/*
   Handles commas inside quoted CSV fields.
*/

function parseCSVLine(line) {

    const result = [];

    let current = "";

    let insideQuotes = false;


    for (let i = 0; i < line.length; i++) {

        const char = line[i];

        const next = line[i + 1];


        if (char === '"' && next === '"') {

            current += '"';

            i++;

            continue;

        }


        if (char === '"') {

            insideQuotes = !insideQuotes;

            continue;

        }


        if (char === "," && !insideQuotes) {

            result.push(current);

            current = "";

        } else {

            current += char;

        }

    }


    result.push(current);

    return result;

}


function parseCSV(text) {

    const lines =
        text
            .trim()
            .split(/\r?\n/);


    if (lines.length < 2) {

        return [];

    }


    const headers =
        parseCSVLine(lines[0]);


    return lines
        .slice(1)
        .map(function (line) {

            const values =
                parseCSVLine(line);


            const row = {};


            headers.forEach(function (header, index) {

                row[header] =
                    values[index] ?? "";

            });


            return row;

        });

}


/* =====================================================
   LOAD OWID DATA
===================================================== */

async function loadEnergyData() {

    try {

        const response =
            await fetch(
                OWID_ENERGY_DATA,
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load OWID Energy Dataset."
            );

        }


        const csv =
            await response.text();


        return parseCSV(csv);

    }

    catch (error) {

        console.error(
            "OWID DATA ERROR:",
            error
        );


        showDataError(
            "Unable to load the live energy dataset. Please check your internet connection."
        );


        return [];

    }

}


/* =====================================================
   DATA ERROR
===================================================== */

function showDataError(message) {

    const dashboard =
        document.querySelector(".dashboard");


    if (!dashboard) return;


    const errorBox =
        document.createElement("div");


    errorBox.className =
        "data-error";


    errorBox.innerHTML = `
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span>${message}</span>
    `;


    dashboard.prepend(errorBox);

}


/* =====================================================
   GLOBAL CHART DEFAULTS
===================================================== */

Chart.defaults.font.family =
    "Inter, Arial, sans-serif";

Chart.defaults.animation.duration =
    1200;


/* =====================================================
   GET WORLD DATA
===================================================== */

function getWorldData(data) {

    return data.filter(function (row) {

        return (
            row.Entity === "World"
        );

    });

}


/* =====================================================
   NUMBER CHECK
===================================================== */

function validNumber(value) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        return false;

    }


    return Number.isFinite(
        Number(value)
    );

}


/* =====================================================
   CLEAN DATA
===================================================== */

function cleanSeries(
    data,
    column,
    startYear = 1965
) {

    return data.filter(function (row) {

        return (
            Number(row.Year) >= startYear &&
            validNumber(row[column])
        );

    });

}


/* =====================================================
   CHART 1
   RENEWABLE VS FOSSIL
===================================================== */

function createRenewableFossilChart(data) {

    const canvas =
        document.getElementById(
            "renewableFossilChart"
        );


    if (!canvas) return;


    /*
       These are actual columns in
       the OWID Energy Dataset.
    */

    const renewable =
        cleanSeries(
            data,
            "renewables"
        );


    const fossil =
        cleanSeries(
            data,
            "fossil_fuels"
        );


    /*
       Use only years that exist in both
       datasets.
    */

    const years =
        renewable
            .map(row => Number(row.Year))
            .filter(function (year) {

                return fossil.some(
                    row =>
                        Number(row.Year) === year
                );

            });


    const filteredYears =
        years.slice(-40);


    const renewableMap =
        new Map(
            renewable.map(
                row => [
                    Number(row.Year),
                    Number(row.renewables)
                ]
            )
        );


    const fossilMap =
        new Map(
            fossil.map(
                row => [
                    Number(row.Year),
                    Number(row.fossil_fuels)
                ]
            )
        );


    new Chart(canvas, {

        type: "line",

        data: {

            labels: filteredYears,

            datasets: [

                {

                    label:
                        "Renewable Energy",

                    data:
                        filteredYears.map(
                            year =>
                                renewableMap.get(year)
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
                        filteredYears.map(
                            year =>
                                fossilMap.get(year)
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

                        padding: 25

                    }

                },


                tooltip: {

                    backgroundColor:
                        "rgba(3,20,14,.95)",

                    padding: 14,

                    cornerRadius: 12,

                    callbacks: {

                        label: function (context) {

                            return (
                                context.dataset.label +
                                ": " +
                                Number(
                                    context.raw
                                ).toLocaleString() +
                                " TWh"
                            );

                        }

                    }

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
                            "rgba(255,255,255,.55)",

                        callback: function (value) {

                            return (
                                Number(value)
                                .toLocaleString() +
                                " TWh"
                            );

                        }

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

function createEnergyConsumptionChart(data) {

    const canvas =
        document.getElementById(
            "energyConsumptionChart"
        );


    if (!canvas) return;


    /*
       Actual OWID column:
       primary_energy_consumption

       Unit:
       TWh
    */

    const filtered =
        cleanSeries(
            data,
            "primary_energy_consumption",
            1965
        ).slice(-50);


    new Chart(canvas, {

        type: "line",

        data: {

            labels:
                filtered.map(
                    row => row.Year
                ),

            datasets: [

                {

                    label:
                        "Global Primary Energy Consumption",

                    data:
                        filtered.map(
                            row =>
                                Number(
                                    row.primary_energy_consumption
                                )
                        ),

                    borderColor:
                        "#159765",

                    backgroundColor:
                        "rgba(21,151,101,.13)",

                    fill: true,

                    tension: .3,

                    borderWidth: 3,

                    pointRadius: 0,

                    pointHoverRadius: 5

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

                    display: false

                },


                tooltip: {

                    backgroundColor:
                        "#062c20",

                    padding: 12,

                    callbacks: {

                        label: function (context) {

                            return (
                                "Energy: " +
                                Number(
                                    context.raw
                                ).toLocaleString(
                                    undefined,
                                    {
                                        maximumFractionDigits: 0
                                    }
                                ) +
                                " TWh"
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

                    beginAtZero: false,

                    ticks: {

                        color: "#7b8b84",

                        callback: function (value) {

                            return (
                                Number(value)
                                .toLocaleString() +
                                " TWh"
                            );

                        }

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

function createElectricityChart(data) {

    const canvas =
        document.getElementById(
            "electricityChart"
        );


    if (!canvas) return;


    /*
       Actual OWID electricity columns:

       Fossil:
       fossil_electricity

       Nuclear:
       nuclear_electricity

       Renewables:
       renewables_electricity
    */

    const renewable =
        cleanSeries(
            data,
            "renewables_electricity",
            1985
        );


    const fossil =
        cleanSeries(
            data,
            "fossil_electricity",
            1985
        );


    const nuclear =
        cleanSeries(
            data,
            "nuclear_electricity",
            1985
        );


    const fossilMap =
        new Map(
            fossil.map(
                row => [
                    Number(row.Year),
                    Number(row.fossil_electricity)
                ]
            )
        );


    const nuclearMap =
        new Map(
            nuclear.map(
                row => [
                    Number(row.Year),
                    Number(row.nuclear_electricity)
                ]
            )
        );


    const renewableMap =
        new Map(
            renewable.map(
                row => [
                    Number(row.Year),
                    Number(row.renewables_electricity)
                ]
            )
        );


    const years =
        Array.from(
            new Set(
                [
                    ...renewableMap.keys(),
                    ...fossilMap.keys(),
                    ...nuclearMap.keys()
                ]
            )
        )
        .sort(
            (a,b) => a-b
        )
        .slice(-40);


    new Chart(canvas, {

        type: "line",

        data: {

            labels: years,

            datasets: [

                {

                    label:
                        "Renewables",

                    data:
                        years.map(
                            year =>
                                renewableMap.get(year) ?? null
                        ),

                    borderColor:
                        "#159765",

                    backgroundColor:
                        "rgba(21,151,101,.08)",

                    borderWidth: 3,

                    tension: .3,

                    pointRadius: 0

                },


                {

                    label:
                        "Fossil Fuels",

                    data:
                        years.map(
                            year =>
                                fossilMap.get(year) ?? null
                        ),

                    borderColor:
                        "#d9984f",

                    backgroundColor:
                        "rgba(217,152,79,.06)",

                    borderWidth: 3,

                    tension: .3,

                    pointRadius: 0

                },


                {

                    label:
                        "Nuclear",

                    data:
                        years.map(
                            year =>
                                nuclearMap.get(year) ?? null
                        ),

                    borderColor:
                        "#4b9ed0",

                    backgroundColor:
                        "rgba(75,158,208,.06)",

                    borderWidth: 3,

                    tension: .3,

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

                        usePointStyle: true,

                        padding: 18

                    }

                },


                tooltip: {

                    backgroundColor:
                        "#062c20",

                    padding: 12,

                    callbacks: {

                        label: function (context) {

                            return (
                                context.dataset.label +
                                ": " +
                                Number(
                                    context.raw
                                ).toLocaleString() +
                                " TWh"
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

                    ticks: {

                        color: "#7b8b84",

                        callback: function (value) {

                            return (
                                Number(value)
                                .toLocaleString() +
                                " TWh"
                            );

                        }

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
   START WEBSITE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        /*
           Load ONE official OWID dataset.
           Then create all charts from it.
        */

        const rawData =
            await loadEnergyData();


        if (!rawData.length) {

            return;

        }


        const world =
            getWorldData(rawData);


        if (!world.length) {

            showDataError(
                "World energy records could not be found in the dataset."
            );

            return;

        }


        createRenewableFossilChart(world);

        createEnergyConsumptionChart(world);

        createElectricityChart(world);

    }
);
