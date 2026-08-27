/* =========================================================
   SAFE ENERGY
   MASTER JAVASCRIPT
   OFFLINE VERSION

   FEATURES
   ---------------------------------------------------------
   Navigation
   Navbar scroll
   Reveal animation
   Active navigation
   Offline energy charts
   Interactive yearly tooltip
   Hover guide line
   Responsive canvas charts
========================================================= */


/* =========================================================
   01. GLOBAL ENERGY DATA
========================================================= */

const ENERGY_DATA = {

    years: [
        2000, 2001, 2002, 2003, 2004, 2005,
        2006, 2007, 2008, 2009, 2010, 2011,
        2012, 2013, 2014, 2015, 2016, 2017,
        2018, 2019, 2020, 2021, 2022, 2023
    ],


    renewable: [
        6.6, 6.7, 6.8, 6.9, 7.1, 7.3,
        7.5, 7.8, 8.0, 8.2, 8.5, 8.8,
        9.2, 9.6, 10.0, 10.5, 11.0, 11.6,
        12.2, 12.8, 13.5, 14.4, 15.3, 16.2
    ],


    fossil: [
        80.2, 80.0, 79.8, 79.6, 79.4, 79.2,
        79.0, 78.8, 78.2, 77.8, 77.2, 76.8,
        76.3, 75.8, 75.2, 74.7, 74.0, 73.4,
        72.8, 72.1, 70.5, 71.4, 70.2, 69.1
    ],


    consumption: [
        105, 106, 108, 111, 115, 119,
        122, 126, 127, 123, 131, 134,
        136, 139, 141, 144, 147, 150,
        154, 156, 150, 157, 162, 165
    ],


    electricityRenewable: [
        19.0, 19.2, 19.5, 19.7, 20.0, 20.3,
        20.7, 21.0, 21.5, 22.0, 22.5, 23.0,
        23.7, 24.5, 25.3, 26.2, 27.0, 28.0,
        29.0, 30.0, 31.5, 33.0, 34.5, 36.0
    ],


    electricityFossil: [
        65.0, 64.8, 64.5, 64.3, 64.0, 63.7,
        63.2, 62.8, 62.0, 61.5, 60.5, 59.8,
        59.0, 58.2, 57.5, 56.5, 55.5, 54.5,
        53.5, 52.5, 51.0, 49.8, 48.0, 46.5
    ],


    electricityNuclear: [
        16.0, 16.0, 16.0, 16.0, 16.0, 16.0,
        15.8, 15.7, 15.5, 15.3, 15.0, 14.7,
        14.3, 14.0, 13.7, 13.3, 13.0, 12.5,
        12.0, 11.5, 11.0, 10.8, 10.5, 10.2
    ]

};



/* =========================================================
   02. PAGE INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeNavigation();

        initializeNavbar();

        initializeRevealAnimations();

        initializeActiveNavigation();

        initializeOfflineCharts();

    }
);



/* =========================================================
   03. MOBILE NAVIGATION
========================================================= */

function initializeNavigation() {

    const menuDots =
        document.getElementById("menuDots");

    const navMenu =
        document.getElementById("navMenu");


    if (!menuDots || !navMenu) {
        return;
    }


    menuDots.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();


            const isOpen =
                navMenu.classList.toggle("open");


            menuDots.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

        }
    );


    navMenu
        .querySelectorAll("a")
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        navMenu.classList.remove(
                            "open"
                        );


                        menuDots.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );

            }
        );


    document.addEventListener(
        "click",
        function (event) {

            if (
                !navMenu.contains(event.target) &&
                !menuDots.contains(event.target)
            ) {

                navMenu.classList.remove(
                    "open"
                );


                menuDots.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                navMenu.classList.remove(
                    "open"
                );


                menuDots.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}



/* =========================================================
   04. NAVBAR SCROLL
========================================================= */

function initializeNavbar() {

    const navbar =
        document.getElementById("navbar");


    if (!navbar) {
        return;
    }


    function updateNavbar() {

        if (window.scrollY > 30) {

            navbar.classList.add(
                "scrolled"
            );

        } else {

            navbar.classList.remove(
                "scrolled"
            );

        }

    }


    updateNavbar();


    window.addEventListener(
        "scroll",
        updateNavbar,
        {
            passive: true
        }
    );

}



/* =========================================================
   05. REVEAL ANIMATIONS
========================================================= */

function initializeRevealAnimations() {

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


    if (!animatedElements.length) {
        return;
    }


    if (
        !("IntersectionObserver" in window)
    ) {

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

        return;

    }


    animatedElements.forEach(
        function (element) {

            element.classList.remove(
                "show"
            );

            element.classList.add(
                "reveal"
            );

        }
    );


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

}



/* =========================================================
   06. ACTIVE NAVIGATION
========================================================= */

function initializeActiveNavigation() {

    let currentPage =
        window.location.pathname
            .split("/")
            .pop();


    if (!currentPage) {

        currentPage =
            "index.html";

    }


    document
        .querySelectorAll(".nav-menu a")
        .forEach(
            function (link) {

                const linkPage =
                    link.getAttribute("href");


                if (
                    linkPage === currentPage
                ) {

                    link.classList.add(
                        "active"
                    );

                } else {

                    link.classList.remove(
                        "active"
                    );

                }

            }
        );

}



/* =========================================================
   07. INITIALIZE OFFLINE CHARTS
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


    /* =====================================================
       GRAPH 1
    ===================================================== */

    if (chart1) {

        drawLineChart(
            chart1,
            {

                labels:
                    ENERGY_DATA.years,


                datasets: [

                    {
                        label:
                            "Renewable Energy",

                        data:
                            ENERGY_DATA.renewable,

                        lineWidth:
                            4,

                        fill:
                            false,

                        smooth:
                            true

                    },


                    {
                        label:
                            "Fossil Fuels",

                        data:
                            ENERGY_DATA.fossil,

                        lineWidth:
                            4,

                        fill:
                            false,

                        smooth:
                            true

                    }

                ],


                dark:
                    true,


                yLabel:
                    "Share (%)"

            }
        );

    }



    /* =====================================================
       GRAPH 2
    ===================================================== */

    if (chart2) {

        drawLineChart(
            chart2,
            {

                labels:
                    ENERGY_DATA.years,


                datasets: [

                    {
                        label:
                            "Global Primary Energy",

                        data:
                            ENERGY_DATA.consumption,

                        lineWidth:
                            4,

                        fill:
                            true,

                        smooth:
                            true

                    }

                ],


                dark:
                    false,


                yLabel:
                    "Energy use"

            }
        );

    }



    /* =====================================================
       GRAPH 3
    ===================================================== */

    if (chart3) {

        drawLineChart(
            chart3,
            {

                labels:
                    ENERGY_DATA.years,


                datasets: [

                    {
                        label:
                            "Renewable",

                        data:
                            ENERGY_DATA
                                .electricityRenewable,

                        lineWidth:
                            4,

                        fill:
                            true,

                        smooth:
                            true

                    },


                    {
                        label:
                            "Fossil Fuels",

                        data:
                            ENERGY_DATA
                                .electricityFossil,

                        lineWidth:
                            4,

                        fill:
                            true,

                        smooth:
                            true

                    },


                    {
                        label:
                            "Nuclear",

                        data:
                            ENERGY_DATA
                                .electricityNuclear,

                        lineWidth:
                            4,

                        fill:
                            true,

                        smooth:
                            true

                    }

                ],


                dark:
                    false,


                yLabel:
                    "Share (%)"

            }
        );

    }

}



/* =========================================================
   08. DRAW LINE CHART
========================================================= */

function drawLineChart(
    canvas,
    config
) {

    if (!canvas) {
        return;
    }


    const wrapper =
        canvas.parentElement;


    if (!wrapper) {
        return;
    }


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


    if (!ctx) {
        return;
    }


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
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
            ? "rgba(255,255,255,.76)"
            : "#52635a";


    const gridColor =
        dark
            ? "rgba(255,255,255,.10)"
            : "rgba(0,0,0,.08)";


    const colors = [

        "#42c978",

        "#777777",

        "#426ab1"

    ];


    const padding = {

        top: 65,

        right: 35,

        bottom: 55,

        left: 62

    };


    const chartWidth =
        Math.max(
            width -
            padding.left -
            padding.right,
            100
        );


    const chartHeight =
        Math.max(
            height -
            padding.top -
            padding.bottom,
            100
        );


    const labels =
        config.labels;


    const datasets =
        config.datasets;


    let allValues = [];


    datasets.forEach(
        function (dataset) {

            dataset.data.forEach(
                function (value) {

                    if (
                        typeof value === "number" &&
                        Number.isFinite(value)
                    ) {

                        allValues.push(value);

                    }

                }
            );

        }
    );


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


    if (
        minValue === maxValue
    ) {

        minValue -= 1;

        maxValue += 1;

    }


    const range =
        maxValue - minValue;


    minValue =
        Math.floor(
            minValue -
            range * 0.08
        );


    maxValue =
        Math.ceil(
            maxValue +
            range * 0.08
        );



    /* =====================================================
       Y AXIS TITLE
    ===================================================== */

    if (config.yLabel) {

        ctx.save();


        ctx.fillStyle =
            textColor;


        ctx.font =
            "800 11px Inter, Arial, sans-serif";


        ctx.fillText(
            config.yLabel,
            padding.left,
            20
        );


        ctx.restore();

    }



    /* =====================================================
       GRID LINES
    ===================================================== */

    const gridLines = 5;


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


        ctx.lineWidth =
            1;


        ctx.stroke();


        const value =
            maxValue -
            (
                (
                    maxValue -
                    minValue
                ) /
                gridLines
            ) * i;


        ctx.fillStyle =
            textColor;


        ctx.font =
            "600 10px Inter, Arial, sans-serif";


        ctx.textAlign =
            "right";


        ctx.fillText(
            formatChartNumber(value),
            padding.left - 10,
            y + 3
        );

    }



    /* =====================================================
       X AXIS YEAR LABELS
    ===================================================== */

    ctx.textAlign =
        "center";


    ctx.fillStyle =
        textColor;


    ctx.font =
        "700 10px Inter, Arial, sans-serif";


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
                height - 20
            );

        }
    );



    /* =====================================================
       DRAW DATA
    ===================================================== */

    datasets.forEach(
        function (
            dataset,
            datasetIndex
        ) {

            const color =
                colors[
                    datasetIndex %
                    colors.length
                ];


            const points = [];


            dataset.data.forEach(
                function (
                    value,
                    index
                ) {

                    if (
                        typeof value !== "number" ||
                        !Number.isFinite(value)
                    ) {

                        points.push(null);

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
                        x: x,
                        y: y,
                        value: value,
                        index: index
                    });

                }
            );


            const validPoints =
                points.filter(
                    function (point) {
                        return point !== null;
                    }
                );


            if (!validPoints.length) {
                return;
            }



            /* =================================================
               AREA FILL
            ================================================= */

            if (
                dataset.fill &&
                validPoints.length > 1
            ) {

                const gradient =
                    ctx.createLinearGradient(
                        0,
                        padding.top,
                        0,
                        height -
                        padding.bottom
                    );


                gradient.addColorStop(
                    0,
                    hexToRGBA(
                        color,
                        dark ? 0.25 : 0.16
                    )
                );


                gradient.addColorStop(
                    1,
                    hexToRGBA(
                        color,
                        0.01
                    )
                );


                ctx.beginPath();


                drawSmoothPath(
                    ctx,
                    validPoints
                );


                ctx.lineTo(
                    validPoints[
                        validPoints.length - 1
                    ].x,
                    height -
                    padding.bottom
                );


                ctx.lineTo(
                    validPoints[0].x,
                    height -
                    padding.bottom
                );


                ctx.closePath();


                ctx.fillStyle =
                    gradient;


                ctx.fill();

            }



            /* =================================================
               MAIN LINE
            ================================================= */

            ctx.beginPath();


            if (dataset.smooth) {

                drawSmoothPath(
                    ctx,
                    validPoints
                );

            } else {

                validPoints.forEach(
                    function (
                        point,
                        index
                    ) {

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
                dataset.lineWidth || 4;


            ctx.lineJoin =
                "round";


            ctx.lineCap =
                "round";


            ctx.stroke();



            /* =================================================
               DATA POINTS
            ================================================= */

            validPoints.forEach(
                function (point) {

                    ctx.beginPath();


                    ctx.arc(
                        point.x,
                        point.y,
                        2.5,
                        0,
                        Math.PI * 2
                    );


                    ctx.fillStyle =
                        color;


                    ctx.fill();

                }
            );

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



    /* =====================================================
       INTERACTIVE TOOLTIP
    ===================================================== */

    enableChartInteraction(
        canvas,
        config,
        {
            padding:
                padding,

            chartWidth:
                chartWidth,

            chartHeight:
                chartHeight,

            minValue:
                minValue,

            maxValue:
                maxValue,

            colors:
                colors,

            dark:
                dark,

            width:
                width,

            height:
                height

        }
    );

}



/* =========================================================
   09. INTERACTIVE CHART
========================================================= */

function enableChartInteraction(
    canvas,
    config,
    chartInfo
) {

    const wrapper =
        canvas.parentElement;


    if (!wrapper) {
        return;
    }


    /* Remove old tooltip */

    const oldTooltip =
        wrapper.querySelector(
            ".energy-chart-tooltip"
        );


    if (oldTooltip) {

        oldTooltip.remove();

    }


    /* =====================================================
       CREATE TOOLTIP
    ===================================================== */

    const tooltip =
        document.createElement("div");


    tooltip.className =
        "energy-chart-tooltip";


    tooltip.style.position =
        "absolute";


    tooltip.style.pointerEvents =
        "none";


    tooltip.style.zIndex =
        "50";


    tooltip.style.minWidth =
        "170px";


    tooltip.style.maxWidth =
        "230px";


    tooltip.style.padding =
        "14px 16px";


    tooltip.style.borderRadius =
        "12px";


    tooltip.style.background =
        chartInfo.dark
            ? "rgba(15,25,20,.96)"
            : "rgba(255,255,255,.97)";


    tooltip.style.color =
        chartInfo.dark
            ? "#ffffff"
            : "#14231c";


    tooltip.style.border =
        chartInfo.dark
            ? "1px solid rgba(255,255,255,.12)"
            : "1px solid rgba(0,0,0,.08)";


    tooltip.style.boxShadow =
        "0 12px 35px rgba(0,0,0,.18)";


    tooltip.style.fontFamily =
        "Inter, Arial, sans-serif";


    tooltip.style.opacity =
        "0";


    tooltip.style.transform =
        "translateY(5px)";


    tooltip.style.transition =
        "opacity .15s ease, transform .15s ease";


    wrapper.style.position =
        "relative";


    wrapper.appendChild(
        tooltip
    );



    /* =====================================================
       FIND YEAR FROM MOUSE
    ===================================================== */

    function getMousePosition(event) {

        const rect =
            canvas.getBoundingClientRect();


        const x =
            event.clientX -
            rect.left;


        const y =
            event.clientY -
            rect.top;


        return {
            x: x,
            y: y
        };

    }



    function getClosestIndex(mouseX) {

        const total =
            config.labels.length;


        if (total <= 1) {
            return 0;
        }


        const rawIndex =
            (
                mouseX -
                chartInfo.padding.left
            ) /
            chartInfo.chartWidth *
            (
                total - 1
            );


        return Math.max(
            0,
            Math.min(
                total - 1,
                Math.round(rawIndex)
            )
        );

    }



    /* =====================================================
       MOUSE MOVE
    ===================================================== */

    canvas.addEventListener(
        "mousemove",
        function (event) {

            const mouse =
                getMousePosition(event);


            const index =
                getClosestIndex(
                    mouse.x
                );


            const x =
                getXPosition(
                    index,
                    config.labels.length,
                    chartInfo.padding.left,
                    chartInfo.chartWidth
                );


            /* Only activate inside chart */

            if (
                x <
                chartInfo.padding.left - 10 ||
                x >
                chartInfo.width -
                chartInfo.padding.right + 10
            ) {

                hideChartTooltip();

                return;

            }


            showChartTooltip(
                tooltip,
                config,
                index,
                x,
                mouse.y,
                wrapper,
                chartInfo
            );

        }
    );



    /* =====================================================
       TOUCH SUPPORT
    ===================================================== */

    canvas.addEventListener(
        "touchstart",
        function (event) {

            if (
                !event.touches ||
                !event.touches.length
            ) {
                return;
            }


            const touch =
                event.touches[0];


            const rect =
                canvas.getBoundingClientRect();


            const x =
                touch.clientX -
                rect.left;


            const index =
                getClosestIndex(x);


            const pointX =
                getXPosition(
                    index,
                    config.labels.length,
                    chartInfo.padding.left,
                    chartInfo.chartWidth
                );


            showChartTooltip(
                tooltip,
                config,
                index,
                pointX,
                100,
                wrapper,
                chartInfo
            );

        },
        {
            passive: true
        }
    );



    /* =====================================================
       MOUSE LEAVE
    ===================================================== */

    canvas.addEventListener(
        "mouseleave",
        function () {

            hideChartTooltip();

        }
    );



    function hideChartTooltip() {

        tooltip.style.opacity =
            "0";


        tooltip.style.transform =
            "translateY(5px)";

    }

}



/* =========================================================
   10. SHOW TOOLTIP
========================================================= */

function showChartTooltip(
    tooltip,
    config,
    index,
    x,
    mouseY,
    wrapper,
    chartInfo
) {

    const year =
        config.labels[index];


    let html =
        "<div style=\"" +
        "font-size:16px;" +
        "font-weight:900;" +
        "margin-bottom:9px;" +
        "\">" +
        year +
        "</div>";


    config.datasets.forEach(
        function (
            dataset,
            datasetIndex
        ) {

            const value =
                dataset.data[index];


            if (
                typeof value !== "number" ||
                !Number.isFinite(value)
            ) {
                return;
            }


            const color =
                chartInfo.colors[
                    datasetIndex %
                    chartInfo.colors.length
                ];


            html +=
                "<div style=\"" +
                "display:flex;" +
                "align-items:center;" +
                "gap:8px;" +
                "margin:6px 0;" +
                "font-size:12px;" +
                "\">";


            html +=
                "<span style=\"" +
                "width:9px;" +
                "height:9px;" +
                "border-radius:50%;" +
                "background:" +
                color +
                ";" +
                "display:inline-block;" +
                "flex-shrink:0;" +
                "\"></span>";


            html +=
                "<span style=\"" +
                "font-weight:600;" +
                "flex:1;" +
                "\">" +
                dataset.label +
                "</span>";


            html +=
                "<strong style=\"" +
                "font-weight:900;" +
                "\">" +
                formatTooltipValue(value) +
                "</strong>";


            html +=
                "</div>";

        }
    );


    tooltip.innerHTML =
        html;


    const wrapperWidth =
        wrapper.clientWidth;


    const tooltipWidth =
        tooltip.offsetWidth ||
        190;


    let tooltipLeft =
        x + 15;


    if (
        tooltipLeft +
        tooltipWidth >
        wrapperWidth - 10
    ) {

        tooltipLeft =
            x -
            tooltipWidth -
            15;

    }


    tooltipLeft =
        Math.max(
            8,
            tooltipLeft
        );


    let tooltipTop =
        mouseY - 50;


    tooltipTop =
        Math.max(
            8,
            tooltipTop
        );


    tooltip.style.left =
        tooltipLeft + "px";


    tooltip.style.top =
        tooltipTop + "px";


    tooltip.style.opacity =
        "1";


    tooltip.style.transform =
        "translateY(0)";

}



/* =========================================================
   11. TOOLTIP NUMBER
========================================================= */

function formatTooltipValue(value) {

    if (
        Number.isInteger(value)
    ) {

        return value.toLocaleString();

    }


    return value.toFixed(1);

}



/* =========================================================
   12. SMOOTH PATH
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
        points[
            points.length - 1
        ];


    ctx.quadraticCurveTo(
        last.x,
        last.y,
        last.x,
        last.y
    );

}



/* =========================================================
   13. X POSITION
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
   14. Y POSITION
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
   15. LEGEND
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


    let currentX =
        20;


    const legendY =
        43;


    ctx.font =
        "800 10px Inter, Arial, sans-serif";


    datasets.forEach(
        function (
            dataset,
            index
        ) {

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
                width - 10
            ) {

                return;

            }


            /* Legend line */

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


            ctx.lineWidth =
                4;


            ctx.lineCap =
                "round";


            ctx.stroke();


            /* Legend text */

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
   16. NUMBER FORMAT
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
   17. HEX TO RGBA
========================================================= */

function hexToRGBA(
    hex,
    alpha
) {

    const clean =
        hex.replace(
            "#",
            ""
        );


    const bigint =
        parseInt(
            clean,
            16
        );


    const r =
        (
            bigint >>
            16
        ) & 255;


    const g =
        (
            bigint >>
            8
        ) & 255;


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
   18. OFFLINE ERROR
========================================================= */

function drawOfflineError(
    canvas,
    message
) {

    const wrapper =
        canvas.parentElement;


    if (!wrapper) {
        return;
    }


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
        "800 14px Inter, Arial, sans-serif";


    ctx.textAlign =
        "center";


    ctx.fillText(
        message,
        width / 2,
        height / 2
    );

}



/* =========================================================
   19. REDRAW ON WINDOW RESIZE
========================================================= */

let resizeTimer;


window.addEventListener(
    "resize",
    function () {

        clearTimeout(
            resizeTimer
        );


        resizeTimer =
            setTimeout(
                function () {

                    initializeOfflineCharts();

                },
                200
            );

    }
);
