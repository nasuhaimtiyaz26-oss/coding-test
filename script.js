/* =========================================================
   SAFE ENERGY
   MASTER JAVASCRIPT
   OFFLINE VERSION
   Navigation + Animation + Offline Energy Charts
========================================================= */


document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       01. MOBILE NAVIGATION
    ===================================================== */

    const menuDots = document.getElementById("menuDots");
    const navMenu = document.getElementById("navMenu");


    if (menuDots && navMenu) {

        menuDots.addEventListener("click", function (event) {

            event.stopPropagation();

            const isOpen =
                navMenu.classList.toggle("open");

            menuDots.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

        });


        navMenu
            .querySelectorAll("a")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        navMenu.classList.remove("open");

                        menuDots.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );

            });

    }



    /* =====================================================
       02. NAVBAR SCROLL
    ===================================================== */

    const navbar =
        document.getElementById("navbar");


    function updateNavbar() {

        if (!navbar) return;


        if (window.scrollY > 30) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }

    }


    updateNavbar();


    window.addEventListener(
        "scroll",
        updateNavbar,
        { passive: true }
    );



    /* =====================================================
       03. REVEAL ANIMATION
    ===================================================== */

    const animatedElements =
        document.querySelectorAll(
            ".data-card, " +
            ".chart-card, " +
            ".benefit-card, " +
            ".renewable-type-card, " +
            ".effect-card, " +
            ".save-card, " +
            ".team-card, " +
            ".research-source-card, " +
            ".source-detail-card, " +
            ".home-nav-card, " +
            ".energy-card"
        );


    animatedElements.forEach(function (element) {

        element.classList.remove("reveal");

        element.classList.add("show");

    });


    if ("IntersectionObserver" in window) {

        animatedElements.forEach(function (element) {

            element.classList.remove("show");

            element.classList.add("reveal");

        });


        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target
                                    .classList
                                    .add("show");

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.05
                }
            );


        animatedElements.forEach(
            function (element) {

                observer.observe(element);

            }
        );

    } else {

        animatedElements.forEach(
            function (element) {

                element.classList.remove(
                    "reveal"
                );

                element.classList.add(
                    "show"
                );

            }
        );

    }



    /* =====================================================
       04. ACTIVE NAVIGATION
    ===================================================== */

    let currentPage =
        window.location.pathname
            .split("/")
            .pop();


    if (!currentPage) {

        currentPage = "index.html";

    }


    document
        .querySelectorAll(".nav-menu a")
        .forEach(function (link) {

            const linkPage =
                link.getAttribute("href");


            if (linkPage === currentPage) {

                link.classList.add("active");

            } else {

                link.classList.remove("active");

            }

        });



    /* =====================================================
       05. CLOSE MENU OUTSIDE
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (
                navMenu &&
                menuDots &&
                !navMenu.contains(event.target) &&
                !menuDots.contains(event.target)
            ) {

                navMenu.classList.remove("open");

                menuDots.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );



    /* =====================================================
       06. ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                if (navMenu) {

                    navMenu.classList.remove(
                        "open"
                    );

                }


                if (menuDots) {

                    menuDots.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }

        }
    );



    /* =====================================================
       07. OFFLINE ENERGY CHARTS
    ===================================================== */

    initializeOfflineCharts();

});



/* =========================================================
   OFFLINE ENERGY DATA
   No internet required.
========================================================= */


/*
    These values are embedded directly into JavaScript.

    Therefore:

    Internet OFF  -> Charts still work
    GitHub Pages  -> Charts work
    Local HTML    -> Charts work
*/


const ENERGY_DATA = {

    years: [
        2000,
        2001,
        2002,
        2003,
        2004,
        2005,
        2006,
        2007,
        2008,
        2009,
        2010,
        2011,
        2012,
        2013,
        2014,
        2015,
        2016,
        2017,
        2018,
        2019,
        2020,
        2021,
        2022,
        2023
    ],


    /*
        Renewable share of global primary energy (%)
    */

    renewable: [
        6.6,
        6.7,
        6.8,
        6.9,
        7.1,
        7.3,
        7.5,
        7.8,
        8.0,
        8.2,
        8.5,
        8.8,
        9.2,
        9.6,
        10.0,
        10.5,
        11.0,
        11.6,
        12.2,
        12.8,
        13.5,
        14.4,
        15.3,
        16.2
    ],


    /*
        Fossil fuel share of global primary energy (%)
    */

    fossil: [
        80.2,
        80.0,
        79.8,
        79.6,
        79.4,
        79.2,
        79.0,
        78.8,
        78.2,
        77.8,
        77.2,
        76.8,
        76.3,
        75.8,
        75.2,
        74.7,
        74.0,
        73.4,
        72.8,
        72.1,
        70.5,
        71.4,
        70.2,
        69.1
    ],


    /*
        Global primary energy consumption
        Approximate EJ-style index values
        for offline visualisation.
    */

    consumption: [
        105,
        106,
        108,
        111,
        115,
        119,
        122,
        126,
        127,
        123,
        131,
        134,
        136,
        139,
        141,
        144,
        147,
        150,
        154,
        156,
        150,
        157,
        162,
        165
    ],


    /*
        Electricity generation source shares (%)
    */

    electricityRenewable: [
        19.0,
        19.2,
        19.5,
        19.7,
        20.0,
        20.3,
        20.7,
        21.0,
        21.5,
        22.0,
        22.5,
        23.0,
        23.7,
        24.5,
        25.3,
        26.2,
        27.0,
        28.0,
        29.0,
        30.0,
        31.5,
        33.0,
        34.5,
        36.0
    ],


    electricityFossil: [
        65.0,
        64.8,
        64.5,
        64.3,
        64.0,
        63.7,
        63.2,
        62.8,
        62.0,
        61.5,
        60.5,
        59.8,
        59.0,
        58.2,
        57.5,
        56.5,
        55.5,
        54.5,
        53.5,
        52.5,
        51.0,
        49.8,
        48.0,
        46.5
    ],


    electricityNuclear: [
        16.0,
        16.0,
        16.0,
        16.0,
        16.0,
        16.0,
        15.8,
        15.7,
        15.5,
        15.3,
        15.0,
        14.7,
        14.3,
        14.0,
        13.7,
        13.3,
        13.0,
        12.5,
        12.0,
        11.5,
        11.0,
        10.8,
        10.5,
        10.2
    ]

};



/* =========================================================
   INITIALIZE CHARTS
========================================================= */

function initializeOfflineCharts() {

    const chart1 =
        document.getElementById(
            "renewableFossilChart"
        );


    const chart2 =
        document.getElementById(
            "energyConsumptionChart"
        );


    const chart3 =
        document.getElementById(
            "electricityChart"
        );


    if (chart1) {

        drawLineChart(
            chart1,
            {
                labels: ENERGY_DATA.years,

                datasets: [

                    {
                        label: "Renewable Energy",

                        data:
                            ENERGY_DATA.renewable,

                        lineWidth: 3,

                        fill: false,

                        smooth: true
                    },

                    {
                        label: "Fossil Fuels",

                        data:
                            ENERGY_DATA.fossil,

                        lineWidth: 3,

                        fill: false,

                        smooth: true
                    }

                ],

                dark: true,

                yLabel: "Share (%)"

            }
        );

    }


    if (chart2) {

        drawLineChart(
            chart2,
            {
                labels: ENERGY_DATA.years,

                datasets: [

                    {
                        label:
                            "Global Primary Energy",

                        data:
                            ENERGY_DATA.consumption,

                        lineWidth: 3,

                        fill: true,

                        smooth: true
                    }

                ],

                dark: false,

                yLabel: "Energy use"

            }
        );

    }


    if (chart3) {

        drawLineChart(
            chart3,
            {
                labels: ENERGY_DATA.years,

                datasets: [

                    {
                        label: "Renewable",

                        data:
                            ENERGY_DATA
                                .electricityRenewable,

                        lineWidth: 2,

                        fill: true,

                        smooth: true
                    },

                    {
                        label: "Fossil Fuels",

                        data:
                            ENERGY_DATA
                                .electricityFossil,

                        lineWidth: 2,

                        fill: true,

                        smooth: true
                    },

                    {
                        label: "Nuclear",

                        data:
                            ENERGY_DATA
                                .electricityNuclear,

                        lineWidth: 2,

                        fill: true,

                        smooth: true
                    }

                ],

                dark: false,

                yLabel: "Share (%)"

            }
        );

    }

}



/* =========================================================
   CANVAS LINE CHART
   Pure JavaScript
   No Chart.js
   No Internet
========================================================= */

function drawLineChart(canvas, config) {

    if (!canvas) return;


    const wrapper =
        canvas.parentElement;


    const rect =
        wrapper.getBoundingClientRect();


    const width =
        Math.max(
            rect.width,
            300
        );


    const height =
        Math.max(
            rect.height,
            250
        );


    const devicePixelRatio =
        window.devicePixelRatio || 1;


    canvas.width =
        width * devicePixelRatio;


    canvas.height =
        height * devicePixelRatio;


    canvas.style.width =
        width + "px";


    canvas.style.height =
        height + "px";


    const ctx =
        canvas.getContext("2d");


    ctx.setTransform(
        devicePixelRatio,
        0,
        0,
        devicePixelRatio,
        0,
        0
    );


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const dark =
        config.dark === true;


    const textColor =
        dark
            ? "rgba(255,255,255,.72)"
            : "#64736b";


    const gridColor =
        dark
            ? "rgba(255,255,255,.09)"
            : "rgba(0,0,0,.07)";


    const colors = [
        "#42c978",
        "#777777",
        "#426ab1"
    ];


    const padding = {

        top: 48,

        right: 25,

        bottom: 45,

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


    const labels =
        config.labels;


    const datasets =
        config.datasets;


    let allValues = [];


    datasets.forEach(function (dataset) {

        dataset.data.forEach(function (value) {

            if (
                typeof value === "number" &&
                Number.isFinite(value)
            ) {

                allValues.push(value);

            }

        });

    });


    if (!allValues.length) {

        drawOfflineError(
            canvas,
            "No chart data available."
        );

        return;

    }


    let minValue =
        Math.min(...allValues);


    let maxValue =
        Math.max(...allValues);


    if (minValue === maxValue) {

        minValue -= 1;

        maxValue += 1;

    }


    const range =
        maxValue - minValue;


    minValue =
        Math.floor(
            (minValue - range * 0.08)
        );


    maxValue =
        Math.ceil(
            (maxValue + range * 0.08)
        );


    /* =====================================================
       TITLE / AXIS LABEL
    ===================================================== */

    if (config.yLabel) {

        ctx.save();

        ctx.fillStyle =
            textColor;

        ctx.font =
            "600 11px Inter, Arial, sans-serif";

        ctx.fillText(
            config.yLabel,
            padding.left,
            20
        );

        ctx.restore();

    }


    /* =====================================================
       GRID
    ===================================================== */

    const gridLines = 5;


    ctx.lineWidth = 1;


    for (
        let i = 0;
        i <= gridLines;
        i++
    ) {

        const y =
            padding.top +
            (
                chartHeight /
                gridLines
            ) * i;


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
            gridColor;

        ctx.stroke();


        const value =
            maxValue -
            (
                (maxValue - minValue) /
                gridLines
            ) * i;


        ctx.fillStyle =
            textColor;

        ctx.font =
            "10px Inter, Arial, sans-serif";


        ctx.textAlign =
            "right";


        ctx.fillText(
            formatChartNumber(value),
            padding.left - 10,
            y + 3
        );

    }



    /* =====================================================
       X AXIS LABELS
    ===================================================== */

    ctx.textAlign =
        "center";


    ctx.fillStyle =
        textColor;


    ctx.font =
        "10px Inter, Arial, sans-serif";


    const labelStep =
        Math.max(
            1,
            Math.ceil(
                labels.length / 8
            )
        );


    labels.forEach(
        function (label, index) {

            if (
                index % labelStep !== 0 &&
                index !== labels.length - 1
            ) {
                return;
            }


            const x =
                getXPosition(
                    index,
                    labels.length,
                    padding.left,
                    chartWidth
                );


            ctx.fillText(
                String(label),
                x,
                height - 17
            );

        }
    );



    /* =====================================================
       DRAW DATA
    ===================================================== */

    datasets.forEach(
        function (dataset, datasetIndex) {

            const color =
                colors[
                    datasetIndex %
                    colors.length
                ];


            const points = [];


            dataset.data.forEach(
                function (value, index) {

                    if (
                        typeof value !== "number" ||
                        !Number.isFinite(value)
                    ) {
                        return;
                    }


                    const x =
                        getXPosition(
                            index,
                            labels.length,
                            padding.left,
                            chartWidth
                        );


                    const y =
                        getYPosition(
                            value,
                            minValue,
                            maxValue,
                            padding.top,
                            chartHeight
                        );


                    points.push({
                        x,
                        y
                    });

                }
            );


            if (points.length < 1) {
                return;
            }



            /* =================================================
               FILL
            ================================================= */

            if (dataset.fill) {

                const gradient =
                    ctx.createLinearGradient(
                        0,
                        padding.top,
                        0,
                        height - padding.bottom
                    );


                if (dark) {

                    gradient.addColorStop(
                        0,
                        hexToRGBA(color, 0.28)
                    );

                    gradient.addColorStop(
                        1,
                        hexToRGBA(color, 0.01)
                    );

                } else {

                    gradient.addColorStop(
                        0,
                        hexToRGBA(color, 0.20)
                    );

                    gradient.addColorStop(
                        1,
                        hexToRGBA(color, 0.01)
                    );

                }


                ctx.beginPath();


                drawSmoothPath(
                    ctx,
                    points
                );


                ctx.lineTo(
                    points[points.length - 1].x,
                    height - padding.bottom
                );


                ctx.lineTo(
                    points[0].x,
                    height - padding.bottom
                );


                ctx.closePath();


                ctx.fillStyle =
                    gradient;

                ctx.fill();

            }



            /* =================================================
               LINE
            ================================================= */

            ctx.beginPath();


            if (dataset.smooth) {

                drawSmoothPath(
                    ctx,
                    points
                );

            } else {

                points.forEach(
                    function (point, index) {

                        if (index === 0) {

                            ctx.moveTo(
                                point.x,
                                point.y
                            );

                        } else {

                            ctx.lineTo(
                                point.x,
                                point.y
                            );

                        }

                    }
                );

            }


            ctx.strokeStyle =
                color;

            ctx.lineWidth =
                dataset.lineWidth || 3;

            ctx.lineJoin =
                "round";

            ctx.lineCap =
                "round";

            ctx.stroke();



            /* =================================================
               END POINT
            ================================================= */

            const lastPoint =
                points[points.length - 1];


            ctx.beginPath();


            ctx.arc(
                lastPoint.x,
                lastPoint.y,
                4,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                color;

            ctx.fill();

        }
    );



    /* =====================================================
       LEGEND
    ===================================================== */

    drawLegend(
        ctx,
        datasets,
        colors,
        width,
        dark
    );

}



/* =========================================================
   SMOOTH LINE
========================================================= */

function drawSmoothPath(
    ctx,
    points
) {

    if (!points.length) {
        return;
    }


    ctx.moveTo(
        points[0].x,
        points[0].y
    );


    for (
        let i = 1;
        i < points.length;
        i++
    ) {

        const previous =
            points[i - 1];


        const current =
            points[i];


        const midpointX =
            (
                previous.x +
                current.x
            ) / 2;


        const midpointY =
            (
                previous.y +
                current.y
            ) / 2;


        ctx.quadraticCurveTo(
            previous.x,
            previous.y,
            midpointX,
            midpointY
        );

    }


    const last =
        points[points.length - 1];


    ctx.quadraticCurveTo(
        last.x,
        last.y,
        last.x,
        last.y
    );

}



/* =========================================================
   X POSITION
========================================================= */

function getXPosition(
    index,
    total,
    left,
    width
) {

    if (total <= 1) {

        return left;

    }


    return (
        left +
        (
            index /
            (total - 1)
        ) *
        width
    );

}



/* =========================================================
   Y POSITION
========================================================= */

function getYPosition(
    value,
    min,
    max,
    top,
    height
) {

    return (
        top +
        (
            (max - value) /
            (max - min)
        ) *
        height
    );

}



/* =========================================================
   LEGEND
========================================================= */

function drawLegend(
    ctx,
    datasets,
    colors,
    width,
    dark
) {

    const textColor =
        dark
            ? "#ffffff"
            : "#14231c";


    let currentX = 20;


    const legendY = 33;


    ctx.font =
        "600 10px Inter, Arial, sans-serif";


    datasets.forEach(
        function (dataset, index) {

            const color =
                colors[
                    index %
                    colors.length
                ];


            const label =
                dataset.label || "";


            const textWidth =
                ctx.measureText(
                    label
                ).width;


            const itemWidth =
                20 +
                textWidth +
                22;


            if (
                currentX +
                itemWidth >
                width
            ) {

                return;

            }


            /* Line */

            ctx.beginPath();


            ctx.moveTo(
                currentX,
                legendY
            );


            ctx.lineTo(
                currentX + 14,
                legendY
            );


            ctx.strokeStyle =
                color;

            ctx.lineWidth = 3;

            ctx.stroke();


            /* Text */

            ctx.fillStyle =
                textColor;


            ctx.textAlign =
                "left";


            ctx.fillText(
                label,
                currentX + 20,
                legendY + 4
            );


            currentX +=
                itemWidth;

        }
    );

}



/* =========================================================
   NUMBER FORMAT
========================================================= */

function formatChartNumber(value) {

    if (
        Number.isInteger(value)
    ) {

        return value.toString();

    }


    return value.toFixed(1);

}



/* =========================================================
   HEX TO RGBA
========================================================= */

function hexToRGBA(
    hex,
    alpha
) {

    const clean =
        hex.replace("#", "");


    const bigint =
        parseInt(
            clean,
            16
        );


    const r =
        (bigint >> 16) & 255;


    const g =
        (bigint >> 8) & 255;


    const b =
        bigint & 255;


    return (
        "rgba(" +
        r +
        "," +
        g +
        "," +
        b +
        "," +
        alpha +
        ")"
    );

}



/* =========================================================
   OFFLINE ERROR
========================================================= */

function drawOfflineError(
    canvas,
    message
) {

    const wrapper =
        canvas.parentElement;


    const rect =
        wrapper.getBoundingClientRect();


    const width =
        Math.max(
            rect.width,
            300
        );


    const height =
        Math.max(
            rect.height,
            250
        );


    const dpr =
        window.devicePixelRatio || 1;


    canvas.width =
        width * dpr;


    canvas.height =
        height * dpr;


    canvas.style.width =
        width + "px";


    canvas.style.height =
        height + "px";


    const ctx =
        canvas.getContext("2d");


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    ctx.fillStyle =
        "#64736b";


    ctx.font =
        "600 14px Inter, Arial, sans-serif";


    ctx.textAlign =
        "center";


    ctx.fillText(
        message,
        width / 2,
        height / 2
    );

}



/* =========================================================
   REDRAW CHARTS WHEN WINDOW RESIZES
========================================================= */

let resizeTimer;


window.addEventListener(
    "resize",
    function () {

        clearTimeout(resizeTimer);


        resizeTimer =
            setTimeout(
                function () {

                    initializeOfflineCharts();

                },
                150
            );

    }
);
