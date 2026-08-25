/* =====================================================
   SAFE ENERGY
   MAIN JAVASCRIPT
===================================================== */


/* =====================================================
   MOBILE NAVIGATION
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const mobileMenu =
        document.getElementById("mobileMenu");

    const navLinks =
        document.getElementById("navLinks");

    const navbar =
        document.getElementById("navbar");


    /* Mobile menu */

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


        /* Close mobile menu */

        document
            .querySelectorAll(".nav-links a")
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


    /* =================================================
       STICKY NAVBAR
    ================================================= */

    window.addEventListener("scroll", function () {

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
   OWID
===================================================== */

const OWID =
    "https://ourworldindata.org/grapher/";



/* =====================================================
   DOWNLOAD CSV
===================================================== */

async function getOWIDData(slug) {

    try {

        const response =
            await fetch(
                OWID + slug + ".csv"
            );


        if (!response.ok) {

            throw new Error(
                "OWID request failed: " +
                response.status
            );

        }


        const text =
            await response.text();


        return parseCSV(text);

    }

    catch (error) {

        console.error(
            "OWID ERROR:",
            error
        );

        return [];

    }

}



/* =====================================================
   CSV PARSER
   Handles quoted CSV values better than split(",")
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

        }

        else if (char === '"') {

            insideQuotes =
                !insideQuotes;

        }

        else if (char === "," && !insideQuotes) {

            row.push(value);

            value = "";

        }

        else if (
            (char === "\n" || char === "\r") &&
            !insideQuotes
        ) {

            if (value !== "" || row.length > 0) {

                row.push(value);

                rows.push(row);

            }

            value = "";

            row = [];


            if (
                char === "\r" &&
                next === "\n"
            ) {

                i++;

            }

        }

        else {

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


    const headers =
        rows[0].map(function (header) {

            return header.trim();

        });


    return rows
        .slice(1)
        .map(function (values) {

            const object = {};

            headers.forEach(function (header, index) {

                object[header] =
                    values[index] !== undefined
                        ? values[index].trim()
                        : "";

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

function findColumn(row, searchTerms) {

    const keys =
        Object.keys(row);


    return keys.find(function (key) {

        const lower =
            key.toLowerCase();


        return searchTerms.some(function (term) {

            return lower.includes(
                term.toLowerCase()
            );

        });

    });

}



/* =====================================================
   CHART DEFAULTS
===================================================== */

Chart.defaults.font.family =
    "Inter, Arial, sans-serif";

Chart.defaults.animation.duration =
    1200;



/* =====================================================
   CHART 1
   RENEWABLE VS FOSSIL ENERGY
===================================================== */

async function renewableFossilChart() {

    const canvas =
        document.getElementById(
            "renewableFossilChart"
        );


    if (!canvas) return;


    const data =
        worldData(
            await getOWIDData(
                "primary-energy-from-fossil-nuclear-renewables"
            )
        );


    if (!data.length) {

        console.error(
            "Renewable/Fossil data unavailable."
        );

        return;

    }


    console.log(
        "Renewable/Fossil columns:",
        Object.keys(data[0])
    );


    const renewableColumn =
        findColumn(
            data[0],
            [
                "renewables"
            ]
        );


    const fossilColumn =
        findColumn(
            data[0],
            [
                "fossil"
            ]
        );


    if (
        !renewableColumn ||
        !fossilColumn
    ) {

        console.error(
            "Renewable/Fossil columns not found."
        );

        return;

    }


    const filtered =
        data
            .filter(function (row) {

                return (
                    Number(row.Year) >= 1965 &&
                    Number.isFinite(
                        Number(row[renewableColumn])
                    ) &&
                    Number.isFinite(
                        Number(row[fossilColumn])
                    )
                );

            })
            .sort(function (a, b) {

                return (
                    Number(a.Year) -
                    Number(b.Year)
                );

            });


    if (!filtered.length) return;


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
                        "rgba(3,20,14,.95)",

                    padding: 14,

                    cornerRadius: 10

                }

            },

            scales: {

                x: {

                    ticks: {

                        color:
                            "rgba(255,255,255,.6)",

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
                            "rgba(255,255,255,.6)"

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

   Uses OWID total primary energy dataset.
===================================================== */

async function energyConsumptionChart() {

    const canvas =
        document.getElementById(
            "energyConsumptionChart"
        );


    if (!canvas) return;


    /*
     * OWID dataset specifically for
     * global primary energy consumption.
     */

    const data =
        worldData(
            await getOWIDData(
                "global-energy-substitution"
            )
        );


    /*
     * If the first dataset does not contain
     * the expected total value, use the
     * primary-energy-consumption dataset.
     */

    let world = data;


    if (!world.length) {

        world =
            worldData(
                await getOWIDData(
                    "primary-energy-consumption"
                )
            );

    }


    if (!world.length) {

        console.error(
            "Global energy consumption data unavailable."
        );

        return;

    }


    console.log(
        "Energy consumption columns:",
        Object.keys(world[0])
    );


    /*
     * Find total energy column.
     */

    const column =
        findColumn(
            world[0],
            [
                "primary energy consumption",
                "energy consumption",
                "primary energy",
                "total energy"
            ]
        );


    if (!column) {

        console.error(
            "Total energy consumption column not found."
        );

        return;

    }


    const filtered =
        world
            .filter(function (row) {

                return (
                    Number.isFinite(
                        Number(row.Year)
                    ) &&
                    Number.isFinite(
                        Number(row[column])
                    )
                );

            })
            .sort(function (a, b) {

                return (
                    Number(a.Year) -
                    Number(b.Year)
                );

            });


    if (!filtered.length) {

        console.error(
            "No valid energy consumption rows."
        );

        return;

    }


    console.log(
        "Global energy consumption:",
        filtered
    );


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
                                    row[column]
                                )
                        ),

                    borderColor:
                        "#12a36d",

                    backgroundColor:
                        "rgba(18,163,109,.12)",

                    fill: true,

                    tension: .35,

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

                        label:
                            function (context) {

                                return (
                                    "Energy: " +
                                    Number(
                                        context.parsed.y
                                    ).toLocaleString(
                                        undefined,
                                        {
                                            maximumFractionDigits: 2
                                        }
                                    )
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


    if (!canvas) return;


    /*
     * Official OWID electricity generation
     * dataset.
     */

    const data =
        await getOWIDData(
            "elec-fossil-nuclear-renewables"
        );


    if (!data.length) {

        console.error(
            "Electricity data unavailable."
        );

        return;

    }


    /*
     * World only.
     */

    const world =
        worldData(data);


    if (!world.length) {

        console.error(
            "World electricity data unavailable."
        );

        return;

    }


    /*
     * Display the actual column names
     * in browser console.
     */

    console.log(
        "Electricity columns:",
        Object.keys(world[0])
    );


    /*
     * Find columns.
     */

    const columns =
        Object.keys(world[0]);


    const fossilColumn =
        columns.find(function (column) {

            return column
                .toLowerCase()
                .includes("fossil");

        });


    const nuclearColumn =
        columns.find(function (column) {

            return column
                .toLowerCase()
                .includes("nuclear");

        });


    const renewableColumn =
        columns.find(function (column) {

            return column
                .toLowerCase()
                .includes("renewable");

        });


    console.log(
        "Fossil:",
        fossilColumn
    );

    console.log(
        "Nuclear:",
        nuclearColumn
    );

    console.log(
        "Renewable:",
        renewableColumn
    );


    /*
     * Make sure all 3 columns exist.
     */

    if (
        !fossilColumn ||
        !nuclearColumn ||
        !renewableColumn
    ) {

        console.error(
            "Could not find electricity columns."
        );

        return;

    }


    /*
     * Clean and sort data.
     */

    const filtered =
        world
            .filter(function (row) {

                const year =
                    Number(row.Year);

                const fossil =
                    Number(
                        row[fossilColumn]
                    );

                const nuclear =
                    Number(
                        row[nuclearColumn]
                    );

                const renewable =
                    Number(
                        row[renewableColumn]
                    );


                return (
                    year >= 1965 &&

                    Number.isFinite(fossil) &&

                    Number.isFinite(nuclear) &&

                    Number.isFinite(renewable)
                );

            })
            .sort(function (a, b) {

                return (
                    Number(a.Year) -
                    Number(b.Year)
                );

            });


    if (!filtered.length) {

        console.error(
            "Electricity chart has no valid data."
        );

        return;

    }


    console.log(
        "Final electricity data:",
        filtered
    );


    /*
     * Create chart.
     */

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

                    tension: .35,

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

                    tension: .35,

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

                    tension: .35,

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

                    display: true,

                    labels: {

                        usePointStyle: true,

                        color: "#50635a",

                        padding: 18

                    }

                },


                tooltip: {

                    backgroundColor:
                        "rgba(3,35,24,.95)",

                    padding: 13,

                    cornerRadius: 10,

                    callbacks: {

                        label:
                            function (context) {

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
