
/* =========================================================
   SAFE ENERGY
   MASTER JAVASCRIPT
   ONLINE VERSION

   FEATURES:
   - Mobile Navigation
   - Navbar Scroll
   - Reveal Animation
   - Active Navigation
   - OWID Online Energy Data
   - Interactive Energy Charts
   - Chart Hover / Tooltip
   - Responsive Charts
   - GLOBAL VIEW COUNTER
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

                            entry.target.classList.add("show");

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

            if (
                linkPage === currentPage ||
                (
                    currentPage === "" &&
                    linkPage === "index.html"
                )
            ) {

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
       07. LOAD ONLINE ENERGY DATA
    ===================================================== */

    initializeOnlineEnergyCharts();


    /* =====================================================
       08. INITIALIZE VIEW COUNTER
    ===================================================== */

    initCounterApi();

});



/* =========================================================
   OUR WORLD IN DATA
   ONLINE DATA SOURCES
========================================================= */

const OWID_URLS = {

    energyMix:
        "https://ourworldindata.org/grapher/primary-energy-from-fossil-nuclear-renewables.csv?v=1&csvType=full&useColumnShortNames=false",

    primaryEnergy:
        "https://ourworldindata.org/grapher/global-primary-energy-by-source.csv?v=1&csvType=full&useColumnShortNames=false",

    electricity:
        "https://ourworldindata.org/grapher/electricity-fossil-renewables-nuclear-line.csv?v=1&csvType=full&useColumnShortNames=false"

};


/* =========================================================
   COUNTERAPI V2
   SAFE ENERGY VIEW COUNTER
========================================================= */

async function initCounterAPI() {

    const viewCount =
        document.getElementById("viewCount");

    const errorMessage =
        document.getElementById("viewCounterError");


    /* =====================================================
       CHECK COUNTER ELEMENT
    ===================================================== */

    if (!viewCount) {

        console.warn(
            "CounterAPI: #viewCount not found."
        );

        return;

    }


    /* =====================================================
       COUNTERAPI V2 CONFIGURATION
    ===================================================== */

    const TEAM_SLUG =
        "nasuhaimtiyaz26-osss-team-5294";

    const API_SLUG =
        "first-counter-5294";

    const COUNTER_NAME =
        "safe-energy-views";


    /*
       IMPORTANT:
       Use a NEW token here.
       Do not reuse the token previously exposed.
    */

    const ACCESS_TOKEN =
        "ut_l74wprkgl2qzzG8eDGpedHU50azlyGp4RZrxJQLJ";


    /* =====================================================
       COUNTERAPI V2 URL
    ===================================================== */

    const COUNTER_API_URL =
        "https://api.counterapi.dev/v2/" +
        TEAM_SLUG +
        "/" +
        API_SLUG;


    const INCREMENT_URL =
        COUNTER_API_URL +
        "/up";


    /* =====================================================
       DEBUG URL
    ===================================================== */

    console.log(
        "CounterAPI Team:",
        TEAM_SLUG
    );

    console.log(
        "CounterAPI API Slug:",
        API_SLUG
    );

    console.log(
        "CounterAPI Counter Name:",
        COUNTER_NAME
    );

    console.log(
        "CounterAPI URL:",
        COUNTER_API_URL
    );

    console.log(
        "CounterAPI Increment URL:",
        INCREMENT_URL
    );


    /* =====================================================
       CHECK ACCESS TOKEN
    ===================================================== */

    if (
        !ACCESS_TOKEN ||
        ACCESS_TOKEN ===
        "ut_l74wprkgl2qzzG8eDGpedHU50azlyGp4RZrxJQLJ"
    ) {

        console.error(
            "CounterAPI: Access token is not configured."
        );

        viewCount.textContent =
            "Unavailable";


        if (errorMessage) {

            errorMessage.textContent =
                "CounterAPI token is not configured.";

        }

        return;

    }


    /* =====================================================
       LOADING
    ===================================================== */

    viewCount.textContent =
        "Loading...";


    if (errorMessage) {

        errorMessage.textContent =
            "";

    }


    try {

        /* =================================================
           INCREMENT WEBSITE VIEW
        ================================================= */

        const response =
            await fetch(
                INCREMENT_URL,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " +
                            ACCESS_TOKEN,

                        "Accept":
                            "application/json"
                    },

                    cache:
                        "no-store"
                }
            );


        console.log(
            "CounterAPI HTTP Status:",
            response.status
        );


        /* =================================================
           READ API RESPONSE
        ================================================= */

        const result =
            await response.json();


        console.log(
            "CounterAPI Response:",
            result
        );


        /* =================================================
           CHECK RESPONSE
        ================================================= */

        if (!response.ok) {

            const error =
                new Error(
                    "CounterAPI HTTP " +
                    response.status
                );

            error.status =
                response.status;

            error.response =
                result;

            throw error;

        }


        /* =================================================
           GET VALUE
        ================================================= */

        let value = null;


        if (
            result &&
            typeof result.value !==
            "undefined"
        ) {

            value =
                result.value;

        }

        else if (
            result &&
            result.data &&
            typeof result.data.value !==
            "undefined"
        ) {

            value =
                result.data.value;

        }


        /* =================================================
           DISPLAY VALUE
        ================================================= */

        if (
            value !== null &&
            Number.isFinite(
                Number(value)
            )
        ) {

            viewCount.textContent =
                Number(value)
                    .toLocaleString();

        }

        else {

            console.error(
                "CounterAPI invalid response:",
                result
            );

            throw new Error(
                "CounterAPI returned an invalid value."
            );

        }


        /* =================================================
           CLEAR ERROR
        ================================================= */

        if (errorMessage) {

            errorMessage.textContent =
                "";

        }


    } catch (error) {

        console.error(
            "CounterAPI V2 Error:",
            error
        );


        viewCount.textContent =
            "Unavailable";


        if (errorMessage) {

            if (
                error.status === 401
            ) {

                errorMessage.textContent =
                    "Invalid CounterAPI access token.";

            }

            else if (
                error.status === 403
            ) {

                errorMessage.textContent =
                    "CounterAPI permission denied.";

            }

            else if (
                error.status === 404
            ) {

                errorMessage.textContent =
                    "CounterAPI endpoint not found.";

            }

            else if (
                error.status === 429
            ) {

                errorMessage.textContent =
                    "Too many requests. Try again later.";

            }

            else {

                errorMessage.textContent =
                    "Unable to load view count.";

            }

        }

    }

}


/* =========================================================
   GET CURRENT VIEW COUNT
   DOES NOT INCREMENT
========================================================= */

async function getWebsiteViews() {

    const TEAM_SLUG =
        "nasuhaimtiyaz26-osss-team-5294";

    const API_SLUG =
        "first-counter-5294";

    const ACCESS_TOKEN =
        "ut_l74wprkgl2qzzG8eDGpedHU50azlyGp4RZrxJQLJ";


    /* =====================================================
       COUNTERAPI V2 URL
    ===================================================== */

    const COUNTER_API_URL =
        "https://api.counterapi.dev/v2/" +
        TEAM_SLUG +
        "/" +
        API_SLUG;


    console.log(
        "CounterAPI GET URL:",
        COUNTER_API_URL
    );


    try {

        const response =
            await fetch(
                COUNTER_API_URL,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " +
                            ACCESS_TOKEN,

                        "Accept":
                            "application/json"
                    },

                    cache:
                        "no-store"
                }
            );


        const result =
            await response.json();


        console.log(
            "CounterAPI GET Response:",
            result
        );


        if (!response.ok) {

            const error =
                new Error(
                    "CounterAPI HTTP " +
                    response.status
                );

            error.status =
                response.status;

            throw error;

        }


        if (
            result &&
            typeof result.value !==
            "undefined"
        ) {

            return result.value;

        }


        if (
            result &&
            result.data &&
            typeof result.data.value !==
            "undefined"
        ) {

            return result.data.value;

        }


        throw new Error(
            "Invalid CounterAPI response."
        );


    } catch (error) {

        console.error(
            "CounterAPI GET Error:",
            error
        );

        throw error;

    }

}


/* =========================================================
   REFRESH VIEW COUNT
   WITHOUT INCREMENTING
========================================================= */

async function refreshWebsiteViews() {

    const viewCount =
        document.getElementById(
            "viewCount"
        );

    const errorMessage =
        document.getElementById(
            "viewCounterError"
        );


    if (!viewCount) {

        return;

    }


    try {

        const value =
            await getWebsiteViews();


        viewCount.textContent =
            Number(value)
                .toLocaleString();


        if (errorMessage) {

            errorMessage.textContent =
                "";

        }


    } catch (error) {

        console.error(
            "CounterAPI refresh error:",
            error
        );


        viewCount.textContent =
            "Unavailable";


        if (errorMessage) {

            errorMessage.textContent =
                "Unable to refresh view count.";

        }

    }

}


/* =========================================================
   MAIN ENERGY CHART INITIALIZATION
========================================================= */

async function initializeOnlineEnergyCharts() {

    const renewableFossilCanvas =
        document.getElementById(
            "renewableFossilChart"
        );


    const energyConsumptionCanvas =
        document.getElementById(
            "energyConsumptionChart"
        );


    const electricityCanvas =
        document.getElementById(
            "electricityChart"
        );


    if (
        !renewableFossilCanvas &&
        !energyConsumptionCanvas &&
        !electricityCanvas
    ) {

        return;

    }


    showChartLoading(
        renewableFossilCanvas
    );


    showChartLoading(
        energyConsumptionCanvas
    );


    showChartLoading(
        electricityCanvas
    );


    try {

        const results =
            await Promise.allSettled([

                fetchCSV(
                    OWID_URLS.energyMix
                ),

                fetchCSV(
                    OWID_URLS.primaryEnergy
                ),

                fetchCSV(
                    OWID_URLS.electricity
                )

            ]);


        /* =================================================
           GRAPH 1
           ENERGY TRANSITION
        ================================================= */

        if (
            renewableFossilCanvas &&
            results[0].status === "fulfilled"
        ) {

            const rows =
                results[0].value;


            const worldRows =
                getWorldRows(rows);


            const parsed =
                parseEnergyTransition(
                    worldRows
                );


            if (
                parsed.years.length > 0 &&
                parsed.renewable.length > 0 &&
                parsed.fossil.length > 0
            ) {

                drawInteractiveLineChart(
                    renewableFossilCanvas,
                    {

                        labels:
                            parsed.years,

                        datasets: [

                            {
                                label:
                                    "Renewable Energy",

                                data:
                                    parsed.renewable,

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
                                    parsed.fossil,

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
                            "Share of Primary Energy (%)"

                    }
                );

            } else {

                drawChartError(
                    renewableFossilCanvas,
                    "No energy transition data found."
                );

            }

        } else if (renewableFossilCanvas) {

            drawChartError(
                renewableFossilCanvas,
                "Unable to load energy transition data."
            );

        }


        /* =================================================
           GRAPH 2
           GLOBAL PRIMARY ENERGY
        ================================================= */

        if (
            energyConsumptionCanvas &&
            results[1].status === "fulfilled"
        ) {

            const rows =
                results[1].value;


            const worldRows =
                getWorldRows(rows);


            const parsed =
                parsePrimaryEnergy(
                    worldRows
                );


            if (
                parsed.years.length > 0
            ) {

                drawInteractiveLineChart(
                    energyConsumptionCanvas,
                    {

                        labels:
                            parsed.years,

                        datasets: [

                            {
                                label:
                                    "Global Primary Energy",

                                data:
                                    parsed.total,

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

            } else {

                drawChartError(
                    energyConsumptionCanvas,
                    "No primary energy data found."
                );

            }

        } else if (energyConsumptionCanvas) {

            drawChartError(
                energyConsumptionCanvas,
                "Unable to load primary energy data."
            );

        }


        /* =================================================
           GRAPH 3
           ELECTRICITY MIX
        ================================================= */

        if (
            electricityCanvas &&
            results[2].status === "fulfilled"
        ) {

            const rows =
                results[2].value;


            const worldRows =
                getWorldRows(rows);


            const parsed =
                parseElectricity(
                    worldRows
                );


            if (
                parsed.years.length > 0
            ) {

                drawInteractiveLineChart(
                    electricityCanvas,
                    {

                        labels:
                            parsed.years,

                        datasets: [

                            {
                                label:
                                    "Renewable",

                                data:
                                    parsed.renewable,

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
                                    parsed.fossil,

                                lineWidth:
                                    4,

                                fill:
                                    false,

                                smooth:
                                    true
                            },

                            {
                                label:
                                    "Nuclear",

                                data:
                                    parsed.nuclear,

                                lineWidth:
                                    4,

                                fill:
                                    false,

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

            } else {

                drawChartError(
                    electricityCanvas,
                    "No electricity data found."
                );

            }

        } else if (electricityCanvas) {

            drawChartError(
                electricityCanvas,
                "Unable to load electricity data."
            );

        }


    } catch (error) {

        console.error(
            "Energy data error:",
            error
        );


        [
            renewableFossilCanvas,
            energyConsumptionCanvas,
            electricityCanvas
        ].forEach(function (canvas) {

            if (canvas) {

                drawChartError(
                    canvas,
                    "Unable to connect to Our World in Data."
                );

            }

        });

    }

}



/* =========================================================
   FETCH CSV
========================================================= */

async function fetchCSV(url) {

    const response =
        await fetch(
            url,
            {
                cache:
                    "no-store"
            }
        );


    if (!response.ok) {

        throw new Error(
            "HTTP error: " +
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


        if (
            char === '"' &&
            insideQuotes &&
            next === '"'
        ) {

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


            if (
                row.length > 0
            ) {

                rows.push(row);

            }


            row = [];

            continue;

        }


        value += char;

    }


    if (
        value.length > 0 ||
        row.length > 0
    ) {

        row.push(value);

        rows.push(row);

    }


    if (!rows.length) {

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
        .map(function (values) {

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

        });

}



/* =========================================================
   GET WORLD DATA
========================================================= */

function getWorldRows(rows) {

    if (
        !rows ||
        !rows.length
    ) {

        return [];

    }


    const worldRows =
        rows.filter(
            function (row) {

                const entity =
                    String(
                        row.Entity ||
                        row.entity ||
                        ""
                    )
                        .trim()
                        .toLowerCase();


                return (
                    entity === "world"
                );

            }
        );


    if (
        worldRows.length
    ) {

        return worldRows;

    }


    return rows;

}



/* =========================================================
   FIND COLUMN
========================================================= */

function findColumn(
    row,
    keywords
) {

    if (!row) {

        return null;

    }


    const columns =
        Object.keys(row);


    for (
        let i = 0;
        i < keywords.length;
        i++
    ) {

        const keyword =
            keywords[i]
                .toLowerCase();


        const found =
            columns.find(
                function (column) {

                    return column
                        .toLowerCase()
                        .includes(keyword);

                }
            );


        if (found) {

            return found;

        }

    }


    return null;

}



/* =========================================================
   PARSE ENERGY TRANSITION
========================================================= */

function parseEnergyTransition(rows) {

    if (
        !rows ||
        !rows.length
    ) {

        return {

            years: [],

            renewable: [],

            fossil: []

        };

    }


    const columns =
        Object.keys(
            rows[0]
        );


    let renewableColumn =
        columns.find(
            function (column) {

                const name =
                    column.toLowerCase();


                return (
                    name.includes("renewable") &&
                    (
                        name.includes("share") ||
                        name.includes("%")
                    )
                );

            }
        );


    let fossilColumn =
        columns.find(
            function (column) {

                const name =
                    column.toLowerCase();


                return (
                    name.includes("fossil") &&
                    (
                        name.includes("share") ||
                        name.includes("%")
                    )
                );

            }
        );


    if (!renewableColumn) {

        renewableColumn =
            findColumn(
                rows[0],
                [
                    "renewables share",
                    "renewable share",
                    "renewables",
                    "renewable"
                ]
            );

    }


    if (!fossilColumn) {

        fossilColumn =
            findColumn(
                rows[0],
                [
                    "fossil fuels share",
                    "fossil fuel share",
                    "fossil fuels",
                    "fossil"
                ]
            );

    }


    const yearlyData = {};


    rows.forEach(
        function (row) {

            const year =
                Number(
                    row.Year
                );


            if (
                !Number.isFinite(year)
            ) {

                return;

            }


            const renewableValue =
                renewableColumn
                    ? Number(
                        row[
                            renewableColumn
                        ]
                    )
                    : NaN;


            const fossilValue =
                fossilColumn
                    ? Number(
                        row[
                            fossilColumn
                        ]
                    )
                    : NaN;


            if (
                Number.isFinite(
                    renewableValue
                ) ||
                Number.isFinite(
                    fossilValue
                )
            ) {

                yearlyData[year] = {

                    renewable:
                        Number.isFinite(
                            renewableValue
                        )
                            ? renewableValue
                            : null,

                    fossil:
                        Number.isFinite(
                            fossilValue
                        )
                            ? fossilValue
                            : null

                };

            }

        }
    );


    const years =
        Object.keys(
            yearlyData
        )
            .map(Number)
            .sort(
                function (a, b) {

                    return a - b;

                }
            );


    return {

        years,

        renewable:
            years.map(
                function (year) {

                    return yearlyData[
                        year
                    ].renewable;

                }
            ),

        fossil:
            years.map(
                function (year) {

                    return yearlyData[
                        year
                    ].fossil;

                }
            )

    };

}



/* =========================================================
   PARSE PRIMARY ENERGY
========================================================= */

function parsePrimaryEnergy(rows) {

    if (
        !rows ||
        !rows.length
    ) {

        return {

            years: [],

            total: []

        };

    }


    const columns =
        Object.keys(
            rows[0]
        );


    const sourceColumns =
        columns.filter(
            function (column) {

                const name =
                    column.toLowerCase();


                return (

                    name !== "entity" &&

                    name !== "code" &&

                    name !== "year" &&

                    (
                        name.includes("coal") ||
                        name.includes("oil") ||
                        name.includes("gas") ||
                        name.includes("nuclear") ||
                        name.includes("hydro") ||
                        name.includes("solar") ||
                        name.includes("wind") ||
                        name.includes("biofuel") ||
                        name.includes("other renewables") ||
                        name.includes("renewables")
                    )

                );

            }
        );


    const yearlyData = {};


    rows.forEach(
        function (row) {

            const year =
                Number(
                    row.Year
                );


            if (
                !Number.isFinite(year)
            ) {

                return;

            }


            let total = 0;

            let hasValue = false;


            sourceColumns.forEach(
                function (column) {

                    const value =
                        Number(
                            row[column]
                        );


                    if (
                        Number.isFinite(value)
                    ) {

                        total += value;

                        hasValue = true;

                    }

                }
            );


            if (hasValue) {

                yearlyData[
                    year
                ] = total;

            }

        }
    );


    const years =
        Object.keys(
            yearlyData
        )
            .map(Number)
            .sort(
                function (a, b) {

                    return a - b;

                }
            );


    return {

        years,

        total:
            years.map(
                function (year) {

                    return yearlyData[
                        year
                    ];

                }
            )

    };

}



/* =========================================================
   PARSE ELECTRICITY
========================================================= */

function parseElectricity(rows) {

    if (
        !rows ||
        !rows.length
    ) {

        return {

            years: [],

            renewable: [],

            fossil: [],

            nuclear: []

        };

    }


    const renewableColumn =
        findColumn(
            rows[0],
            [
                "Renewables - %",
                "Renewables"
            ]
        );


    const fossilColumn =
        findColumn(
            rows[0],
            [
                "Fossil fuels - %",
                "Fossil fuels"
            ]
        );


    const nuclearColumn =
        findColumn(
            rows[0],
            [
                "Nuclear - %",
                "Nuclear"
            ]
        );


    const data = {};


    rows.forEach(
        function (row) {

            const year =
                Number(
                    row.Year
                );


            if (
                !Number.isFinite(year)
            ) {

                return;

            }


            const renewable =
                renewableColumn
                    ? Number(
                        row[
                            renewableColumn
                        ]
                    )
                    : NaN;


            const fossil =
                fossilColumn
                    ? Number(
                        row[
                            fossilColumn
                        ]
                    )
                    : NaN;


            const nuclear =
                nuclearColumn
                    ? Number(
                        row[
                            nuclearColumn
                        ]
                    )
                    : NaN;


            if (
                Number.isFinite(
                    renewable
                ) ||
                Number.isFinite(
                    fossil
                ) ||
                Number.isFinite(
                    nuclear
                )
            ) {

                data[year] = {

                    renewable:
                        Number.isFinite(
                            renewable
                        )
                            ? renewable
                            : null,

                    fossil:
                        Number.isFinite(
                            fossil
                        )
                            ? fossil
                            : null,

                    nuclear:
                        Number.isFinite(
                            nuclear
                        )
                            ? nuclear
                            : null

                };

            }

        }
    );


    const years =
        Object.keys(
            data
        )
            .map(Number)
            .sort(
                function (a, b) {

                    return a - b;

                }
            );


    return {

        years,

        renewable:
            years.map(
                function (year) {

                    return data[
                        year
                    ].renewable;

                }
            ),

        fossil:
            years.map(
                function (year) {

                    return data[
                        year
                    ].fossil;

                }
            ),

        nuclear:
            years.map(
                function (year) {

                    return data[
                        year
                    ].nuclear;

                }
            )

    };

}



/* =========================================================
   LOADING STATE
========================================================= */

function showChartLoading(canvas) {

    if (!canvas) return;


    const wrapper =
        canvas.parentElement;


    if (!wrapper) return;


    wrapper.style.position =
        "relative";


    let loading =
        wrapper.querySelector(
            ".energy-chart-loading"
        );


    if (!loading) {

        loading =
            document.createElement(
                "div"
            );


        loading.className =
            "energy-chart-loading";


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


        loading.style.font =
            "600 14px Inter, Arial, sans-serif";


        loading.style.color =
            "#64736b";


        loading.style.pointerEvents =
            "none";


        wrapper.appendChild(
            loading
        );

    }


    loading.textContent =
        "Loading live energy data...";


    loading.style.display =
        "flex";

}



/* =========================================================
   HIDE LOADING
========================================================= */

function hideChartLoading(canvas) {

    if (!canvas) return;


    const wrapper =
        canvas.parentElement;


    if (!wrapper) return;


    const loading =
        wrapper.querySelector(
            ".energy-chart-loading"
        );


    if (loading) {

        loading.style.display =
            "none";

    }

}



/* =========================================================
   INTERACTIVE LINE CHART
========================================================= */

function drawInteractiveLineChart(
    canvas,
    config
) {

    if (!canvas) return;


    hideChartLoading(canvas);


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
            : "#52635a";


    const gridColor =
        dark
            ? "rgba(255,255,255,.10)"
            : "rgba(0,0,0,.08)";


    const colors = [

        "#32c878",

        "#777777",

        "#3f6db5"

    ];


    const padding = {

        top: 58,

        right: 28,

        bottom: 48,

        left: 58

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


    if (
        !allValues.length
    ) {

        drawChartError(
            canvas,
            "No valid data."
        );

        return;

    }


    let minValue =
        Math.min(
            ...allValues
        );


    let maxValue =
        Math.max(
            ...allValues
        );


    if (
        minValue === maxValue
    ) {

        minValue -= 1;

        maxValue += 1;

    }


    const range =
        maxValue -
        minValue;


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


    ctx.fillStyle =
        textColor;


    ctx.font =
        "700 11px Inter, Arial, sans-serif";


    ctx.textAlign =
        "left";


    ctx.fillText(
        config.yLabel || "",
        padding.left,
        22
    );


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
            ) *
            i;


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
            ) *
            i;


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


    ctx.fillStyle =
        textColor;


    ctx.font =
        "600 10px Inter, Arial, sans-serif";


    ctx.textAlign =
        "center";


    const labelStep =
        Math.max(
            1,
            Math.ceil(
                labels.length / 9
            )
        );


    labels.forEach(
        function (
            label,
            index
        ) {

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
                height - 18
            );

        }
    );


    const allPoints = [];


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

                        x,

                        y,

                        value,

                        year:
                            labels[index]

                    });

                }
            );


            allPoints.push(
                points
            );


            if (
                dataset.fill
            ) {

                const validPoints =
                    points.filter(Boolean);


                if (
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
                            dark
                                ? 0.30
                                : 0.18
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

            }


            const validPoints =
                points.filter(Boolean);


            if (
                validPoints.length > 1
            ) {

                ctx.beginPath();


                if (
                    dataset.smooth
                ) {

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

                            if (
                                index === 0
                            ) {

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
                    dataset.lineWidth ||
                    3;


                ctx.lineJoin =
                    "round";


                ctx.lineCap =
                    "round";


                ctx.stroke();

            }

        }
    );


    drawLegend(
        ctx,
        datasets,
        colors,
        width,
        dark
    );


    setupChartInteraction(
        canvas,
        {

            labels,

            datasets,

            allPoints,

            padding,

            chartWidth,

            chartHeight,

            minValue,

            maxValue,

            dark,

            yLabel:
                config.yLabel || ""

        }
    );

}



/* =========================================================
   CHART INTERACTION
========================================================= */

function setupChartInteraction(
    canvas,
    state
) {

    const oldHandler =
        canvas._energyMouseMoveHandler;


    if (oldHandler) {

        canvas.removeEventListener(
            "mousemove",
            oldHandler
        );

    }


    const oldLeave =
        canvas._energyMouseLeaveHandler;


    if (oldLeave) {

        canvas.removeEventListener(
            "mouseleave",
            oldLeave
        );

    }


    const mouseMove =
        function (event) {

            const rect =
                canvas.getBoundingClientRect();


            const mouseX =
                event.clientX -
                rect.left;


            const mouseY =
                event.clientY -
                rect.top;


            const index =
                findNearestYear(
                    mouseX,
                    state.labels.length,
                    state.padding.left,
                    state.chartWidth
                );


            if (
                index < 0 ||
                index >= state.labels.length
            ) {

                return;

            }


            drawChartWithTooltip(
                canvas,
                state,
                index,
                mouseX,
                mouseY
            );

        };


    const mouseLeave =
        function () {

            redrawChart(
                canvas,
                state
            );

        };


    canvas.addEventListener(
        "mousemove",
        mouseMove
    );


    canvas.addEventListener(
        "mouseleave",
        mouseLeave
    );


    canvas._energyMouseMoveHandler =
        mouseMove;


    canvas._energyMouseLeaveHandler =
        mouseLeave;


    const oldTouch =
        canvas._energyTouchHandler;


    if (oldTouch) {

        canvas.removeEventListener(
            "touchstart",
            oldTouch
        );

    }


    const touchStart =
        function (event) {

            if (
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


            const y =
                touch.clientY -
                rect.top;


            const index =
                findNearestYear(
                    x,
                    state.labels.length,
                    state.padding.left,
                    state.chartWidth
                );


            drawChartWithTooltip(
                canvas,
                state,
                index,
                x,
                y
            );

        };


    canvas.addEventListener(
        "touchstart",
        touchStart,
        {
            passive: true
        }
    );


    canvas._energyTouchHandler =
        touchStart;

}



/* =========================================================
   REDRAW
========================================================= */

function redrawChart(
    canvas,
    state
) {

    drawInteractiveLineChart(
        canvas,
        {

            labels:
                state.labels,

            datasets:
                state.datasets,

            dark:
                state.dark,

            yLabel:
                state.yLabel

        }
    );

}



/* =========================================================
   DRAW TOOLTIP
========================================================= */

function drawChartWithTooltip(
    canvas,
    state,
    index,
    mouseX,
    mouseY
) {

    redrawChartBase(
        canvas,
        state
    );


    const ctx =
        canvas.getContext("2d");


    const dpr =
        window.devicePixelRatio ||
        1;


    const rect =
        canvas.getBoundingClientRect();


    const width =
        rect.width;


    const height =
        rect.height;


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    const x =
        getXPosition(
            index,
            state.labels.length,
            state.padding.left,
            state.chartWidth
        );


    ctx.beginPath();


    ctx.moveTo(
        x,
        state.padding.top
    );


    ctx.lineTo(
        x,
        height -
        state.padding.bottom
    );


    ctx.strokeStyle =
        state.dark
            ? "rgba(255,255,255,.25)"
            : "rgba(0,0,0,.18)";


    ctx.lineWidth = 1;


    ctx.setLineDash([
        5,
        5
    ]);


    ctx.stroke();


    ctx.setLineDash([]);


    const colors = [

        "#32c878",

        "#777777",

        "#3f6db5"

    ];


    state.allPoints.forEach(
        function (
            points,
            datasetIndex
        ) {

            const point =
                points[index];


            if (!point) {

                return;

            }


            const color =
                colors[
                    datasetIndex %
                    colors.length
                ];


            ctx.beginPath();


            ctx.arc(
                point.x,
                point.y,
                6,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                color;


            ctx.fill();


            ctx.beginPath();


            ctx.arc(
                point.x,
                point.y,
                9,
                0,
                Math.PI * 2
            );


            ctx.strokeStyle =
                "#ffffff";


            ctx.lineWidth = 2;


            ctx.stroke();

        }
    );


    const tooltipLines = [];


    tooltipLines.push(
        String(
            state.labels[index]
        )
    );


    state.datasets.forEach(
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


            let suffix = "";


            if (
                state.yLabel
                    .toLowerCase()
                    .includes("%")
            ) {

                suffix = "%";

            }


            tooltipLines.push(
                dataset.label +
                ": " +
                formatChartNumber(value) +
                suffix
            );

        }
    );


    ctx.font =
        "700 12px Inter, Arial, sans-serif";


    let maxTextWidth = 0;


    tooltipLines.forEach(
        function (line) {

            maxTextWidth =
                Math.max(
                    maxTextWidth,
                    ctx.measureText(
                        line
                    ).width
                );

        }
    );


    const boxWidth =
        maxTextWidth +
        30;


    const boxHeight =
        tooltipLines.length *
        21 +
        20;


    let boxX =
        mouseX +
        15;


    let boxY =
        mouseY -
        boxHeight -
        15;


    if (
        boxX +
        boxWidth >
        width -
        10
    ) {

        boxX =
            mouseX -
            boxWidth -
            15;

    }


    if (
        boxX < 10
    ) {

        boxX = 10;

    }


    if (
        boxY < 10
    ) {

        boxY =
            mouseY +
            15;

    }


    if (
        boxY +
        boxHeight >
        height -
        10
    ) {

        boxY =
            height -
            boxHeight -
            10;

    }


    ctx.fillStyle =
        state.dark
            ? "rgba(8,22,15,.96)"
            : "rgba(255,255,255,.97)";


    roundRect(
        ctx,
        boxX,
        boxY,
        boxWidth,
        boxHeight,
        10
    );


    ctx.fill();


    ctx.strokeStyle =
        state.dark
            ? "rgba(255,255,255,.12)"
            : "rgba(0,0,0,.08)";


    ctx.lineWidth = 1;


    ctx.stroke();


    tooltipLines.forEach(
        function (
            line,
            lineIndex
        ) {

            ctx.fillStyle =
                lineIndex === 0
                    ? (
                        state.dark
                            ? "#ffffff"
                            : "#14231c"
                    )
                    : (
                        state.dark
                            ? "rgba(255,255,255,.75)"
                            : "#52635a"
                    );


            ctx.font =
                lineIndex === 0
                    ? "800 12px Inter, Arial, sans-serif"
                    : "600 11px Inter, Arial, sans-serif";


            ctx.textAlign =
                "left";


            ctx.fillText(
                line,
                boxX + 15,
                boxY +
                20 +
                lineIndex * 21
            );

        }
    );

}



/* =========================================================
   REDRAW BASE
========================================================= */

function redrawChartBase(
    canvas,
    state
) {

    const ctx =
        canvas.getContext("2d");


    const rect =
        canvas.getBoundingClientRect();


    const width =
        rect.width;


    const height =
        rect.height;


    const dpr =
        window.devicePixelRatio ||
        1;


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
        state.dark;


    const textColor =
        dark
            ? "rgba(255,255,255,.78)"
            : "#52635a";


    const gridColor =
        dark
            ? "rgba(255,255,255,.10)"
            : "rgba(0,0,0,.08)";


    const gridLines = 5;


    for (
        let i = 0;
        i <= gridLines;
        i++
    ) {

        const y =
            state.padding.top +
            (
                state.chartHeight /
                gridLines
            ) *
            i;


        ctx.beginPath();


        ctx.moveTo(
            state.padding.left,
            y
        );


        ctx.lineTo(
            width -
            state.padding.right,
            y
        );


        ctx.strokeStyle =
            gridColor;


        ctx.lineWidth = 1;


        ctx.stroke();


        const value =
            state.maxValue -
            (
                (
                    state.maxValue -
                    state.minValue
                ) /
                gridLines
            ) *
            i;


        ctx.fillStyle =
            textColor;


        ctx.font =
            "600 10px Inter, Arial, sans-serif";


        ctx.textAlign =
            "right";


        ctx.fillText(
            formatChartNumber(value),
            state.padding.left - 10,
            y + 3
        );

    }


    ctx.fillStyle =
        textColor;


    ctx.font =
        "700 11px Inter, Arial, sans-serif";


    ctx.textAlign =
        "left";


    ctx.fillText(
        state.yLabel || "",
        state.padding.left,
        22
    );


    const labelStep =
        Math.max(
            1,
            Math.ceil(
                state.labels.length / 9
            )
        );


    ctx.fillStyle =
        textColor;


    ctx.font =
        "600 10px Inter, Arial, sans-serif";


    ctx.textAlign =
        "center";


    state.labels.forEach(
        function (
            label,
            index
        ) {

            if (
                index % labelStep !== 0 &&
                index !==
                state.labels.length - 1
            ) {

                return;

            }


            const x =
                getXPosition(
                    index,
                    state.labels.length,
                    state.padding.left,
                    state.chartWidth
                );


            ctx.fillText(
                String(label),
                x,
                height - 18
            );

        }
    );


    const colors = [

        "#32c878",

        "#777777",

        "#3f6db5"

    ];


    state.datasets.forEach(
        function (
            dataset,
            datasetIndex
        ) {

            const color =
                colors[
                    datasetIndex %
                    colors.length
                ];


            const points =
                state.allPoints[
                    datasetIndex
                ].filter(Boolean);


            if (
                points.length < 2
            ) {

                return;

            }


            ctx.beginPath();


            if (
                dataset.smooth
            ) {

                drawSmoothPath(
                    ctx,
                    points
                );

            } else {

                points.forEach(
                    function (
                        point,
                        index
                    ) {

                        if (
                            index === 0
                        ) {

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
                dataset.lineWidth ||
                3;


            ctx.lineJoin =
                "round";


            ctx.lineCap =
                "round";


            ctx.stroke();

        }
    );


    drawLegend(
        ctx,
        state.datasets,
        colors,
        width,
        dark
    );

}



/* =========================================================
   FIND NEAREST YEAR
========================================================= */

function findNearestYear(
    mouseX,
    total,
    left,
    width
) {

    if (
        total <= 1
    ) {

        return 0;

    }


    const position =
        (
            mouseX -
            left
        ) /
        width;


    const rawIndex =
        position *
        (
            total -
            1
        );


    return Math.max(
        0,
        Math.min(
            total - 1,
            Math.round(
                rawIndex
            )
        )
    );

}



/* =========================================================
   SMOOTH LINE
========================================================= */

function drawSmoothPath(
    ctx,
    points
) {

    if (
        !points.length
    ) {

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
            ) /
            2;


        const midpointY =
            (
                previous.y +
                current.y
            ) /
            2;


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

    if (
        total <= 1
    ) {

        return left;

    }


    return (
        left +
        (
            index /
            (
                total -
                1
            )
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
            (
                max -
                value
            ) /
            (
                max -
                min
            )
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


    const legendY = 35;


    ctx.font =
        "700 10px Inter, Arial, sans-serif";


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
                dataset.label ||
                "";


            const textWidth =
                ctx.measureText(
                    label
                ).width;


            const itemWidth =
                20 +
                textWidth +
                25;


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
                currentX + 14,
                legendY
            );


            ctx.strokeStyle =
                color;


            ctx.lineWidth = 4;


            ctx.lineCap =
                "round";


            ctx.stroke();


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
   ROUND RECT
========================================================= */

function roundRect(
    ctx,
    x,
    y,
    width,
    height,
    radius
) {

    ctx.beginPath();


    ctx.moveTo(
        x + radius,
        y
    );


    ctx.lineTo(
        x + width - radius,
        y
    );


    ctx.quadraticCurveTo(
        x + width,
        y,
        x + width,
        y + radius
    );


    ctx.lineTo(
        x + width,
        y + height - radius
    );


    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
    );


    ctx.lineTo(
        x + radius,
        y + height
    );


    ctx.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - radius
    );


    ctx.lineTo(
        x,
        y + radius
    );


    ctx.quadraticCurveTo(
        x,
        y,
        x + radius,
        y
    );


    ctx.closePath();

}



/* =========================================================
   NUMBER FORMAT
========================================================= */

function formatChartNumber(
    value
) {

    if (
        !Number.isFinite(value)
    ) {

        return "-";

    }


    if (
        Math.abs(value) >= 1000
    ) {

        return value.toLocaleString(
            "en-US",
            {
                maximumFractionDigits:
                    0
            }
        );

    }


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
        ) &
        255;


    const g =
        (
            bigint >>
            8
        ) &
        255;


    const b =
        bigint &
        255;


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
   CHART ERROR
========================================================= */

function drawChartError(
    canvas,
    message
) {

    if (!canvas) return;


    hideChartLoading(
        canvas
    );


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
        window.devicePixelRatio ||
        1;


    canvas.width =
        width * dpr;


    canvas.height =
        height * dpr;


    canvas.style.width =
        width + "px";


    canvas.style.height =
        height + "px";


    const ctx =
        canvas.getContext(
            "2d"
        );


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr
    );


    ctx.fillStyle =
        "#64736b";


    ctx.font =
        "700 14px Inter, Arial, sans-serif";


    ctx.textAlign =
        "center";


    ctx.fillText(
        message,
        width / 2,
        height / 2
    );

}



/* =========================================================
   RESIZE
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

                    initializeOnlineEnergyCharts();

                },
                250
            );

    }
);
