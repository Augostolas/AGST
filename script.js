document.addEventListener('DOMContentLoaded', () => {
    const cliInput = document.getElementById('cliInput');
    const dynamicContent = document.getElementById('dynamicContent');
    const matrixCanvas = document.getElementById('matrixCanvas');
    const eggCounter = document.getElementById('eggCounter');
    const easterEggsFound = {
        admin: false,
        matrix: false,
        '123': false
    };
    let easterEggCount = 0;

    const state = {
        history: [],
        historyIndex: 0,
        activeTab: 'projects',
        activeFolder: null,
        matrixActive: false,
        adminTimer: null,
        loadingTimer: null,
        dotTimer: null
    };

    const folders = {
        animating: {
            title: 'Animating',
            files: []
        },
        building: {
            title: 'Building',
            files: [
                {
                    name: '001',
                    description: '',
                    preview: 'assets/building/destroyed-building.png'
                },
                {
                    name: '002',
                    description: '',
                    preview: 'assets/building/street-storefront.png'
                },
                {
                    name: '003',
                    description: '',
                    preview: 'assets/building/red-temple-arena.png'
                },
                {
                    name: '004',
                    description: '',
                    preview: 'assets/building/red-interior-room.png'
                },
                {
                    name: '005',
                    description: '',
                    preview: 'assets/building/sandstone-street.png'
                },
                {
                    name: '006',
                    description: '',
                    preview: 'assets/building/sunny-plaza.png'
                },
                {
                    name: '007',
                    description: '',
                    preview: 'assets/building/checkered-lounge.png'
                },
                {
                    name: '008',
                    description: '',
                    preview: 'assets/building/academy-facade.png'
                }
            ]
        },
        scripting: {
            title: 'Scripting',
            files: [
                {
                    name: 'Molotov',
                    description: '',
                    preview: 'assets/scripting/molotov.webp'
                },
                {
                    name: 'Ragdoll',
                    description: '',
                    preview: 'assets/scripting/ragdoll.webp'
                },
                {
                    name: 'Laser',
                    description: '',
                    preview: 'assets/scripting/laser.webp'
                },
                {
                    name: 'Bezier Projectile',
                    description: '',
                    preview: 'assets/scripting/bezier-projectile.webp'
                }
            ]
        },
        vfxing: {
            title: 'VFXing',
            files: []
        }
    };

    const loadingAssets = [
        'building/destroyed-building.png',
        'building/street-storefront.png',
        'building/red-temple-arena.png',
        'building/red-interior-room.png',
        'building/sandstone-street.png',
        'building/sunny-plaza.png',
        'building/checkered-lounge.png',
        'building/academy-facade.png',
        'scripting/molotov.webp',
        'scripting/ragdoll.webp',
        'scripting/laser.webp',
        'scripting/bezier-projectile.webp'
    ];

    function updateEggDisplay() {
        const found = Object.values(easterEggsFound).filter(Boolean).length;
        if (eggCounter) eggCounter.textContent = `${found}/3 Easter eggs found`;
    }

    function markEasterEggFound(name) {
        if (!easterEggsFound[name]) {
            easterEggsFound[name] = true;
            updateEggDisplay();
            
            // Sync to global counter if Firebase is enabled
            if (typeof incrementGlobalDiscoveryCount === 'function') {
                incrementGlobalDiscoveryCount();
            }

            if (Object.values(easterEggsFound).every(Boolean)) {
                unlockMatrixBackground();
            }
        }
        updateEggDisplay();
    }

    function escapeHTML(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function scrollToPrompt() {
        requestAnimationFrame(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    }

    function appendEntry(command, outputHTML = '') {
        dynamicContent.insertAdjacentHTML('beforeend', `
<section class="terminal-entry">
    <div class="terminal-command"><span class="prompt-path">C:\\PORTFOLIO&gt;</span> ${escapeHTML(command)}</div>
    <div class="terminal-output">${outputHTML}</div>
</section>`);
        scrollToPrompt();
    }

    function setAppOutput(outputHTML) {
        let surface = document.getElementById('appSurface');
        if (!surface) {
            dynamicContent.innerHTML = '<section class="terminal-entry app-entry" id="appSurface"><div class="terminal-output"></div></section>';
            surface = document.getElementById('appSurface');
        }
        surface.querySelector('.terminal-output').innerHTML = outputHTML;
        scrollToPrompt();
    }

    function renderTabs(active = state.activeTab) {
        const tabs = [
            ['projects', 'Projects'],
            ['contact', 'Contact'],
            ['prices', 'Prices']
        ];

        return `
<div class="cmd-tabs" role="tablist" aria-label="Client app tabs">
    ${tabs.map(([view, label]) => `
        <button class="cmd-tab ${active === view ? 'active' : ''}" data-view="${view}" role="tab" aria-selected="${active === view}">
            [${label}]
        </button>
    `).join('')}
</div>`;
    }

    function normalizeFile(file) {
        if (Array.isArray(file)) {
            return {
                name: file[0],
                description: file[1],
                preview: null
            };
        }

        return file;
    }

    function renderProjectFile(file) {
        const artifact = normalizeFile(file);

        if (!artifact.preview) {
            return `
            <div class="file-row">
                <span class="file-name">${escapeHTML(artifact.name)}</span>
                <span class="file-desc">${escapeHTML(artifact.description)}</span>
            </div>`;
        }

        return `
            <a class="preview-card" href="${escapeHTML(artifact.preview)}" target="_blank" rel="noopener">
                <img src="${escapeHTML(artifact.preview)}" alt="${escapeHTML(artifact.name)}" loading="eager" decoding="async">
                <span class="preview-name">${escapeHTML(artifact.name)}</span>
                <span class="preview-desc">${escapeHTML(artifact.description)}</span>
            </a>`;
    }

    function renderProjects(folderKey = null) {
        const folderRows = Object.entries(folders).map(([key, folder]) => `
            <button class="folder-row ${folderKey === key ? 'active' : ''}" data-folder="${key}">
                <span class="folder-icon">[DIR]</span>
                <span>${folder.title}</span>
            </button>
        `).join('');

        const selected = folderKey ? folders[folderKey] : null;
        const hasPreviews = selected?.files.some(file => normalizeFile(file).preview);
        const fileRows = selected ? `
            <div class="${hasPreviews ? 'preview-grid' : 'plain-file-list'}">
                ${selected.files.map(renderProjectFile).join('')}
            </div>
        ` : `
            <div class="empty-folder">Select a folder to inspect project files.</div>
        `;

        return `
${renderTabs('projects')}
<div class="file-manager">
    <div class="fm-toolbar">
        <span>C:\\PORTFOLIO\\PROJECTS${selected ? `\\${selected.title.toUpperCase()}` : ''}</span>
        <span>${selected ? selected.files.length : Object.keys(folders).length} item(s)</span>
    </div>
    <div class="fm-grid">
        <div class="folder-list">
            ${folderRows}
        </div>
        <div class="file-list">
            ${fileRows}
        </div>
    </div>
</div>`;
    }

    function renderContact() {
        return `
${renderTabs('contact')}
<div class="content-section">
    <pre class="ascii-header">CONTACT CHANNELS
----------------</pre>
    <p>Email   : contact@augostolas.com</p>
    <p>GitHub  : github.com/Augostolas</p>
    <p>Brief   : Send project type, deadline, references, and budget range.</p>
    <p>Status  : Available for animation, building, scripting, and VFX work.</p>
</div>`;
    }

    function renderPrices() {
        return `
${renderTabs('prices')}
<div class="price-grid">
    <div class="price-card">
        <h3>Starter</h3>
        <strong>$50+</strong>
        <p>Small fixes, UI polish, simple scripts, or asset tweaks.</p>
    </div>
    <div class="price-card">
        <h3>Build Pack</h3>
        <strong>$150+</strong>
        <p>Maps, interactive scenes, feature prototypes, and portfolio-ready pages.</p>
    </div>
    <div class="price-card">
        <h3>Full System</h3>
        <strong>Custom</strong>
        <p>Complete game/web systems with animation, scripting, VFX, and iteration.</p>
    </div>
</div>`;
    }

    function runAdminEasterEgg(command) {
        if (state.adminTimer) clearTimeout(state.adminTimer);
        markEasterEggFound('admin');
        
        document.body.classList.add('rgb-party');
        appendEntry(command, `
<div class="admin-message">
    Yo, that was actually a pretty solid dig.
    RGB mode is unlocked for 15 seconds.
</div>`);

        state.adminTimer = setTimeout(() => {
            document.body.classList.remove('rgb-party');
            state.adminTimer = null;
        }, 15000);
    }

    function run123EasterEgg(command) {
        markEasterEggFound('123');
        appendEntry(command, `
<div class="admin-message">
    Easy as 1-2-3! You found another one.
</div>`);
    }

    function discoverMatrix(command) {
        markEasterEggFound('matrix');
        appendEntry(command, '<div class="content-section"><p>Follow the white rabbit.</p></div>');
    }

    function processEasterEgg(rawCommand) {
        const command = rawCommand.trim();
        if (!command) return;

        state.history.push(command);
        state.historyIndex = state.history.length;
        const cmd = command.toLowerCase();

        if (cmd === 'admin') {
            runAdminEasterEgg(command);
            return;
        }

        if (cmd === '123') {
            run123EasterEgg(command);
            return;
        }

        if (cmd === 'matrix') {
            discoverMatrix(command);
            return;
        }

        appendEntry(command, '<div class="content-section error-line">No easter egg found.</div>');
    }

    function shuffle(items) {
        return [...items].sort(() => Math.random() - 0.5);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function runStartupSequence() {
        if (state.loadingTimer) clearTimeout(state.loadingTimer);
        if (state.dotTimer) clearInterval(state.dotTimer);

        dynamicContent.innerHTML = '';
        cliInput.disabled = true;

        const bootId = `boot-${Date.now()}`;
        const assets = shuffle(loadingAssets);
        dynamicContent.innerHTML = `
<section class="terminal-entry loading-entry" id="${bootId}">
    <div class="terminal-command"><span class="prompt-path">C:\\PORTFOLIO&gt;</span> client_app.exe /load-assets</div>
    <div class="terminal-output">
        <div class="content-section">
            <p class="loading-head">Loading client workspace<span id="loadingDots">...</span></p>
            <div class="asset-log" id="assetLog"></div>
        </div>
    </div>
</section>`;

        const dotEl = document.getElementById('loadingDots');
        const assetLog = document.getElementById('assetLog');
        let dotCount = 0;
        const startedAt = Date.now();
        const totalMs = 15000;

        state.dotTimer = setInterval(() => {
            dotCount = (dotCount + 1) % 4;
            if (dotEl) dotEl.textContent = '.'.repeat(dotCount || 3);
        }, 280);

        const checkpoints = assets
            .map(() => 700 + Math.random() * (totalMs - 2200))
            .sort((a, b) => a - b);

        for (let index = 0; index < assets.length; index += 1) {
            const targetTime = checkpoints[index];
            const waitTime = Math.max(0, targetTime - (Date.now() - startedAt));
            await sleep(waitTime);
            const fakeMs = Math.floor(120 + Math.random() * 1480);
            assetLog.insertAdjacentHTML('beforeend', `<p>Loading ${escapeHTML(assets[index])} ${fakeMs}ms ... OK</p>`);
            scrollToPrompt();
        }

        const elapsed = Date.now() - startedAt;
        if (elapsed < totalMs) await sleep(totalMs - elapsed);

        clearInterval(state.dotTimer);
        state.dotTimer = null;
        if (dotEl) dotEl.textContent = '...';
        assetLog.insertAdjacentHTML('beforeend', '<p>Mounting interface tabs ... OK</p><p>Ready.</p>');
        await sleep(500);

        cliInput.disabled = false;
        cliInput.focus();
        setAppOutput(renderProjects());
    }

    cliInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            const command = cliInput.value;
            cliInput.value = '';
            processEasterEgg(command);
            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (state.history.length) {
                state.historyIndex = Math.max(0, state.historyIndex - 1);
                cliInput.value = state.history[state.historyIndex] || '';
                cliInput.setSelectionRange(cliInput.value.length, cliInput.value.length);
            }
            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (state.history.length) {
                state.historyIndex = Math.min(state.history.length, state.historyIndex + 1);
                cliInput.value = state.history[state.historyIndex] || '';
                cliInput.setSelectionRange(cliInput.value.length, cliInput.value.length);
            }
        }
    });

    document.addEventListener('click', event => {
        const tabButton = event.target.closest('[data-view]');
        if (tabButton) {
            state.activeTab = tabButton.dataset.view;
            state.activeFolder = null;
            const views = {
                projects: () => renderProjects(),
                contact: renderContact,
                prices: renderPrices
            };
            setAppOutput(views[state.activeTab]());
        }

        const folderButton = event.target.closest('[data-folder]');
        if (folderButton && folders[folderButton.dataset.folder]) {
            state.activeTab = 'projects';
            state.activeFolder = folderButton.dataset.folder;
            setAppOutput(renderProjects(state.activeFolder));
        }
        cliInput.focus();
    });

    function unlockMatrixBackground() {
        if (state.matrixActive) return;
        state.matrixActive = true;
        document.body.classList.add('matrix-unlocked');
        matrixCanvas.style.display = 'block';
        startMatrixRain();
    }

    function startMatrixRain() {
        const ctx = matrixCanvas.getContext('2d');
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;

        const glyphs = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const fontSize = 16;
        const columns = Math.ceil(matrixCanvas.width / fontSize);
        const drops = Array.from({ length: columns }, () => 1);

        if (window.matrixInterval) clearInterval(window.matrixInterval);
        window.matrixInterval = setInterval(() => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
            ctx.fillStyle = '#00ff66';
            ctx.font = `${fontSize}px monospace`;

            drops.forEach((drop, index) => {
                const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
                ctx.fillText(glyph, index * fontSize, drop * fontSize);
                if (drop * fontSize > matrixCanvas.height && Math.random() > 0.975) drops[index] = 0;
                drops[index] += 1;
            });
        }, 33);
    }

    window.addEventListener('resize', () => {
        if (state.matrixActive) startMatrixRain();
    });

    updateEggDisplay();
    cliInput.focus();
    runStartupSequence();
});
