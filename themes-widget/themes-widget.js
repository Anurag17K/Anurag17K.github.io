(function () {

    const THEME_API_BASE = "https://z1s4ahgav3.execute-api.us-east-1.amazonaws.com/prod/themes/";
    const STORAGE_KEY = "uts-selected-theme";

    // Optional per-site configuration
    const CONFIG = window.UTS_CONFIG || {};

    const BTN_TOP = CONFIG.top || "10px";
    const BTN_RIGHT = CONFIG.right || "20px";
    const BTN_BOTTOM = CONFIG.bottom || null;
    const BTN_LEFT = CONFIG.left || null;

    function injectCSS() {
        const css = `
        :root {
            --bg-color: #ffffff;
            --text-color: #000000;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-color);
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        #uts-toggle-btn {
            position: fixed;
            background: #333;
            color: white;
            border: none;
            padding: 10px 14px;
            border-radius: 50px;
            cursor: pointer;
            z-index: 9999;
        }

        #uts-panel {
            display: none;
            position: fixed;
            background: white;
            border: 1px solid #ccc;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            width: 220px;
            z-index: 9999;
        }

        #uts-panel label {
            display: block;
            margin-bottom: 8px;
        }

        #randomCategoryPanel {
            display: none;
            margin-top: 10px;
            border-top: 1px solid #ccc;
            padding-top: 10px;
        }

        #randomCategoryPanel button {
            width: 100%;
            margin: 4px 0;
            cursor: pointer;
        }`;

        const style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
    }

    function applyPosition(element) {
        if (BTN_TOP) element.style.top = BTN_TOP;
        if (BTN_RIGHT) element.style.right = BTN_RIGHT;
        if (BTN_BOTTOM) element.style.bottom = BTN_BOTTOM;
        if (BTN_LEFT) element.style.left = BTN_LEFT;
    }

    function applyPanelPosition(panel) {
        if (BTN_TOP) panel.style.top = `calc(${BTN_TOP} + 60px)`;
        if (BTN_RIGHT) panel.style.right = BTN_RIGHT;
        if (BTN_BOTTOM) panel.style.bottom = `calc(${BTN_BOTTOM} + 60px)`;
        if (BTN_LEFT) panel.style.left = BTN_LEFT;
    }

    function applyTheme(theme) {
        document.documentElement.style.setProperty('--bg-color', theme.background);
        document.documentElement.style.setProperty('--text-color', theme.text);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    }

    function resetTheme() {
        document.documentElement.style.setProperty('--bg-color', '#ffffff');
        document.documentElement.style.setProperty('--text-color', '#000000');
        localStorage.removeItem(STORAGE_KEY);
    }

    function loadSavedTheme() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) applyTheme(JSON.parse(saved));
    }

    function createUI() {

        const toggleBtn = document.createElement("button");
        toggleBtn.id = "uts-toggle-btn";
        toggleBtn.innerText = "Theme";
        applyPosition(toggleBtn);
        document.body.appendChild(toggleBtn);

        const panel = document.createElement("div");
        panel.id = "uts-panel";
        applyPanelPosition(panel);

        panel.innerHTML = `
            <label><input type="radio" name="uts-theme" value="default" checked> Default</label>
            <label><input type="radio" name="uts-theme" value="dark"> Dark</label>
            <hr>
            <button id="randomMainBtn">Random Theme ▸</button>
            <div id="randomCategoryPanel">
                <button data-category="beach">Beach</button>
                <button data-category="city">City</button>
                <button data-category="night">Night</button>
                <button data-category="mountain">Mountain</button>
                <button data-category="lava">Lava</button>
                <button data-category="grass">Grass</button>
            </div>
        `;

        document.body.appendChild(panel);

        toggleBtn.addEventListener("click", () => {
            panel.style.display = panel.style.display === "block" ? "none" : "block";
        });

        const randomMainBtn = panel.querySelector("#randomMainBtn");
        const randomPanel = panel.querySelector("#randomCategoryPanel");

        randomMainBtn.addEventListener("click", () => {
            const isOpen = randomPanel.style.display === "block";
            randomPanel.style.display = isOpen ? "none" : "block";
            randomMainBtn.textContent = isOpen ? "Random Theme ▸" : "Random Theme ▾";
        });

        panel.querySelectorAll('input[name="uts-theme"]').forEach(radio => {
            radio.addEventListener("change", function () {
                if (this.value === "default") resetTheme();
                if (this.value === "dark") {
                    fetch(THEME_API_BASE + "dark")
                        .then(r => r.json())
                        .then(data => applyTheme(data))
                        .catch(() => alert("Theme API error"));
                }
            });
        });

        randomPanel.querySelectorAll("button[data-category]").forEach(btn => {
            btn.addEventListener("click", () => {
                const category = btn.dataset.category;

                fetch(THEME_API_BASE + category)
                    .then(r => r.json())
                    .then(data => applyTheme(data))
                    .catch(() => alert("Theme API error"));

                randomPanel.style.display = "none";
                panel.style.display = "none";
                randomMainBtn.textContent = "Random Theme ▸";
            });
        });

        document.addEventListener("click", e => {
            if (!panel.contains(e.target) && e.target !== toggleBtn) {
                panel.style.display = "none";
                randomPanel.style.display = "none";
                randomMainBtn.textContent = "Random Theme ▸";
            }
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        injectCSS();
        loadSavedTheme();
        createUI();
    });

})();
