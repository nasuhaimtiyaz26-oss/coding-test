/* =====================================================
   SAFE ENERGY
   SCRIPT.JS
   OWID + CHART.JS
===================================================== */


/* =====================================================
   OWID CONFIG
===================================================== */

const OWID = "https://ourworldindata.org/grapher/";


/* =====================================================
   DOM READY
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const mobileMenu = document.getElementById("mobileMenu");
    const navLinks = document.getElementById("navLinks");
    const navbar = document.getElementById("navbar");


    /* =================================================
       MOBILE NAVIGATION
    ================================================= */

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


        /* Close mobile menu after clicking a link */

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


    /* =================================================
       STICKY NAVBAR
    ================================================= */

    window.addEventListener("scroll", () => {

        if (!navbar) return;

        if (window.scrollY > 50) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }

    });


    /* =================================================
       START CHARTS
    ================================================= */

    renewableFossilChart();
    energyConsumptionChart();
    electricityChart();

});


/* =====================================================
   DOWNLOAD OWID CSV
===================================================== */

async function getOWIDData(slug, query = "") {

    try {

        const url =
            OWID +
            slug +
            ".csv" +
            query;

        console.log("Loading OWID:", url);

        const response = await fetch(url);

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }

        const text = await response.text();

        return parseCSV(text);

    }

    catch (error) {

        console.error(
            "OWID DATA ERROR:",
            error
        );

        return [];

    }

}


/* =====================================================
   CSV PARSER
===================================================== */

function parseCSV(text) {

    const rows = [];

    let currentRow = [];
    let currentValue = "";
    let insideQuotes = false;


    for (let i = 0; i < text.length; i++) {

        const char = text[i];
        const nextChar = text[i + 1];


        /* Handle escaped quotes */

        if (
            char === '"' &&
            insideQuotes &&
            nextChar === '"'
        ) {

            currentValue += '"';

            i++;

        }


        /* Start / end quote */

        else if (char === '"') {

            insideQuotes = !insideQuotes;

        }


        /* New column */

        else if (
            char === "," &&
            !insideQuotes
        ) {

            currentRow.push(currentValue);

            currentValue = "";

        }


        /* New row */

        else if (
            (char === "\n" || char === "\r") &&
            !insideQuotes
        ) {

            if (
                currentValue !== "" ||
                currentRow.length > 0
            ) {

                currentRow.push(currentValue);

                rows.push(currentRow);

            }

            currentRow = [];
            currentValue = "";


            /* Handle Windows CRLF */

            if (
                char === "\r" &&
                nextChar === "\n"
            ) {

                i++;

            }

        }


        /* Normal character */

        else {

            currentValue += char;

        }

    }


    /* Add final row */

    if (
        currentValue !== "" ||
        currentRow.length > 0
    ) {

        currentRow.push(currentValue);

        rows.push(currentRow);

    }


    /* Need at least header + one row */

    if (rows.length < 2) {

        return [];

    }


    /* Create objects from CSV */

    const headers =
        rows[0].map(
            header => header.trim()
        );


    return rows
        .slice(1)
        .map(values => {

            const object = {};

            headers.forEach(
                (header, index) => {

                    object[header] =
                        values[index] !== undefined
                            ? values[index].trim()
                            : "";

                }
            );

            return object;

        });

}


/* =====================================================
   GET WORLD DATA
===================================================== */

function getWorldData(data) {

    return data.filter(row => {

        return (
            row.Entity === "World" ||
            row.Code === "OWID_WRL"
        );

    });

}


/* =====================================================
   NUMBER VALIDATION
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
   CHART DEFAULTS
===================================================== */

if (typeof Chart !== "undefined") {

    Chart.defaults.font.family =
        "Inter, Arial, sans-serif";

    Chart.defaults.animation.duration =
        1200;

}


/* =====================================================
   GRAPH 1
   RENEWABLE VS FOSSIL
===================================================== */

async function renewableFossilChart() {

    const canvas =
        document.getElementById(
            "renewableFossilChart"
        );


    if (!canvas) {

        console.warn(
            "renewableFossilChart canvas not found."
        );

        return;

    }


    /* Load OWID data */

    const data =
        await getOWIDData(
            "primary-energy-from-fossil-nuclear-renewables"
        );


    const world =
        getWorldData(data);


    if (!world.length) {

        console.error(
            "Renewable/Fossil data unavailable."
        );

        return;

    }


    /* Find available columns */

    const columns =
        Object.keys(world[0]);


    console.log(
        "Renewable/Fossil columns:",
        columns
    );


    const renewableColumn =
        columns.find(column =>
            column.toLowerCase()
                .includes("renewable")
        );


    const fossilColumn =
        columns.find(column =>
            column.toLowerCase()
                .includes("fossil")
        );


    if (
        !renewableColumn ||
        !fossilColumn
    ) {

        console.error(
            "Renewable or fossil column not found."
        );

        return;

    }


    /* Filter valid data */

    const filtered =
        world
            .filter(row => {

                return (
                    validNumber(row.Year) &&
                    validNumber(
                        row[renewableColumn]
                    ) &&
                    validNumber(
                        row[fossilColumn]
                    )
                );

            })
            .sort(
                (a, b) =>
                    Number(a.Year) -
                    Number(b.Year)
            );


    if (!filtered.length) {

        console.error(
            "No Renewable/Fossil values."
        );

        return;

    }


    /* Create Chart */

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
                        "Renewable Energy",

                    data:
                        filtered.map(
                            row =>
                                Number(
                                    row[
                                        renewableColumn
                                    ]
                                )
                        ),

                    borderColor:
                        "#48d597",

                    backgroundColor:
                        "rgba(72,213,151,0.12)",

                    borderWidth: 3,

                    fill: true,

                    tension: 0.35,

                    pointRadius: 0,

                    pointHoverRadius: 5
                },


                {
                    label:
                        "Fossil Fuels",

                    data:
                        filtered.map(
                            row =>
                                Number(
                                    row[
                                        fossilColumn
                                    ]
                                )
                        ),

                    borderColor:
                        "#e2a45c",

                    backgroundColor:
                        "rgba(226,164,92,0.08)",

                    borderWidth: 3,

                    fill: true,

                    tension: 0.35,

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

                    labels: {

                        color: "#ffffff",

                        usePointStyle: true,

                        padding: 20

                    }

                },


                tooltip: {

                    backgroundColor:
                        "rgba(3,20,14,0.95)",

                    padding: 14,

                    cornerRadius: 10

                }

            },


            scales: {

                x: {

                    ticks: {

                        color:
                            "rgba(255,255,255,0.6)",

                        maxTicksLimit: 8

                    },

                    grid: {

                        color:
                            "rgba(255,255,255,0.07)"

                    }

                },


                y: {

                    ticks: {

                        color:
                            "rgba(255,255,255,0.6)"

                    },

                    grid: {

                        color:
                            "rgba(255,255,255,0.07)"

                    }

                }

            }

        }

    });

}


/* =====================================================
   GRAPH 2
   GLOBAL ENERGY CONSUMPTION
===================================================== */

/*
   OWID Energy Mix dataset.

   metric = total
   source = total

   Global primary energy use
   measured in TWh.
*/

async function energyConsumptionChart() {

    const canvas =
        document.getElementById(
            "energyConsumptionChart"
        );


    if (!canvas) {

        console.warn(
            "energyConsumptionChart canvas not found."
        );

        return;

    }


    const data =
        await getOWIDData(
            "energy-mix",
            "?v=1&csvType=full&useColumnShortNames=false&source=total&metric=total"
        );


    const world =
        getWorldData(data);


    if (!world.length) {

        console.error(
            "Global energy consumption data unavailable."
        );

        return;

    }


    const columns =
        Object.keys(world[0]);


    console.log(
        "Energy consumption columns:",
        columns
    );


    /* Find energy column */

    const energyColumn =
        columns.find(column => {

            const name =
                column.toLowerCase();


            return (

                name.includes(
                    "total energy supply"
                ) ||

                name.includes(
                    "primary energy"
                ) ||

                name.includes(
                    "total primary energy"
                )

            );

        });


    if (!energyColumn) {

        console.error(
            "Energy consumption column not found.",
            columns
        );

        return;

    }


    console.log(
        "Using energy column:",
        energyColumn
    );


    /* Filter valid data */

    const filtered =
        world
            .filter(row => {

                return (
                    validNumber(row.Year) &&
                    validNumber(
                        row[energyColumn]
                    )
                );

            })
            .sort(
                (a, b) =>
                    Number(a.Year) -
                    Number(b.Year)
            );


    if (!filtered.length) {

        console.error(
            "No global energy consumption values."
        );

        return;

    }


    /* Create Chart */

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
                        "Global Energy Consumption",

                    data:
                        filtered.map(
                            row =>
                                Number(
                                    row[
                                        energyColumn
                                    ]
                                )
                        ),

                    borderColor:
                        "#12a36d",

                    backgroundColor:
                        "rgba(18,163,109,0.14)",

                    borderWidth: 3,

                    fill: true,

                    tension: 0.35,

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

                    padding: 13,

                    cornerRadius: 10,


                    callbacks: {

                        label: context => {

                            return (

                                "Energy: " +

                                Number(
                                    context.parsed.y
                                ).toLocaleString(
                                    undefined,
                                    {
                                        maximumFractionDigits: 1
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

                    title: {

                        display: true,

                        text: "Year",

                        color: "#718078"

                    },


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


                    title: {

                        display: true,

                        text:
                            "Primary Energy Use (TWh)",

                        color: "#718078"

                    },


                    ticks: {

                        color: "#7b8b84",

                        callback:
                            value =>
                                Number(
                                    value
                                ).toLocaleString()

                    },


                    grid: {

                        color:
                            "rgba(0,0,0,0.06)"

                    }

                }

            }

        }

    });

}


/* =====================================================
   GRAPH 3
   ELECTRICITY GENERATION
===================================================== */

async function electricityChart() {

    const canvas =
        document.getElementById(
            "electricityChart"
        );


    if (!canvas) {

        console.warn(
            "electricityChart canvas not found."
        );

        return;

    }


    const data =
        await getOWIDData(
            "elec-fossil-nuclear-renewables"
        );


    const world =
        getWorldData(data);


    if (!world.length) {

        console.error(
            "Electricity generation data unavailable."
        );

        return;

    }


    const columns =
        Object.keys(world[0]);


    console.log(
        "Electricity columns:",
        columns
    );


    /* Find required columns */

    const fossilColumn =
        columns.find(column =>
            column.toLowerCase()
                .includes("fossil")
        );


    const nuclearColumn =
        columns.find(column =>
            column.toLowerCase()
                .includes("nuclear")
        );


    const renewableColumn =
        columns.find(column =>
            column.toLowerCase()
                .includes("renewable")
        );


    if (
        !fossilColumn ||
        !nuclearColumn ||
        !renewableColumn
    ) {

        console.error(
            "Electricity columns not found."
        );

        return;

    }


    /* Filter valid data */

    const filtered =
        world
            .filter(row => {

                return (

                    validNumber(row.Year) &&

                    validNumber(
                        row[fossilColumn]
                    ) &&

                    validNumber(
                        row[nuclearColumn]
                    ) &&

                    validNumber(
                        row[renewableColumn]
                    )

                );

            })
            .sort(
                (a, b) =>
                    Number(a.Year) -
                    Number(b.Year)
            );


    if (!filtered.length) {

        console.error(
            "No electricity generation values."
        );

        return;

    }


    /* Create Chart */

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
                        "Renewable Energy",

                    data:
                        filtered.map(
                            row =>
                                Number(
                                    row[
                                        renewableColumn
                                    ]
                                )
                        ),

                    borderColor:
                        "#12a36d",

                    borderWidth: 3,

                    tension: 0.35,

                    pointRadius: 0,

                    pointHoverRadius: 5

                },


                {
                    label:
                        "Fossil Fuels",

                    data:
                        filtered.map(
                            row =>
                                Number(
                                    row[
                                        fossilColumn
                                    ]
                                )
                        ),

                    borderColor:
                        "#d9984f",

                    borderWidth: 3,

                    tension: 0.35,

                    pointRadius: 0,

                    pointHoverRadius: 5

                },


                {
                    label:
                        "Nuclear Energy",

                    data:
                        filtered.map(
                            row =>
                                Number(
                                    row[
                                        nuclearColumn
                                    ]
                                )
                        ),

                    borderColor:
                        "#65b9e8",

                    borderWidth: 3,

                    tension: 0.35,

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

                    labels: {

                        color: "#50635a",

                        usePointStyle: true,

                        padding: 18

                    }

                },


                tooltip: {

                    backgroundColor:
                        "rgba(3,35,24,0.95)",

                    padding: 13,

                    cornerRadius: 10,


                    callbacks: {

                        label: context => {

                            return (

                                context.dataset.label +

                                ": " +

                                Number(
                                    context.parsed.y
                                ).toLocaleString(
                                    undefined,
                                    {
                                        maximumFractionDigits: 1
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

                    title: {

                        display: true,

                        text: "Year",

                        color: "#718078"

                    },


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


                    title: {

                        display: true,

                        text:
                            "Electricity Generation (TWh)",

                        color: "#718078"

                    },


                    ticks: {

                        color: "#7b8b84",

                        callback:
                            value =>
                                Number(
                                    value
                                ).toLocaleString()

                    },


                    grid: {

                        color:
                            "rgba(0,0,0,0.06)"

                    }

                }

            }

        }

    });

}
