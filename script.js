/* =====================================================
   IMPORTANCE OF SAFE ENERGY
   MAIN JAVASCRIPT
===================================================== */


/* =====================================================
   MOBILE NAVIGATION
===================================================== */

const mobileMenu =
    document.getElementById("mobileMenu");

const navLinks =
    document.getElementById("navLinks");


if (mobileMenu && navLinks) {

    mobileMenu.addEventListener(
        "click",
        function () {

            navLinks.classList.toggle("open");

            const icon =
                mobileMenu.querySelector("i");

            if (
                navLinks.classList.contains("open")
            ) {

                icon.classList.remove("fa-bars");

                icon.classList.add("fa-xmark");

            } else {

                icon.classList.remove("fa-xmark");

                icon.classList.add("fa-bars");

            }

        }
    );


    document
        .querySelectorAll(".nav-links a")
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    navLinks.classList.remove("open");

                    const icon =
                        mobileMenu.querySelector("i");

                    icon.classList.remove("fa-xmark");

                    icon.classList.add("fa-bars");

                }
            );

        });

}


/* =====================================================
   STICKY NAVIGATION
===================================================== */

const navbar =
    document.getElementById("navbar");


if (navbar) {

    window.addEventListener(
        "scroll",
        function () {

            if (window.scrollY > 50) {

                navbar.classList.add("scrolled");

            } else {

                navbar.classList.remove("scrolled");

            }

        }
    );

}


/* =====================================================
   OWID
===================================================== */

const OWID =
    "https://ourworldindata.org/grapher/";


/* =====================================================
   CSV LOADER
===================================================== */

async function getOWIDData(slug) {

    try {

        const response =
            await fetch(
                OWID + slug + ".csv"
            );


        if (!response.ok) {

            throw new Error(
                "Could not load OWID dataset."
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
===================================================== */

function parseCSV(text) {

    const rows = [];

    let currentRow = [];

    let currentValue = "";

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

            currentValue += '"';

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

            currentRow.push(
                currentValue
            );

            currentValue = "";

        }


        else if (
            (char === "\n" ||
             char === "\r") &&
            !insideQuotes
        ) {

            if (
                char === "\r" &&
                next === "\n"
            ) {

                i++;

            }


            currentRow.push(
                currentValue
            );

            rows.push(
                currentRow
            );

            currentRow = [];

            currentValue = "";

        }


        else {

            currentValue += char;

        }

    }


    if (
        currentValue.length > 0 ||
        currentRow.length > 0
    ) {

        currentRow.push(
            currentValue
        );

        rows.push(
            currentRow
        );

    }


    if (rows.length < 2) {

        return [];

    }


    const headers =
        rows[0];


    return rows
        .slice(1)
        .map(function (values) {

            const object = {};


            headers.forEach(
                function (
                    header,
                    index
                ) {

                    object[header] =
                        values[index] ?? "";

                }
            );


            return object;

        });

}


/* =====================================================
   GET WORLD
===================================================== */

function getWorldData(data) {

    return data.filter(
        function (row) {

            return row.Entity === "World";

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
   CHART 1
   RENEWABLE VS FOSSIL
===================================================== */

async function renewableFossilChart() {

    const canvas =
        document.getElementById(
            "renewableFossilChart"
        );


    if (!canvas) {

        return;

    }


    const data =
        getWorldData(
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


    const columns =
        Object.keys(data[0]);


    console.log(
        "Chart 1 columns:",
        columns
    );


    const renewableColumn =
        columns.find(
            column =>
                column
                    .toLowerCase()
                    .includes("renewable")
        );


    const fossilColumn =
        columns.find(
            column =>
                column
                    .toLowerCase()
                    .includes("fossil")
        );


    if (
        !renewableColumn ||
        !fossilColumn
    ) {

        console.error(
            "Chart 1 columns missing."
        );

        return;

    }


    const filtered =
        data
            .filter(
                row =>
                    Number(row.Year) >= 1985
            )
            .filter(
                row =>
                    Number.isFinite(
                        Number(
                            row[renewableColumn]
                        )
                    ) &&
                    Number.isFinite(
                        Number(
                            row[fossilColumn]
                        )
                    )
            )
            .slice(-40);


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
                            "#55e3a2",

                        backgroundColor:
                            "rgba(85,227,162,.12)",

                        fill:
                            true,

                        tension:
                            .35,

                        borderWidth:
                            3,

                        pointRadius:
                            0

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
                            "#e0a15b",

                        backgroundColor:
                            "rgba(224,161,91,.08)",

                        fill:
                            true,

                        tension:
                            .35,

                        borderWidth:
                            3,

                        pointRadius:
                            0

                    }

                ]

            },


            options: {

                responsive:
                    true,

                maintainAspectRatio:
                    false,

                interaction: {

                    mode:
                        "index",

                    intersect:
                        false

                },


                plugins: {

                    legend: {

                        labels: {

                            color:
                                "#ffffff",

                            usePointStyle:
                                true

                        }

                    },


                    tooltip: {

                        backgroundColor:
                            "#031b12",

                        padding:
                            13,

                        cornerRadius:
                            10

                    }

                },


                scales: {

                    x: {

                        ticks: {

                            color:
                                "rgba(255,255,255,.6)",

                            maxTicksLimit:
                                8

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
   CHART 2
   GLOBAL ENERGY CONSUMPTION

   Uses OWID:
   global-primary-energy-by-source

   Total is calculated from actual source data.
===================================================== */

async function energyConsumptionChart() {

    const canvas =
        document.getElementById(
            "energyConsumptionChart"
        );


    if (!canvas) {

        return;

    }


    const data =
        getWorldData(
            await getOWIDData(
                "global-primary-energy-by-source"
            )
        );


    if (!data.length) {

        console.error(
            "Global energy data unavailable."
        );

        return;

    }


    const columns =
        Object.keys(data[0]);


    console.log(
        "Chart 2 columns:",
        columns
    );


    /*
       Only use actual energy-source columns.
    */

    const sourceColumns =
        columns.filter(
            function (column) {

                const name =
                    column.toLowerCase();


                return (

                    name.includes("coal") ||

                    name.includes("oil") ||

                    name.includes("gas") ||

                    name.includes("nuclear") ||

                    name.includes("hydro") ||

                    name.includes("wind") ||

                    name.includes("solar") ||

                    name.includes("biofuel") ||

                    name.includes("biomass")

                );

            }
        );


    if (!sourceColumns.length) {

        console.error(
            "No energy source columns found."
        );

        return;

    }


    const calculated =
        data
            .filter(
                row =>
                    Number(row.Year) >= 1985
            )
            .map(
                function (row) {

                    let total = 0;


                    sourceColumns.forEach(
                        function (column) {

                            const value =
                                Number(
                                    row[column]
                                );


                            if (
                                Number.isFinite(
                                    value
                                )
                            ) {

                                total += value;

                            }

                        }
                    );


                    return {

                        year:
                            Number(row.Year),

                        total:
                            total

                    };

                }
            )
            .filter(
                row =>
                    row.total > 0
            )
            .slice(-40);


    if (!calculated.length) {

        console.error(
            "Global consumption values unavailable."
        );

        return;

    }


    if (
        window.globalEnergyChart
    ) {

        window.globalEnergyChart.destroy();

    }


    window.globalEnergyChart =
        new Chart(
            canvas,
            {

                type:
                    "line",

                data: {

                    labels:
                        calculated.map(
                            row =>
                                row.year
                        ),

                    datasets: [

                        {

                            label:
                                "Global Energy Consumption",

                            data:
                                calculated.map(
                                    row =>
                                        row.total
                                ),

                            borderColor:
                                "#149b68",

                            backgroundColor:
                                "rgba(20,155,104,.14)",

                            fill:
                                true,

                            tension:
                                .35,

                            borderWidth:
                                3,

                            pointRadius:
                                0,

                            pointHoverRadius:
                                6

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    interaction: {

                        mode:
                            "index",

                        intersect:
                            false

                    },


                    plugins: {

                        legend: {

                            display:
                                false

                        },


                        tooltip: {

                            backgroundColor:
                                "#062c20",

                            padding:
                                14,

                            cornerRadius:
                                10,

                            displayColors:
                                false,

                            callbacks: {

                                label:
                                    function (
                                        context
                                    ) {

                                        return (

                                            "Energy: " +

                                            Number(
                                                context
                                                    .parsed
                                                    .y
                                            ).toLocaleString(
                                                undefined,
                                                {
                                                    maximumFractionDigits:
                                                        1
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

                                color:
                                    "#7b8b84",

                                maxTicksLimit:
                                    8

                            },

                            grid: {

                                display:
                                    false

                            }

                        },


                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                color:
                                    "#7b8b84",

                                callback:
                                    function (
                                        value
                                    ) {

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


    console.log(
        "Global Energy Consumption loaded."
    );

}


/* =====================================================
   CHART 3
   ELECTRICITY GENERATION

   Official OWID dataset:
   elec-fossil-nuclear-renewables

   Unit: TWh
===================================================== */

async function electricityChart() {

    const canvas =
        document.getElementById(
            "electricityChart"
        );


    if (!canvas) {

        console.error(
            "electricityChart canvas missing."
        );

        return;

    }


    const data =
        getWorldData(
            await getOWIDData(
                "elec-fossil-nuclear-renewables"
            )
        );


    if (!data.length) {

        console.error(
            "Electricity data unavailable."
        );

        return;

    }


    const columns =
        Object.keys(data[0]);


    console.log(
        "Chart 3 columns:",
        columns
    );


    /*
       Automatically identify the actual
       electricity generation columns.
    */

    const fossilColumn =
        columns.find(
            column => {

                const name =
                    column.toLowerCase();

                return (
                    name.includes(
                        "electricity from fossil"
                    )
                );

            }
        );


    const nuclearColumn =
        columns.find(
            column => {

                const name =
                    column.toLowerCase();

                return (
                    name.includes(
                        "electricity from nuclear"
                    )
                );

            }
        );


    const renewableColumn =
        columns.find(
            column => {

                const name =
                    column.toLowerCase();

                return (
                    name.includes(
                        "electricity from renewables"
                    )
                );

            }
        );


    console.log(
        "Fossil:",
        fossilColumn
    );

    console.log(
        "Nuclear:",
        nuclearColumn
    );

    console.log(
        "Renewables:",
        renewableColumn
    );


    if (
        !fossilColumn ||
        !nuclearColumn ||
        !renewableColumn
    ) {

        console.error(
            "Required electricity columns not found."
        );

        return;

    }


    const filtered =
        data
            .filter(
                row =>
                    Number(row.Year) >= 1985
            )
            .filter(
                row =>
                    Number.isFinite(
                        Number(
                            row[fossilColumn]
                        )
                    ) &&
                    Number.isFinite(
                        Number(
                            row[nuclearColumn]
                        )
                    ) &&
                    Number.isFinite(
                        Number(
                            row[renewableColumn]
                        )
                    )
            )
            .slice(-40);


    if (!filtered.length) {

        console.error(
            "No electricity generation values."
        );

        return;

    }


    if (
        window.electricityChartInstance
    ) {

        window.electricityChartInstance.destroy();

    }


    /*
       Regular line chart rather than stacked chart.

       This makes each source's actual TWh
       value easier to read.
    */

    window.electricityChartInstance =
        new Chart(
            canvas,
            {

                type:
                    "line",

                data: {

                    labels:
                        filtered.map(
                            row =>
                                row.Year
                        ),

                    datasets: [

                        {

                            label:
                                "Renewables",

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
                                "#149b68",

                            backgroundColor:
                                "rgba(20,155,104,.10)",

                            borderWidth:
                                3,

                            tension:
                                .3,

                            pointRadius:
                                0,

                            pointHoverRadius:
                                6

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
                                "#d89449",

                            backgroundColor:
                                "rgba(216,148,73,.08)",

                            borderWidth:
                                3,

                            tension:
                                .3,

                            pointRadius:
                                0,

                            pointHoverRadius:
                                6

                        },


                        {

                            label:
                                "Nuclear",

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
                                "#4da9dc",

                            backgroundColor:
                                "rgba(77,169,220,.08)",

                            borderWidth:
                                3,

                            tension:
                                .3,

                            pointRadius:
                                0,

                            pointHoverRadius:
                                6

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    interaction: {

                        mode:
                            "index",

                        intersect:
                            false

                    },


                    animation: {

                        duration:
                            1300

                    },


                    plugins: {

                        legend: {

                            labels: {

                                color:
                                    "#50635a",

                                usePointStyle:
                                    true,

                                padding:
                                    18

                            }

                        },


                        tooltip: {

                            backgroundColor:
                                "#062c20",

                            titleColor:
                                "#ffffff",

                            bodyColor:
                                "#ffffff",

                            padding:
                                13,

                            cornerRadius:
                                10,

                            callbacks: {

                                label:
                                    function (
                                        context
                                    ) {

                                        return (

                                            context
                                                .dataset
                                                .label +

                                            ": " +

                                            Number(
                                                context
                                                    .parsed
                                                    .y
                                            ).toLocaleString(
                                                undefined,
                                                {
                                                    maximumFractionDigits:
                                                        1
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

                                color:
                                    "#7b8b84",

                                maxTicksLimit:
                                    8

                            },

                            grid: {

                                display:
                                    false

                            }

                        },


                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                color:
                                    "#7b8b84",

                                callback:
                                    function (
                                        value
                                    ) {

                                        return (
                                            Number(
                                                value
                                            ).toLocaleString() +
                                            " TWh"
                                        );

                                    }

                            },

                            grid: {

                                color:
                                    "rgba(0,0,0,.06)"

                            },

                            title: {

                                display:
                                    true,

                                text:
                                    "Electricity Generation (TWh)",

                                color:
                                    "#7b8b84"

                            }

                        }

                    }

                }

            }
        );


    console.log(
        "Electricity Generation loaded."
    );

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
