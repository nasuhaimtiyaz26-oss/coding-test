/* =========================================================
   SAFE ENERGY
   MASTER JAVASCRIPT
   Navigation + Animation + Energy Data Charts
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

            const isOpen = navMenu.classList.toggle("open");

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

    const navbar = document.getElementById("navbar");

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

    const animatedElements = document.querySelectorAll(
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


    /*
     * IMPORTANT:
     * Make cards visible first.
     * Animation is optional.
     */

    animatedElements.forEach(function (element) {

        element.classList.remove("reveal");
        element.classList.add("show");

    });


    /*
     * Add animation only when browser supports it.
     */

    if ("IntersectionObserver" in window) {

        animatedElements.forEach(function (element) {

            element.classList.remove("show");
            element.classList.add("reveal");

        });


        const observer = new IntersectionObserver(
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
       07. ENERGY DATA CHARTS
    ===================================================== */

    if (
        typeof Chart !== "undefined" &&
        document.getElementById("renewableFossilChart")
    ) {

        loadEnergyCharts();

    }

});


/* =========================================================
   ENERGY DATA
========================================================= */

async function loadEnergyCharts() {

    try {

        const renewableURL =
            "https://ourworldindata.org/grapher/share-energy-source-sub.csv";

        const primaryEnergyURL =
            "https://ourworldindata.org/grapher/primary-energy-consumption.csv";

        const electricityURL =
            "https://ourworldindata.org/grapher/electricity-prod-source-stacked.csv";


        const responses = await Promise.all([
            fetch(renewableURL),
            fetch(primaryEnergyURL),
            fetch(electricityURL)
        ]);


        if (!responses.every(response => response.ok)) {

            throw new Error(
                "Unable to load Our World in Data datasets."
            );

        }


        const [
            renewableText,
            primaryEnergyText,
            electricityText
        ] = await Promise.all(
            responses.map(
                response => response.text()
            )
        );


        const renewableData =
            parseCSV(renewableText);

        const primaryEnergyData =
            parseCSV(primaryEnergyText);

        const electricityData =
            parseCSV(electricityText);


        const renewableWorld =
            renewableData.filter(
                row => row.Entity === "World"
            );

        const primaryWorld =
            primaryEnergyData.filter(
                row => row.Entity === "World"
            );

        const electricityWorld =
            electricityData.filter(
                row => row.Entity === "World"
            );


        console.log(
            "Renewable data:",
            renewableWorld.length
        );

        console.log(
            "Primary energy data:",
            primaryWorld.length
        );

        console.log(
            "Electricity data:",
            electricityWorld.length
        );


        createRenewableFossilChart(
            renewableWorld
        );

        createEnergyConsumptionChart(
            primaryWorld
        );

        createElectricityChart(
            electricityWorld
        );


    } catch (error) {

        console.error(
            "Energy data error:",
            error
        );

        showChartError();

    }

}


/* =========================================================
   CSV PARSER
========================================================= */

function parseCSV(text) {

    const lines =
        text.trim().split(/\r?\n/);

    if (lines.length < 2) {
        return [];
    }


    const headers =
        splitCSVLine(lines[0]);


    return lines
        .slice(1)
        .map(function (line) {

            const values =
                splitCSVLine(line);

            const object = {};

            headers.forEach(
                function (header, index) {

                    object[header] =
                        values[index] ?? "";

                }
            );

            return object;

        });

}


/* =========================================================
   CSV LINE HANDLER
========================================================= */

function splitCSVLine(line) {

    const result = [];

    let current = "";

    let insideQuotes = false;


    for (
        let i = 0;
        i < line.length;
        i++
    ) {

        const character =
            line[i];


        if (character === '"') {

            if (
                insideQuotes &&
                line[i + 1] === '"'
            ) {

                current += '"';

                i++;

            } else {

                insideQuotes =
                    !insideQuotes;

            }

        } else if (
            character === "," &&
            !insideQuotes
        ) {

            result.push(current);

            current = "";

        } else {

            current += character;

        }

    }


    result.push(current);

    return result;

}


/* =========================================================
   FIND NUMERIC COLUMN
========================================================= */

function findColumn(row, keywords) {

    const keys =
        Object.keys(row);


    return keys.find(
        function (key) {

            const lower =
                key.toLowerCase();


            return keywords.some(
                keyword =>
                    lower.includes(
                        keyword.toLowerCase()
                    )
            );

        }
    );

}


/* =========================================================
   CLEAN NUMBER
========================================================= */

function cleanNumber(value) {

    const number =
        Number(
            String(value)
                .replace(/,/g, "")
        );

    return Number.isFinite(number)
        ? number
        : null;

}


/* =========================================================
   CHART DEFAULTS
========================================================= */

function chartDefaults(isDark = false) {

    return {

        responsive: true,

        maintainAspectRatio: false,

        interaction: {
            mode: "index",
            intersect: false
        },

        plugins: {

            legend: {

                position: "top",

                labels: {

                    usePointStyle: true,

                    padding: 18,

                    color:
                        isDark
                            ? "#ffffff"
                            : "#14231c"

                }

            },

            tooltip: {

                backgroundColor:
                    "rgba(7,27,18,0.95)",

                padding: 12,

                cornerRadius: 10

            }

        },

        scales: {

            x: {

                ticks: {
                    color:
                        isDark
                            ? "rgba(255,255,255,.65)"
                            : "#64736b"
                },

                grid: {
                    display: false
                }

            },

            y: {

                beginAtZero: true,

                ticks: {
                    color:
                        isDark
                            ? "rgba(255,255,255,.65)"
                            : "#64736b"
                },

                grid: {
                    color:
                        isDark
                            ? "rgba(255,255,255,.08)"
                            : "rgba(0,0,0,.06)"
                }

            }

        }

    };

}


/* =========================================================
   GRAPH 1
========================================================= */

function createRenewableFossilChart(data) {

    const canvas =
        document.getElementById(
            "renewableFossilChart"
        );


    if (!canvas || !data.length) {
        return;
    }


    const keys =
        Object.keys(data[0]);


    const renewableColumn =
        keys.find(
            key =>
                key.toLowerCase()
                    .includes("renewable")
        );


    const fossilColumn =
        keys.find(
            key =>
                key.toLowerCase()
                    .includes("fossil")
        );


    if (
        !renewableColumn &&
        !fossilColumn
    ) {

        console.error(
            "Renewable/fossil columns not found.",
            keys
        );

        return;

    }


    const labels =
        data.map(
            row => row.Year
        );


    const renewableValues =
        data.map(
            row =>
                renewableColumn
                    ? cleanNumber(
                        row[renewableColumn]
                    )
                    : null
        );


    const fossilValues =
        data.map(
            row =>
                fossilColumn
                    ? cleanNumber(
                        row[fossilColumn]
                    )
                    : null
        );


    new Chart(
        canvas,
        {

            type: "line",

            data: {

                labels,

                datasets: [

                    {
                        label:
                            "Renewable Energy",

                        data:
                            renewableValues,

                        borderWidth: 3,

                        tension: 0.35,

                        pointRadius: 0,

                        fill: false
                    },

                    {
                        label:
                            "Fossil Fuels",

                        data:
                            fossilValues,

                        borderWidth: 3,

                        tension: 0.35,

                        pointRadius: 0,

                        fill: false
                    }

                ]

            },

            options:
                chartDefaults(true)

        }
    );

}


/* =========================================================
   GRAPH 2
========================================================= */

function createEnergyConsumptionChart(data) {

    const canvas =
        document.getElementById(
            "energyConsumptionChart"
        );


    if (!canvas || !data.length) {
        return;
    }


    const valueColumn =
        findColumn(
            data[0],
            [
                "primary energy",
                "energy consumption",
                "consumption"
            ]
        );


    if (!valueColumn) {

        console.error(
            "Primary energy column not found.",
            Object.keys(data[0])
        );

        return;

    }


    const labels =
        data.map(
            row => row.Year
        );


    const values =
        data.map(
            row =>
                cleanNumber(
                    row[valueColumn]
                )
        );


    new Chart(
        canvas,
        {

            type: "line",

            data: {

                labels,

                datasets: [

                    {
                        label:
                            "Global Primary Energy",

                        data: values,

                        borderWidth: 3,

                        tension: 0.35,

                        pointRadius: 0,

                        fill: true
                    }

                ]

            },

            options:
                chartDefaults(false)

        }
    );

}


/* =========================================================
   GRAPH 3
========================================================= */

function createElectricityChart(data) {

    const canvas =
        document.getElementById(
            "electricityChart"
        );


    if (!canvas || !data.length) {
        return;
    }


    const keys =
        Object.keys(data[0]);


    const renewableColumn =
        keys.find(
            key =>
                key.toLowerCase()
                    .includes("renewable")
        );


    const fossilColumn =
        keys.find(
            key =>
                key.toLowerCase()
                    .includes("fossil")
        );


    const nuclearColumn =
        keys.find(
            key =>
                key.toLowerCase()
                    .includes("nuclear")
        );


    const datasets = [];


    if (renewableColumn) {

        datasets.push({

            label:
                "Renewable",

            data:
                data.map(
                    row =>
                        cleanNumber(
                            row[
                                renewableColumn
                            ]
                        )
                ),

            borderWidth: 2,

            tension: 0.3,

            fill: true

        });

    }


    if (fossilColumn) {

        datasets.push({

            label:
                "Fossil Fuels",

            data:
                data.map(
                    row =>
                        cleanNumber(
                            row[
                                fossilColumn
                            ]
                        )
                ),

            borderWidth: 2,

            tension: 0.3,

            fill: true

        });

    }


    if (nuclearColumn) {

        datasets.push({

            label:
                "Nuclear",

            data:
                data.map(
                    row =>
                        cleanNumber(
                            row[
                                nuclearColumn
                            ]
                        )
                ),

            borderWidth: 2,

            tension: 0.3,

            fill: true

        });

    }


    if (!datasets.length) {

        console.error(
            "Electricity columns not found.",
            keys
        );

        return;

    }


    new Chart(
        canvas,
        {

            type: "line",

            data: {

                labels:
                    data.map(
                        row => row.Year
                    ),

                datasets

            },

            options:
                chartDefaults(false)

        }
    );

}


/* =========================================================
   CHART ERROR
========================================================= */

function showChartError() {

    document
        .querySelectorAll(
            ".chart-wrapper"
        )
        .forEach(
            function (wrapper) {

                if (
                    wrapper.querySelector(
                        ".chart-error"
                    )
                ) {
                    return;
                }


                const message =
                    document.createElement(
                        "div"
                    );


                message.className =
                    "chart-error";


                message.innerHTML = `
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <span>
                        Energy data could not be loaded.
                        Please check your internet connection.
                    </span>
                `;


                wrapper.appendChild(
                    message
                );

            }
        );

}
