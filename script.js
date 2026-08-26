/* =========================================================
   SAFE ENERGY
   OFFLINE JAVASCRIPT
   No Chart.js / No Internet Required For Charts
   ========================================================= */


/* =========================================================
   01. NAVIGATION MENU
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const menuDots = document.getElementById("menuDots");
    const navMenu = document.getElementById("navMenu");

    if (menuDots && navMenu) {

        menuDots.addEventListener("click", function () {

            navMenu.classList.toggle("open");

            const isOpen = navMenu.classList.contains("open");

            menuDots.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

        });

    }


    /* =====================================================
       NAVBAR SCROLL EFFECT
    ===================================================== */

    const navbar = document.getElementById("navbar");

    if (navbar) {

        window.addEventListener("scroll", function () {

            if (window.scrollY > 30) {

                navbar.classList.add("scrolled");

            } else {

                navbar.classList.remove("scrolled");

            }

        });

    }


    /* =====================================================
       REVEAL ANIMATION
    ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");

    if (revealElements.length > 0) {

        const revealObserver =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(function (entry) {

                        if (entry.isIntersecting) {

                            entry.target.classList.add("show");

                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );

        revealElements.forEach(function (element) {

            revealObserver.observe(element);

        });

    }


    /* =====================================================
       START OFFLINE CHARTS
    ===================================================== */

    initEnergyCharts();

});


/* =========================================================
   02. OFFLINE CHART SYSTEM
   ========================================================= */

function initEnergyCharts() {

    const renewableCanvas =
        document.getElementById(
            "renewableFossilChart"
        );

    const consumptionCanvas =
        document.getElementById(
            "energyConsumptionChart"
        );

    const electricityCanvas =
        document.getElementById(
            "electricityChart"
        );


    if (renewableCanvas) {

        drawLineChart(
            renewableCanvas,
            {
                labels: [
                    "1965",
                    "1975",
                    "1985",
                    "1995",
                    "2005",
                    "2015",
                    "2020",
                    "2025"
                ],

                datasets: [

                    {
                        name: "Renewable Energy",
                        values: [
                            5,
                            6,
                            7,
                            8,
                            10,
                            14,
                            17,
                            20
                        ]
                    },

                    {
                        name: "Fossil Fuels",
                        values: [
                            88,
                            86,
                            84,
                            83,
                            82,
                            79,
                            76,
                            73
                        ]
                    }

                ],

                dark: true
            }
        );

    }


    if (consumptionCanvas) {

        drawAreaChart(
            consumptionCanvas,
            {
                labels: [
                    "1965",
                    "1975",
                    "1985",
                    "1995",
                    "2005",
                    "2015",
                    "2020",
                    "2025"
                ],

                values: [
                    61,
                    73,
                    83,
                    96,
                    117,
                    135,
                    145,
                    155
                ],

                dark: false
            }
        );

    }


    if (electricityCanvas) {

        drawElectricityChart(
            electricityCanvas,
            {
                labels: [
                    "Renewable",
                    "Fossil",
                    "Nuclear"
                ],

                values: [
                    30,
                    60,
                    10
                ]
            }
        );

    }

}


/* =========================================================
   03. CANVAS SETUP
   ========================================================= */

function prepareCanvas(canvas) {

    const rect =
        canvas.getBoundingClientRect();

    const width =
        Math.max(rect.width, 300);

    const height =
        Math.max(rect.height, 250);

    const ratio =
        window.devicePixelRatio || 1;

    canvas.width =
        width * ratio;

    canvas.height =
        height * ratio;

    canvas.style.width =
        width + "px";

    canvas.style.height =
        height + "px";

    const ctx =
        canvas.getContext("2d");

    ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );

    return {
        ctx: ctx,
        width: width,
        height: height
    };

}


/* =========================================================
   04. LINE CHART
   ========================================================= */

function drawLineChart(canvas, config) {

    const setup =
        prepareCanvas(canvas);

    const ctx =
        setup.ctx;

    const width =
        setup.width;

    const height =
        setup.height;


    const padding = {
        top: 35,
        right: 30,
        bottom: 55,
        left: 55
    };


    const chartWidth =
        width -
        padding.left -
        padding.right;

    const chartHeight =
        height -
        padding.top -
        padding.bottom;


    let maxValue = 100;
    let minValue = 0;


    /* =====================================================
       BACKGROUND
    ===================================================== */

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /* =====================================================
       GRID
    ===================================================== */

    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {

        const y =
            padding.top +
            chartHeight -
            (chartHeight * i / 5);

        ctx.beginPath();

        ctx.moveTo(
            padding.left,
            y
        );

        ctx.lineTo(
            width - padding.right,
            y
        );

        ctx.strokeStyle =
            config.dark
                ? "rgba(255,255,255,0.10)"
                : "rgba(20,50,36,0.10)";

        ctx.stroke();


        /* Y LABEL */

        ctx.fillStyle =
            config.dark
                ? "rgba(255,255,255,0.50)"
                : "#64736b";

        ctx.font =
            "11px Inter, Arial";

        ctx.textAlign = "right";

        ctx.fillText(
            Math.round(i * 20),
            padding.left - 10,
            y + 4
        );

    }


    /* =====================================================
       X LABELS
    ===================================================== */

    ctx.textAlign = "center";

    config.labels.forEach(
        function (label, index) {

            const x =
                padding.left +
                chartWidth *
                index /
                (config.labels.length - 1);

            ctx.fillStyle =
                config.dark
                    ? "rgba(255,255,255,0.50)"
                    : "#64736b";

            ctx.font =
                "10px Inter, Arial";

            ctx.fillText(
                label,
                x,
                height - 20
            );

        }
    );


    /* =====================================================
       DATA LINES
    ===================================================== */

    const lineColors = [
        "#42c978",
        "#ffffff"
    ];


    config.datasets.forEach(
        function (dataset, datasetIndex) {

            ctx.beginPath();

            dataset.values.forEach(
                function (value, index) {

                    const x =
                        padding.left +
                        chartWidth *
                        index /
                        (dataset.values.length - 1);

                    const y =
                        padding.top +
                        chartHeight -
                        (
                            value -
                            minValue
                        ) /
                        (
                            maxValue -
                            minValue
                        ) *
                        chartHeight;


                    if (index === 0) {

                        ctx.moveTo(
                            x,
                            y
                        );

                    } else {

                        ctx.lineTo(
                            x,
                            y
                        );

                    }

                }
            );


            ctx.lineWidth = 3;

            ctx.strokeStyle =
                lineColors[datasetIndex];

            ctx.lineJoin = "round";
            ctx.lineCap = "round";

            ctx.stroke();


            /* POINTS */

            dataset.values.forEach(
                function (value, index) {

                    const x =
                        padding.left +
                        chartWidth *
                        index /
                        (dataset.values.length - 1);

                    const y =
                        padding.top +
                        chartHeight -
                        value /
                        100 *
                        chartHeight;


                    ctx.beginPath();

                    ctx.arc(
                        x,
                        y,
                        4,
                        0,
                        Math.PI * 2
                    );

                    ctx.fillStyle =
                        lineColors[datasetIndex];

                    ctx.fill();

                }
            );

        }
    );


    /* =====================================================
       LEGEND
    ===================================================== */

    config.datasets.forEach(
        function (dataset, index) {

            const x =
                padding.left +
                index * 170;

            const y = 15;


            ctx.beginPath();

            ctx.arc(
                x,
                y,
                5,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                lineColors[index];

            ctx.fill();


            ctx.fillStyle =
                config.dark
                    ? "rgba(255,255,255,0.75)"
                    : "#14231c";

            ctx.font =
                "11px Inter, Arial";

            ctx.textAlign = "left";

            ctx.fillText(
                dataset.name,
                x + 10,
                y + 4
            );

        }
    );

}


/* =========================================================
   05. AREA CHART
   ========================================================= */

function drawAreaChart(canvas, config) {

    const setup =
        prepareCanvas(canvas);

    const ctx =
        setup.ctx;

    const width =
        setup.width;

    const height =
        setup.height;


    const padding = {
        top: 25,
        right: 30,
        bottom: 50,
        left: 55
    };


    const chartWidth =
        width -
        padding.left -
        padding.right;

    const chartHeight =
        height -
        padding.top -
        padding.bottom;


    const maxValue = 180;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /* GRID */

    for (let i = 0; i <= 6; i++) {

        const y =
            padding.top +
            chartHeight -
            chartHeight * i / 6;


        ctx.beginPath();

        ctx.moveTo(
            padding.left,
            y
        );

        ctx.lineTo(
            width - padding.right,
            y
        );

        ctx.strokeStyle =
            "rgba(20,50,36,0.10)";

        ctx.lineWidth = 1;

        ctx.stroke();


        ctx.fillStyle =
            "#64736b";

        ctx.font =
            "11px Inter, Arial";

        ctx.textAlign =
            "right";

        ctx.fillText(
            Math.round(i * 30),
            padding.left - 10,
            y + 4
        );

    }


    /* AREA */

    ctx.beginPath();

    config.values.forEach(
        function (value, index) {

            const x =
                padding.left +
                chartWidth *
                index /
                (config.values.length - 1);

            const y =
                padding.top +
                chartHeight -
                value /
                maxValue *
                chartHeight;


            if (index === 0) {

                ctx.moveTo(
                    x,
                    y
                );

            } else {

                ctx.lineTo(
                    x,
                    y
                );

            }

        }
    );


    const lastX =
        padding.left +
        chartWidth;

    const bottomY =
        padding.top +
        chartHeight;


    ctx.lineTo(
        lastX,
        bottomY
    );

    ctx.lineTo(
        padding.left,
        bottomY
    );

    ctx.closePath();


    ctx.fillStyle =
        "rgba(35,155,91,0.15)";

    ctx.fill();


    /* LINE */

    ctx.beginPath();

    config.values.forEach(
        function (value, index) {

            const x =
                padding.left +
                chartWidth *
                index /
                (config.values.length - 1);

            const y =
                padding.top +
                chartHeight -
                value /
                maxValue *
                chartHeight;


            if (index === 0) {

                ctx.moveTo(
                    x,
                    y
                );

            } else {

                ctx.lineTo(
                    x,
                    y
                );

            }

        }
    );


    ctx.strokeStyle =
        "#239b5b";

    ctx.lineWidth = 3;

    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    ctx.stroke();


    /* POINTS */

    config.values.forEach(
        function (value, index) {

            const x =
                padding.left +
                chartWidth *
                index /
                (config.values.length - 1);

            const y =
                padding.top +
                chartHeight -
                value /
                maxValue *
                chartHeight;


            ctx.beginPath();

            ctx.arc(
                x,
                y,
                4,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                "#239b5b";

            ctx.fill();

        }
    );


    /* X LABELS */

    config.labels.forEach(
        function (label, index) {

            const x =
                padding.left +
                chartWidth *
                index /
                (config.labels.length - 1);

            ctx.fillStyle =
                "#64736b";

            ctx.font =
                "10px Inter, Arial";

            ctx.textAlign =
                "center";

            ctx.fillText(
                label,
                x,
                height - 18
            );

        }
    );

}


/* =========================================================
   06. ELECTRICITY CHART
   ========================================================= */

function drawElectricityChart(canvas, config) {

    const setup =
        prepareCanvas(canvas);

    const ctx =
        setup.ctx;

    const width =
        setup.width;

    const height =
        setup.height;


    const centerX =
        width / 2;

    const centerY =
        height / 2 + 10;

    const radius =
        Math.min(
            width,
            height
        ) * 0.28;


    const total =
        config.values.reduce(
            function (sum, value) {
                return sum + value;
            },
            0
        );


    const chartColors = [
        "#239b5b",
        "#555555",
        "#426ab1"
    ];


    let currentAngle =
        -Math.PI / 2;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /* =====================================================
       DONUT
    ===================================================== */

    config.values.forEach(
        function (value, index) {

            const sliceAngle =
                (
                    value /
                    total
                ) *
                Math.PI *
                2;


            ctx.beginPath();

            ctx.moveTo(
                centerX,
                centerY
            );

            ctx.arc(
                centerX,
                centerY,
                radius,
                currentAngle,
                currentAngle +
                sliceAngle
            );

            ctx.closePath();


            ctx.fillStyle =
                chartColors[index];

            ctx.fill();


            currentAngle +=
                sliceAngle;

        }
    );


    /* =====================================================
       CENTER CIRCLE
    ===================================================== */

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        radius * 0.55,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#ffffff";

    ctx.fill();


    ctx.fillStyle =
        "#14231c";

    ctx.font =
        "900 18px Inter, Arial";

    ctx.textAlign =
        "center";

    ctx.fillText(
        "100%",
        centerX,
        centerY + 6
    );


    /* =====================================================
       LEGEND
    ===================================================== */

    const legendX =
        width - 175;

    const legendStartY =
        55;


    config.labels.forEach(
        function (label, index) {

            const y =
                legendStartY +
                index * 55;


            ctx.beginPath();

            ctx.roundRect(
                legendX,
                y,
                13,
                13,
                4
            );

            ctx.fillStyle =
                chartColors[index];

            ctx.fill();


            ctx.fillStyle =
                "#14231c";

            ctx.font =
                "700 12px Inter, Arial";

            ctx.textAlign =
                "left";

            ctx.fillText(
                label,
                legendX + 22,
                y + 10
            );


            ctx.fillStyle =
                "#64736b";

            ctx.font =
                "11px Inter, Arial";

            ctx.fillText(
                config.values[index] +
                "%",
                legendX + 22,
                y + 27
            );

        }
    );

}


/* =========================================================
   07. REDRAW CHARTS WHEN WINDOW RESIZES
   ========================================================= */

let chartResizeTimer;


window.addEventListener(
    "resize",
    function () {

        clearTimeout(
            chartResizeTimer
        );

        chartResizeTimer =
            setTimeout(
                function () {

                    initEnergyCharts();

                },
                200
            );

    }
);
