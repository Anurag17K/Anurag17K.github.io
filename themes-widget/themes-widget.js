const THEME_API_BASE = "https://z1s4ahgav3.execute-api.us-east-1.amazonaws.com/prod/themes/";

(function() {
    // Minimal code: just appends the theme panel and logic
    const panel = document.createElement('div');
    panel.id = 'themePanel';
    panel.innerHTML = `
        <button id="changeThemeBtn">Change Theme</button>
        <div id="themeOptions" style="display:none;">
            <label><input type="radio" name="themeOption" value="default" checked> Default</label>
            <label><input type="radio" name="themeOption" value="dark"> Dark</label>
            <button data-category="beach">Beach</button>
            <button data-category="city">City</button>
            <button data-category="night">Night</button>
            <button data-category="mountain">Mountain</button>
        </div>
    `;
    document.body.appendChild(panel);

    const changeBtn = document.getElementById('changeThemeBtn');
    const options = document.getElementById('themeOptions');

    changeBtn.addEventListener('click', () => {
        options.style.display = options.style.display === 'block' ? 'none' : 'block';
    });

    options.querySelectorAll('input[name="themeOption"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if(this.value === 'default') {
                document.body.style.backgroundColor = '';
                document.body.style.color = '';
            } else {
                fetch(THEME_API_BASE + this.value)
                    .then(r => r.json())
                    .then(theme => {
                        document.body.style.backgroundColor = theme.background;
                        document.body.style.color = theme.text;
                    });
            }
        });
    });

    options.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            fetch(THEME_API_BASE + btn.dataset.category)
                .then(r => r.json())
                .then(theme => {
                    document.body.style.backgroundColor = theme.background;
                    document.body.style.color = theme.text;
                });
        });
    });
})();
