/* =====================================================
   IMPORTANCE OF SAFE ENERGY
   JAVASCRIPT + OUR WORLD IN DATA
   ===================================================== */


/* =====================================================
   MOBILE NAVIGATION
   ===================================================== */

function toggleMenu() {

    const nav = document.getElementById("navMenu");

    nav.classList.toggle("active");

}


/* =====================================================
   OUR WORLD IN DATA
   ===================================================== */

const OWID =
    "https://ourworldindata.org/grapher/";


/* =====================================================
   CSV READER
   ===================================================== */

function parseCSV(text) {

    const rows = [];

    let row = [];

    let cell = "";

    let quoted = false;


    for (let i = 0; i < text.length; i++) {

        const char = text[i];

        const next = text[i + 1];


        if (
            char === '"' &&
            quoted &&
            next === '"'
        ) {

            cell += '"';

            i++;

        }


        else if (char === '"') {

            quoted = !quoted;

        }


        else if (
            char === "," &&
            !quoted
        ) {

            row.push(cell);

            cell = "";

        }


        else if (
            (char === "\n" || char === "\r") &&
            !quoted
        ) {

            if (
                char === "\r" &&
                next === "\n"
            ) {

                i++;

            }

            row.push(cell);


            if (
                row.some(
                    value => value !== ""
                )
            ) {

                rows.push(row);

            }


            row = [];

            cell = "";

        }


        else {

            cell += char;

        }

    }


    if (
        cell ||
        row.length
    ) {

        row.push(cell);

        rows.push(row);

    }


    return rows;

}


/* =====================================================
   GET DATA FROM OWID
   ===================================================== */

async function getOWID(slug) {

    const response =
        await fetch(
            OWID + slug + ".csv"
        );


    if (!response.ok) {

        throw new Error(
            "Unable to load data"
        );

    }


    const rows =
        parseCSV(
            await response.text()
        );


    const headers =
        rows.shift();


    return rows.map(row => {

        const object = {};


        headers.forEach(
            (header, index) => {

                object[header] =
                    row[index];

            }
        );


        return object;

    });

}


/* =====================================================
   FIND COLUMN
   ===================================================== */

function findColumn(row, keywords) {

    return Object.keys(row).find(
        key =>
            keywords.some(
                keyword =>
                    key
                        .toLowerCase()
                        .includes(keyword)
            )
    );

}


/* =====================================================
   ONLY WORLD DATA
   ===================================================== */

function worldOnly(rows) {

    return rows.filter(
        row =>
            (row.Entity || "")
                .toLowerCase() === "world"
    );

}


/* =====================================================
   LATEST DATA
   ===================================================== */

function latest(rows) {

    return [...rows]
        .filter(
            row =>
                row.Year &&
                !Number.isNaN(
                    Number(row.Year)
                )
        )
        .sort(
            (a,b) =>
                Number(a.Year) -
                Number(b.Year)
        )
        .at(-1);

}


/* =====================================================
   FORMAT NUMBERS
   ===================================================== */

function compactNumber(number) {

    if (
        !Number.isFinite(number)
    ) {

        return "—";

    }


    if (number >= 1000000) {

        return (
            number / 1000000
        ).toFixed(1) + "M";

    }


    if (number >= 1000) {

        return (
            number / 1000
        ).toFixed(1) + "k";

    }


    return number.toLocaleString();

}


/* =====================================================
   CHART SETTINGS
   ===================================================== */

const chartSettings = {

    responsive: true,

    maintainAspectRatio: false,

    interaction: {

        mode: "index",

        intersect: false

    },


    plugins: {

        legend: {

            labels: {

                color: "#c8d6cf",

                usePointStyle: true,

                boxWidth: 8,

                font: {

                    size: 10,

                    weight: "bold"

                }

            }

        },


        tooltip: {

            backgroundColor:
                "rgba(3,17,11,0.95)",

            padding: 12,

            cornerRadius: 12

        }

    },


    scales: {

        x: {

            ticks: {

                color: "#789084",

                maxTicksLimit: 8

            },

            grid: {

                display: false

            }

        },


        y: {

            ticks: {

                color: "#789084"

            },

            grid: {

                color:
                    "rgba(255,255,255,0.07)"

            }

        }

    }

};


/* =====================================================
   LOAD DASHBOARD
   ===================================================== */

async function loadDashboard() {

    const status =
        document.getElementById(
            "dataStatus"
        );


    try {

        /*
         Primary energy:
         Fossil + Nuclear + Renewables
        */

        const primary =
            await getOWID(
                "primary-energy-from-fossil-nuclear-renewables"
            );


        /*
         Global energy consumption
        */

        const consumption =
            await getOWID(
                "global-primary-energy-by-source"
            );


        /*
         Electricity generation
        */

        const electricity =
            await getOWID(
                "elec-fossil-nuclear-renewables"
            );


        const primaryWorld =
            worldOnly(primary);


        const consumptionWorld =
            worldOnly(consumption);


        const electricityWorld =
            worldOnly(electricity);


        /* =============================================
           FIND DATA COLUMNS
           ============================================= */

        const primarySample =
            primaryWorld[0];


        const renewableColumn =
            findColumn(
                primarySample,
                ["renewable"]
            );


        const fossilColumn =
            findColumn(
                primarySample,
                ["fossil"]
            );


        const nuclearColumn =
            findColumn(
                primarySample,
                ["nuclear"]
            );


        /* =============================================
           METRICS
           ============================================= */

        const latestPrimary =
            latest(primaryWorld);


        document.getElementById(
            "renewableMetric"
        ).textContent =
            compactNumber(
                Number(
                    latestPrimary[
                        renewableColumn
                    ]
                )
            );


        document.getElementById(
            "fossilMetric"
        ).textContent =
            compactNumber(
                Number(
                    latestPrimary[
                        fossilColumn
                    ]
                )
            );


        document.getElementById(
            "nuclearMetric"
        ).textContent =
            compactNumber(
                Number(
                    latestPrimary[
                        nuclearColumn
                    ]
                )
            );


        document.getElementById(
            "yearMetric"
        ).textContent =
            latestPrimary.Year;


        /* =============================================
           CHART 1
           RENEWABLE VS FOSSIL
           ============================================= */

        const renewableFossilData =
            primaryWorld.filter(
                row =>
                    row[renewableColumn] &&
                    row[fossilColumn]
            );


        new Chart(

            document.getElementById(
                "renewableFossilChart"
            ),

            {

                type: "line",

                data: {

                    labels:
                        renewableFossilData.map(
                            row => row.Year
                        ),


                    datasets: [

                        {

                            label:
                                "Renewable Energy",

                            data:
                                renewableFossilData.map(
                                    row =>
                                        Number(
                                            row[
                                                renewableColumn
                                            ]
                                        )
                                ),

                            borderColor:
                                "#56e49a",

                            backgroundColor:
                                "rgba(86,228,154,0.12)",

                            fill: true,

                            tension: 0.35,

                            pointRadius: 0

                        },


                        {

                            label:
                                "Fossil Fuels",

                            data:
                                renewableFossilData.map(
                                    row =>
                                        Number(
                                            row[
                                                fossilColumn
                                            ]
                                        )
                                ),

                            borderColor:
                                "#d2a66e",

                            backgroundColor:
                                "rgba(210,166,110,0.1)",

                            fill: true,

                            tension: 0.35,

                            pointRadius: 0

                        }

                    ]

                },


                options:
                    chartSettings

            }

        );


        /* =============================================
           CHART 2
           GLOBAL ENERGY CONSUMPTION
           ============================================= */

        const consumptionSample =
            consumptionWorld[0];


        const consumptionColumn =
            findColumn(
                consumptionSample,
                [
                    "primary energy",
                    "energy consumption",
                    "total"
                ]
            );


        const consumptionData =
            consumptionWorld.filter(
                row =>
                    row[
                        consumptionColumn
                    ]
            );


        new Chart(

            document.getElementById(
                "consumptionChart"
            ),

            {

                type: "line",

                data: {

                    labels:
                        consumptionData.map(
                            row => row.Year
                        ),

                    datasets: [

                        {

                            label:
                                "Global Primary Energy",

                            data:
                                consumptionData.map(
                                    row =>
                                        Number(
                                            row[
                                                consumptionColumn
                                            ]
                                        )
                                ),

                            borderColor:
                                "#bdf8d8",

                            backgroundColor:
                                "rgba(86,228,154,0.12)",

                            fill: true,

                            tension: 0.35,

                            pointRadius: 0

                        }

                    ]

                },


                options:
                    chartSettings

            }

        );


        /* =============================================
           CHART 3
           ELECTRICITY GENERATION
           ============================================= */

        const electricitySample =
            electricityWorld[0];


        const electricityRenewable =
            findColumn(
                electricitySample,
                ["renewable"]
            );


        const electricityFossil =
            findColumn(
                electricitySample,
                ["fossil"]
            );


        const electricityNuclear =
            findColumn(
                electricitySample,
                ["nuclear"]
            );


        const electricityData =
            electricityWorld.filter(
                row =>
                    row[
                        electricityRenewable
                    ] &&
                    row[
                        electricityFossil
                    ] &&
                    row[
                        electricityNuclear
                    ]
            );


        new Chart(

            document.getElementById(
                "electricityChart"
            ),

            {

                type: "line",

                data: {

                    labels:
                        electricityData.map(
                            row => row.Year
                        ),


                    datasets: [

                        {

                            label:
                                "Renewables",

                            data:
                                electricityData.map(
                                    row =>
                                        Number(
                                            row[
                                                electricityRenewable
                                            ]
                                        )
                                ),

                            borderColor:
                                "#56e49a",

                            tension: 0.3,

                            pointRadius: 0

                        },


                        {

                            label:
                                "Fossil Fuels",

                            data:
                                electricityData.map(
                                    row =>
                                        Number(
                                            row[
                                                electricityFossil
                                            ]
                                        )
                                ),

                            borderColor:
                                "#d2a66e",

                            tension: 0.3,

                            pointRadius: 0

                        },


                        {

                            label:
                                "Nuclear",

                            data:
                                electricityData.map(
                                    row =>
                                        Number(
                                            row[
                                                electricityNuclear
                                            ]
                                        )
                                ),

                            borderColor:
                                "#b9c6ff",

                            tension: 0.3,

                            pointRadius: 0

                        }

                    ]

                },


                options:
                    chartSettings

            }

        );


        status.textContent =
            "✓ Connected to Our World in Data • Latest available global data: " +
            latestPrimary.Year;

    }


    catch (error) {

        console.error(error);


        status.innerHTML =
            "Data connection could not be loaded. Visit " +
            '<a href="https://ourworldindata.org/energy" target="_blank">' +
            "Our World in Data – Energy" +
            "</a>";

    }

}


/* =====================================================
   START WEBSITE
   ===================================================== */

loadDashboard();
