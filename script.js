/* =========================================================
   SAFE ENERGY
   MASTER JAVASCRIPT
   LIVE OUR WORLD IN DATA VERSION

   - Mobile navigation
   - Navbar scroll
   - Reveal animation
   - Active navigation
   - Live OWID energy data
   - Year-by-year tooltip
   - Responsive canvas charts
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

        navMenu.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                navMenu.classList.remove("open");

                menuDots.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

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

                    entries.forEach(function (entry) {

                        if (entry.isIntersecting) {

                            entry.target
                                .classList
                                .add("show");

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.05
                }
            );

        animatedElements.forEach(function (element) {
            observer.observe(element);
        });

    } else {

        animatedElements.forEach(function (element) {

            element.classList.remove("reveal");
            element.classList.add("show");

        });

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
                    navMenu.classList.remove("open");
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
       07. LIVE ENERGY CHARTS
    ===================================================== */

    initializeLiveEnergyCharts();

});


/* =========================================================
   OUR WORLD IN DATA
   LIVE DATA CONFIGURATION
========================================================= */

const OWID_BASE =
    "https://ourworldindata.org/grapher/";


/*
    Chart slugs used by the website.

    The script downloads the CSV directly from OWID.

    No manually embedded data.
    No offline dataset.
*/

const OWID_CHARTS = {

    renewableFossil:
        "share-energy-source-substitute",

    consumption:
        "primary-energy-consumption",

    electricity:
        "electricity-prod-source-stacked"

};


/* =========================================================
   INITIALIZE LIVE CHARTS
========================================================= */

async function initializeLiveEnergyCharts() {

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


    /*
        If this is not the Energy Data page,
        stop here.

        Therefore Home will NOT get charts.
    */

    if (!chart1 && !chart2 && !chart3) {
        return;
    }


    /*
        Show loading state
    */

    [chart1, chart2, chart3]
        .filter(Boolean)
        .forEach(function (canvas) {

            showChartLoading(canvas);

        });


    try {

        /*
            Load all required datasets.
        */

        const [
            renewableFossilData,
            consumptionData,
            electricityData
        ] = await Promise.all([

            loadOWIDCSV(
                OWID_CHARTS.renewableFossil
            ),

            loadOWIDCSV(
                OWID_CHARTS.consumption
            ),

            loadOWIDCSV(
                OWID_CHARTS.electricity
            )

        ]);


        /*
            GRAPH 1
            Renewable vs Fossil
        */

        if (chart1) {

            const prepared =
                prepareRenewableFossilData(
                    renewableFossilData
                );

            drawInteractiveLineChart(
                chart1,
                {
                    labels: prepared.years,

                    datasets: prepared.datasets,

                    yLabel: prepared.unit || "%",

                    dark: true
                }
            );

        }


        /*
            GRAPH 2
            Global primary energy consumption
        */

        if (chart2) {

            const prepared =
                prepareConsumptionData(
                    consumptionData
                );

            drawInteractiveLineChart(
                chart2,
                {
                    labels: prepared.years,

                    datasets: prepared.datasets,

                    yLabel:
                        prepared.unit ||
                        "Energy",

                    dark: false
                }
            );

        }


        /*
            GRAPH 3
            Electricity generation
        */

        if (chart3) {

            const prepared =
                prepareElectricityData(
                    electricityData
                );

            drawInteractiveLineChart(
                chart3,
                {
                    labels: prepared.years,

                    datasets: prepared.datasets,

                    yLabel:
                        prepared.unit ||
                        "%",

                    dark: false
                }
            );

        }

    } catch (error) {

        console.error(
            "OWID energy data error:",
            error
        );


        [chart1, chart2, chart3]
            .filter(Boolean)
            .forEach(function (canvas) {

                drawOfflineError(
                    canvas,
                    "Unable to load live energy data."
                );

            });

    }

}


/* =========================================================
   LOAD OWID CSV
========================================================= */

async function loadOWIDCSV(slug) {

    const url =
        OWID_BASE +
        slug +
        ".csv?csvType=filtered&country=~OWID_WRL";


    const response =
        await fetch(url);


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


/* =========================================================
   CSV PARSER
========================================================= */

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


        if (char === '"' && next === '"') {

            value += '"';

            i++;

            continue;

        }


        if (char === '"') {

            insideQuotes =
                !insideQuotes;

            continue;

        }


        if (
            char === "," &&
            !insideQuotes
        ) {

            row.push(value);

            value = "";

            continue;

        }


        if (
            (
                char === "\n" ||
                char === "\r"
            ) &&
            !insideQuotes
        ) {

            if (
                char === "\r" &&
                next === "\n"
            ) {

                i++;

            }


            row.push(value);

            value = "";


            if (row.some(function (cell) {
                return cell.trim() !== "";
            })) {

                rows.push(row);

            }


            row = [];

            continue;

        }


        value += char;

    }


    if (value !== "" || row.length) {

        row.push(value);

        rows.push(row);

    }


    if (!rows.length) {
        return [];
    }


    const headers =
        rows[0].map(function (header) {

            return header.trim();

        });


    return rows
        .slice(1)
        .map(function (cells) {

            const object = {};

            headers.forEach(
                function (header, index) {

                    object[header] =
                        cells[index] !== undefined
                            ? cells[index].trim()
                            : "";

                }
            );

            return object;

        });

}


/* =========================================================
   FIND COLUMN
========================================================= */

function findColumn(row, keywords) {

    const columns =
        Object.keys(row);


    for (
        let i = 0;
        i < keywords.length;
        i++
    ) {

        const keyword =
            keywords[i].toLowerCase();


        const exact =
            columns.find(function (column) {

                return column
                    .toLowerCase()
                    === keyword;

            });


        if (exact) {
            return exact;
        }


        const partial =
            columns.find(function (column) {

                return column
                    .toLowerCase()
                    .includes(keyword);

            });


        if (partial) {
            return partial;
        }

    }


    return null;

}


/* =========================================================
   WORLD FILTER
========================================================= */

function filterWorld(data) {

    return data.filter(function (row) {

        const entity =
            String(
                row.Entity || ""
            ).toLowerCase();


        const code =
            String(
                row.Code || ""
            ).toUpperCase();


        return (
            entity === "world" ||
            code === "OWID_WRL"
        );

    });

}


/* =========================================================
   GRAPH 1
   RENEWABLE VS FOSSIL
========================================================= */

function prepareRenewableFossilData(data) {

    const world =
        filterWorld(data);


    if (!world.length) {

        throw new Error(
            "World energy data not found."
        );

    }


    const first =
        world[0];


    const columns =
        Object.keys(first);


    const renewableColumn =
        columns.find(function (column) {

            const name =
                column.toLowerCase();

            return (
                name.includes("renewable") &&
                (
                    name.includes("share") ||
                    name.includes("%")
                )
            );

        });


    const fossilColumn =
        columns.find(function (column) {

            const name =
                column.toLowerCase();

            return (
                (
                    name.includes("fossil") ||
                    name.includes("fossil fuels")
                ) &&
                (
                    name.includes("share") ||
                    name.includes("%")
                )
            );

        });


    /*
        If the selected chart doesn't contain
        the expected columns, use its first
        available numeric columns.
    */

    const numericColumns =
        columns.filter(function (column) {

            if (
                column === "Entity" ||
                column === "Code" ||
                column === "Year"
            ) {

                return false;

            }


            return world.some(function (row) {

                return Number.isFinite(
                    Number(row[column])
                );

            });

        });


    const renewable =
        renewableColumn ||
        numericColumns[0];


    const fossil =
        fossilColumn ||
        numericColumns[1];


    if (!renewable || !fossil) {

        throw new Error(
            "Renewable/fossil columns unavailable."
        );

    }


    const years = [];

    const renewableValues = [];

    const fossilValues = [];


    world.forEach(function (row) {

        const year =
            Number(row.Year);

        const renewableValue =
            Number(row[renewable]);

        const fossilValue =
            Number(row[fossil]);


        if (
            Number.isFinite(year) &&
            Number.isFinite(renewableValue) &&
            Number.isFinite(fossilValue)
        ) {

            years.push(year);

            renewableValues.push(
                renewableValue
            );

            fossilValues.push(
                fossilValue
            );

        }

    });


    return {

        years,

        unit: "%",

        datasets: [

            {
                label:
                    "Renewable Energy",

                data:
                    renewableValues,

                lineWidth:
                    4,

                smooth:
                    true,

                fill:
                    false
            },

            {
                label:
                    "Fossil Fuels",

                data:
                    fossilValues,

                lineWidth:
                    4,

                smooth:
                    true,

                fill:
                    false
            }

        ]

    };

}


/* =========================================================
   GRAPH 2
   GLOBAL PRIMARY ENERGY
========================================================= */

function prepareConsumptionData(data) {

    const world =
        filterWorld(data);


    if (!world.length) {

        throw new Error(
            "Global consumption data not found."
        );

    }


    const first =
        world[0];


    const valueColumn =
        findColumn(
            first,
            [
                "Primary energy consumption",
                "primary energy",
                "Energy consumption"
            ]
        );


    if (!valueColumn) {

        throw new Error(
            "Energy consumption column unavailable."
        );

    }


    const years = [];

    const values = [];


    world.forEach(function (row) {

        const year =
            Number(row.Year);

        const value =
            Number(row[valueColumn]);


        if (
            Number.isFinite(year) &&
            Number.isFinite(value)
        ) {

            years.push(year);

            values.push(value);

        }

    });


    return {

        years,

        unit:
            "Energy",

        datasets: [

            {
                label:
                    "Global Primary Energy",

                data:
                    values,

                lineWidth:
                    4,

                smooth:
                    true,

                fill:
                    true
            }

        ]

    };

}


/* =========================================================
   GRAPH 3
   ELECTRICITY SOURCES
========================================================= */

function prepareElectricityData(data) {

    const world =
        filterWorld(data);


    if (!world.length) {

        throw new Error(
            "Electricity data not found."
        );

    }


    const first =
        world[0];


    const columns =
        Object.keys(first);


    const renewableColumn =
        columns.find(function (column) {

            const name =
                column.toLowerCase();

            return (
                name.includes("renewable") &&
                (
                    name.includes("share") ||
                    name.includes("%")
                )
            );

        });


    const fossilColumn =
        columns.find(function (column) {

            const name =
                column.toLowerCase();

            return (
                name.includes("fossil") &&
                (
                    name.includes("share") ||
                    name.includes("%")
                )
            );

        });


    const nuclearColumn =
        columns.find(function (column) {

            const name =
                column.toLowerCase();

            return (
                name.includes("nuclear") &&
                (
                    name.includes("share") ||
                    name.includes("%")
                )
            );

        });


    const numericColumns =
        columns.filter(function (column) {

            if (
                column === "Entity" ||
                column === "Code" ||
                column === "Year"
            ) {

                return false;

            }


            return world.some(function (row) {

                return Number.isFinite(
                    Number(row[column])
                );

            });

        });


    const renewable =
        renewableColumn ||
        numericColumns[0];


    const fossil =
        fossilColumn ||
        numericColumns[1];


    const nuclear =
        nuclearColumn ||
        numericColumns[2];


    if (
        !renewable ||
        !fossil ||
        !nuclear
    ) {

        throw new Error(
            "Electricity source columns unavailable."
        );

    }


    const years = [];

    const renewableValues = [];

    const fossilValues = [];

    const nuclearValues = [];


    world.forEach(function (row) {

        const year =
            Number(row.Year);

        const r =
            Number(row[renewable]);

        const f =
            Number(row[fossil]);

        const n =
            Number(row[nuclear]);


        if (
            Number.isFinite(year) &&
            Number.isFinite(r) &&
            Number.isFinite(f) &&
            Number.isFinite(n)
        ) {

            years.push(year);

            renewableValues.push(r);

            fossilValues.push(f);

            nuclearValues.push(n);

        }

    });


    return {

        years,

        unit:
            "%",

        datasets: [

            {
                label:
                    "Renewable",

                data:
                    renewableValues,

                lineWidth:
                    4,

                smooth:
                    true,

                fill:
                    false
            },

            {
                label:
                    "Fossil Fuels",

                data:
                    fossilValues,

                lineWidth:
                    4,

                smooth:
                    true,

                fill:
                    false
            },

            {
                label:
                    "Nuclear",

                data:
                    nuclearValues,

                lineWidth:
                    4,

                smooth:
                    true,

                fill:
                    false
            }

        ]

    };

}


/* =========================================================
   INTERACTIVE CANVAS CHART
========================================================= */

function drawInteractiveLineChart(
    canvas,
    config
) {

    if (!canvas) return;


    const wrapper =
        canvas.parentElement;


    if (!wrapper) return;


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
            280
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
            ? "rgba(255,255,255,.78)"
            : "#52635b";


    const strongText =
        dark
            ? "#ffffff"
            : "#14231c";


    const gridColor =
        dark
            ? "rgba(255,255,255,.10)"
            : "rgba(20,35,28,.08)";


    const colors = [
        "#38c878",
        "#777777",
        "#426ab1"
    ];


    const padding = {

        top: 65,

        right: 35,

        bottom: 55,

        left: 65

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
            "No data available."
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

    ctx.fillStyle =
        textColor;


    ctx.font =
        "800 12px Inter, Arial, sans-serif";


    ctx.textAlign =
        "left";


    ctx.fillText(
        config.yLabel || "",
        padding.left,
        22
    );


    /* =====================================================
       GRID
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
            width -
            padding.right,
            y
        );


        ctx.strokeStyle =
            gridColor;

        ctx.lineWidth = 1;

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
            "700 10px Inter, Arial, sans-serif";


        ctx.textAlign =
            "right";


        ctx.fillText(
            formatChartNumber(value),
            padding.left - 10,
            y + 4
        );

    }


    /* =====================================================
       X AXIS YEARS
    ===================================================== */

    ctx.fillStyle =
        textColor;


    ctx.font =
        "700 10px Inter, Arial, sans-serif";


    ctx.textAlign =
        "center";


    const labelStep =
        Math.max(
            1,
            Math.ceil(
                labels.length / 8
            )
        );


    labels.forEach(function (label, index) {

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

    });


    /* =====================================================
       DATA POINT STORAGE
       Used by tooltip.
    ===================================================== */

    const chartPoints = [];


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
                        y,
                        value,
                        year:
                            labels[index]
                    });

                }
            );


            chartPoints.push({
                dataset,
                color,
                points
            });


            if (!points.length) {
                return;
            }


            /* =================================================
               AREA FILL
            ================================================= */

            if (dataset.fill) {

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
                        0.20
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
                    points
                );


                ctx.lineTo(
                    points[
                        points.length - 1
                    ].x,
                    height -
                    padding.bottom
                );


                ctx.lineTo(
                    points[0].x,
                    height -
                    padding.bottom
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


            drawSmoothPath(
                ctx,
                points
            );


            ctx.strokeStyle =
                color;


            ctx.lineWidth =
                dataset.lineWidth ||
                4;


            ctx.lineJoin =
                "round";


            ctx.lineCap =
                "round";


            ctx.stroke();


            /* =================================================
               END POINT
            ================================================= */

            const lastPoint =
                points[
                    points.length - 1
                ];


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


    /* =====================================================
       TOOLTIP
    ===================================================== */

    setupChartTooltip(
        canvas,
        chartPoints,
        {
            padding,
            width,
            height,
            dark
        }
    );

}


/* =========================================================
   TOOLTIP
========================================================= */

function setupChartTooltip(
    canvas,
    chartPoints,
    config
) {

    /*
        Remove old tooltip.
    */

    const oldTooltip =
        canvas.parentElement.querySelector(
            ".energy-chart-tooltip"
        );


    if (oldTooltip) {
        oldTooltip.remove();
    }


    const tooltip =
        document.createElement("div");


    tooltip.className =
        "energy-chart-tooltip";


    tooltip.style.position =
        "absolute";


    tooltip.style.pointerEvents =
        "none";


    tooltip.style.display =
        "none";


    tooltip.style.zIndex =
        "50";


    tooltip.style.padding =
        "14px 16px";


    tooltip.style.borderRadius =
        "12px";


    tooltip.style.fontFamily =
        "Inter, Arial, sans-serif";


    tooltip.style.fontSize =
        "13px";


    tooltip.style.lineHeight =
        "1.6";


    tooltip.style.fontWeight =
        "700";


    tooltip.style.boxShadow =
        "0 12px 30px rgba(0,0,0,.20)";


    tooltip.style.backdropFilter =
        "blur(10px)";


    if (config.dark) {

        tooltip.style.background =
            "rgba(10,25,18,.95)";

        tooltip.style.color =
            "#ffffff";

    } else {

        tooltip.style.background =
            "rgba(255,255,255,.97)";

        tooltip.style.color =
            "#14231c";

    }


    const parent =
        canvas.parentElement;


    if (
        getComputedStyle(parent).position ===
        "static"
    ) {

        parent.style.position =
            "relative";

    }


    parent.appendChild(tooltip);


    function hideTooltip() {

        tooltip.style.display =
            "none";

        redrawHover(
            canvas,
            chartPoints,
            config,
            null
        );

    }


    canvas.addEventListener(
        "mousemove",
        function (event) {

            const rect =
                canvas.getBoundingClientRect();


            const mouseX =
                event.clientX -
                rect.left;


            const mouseY =
                event.clientY -
                rect.top;


            let closest =
                null;


            let closestDistance =
                Infinity;


            chartPoints.forEach(
                function (series) {

                    series.points.forEach(
                        function (point) {

                            const distance =
                                Math.sqrt(
                                    Math.pow(
                                        point.x -
                                        mouseX,
                                        2
                                    ) +
                                    Math.pow(
                                        point.y -
                                        mouseY,
                                        2
                                    )
                                );


                            if (
                                distance <
                                closestDistance
                            ) {

                                closest =
                                    {
                                        ...point,
                                        color:
                                            series.color,
                                        label:
                                            series.dataset.label
                                    };


                                closestDistance =
                                    distance;

                            }

                        }
                    );

                }
            );


            /*
                Only activate tooltip when
                cursor is reasonably close.
            */

            if (
                !closest ||
                closestDistance > 30
            ) {

                hideTooltip();

                return;

            }


            tooltip.innerHTML =

                "<div style=\"" +
                "font-size:15px;" +
                "font-weight:900;" +
                "margin-bottom:6px;" +
                "\">" +

                "YEAR " +
                closest.year +

                "</div>" +

                "<div style=\"" +
                "font-weight:800;" +
                "\">" +

                escapeHTML(
                    closest.label
                ) +

                "</div>" +

                "<div style=\"" +
                "font-size:18px;" +
                "font-weight:900;" +
                "margin-top:2px;" +
                "\">" +

                formatChartNumber(
                    closest.value
                ) +

                "</div>";


            tooltip.style.display =
                "block";


            let left =
                closest.x + 15;


            let top =
                closest.y - 25;


            const tooltipWidth =
                tooltip.offsetWidth;


            const tooltipHeight =
                tooltip.offsetHeight;


            if (
                left +
                tooltipWidth >
                config.width
            ) {

                left =
                    closest.x -
                    tooltipWidth -
                    15;

            }


            if (
                top +
                tooltipHeight >
                config.height
            ) {

                top =
                    config.height -
                    tooltipHeight -
                    10;

            }


            if (top < 5) {
                top = 5;
            }


            tooltip.style.left =
                left + "px";


            tooltip.style.top =
                top + "px";


            redrawHover(
                canvas,
                chartPoints,
                config,
                closest
            );

        }
    );


    canvas.addEventListener(
        "mouseleave",
        hideTooltip
    );

}


/* =========================================================
   HOVER DOT
========================================================= */

function redrawHover(
    canvas,
    chartPoints,
    config,
    selected
) {

    /*
        Full redraw is unnecessary here.
        The normal chart already remains visible.

        This function only adds the highlighted
        point when a year is selected.
    */

    if (!selected) {
        return;
    }


    const ctx =
        canvas.getContext("2d");


    const dpr =
        window.devicePixelRatio || 1;


    ctx.save();


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    ctx.beginPath();


    ctx.arc(
        selected.x,
        selected.y,
        7,
        0,
        Math.PI * 2
    );


    ctx.fillStyle =
        selected.color;


    ctx.fill();


    ctx.beginPath();


    ctx.arc(
        selected.x,
        selected.y,
        11,
        0,
        Math.PI * 2
    );


    ctx.strokeStyle =
        selected.color;


    ctx.lineWidth = 2;


    ctx.globalAlpha =
        0.35;


    ctx.stroke();


    ctx.restore();

}


/* =========================================================
   SMOOTH PATH
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


    let currentX =
        20;


    const legendY =
        40;


    ctx.font =
        "800 11px Inter, Arial, sans-serif";


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
                22 +
                textWidth +
                28;


            if (
                currentX +
                itemWidth >
                width
            ) {

                return;

            }


            ctx.beginPath();


            ctx.moveTo(
                currentX,
                legendY
            );


            ctx.lineTo(
                currentX + 15,
                legendY
            );


            ctx.strokeStyle =
                color;


            ctx.lineWidth = 4;


            ctx.stroke();


            ctx.fillStyle =
                textColor;


            ctx.textAlign =
                "left";


            ctx.fillText(
                label,
                currentX + 21,
                legendY + 4
            );


            currentX +=
                itemWidth;

        }
    );

}


/* =========================================================
   LOADING
========================================================= */

function showChartLoading(canvas) {

    const wrapper =
        canvas.parentElement;


    if (!wrapper) return;


    wrapper.style.position =
        "relative";


    canvas.style.opacity =
        "0.25";


    let loading =
        wrapper.querySelector(
            ".chart-loading"
        );


    if (!loading) {

        loading =
            document.createElement("div");


        loading.className =
            "chart-loading";


        loading.style.position =
            "absolute";


        loading.style.inset =
            "0";


        loading.style.display =
            "flex";


        loading.style.alignItems =
            "center";


        loading.style.justifyContent =
            "center";


        loading.style.fontFamily =
            "Inter, Arial, sans-serif";


        loading.style.fontSize =
            "13px";


        loading.style.fontWeight =
            "800";


        loading.style.color =
            "#38a866";


        loading.innerHTML =
            "Loading live energy data...";


        wrapper.appendChild(loading);

    }

}


/* =========================================================
   REMOVE LOADING
========================================================= */

function removeChartLoading(canvas) {

    canvas.style.opacity =
        "1";


    const loading =
        canvas.parentElement.querySelector(
            ".chart-loading"
        );


    if (loading) {
        loading.remove();
    }

}


/* =========================================================
   NUMBER FORMAT
========================================================= */

function formatChartNumber(value) {

    if (
        Number.isInteger(value)
    ) {

        return value.toLocaleString();

    }


    return value.toLocaleString(
        undefined,
        {
            minimumFractionDigits: 1,
            maximumFractionDigits: 2
        }
    );

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
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   ERROR
========================================================= */

function drawOfflineError(
    canvas,
    message
) {

    removeChartLoading(canvas);


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
            280
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


    canvas.style.opacity =
        "1";


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
   REMOVE LOADING AFTER DRAW
========================================================= */

const originalDraw =
    drawInteractiveLineChart;


/*
    Small wrapper so loading indicator disappears
    once the chart has been drawn.
*/

drawInteractiveLineChart =
    function (canvas, config) {

        originalDraw(
            canvas,
            config
        );

        removeChartLoading(canvas);

    };


/* =========================================================
   REDRAW ON RESIZE
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

                    initializeLiveEnergyCharts();

                },
                250
            );

    }
);
