/* =====================================================
   SAFE ENERGY
   MAIN JAVASCRIPT
===================================================== */


/* =====================================================
   MOBILE NAVIGATION
===================================================== */

const mobileMenu =
    document.getElementById("mobileMenu");

const navLinks =
    document.getElementById("navLinks");


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


/* Close menu after selecting a page */

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


/* =====================================================
   STICKY NAVIGATION
===================================================== */

const navbar =
    document.getElementById("navbar");


window.addEventListener("scroll", function () {

    if (window.scrollY > 50) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});


/* =====================================================
   OWID DATA
===================================================== */

const OWID =
    "https://ourworldindata.org/grapher/";


/*
   Download CSV from Our World in Data.
*/

async function getOWIDData(slug) {

    try {

        const response =
            await fetch(
                OWID + slug + ".csv"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load OWID data"
            );

        }


        const text =
            await response.text();


        return parseCSV(text);

    }

    catch (error) {

        console.error(error);

        return [];

    }

}


/* =====================================================
   SIMPLE CSV PARSER
===================================================== */

function parseCSV(text) {

    const lines =
        text.trim().split(/\r?\n/);


    if (lines.length < 2) {

        return [];

    }


    const headers =
        lines[0].split(",");


    return lines.slice(1).map(function (line) {

        const values =
            line.split(",");


        const object = {};


        headers.forEach(function (header, index) {

            object[header] =
                values[index];

        });


        return object;

    });

}


/* =====================================================
   GET WORLD DATA
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

    const keys =
        Object.keys(row);


    return keys.find(function (key) {

        const lower =
            key.toLowerCase();

        return words.some(function (word) {

            return lower.includes(word);

        });

    });

}


/* =====================================================
   CHART GLOBAL SETTINGS
===================================================== */

Chart.defaults.font.family =
    "Inter, sans-serif";


Chart.defaults.animation.duration =
    1200;


/* =====================================================
   CHART 1
   RENEWABLE VS FOSSIL
===================================================== */

async function renewableFossilChart() {

    const canvas =
        document.getElementById(
            "renewableFossilChart"
        );


    const data =
        worldData(
            await getOWIDData(
                "primary-energy-from-fossil-nuclear-renewables"
            )
        );


    if (!data.length) {

        return;

    }


    const renewableColumn =
        findColumn(
            data[0],
            ["renewables"]
        );


    const fossilColumn =
        findColumn(
            data[0],
            ["fossil"]
        );


    const filtered =
        data.filter(function (row) {

            return (
                Number(row.Year) >= 1965 &&
                row[renewableColumn] &&
                row[fossilColumn]
            );

        }).slice(-40);


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

                    pointRadius: 0

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

                    cornerRadius: 12

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


    const data =
        worldData(
            await getOWIDData(
                "global-primary-energy-by-source"
            )
        );


    if (!data.length) {

        return;

    }


    const firstRow =
        data[0];


    /*
       Locate a total energy value if available.
    */

    const totalColumn =
        findColumn(
            firstRow,
            ["total primary energy", "total"]
        );


    let filtered =
        data.slice(-40);


    /*
       If the dataset has a total column,
       use it directly.
    */

    if (totalColumn) {

        filtered =
            filtered.filter(
                row =>
                    row[totalColumn]
            );

    }


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
                        "Global Energy",

                    data:
                        filtered.map(
                            row =>
                                Number(
                                    row[totalColumn]
                                )
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

            responsive: true,

            maintainAspectRatio: false,


            plugins: {

                legend: {
                    display: false
                },


                tooltip: {

                    backgroundColor:
                        "#062c20",

                    padding: 12

                }

            },


            scales: {

                x: {

                    ticks: {

                        color: "#7b8b84",

                        maxTicksLimit: 7

                    },

                    grid: {
                        display: false
                    }

                },


                y: {

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


    const data =
        worldData(
            await getOWIDData(
                "elec-fossil-nuclear-renewables"
            )
        );


    if (!data.length) {

        return;

    }


    const fossilColumn =
        findColumn(
            data[0],
            ["fossil"]
        );


    const nuclearColumn =
        findColumn(
            data[0],
            ["nuclear"]
        );


    const renewableColumn =
        findColumn(
            data[0],
            ["renewable"]
        );


    const filtered =
        data.filter(function (row) {

            return (
                Number(row.Year) >= 1965 &&
                row[fossilColumn] &&
                row[nuclearColumn] &&
                row[renewableColumn]
            );

        }).slice(-35);


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
                        "Renewables",

                    data:
                        filtered.map(
                            row =>
                                Number(
                                    row[renewableColumn]
                                )
                        ),

                    borderColor:
                        "#12a36d",

                    borderWidth: 3,

                    tension: .35,

                    pointRadius: 0

                },


                {

                    label:
                        "Fossil",

                    data:
                        filtered.map(
                            row =>
                                Number(
                                    row[fossilColumn]
                                )
                        ),

                    borderColor:
                        "#d9984f",

                    borderWidth: 3,

                    tension: .35,

                    pointRadius: 0

                },


                {

                    label:
                        "Nuclear",

                    data:
                        filtered.map(
                            row =>
                                Number(
                                    row[nuclearColumn]
                                )
                        ),

                    borderColor:
                        "#65b9e8",

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

                        usePointStyle: true,

                        color: "#50635a"

                    }

                }

            },


            scales: {

                x: {

                    ticks: {

                        color: "#7b8b84",

                        maxTicksLimit: 7

                    },

                    grid: {
                        display: false
                    }

                },


                y: {

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
   START WEBSITE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renewableFossilChart();

        energyConsumptionChart();

        electricityChart();

    }
);
