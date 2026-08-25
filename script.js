/* =====================================================
   CHART 3
   ELECTRICITY GENERATION BY ENERGY SOURCE
   Official OWID Data
   Unit: TWh
===================================================== */

async function electricityChart() {

    const canvas =
        document.getElementById("electricityChart");

    if (!canvas) {
        return;
    }

    /* Load official OWID electricity data */

    const data =
        worldData(
            await getOWIDData(
                "elec-fossil-nuclear-renewables"
            )
        );

    if (!data.length) {

        console.error(
            "Electricity generation data unavailable."
        );

        return;
    }


    /* Find electricity source columns */

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


    /* Make sure all required columns exist */

    if (
        !fossilColumn ||
        !nuclearColumn ||
        !renewableColumn
    ) {

        console.error(
            "Required electricity columns not found.",
            {
                fossilColumn,
                nuclearColumn,
                renewableColumn
            }
        );

        return;
    }


    /* Keep valid global yearly data */

    const filtered =
        data
        .filter(function (row) {

            return (

                Number(row.Year) >= 1965 &&

                Number.isFinite(
                    Number(row[fossilColumn])
                ) &&

                Number.isFinite(
                    Number(row[nuclearColumn])
                ) &&

                Number.isFinite(
                    Number(row[renewableColumn])
                )

            );

        })
        .slice(-40);


    if (!filtered.length) {

        console.error(
            "No valid electricity generation data found."
        );

        return;
    }


    /* Destroy old chart if it already exists */

    if (window.electricityGenerationChart) {

        window.electricityGenerationChart.destroy();

    }


    /* =================================================
       CREATE STACKED AREA CHART
    ================================================= */

    window.electricityGenerationChart =
        new Chart(canvas, {

            type: "line",

            data: {

                labels:
                    filtered.map(
                        row => row.Year
                    ),

                datasets: [

                    /* =================================
                       RENEWABLE ENERGY
                    ================================= */

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

                        backgroundColor:
                            "rgba(18,163,109,0.55)",

                        borderWidth:
                            2,

                        fill:
                            true,

                        tension:
                            0.3,

                        pointRadius:
                            0,

                        pointHoverRadius:
                            5,

                        stack:
                            "electricity"

                    },


                    /* =================================
                       FOSSIL FUELS
                    ================================= */

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
                            "#d9984f",

                        backgroundColor:
                            "rgba(217,152,79,0.50)",

                        borderWidth:
                            2,

                        fill:
                            true,

                        tension:
                            0.3,

                        pointRadius:
                            0,

                        pointHoverRadius:
                            5,

                        stack:
                            "electricity"

                    },


                    /* =================================
                       NUCLEAR ENERGY
                    ================================= */

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

                        backgroundColor:
                            "rgba(101,185,232,0.55)",

                        borderWidth:
                            2,

                        fill:
                            true,

                        tension:
                            0.3,

                        pointRadius:
                            0,

                        pointHoverRadius:
                            5,

                        stack:
                            "electricity"

                    }

                ]

            },


            /* =================================================
               CHART OPTIONS
            ================================================= */

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
                        1500,

                    easing:
                        "easeOutQuart"

                },


                plugins: {

                    legend: {

                        display:
                            true,

                        position:
                            "top",

                        labels: {

                            color:
                                "#50635a",

                            usePointStyle:
                                true,

                            padding:
                                20,

                            font: {

                                size:
                                    11,

                                weight:
                                    "600"

                            }

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
                            14,

                        cornerRadius:
                            12,

                        displayColors:
                            true,


                        callbacks: {

                            label:
                                function (context) {

                                    return (

                                        " " +
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

                        stacked:
                            true,

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

                        stacked:
                            true,

                        beginAtZero:
                            true,

                        ticks: {

                            color:
                                "#7b8b84",

                            callback:
                                function (value) {

                                    return (
                                        Number(value)
                                            .toLocaleString() +
                                        " TWh"
                                    );

                                }

                        },

                        grid: {

                            color:
                                "rgba(0,0,0,0.06)"

                        },

                        title: {

                            display:
                                true,

                            text:
                                "Electricity Generation (TWh)",

                            color:
                                "#7b8b84",

                            font: {

                                size:
                                    11,

                                weight:
                                    "600"

                            }

                        }

                    }

                }

            }

        });


    console.log(
        "Electricity Generation stacked chart loaded successfully."
    );

}
