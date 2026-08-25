/* =====================================================
   SAFE ENERGY
   MAIN JAVASCRIPT
===================================================== */


/* =====================================================
   CONFIGURATION
===================================================== */

const OWID =
    "https://ourworldindata.org/grapher/";


/* =====================================================
   MOBILE NAVIGATION
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const mobileMenu =
            document.getElementById("mobileMenu");

        const navLinks =
            document.getElementById("navLinks");

        const navbar =
            document.getElementById("navbar");


        /* ---------------------------------------------
           Mobile menu
        --------------------------------------------- */

        if (
            mobileMenu &&
            navLinks
        ) {

            mobileMenu.addEventListener(
                "click",
                function () {

                    navLinks.classList.toggle(
                        "open"
                    );


                    const icon =
                        mobileMenu.querySelector("i");


                    if (
                        navLinks.classList.contains(
                            "open"
                        )
                    ) {

                        icon.classList.remove(
                            "fa-bars"
                        );

                        icon.classList.add(
                            "fa-xmark"
                        );

                    }

                    else {

                        icon.classList.remove(
                            "fa-xmark"
                        );

                        icon.classList.add(
                            "fa-bars"
                        );

                    }

                }
            );


            /* Close menu after click */

            document
                .querySelectorAll(
                    ".nav-links a"
                )
                .forEach(
                    function (link) {

                        link.addEventListener(
                            "click",
                            function () {

                                navLinks.classList.remove(
                                    "open"
                                );


                                const icon =
                                    mobileMenu.querySelector(
                                        "i"
                                    );


                                icon.classList.remove(
                                    "fa-xmark"
                                );

                                icon.classList.add(
                                    "fa-bars"
                                );

                            }
                        );

                    }
                );

        }


        /* ---------------------------------------------
           Sticky navbar
        --------------------------------------------- */

        window.addEventListener(
            "scroll",
            function () {

                if (!navbar) return;


                if (
                    window.scrollY > 50
                ) {

                    navbar.classList.add(
                        "scrolled"
                    );

                }

                else {

                    navbar.classList.remove(
                        "scrolled"
                    );

                }

            }
        );


        /* ---------------------------------------------
           Start charts
        --------------------------------------------- */

        renewableFossilChart();

        energyConsumptionChart();

        electricityChart();

    }
);



/* =====================================================
   CSV DOWNLOADER
===================================================== */

async function getOWIDData(slug) {

    try {

        const response =
            await fetch(
                OWID +
                slug +
                ".csv"
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

    let row = [];

    let value = "";

    let insideQuotes = false;


    for (
        let i = 0;
        i < text.length;
        i++
    ) {

        const char =
            text[i];

        const next =
            text[i + 1];


        if (
            char === '"' &&
            insideQuotes &&
            next === '"'
        ) {

            value += '"';

            i++;

        }


        else if (
            char === '"'
        ) {

            insideQuotes =
                !insideQuotes;

        }


        else if (
            char === "," &&
            !insideQuotes
        ) {

            row.push(value);

            value = "";

        }


        else if (
            (
                char === "\n" ||
                char === "\r"
            ) &&
            !insideQuotes
        ) {

            if (
                value !== "" ||
                row.length > 0
            ) {

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


    if (
        value !== "" ||
        row.length > 0
    ) {

        row.push(value);

        rows.push(row);

    }


    if (
        rows.length < 2
    ) {

        return [];

    }


    const headers =
        rows[0].map(
            function (header) {

                return header.trim();

            }
        );


    return rows
        .slice(1)
        .map(
            function (values) {

                const object = {};


                headers.forEach(
                    function (
                        header,
                        index
                    ) {

                        object[header] =
                            values[index] !== undefined
                                ? values[index].trim()
                                : "";

                    }
                );


                return object;

            }
        );

}



/* =====================================================
   WORLD ONLY
===================================================== */

function worldData(data) {

    return data.filter(
        function (row) {

            return (
                row.Entity === "World"
            );

        }
    );

}



/* =====================================================
   FIND COLUMN
===================================================== */

function findColumn(
    row,
    terms
) {

    const columns =
        Object.keys(row);


    return columns.find(
        function (column) {

            const lower =
                column.toLowerCase();


            return terms.some(
                function (term) {

                    return lower.includes(
                        term.toLowerCase()
                    );

                }
            );

        }
    );

}



/* =====================================================
   CHART DEFAULTS
===================================================== */

Chart.defaults.font.family =
    "Inter, Arial, sans-serif";


Chart.defaults.animation.duration =
    1200;



/* =====================================================
   GRAPH 1
   RENEWABLE VS FOSSIL
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
            .filter(
                function (row) {

                    return (

                        Number(row.Year) >= 1965 &&

                        Number.isFinite(
                            Number(
                                row[
                                    renewableColumn
                                ]
                            )
                        ) &&

                        Number.isFinite(
                            Number(
                                row[
                                    fossilColumn
                                ]
                            )
                        )

                    );

                }
            )
            .sort(
                function (a, b) {

                    return (
                        Number(a.Year) -
                        Number(b.Year)
                    );

                }
            );


    if (!filtered.length) return;


    new Chart(
        canvas,
        {

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
                                        row[
                                            fossilColumn
                                        ]
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

        }
    );

}



/* =====================================================
   GRAPH 2
   GLOBAL ENERGY CONSUMPTION
===================================================== */

async function energyConsumptionChart() {

    const canvas =
        document.getElementById(
            "energyConsumptionChart"
        );


    if (!canvas) return;


    /*
     * Direct OWID dataset:
     *
     * Primary energy consumption
     *
     * Unit: TWh
     */

    const data =
        await getOWIDData(
            "primary-energy-cons"
        );


    if (!data.length) {

        console.error(
            "Primary energy dataset unavailable."
        );

        return;

    }


    console.log(
        "Primary energy columns:",
        Object.keys(data[0])
    );


    const world =
        worldData(data);


    if (!world.length) {

        console.error(
            "World primary energy data unavailable."
        );

        return;

    }


    /*
     * Find the actual primary-energy
     * consumption column.
     */

    const columns =
        Object.keys(world[0]);


    const energyColumn =
        columns.find(
            function (column) {

                const name =
                    column.toLowerCase();


                return (
                    name.includes(
                        "primary energy consumption"
                    ) ||
                    name ===
                        "primary_energy_consumption"
                );

            }
        );


    if (!energyColumn) {

        console.error(
            "Primary energy consumption column not found.",
            columns
        );

        return;

    }


    console.log(
        "Using energy column:",
        energyColumn
    );


    const filtered =
        world
            .filter(
                function (row) {

                    return (

                        Number.isFinite(
                            Number(row.Year)
                        ) &&

                        Number.isFinite(
                            Number(
                                row[
                                    energyColumn
                                ]
                            )
                        )

                    );

                }
            )
            .sort(
                function (a, b) {

                    return (
                        Number(a.Year) -
                        Number(b.Year)
                    );

                }
            );


    if (!filtered.length) {

        console.error(
            "No global energy consumption values."
        );

        return;

    }


    console.log(
        "Global energy consumption:",
        filtered
    );


    new Chart(
        canvas,
        {

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
                            "rgba(18,163,109,.14)",


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


                        padding: 13,


                        cornerRadius: 10,


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
                                "Primary Energy Consumption (TWh)",

                            color: "#718078"

                        },


                        ticks: {

                            color: "#7b8b84",

                            callback:
                                function (value) {

                                    return Number(
                                        value
                                    ).toLocaleString();

                                }

                        },


                        grid: {

                            color:
                                "rgba(0,0,0,.06)"

                        }

                    }

                }

            }

        }
    );

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


    if (!canvas) return;


    const data =
        await getOWIDData(
            "elec-fossil-nuclear-renewables"
        );


    if (!data.length) {

        console.error(
            "Electricity dataset unavailable."
        );

        return;

    }


    console.log(
        "Electricity columns:",
        Object.keys(data[0])
    );


    const world =
        worldData(data);


    if (!world.length) {

        console.error(
            "World electricity data unavailable."
        );

        return;

    }


    const columns =
        Object.keys(world[0]);


    /*
     * Find columns by their names.
     */

    const fossilColumn =
        columns.find(
            function (column) {

                return column
                    .toLowerCase()
                    .includes("fossil");

            }
        );


    const nuclearColumn =
        columns.find(
            function (column) {

                return column
                    .toLowerCase()
                    .includes("nuclear");

            }
        );


    const renewableColumn =
        columns.find(
            function (column) {

                return column
                    .toLowerCase()
                    .includes("renewable");

            }
        );


    console.log(
        "Fossil column:",
        fossilColumn
    );


    console.log(
        "Nuclear column:",
        nuclearColumn
    );


    console.log(
        "Renewable column:",
        renewableColumn
    );


    if (
        !fossilColumn ||
        !nuclearColumn ||
        !renewableColumn
    ) {

        console.error(
            "Electricity columns missing."
        );

        return;

    }


    const filtered =
        world
            .filter(
                function (row) {

                    return (

                        Number(row.Year) >= 1965 &&

                        Number.isFinite(
                            Number(
                                row[
                                    fossilColumn
                                ]
                            )
                        ) &&

                        Number.isFinite(
                            Number(
                                row[
                                    nuclearColumn
                                ]
                            )
                        ) &&

                        Number.isFinite(
                            Number(
                                row[
                                    renewableColumn
                                ]
                            )
                        )

                    );

                }
            )
            .sort(
                function (a, b) {

                    return (
                        Number(a.Year) -
                        Number(b.Year)
                    );

                }
            );


    if (!filtered.length) {

        console.error(
            "No valid electricity data."
        );

        return;

    }


    new Chart(
        canvas,
        {

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

        }
    );

}
