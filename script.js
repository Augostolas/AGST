document.addEventListener('DOMContentLoaded', () => {
    const cliInput = document.getElementById('cliInput');
    const dynamicContent = document.getElementById('dynamicContent');
    const matrixCanvas = document.getElementById('matrixCanvas');
    const eggCounter = document.getElementById('eggCounter');

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
            files: [
                ['loop_showcase.mp4', 'Character loop previews and motion timing.'],
                ['rig_notes.txt', 'Pose planning, blocking passes, and polish checklist.'],
                ['anime_eye.gif', 'Stylized animation asset preview.']
            ]
        },
        building: {
            title: 'Building',
            files: [
                {
                    name: 'destroyed-building.png',
                    description: 'Damaged city block with rubble, heavy orange lighting, and street dressing.',
                    preview: 'assets/building/destroyed-building.png'
                },
                {
                    name: 'street-storefront.png',
                    description: 'Night storefront facade with balconies, lamps, signage, and warm fog.',
                    preview: 'assets/building/street-storefront.png'
                },
                {
                    name: 'red-temple-arena.png',
                    description: 'Red-lit rocky arena and temple path with strong mood lighting.',
                    preview: 'assets/building/red-temple-arena.png'
                },
                {
                    name: 'red-interior-room.png',
                    description: 'Stylized red interior set with dining area, kitchen props, and custom lighting.',
                    preview: 'assets/building/red-interior-room.png'
                },
                {
                    name: 'sandstone-street.png',
                    description: 'Sandstone street build with arches, bridges, and warm daylight atmosphere.',
                    preview: 'assets/building/sandstone-street.png'
                },
                {
                    name: 'sunny-plaza.png',
                    description: 'Bright plaza scene with palm trees, colorful buildings, and open staging.',
                    preview: 'assets/building/sunny-plaza.png'
                },
                {
                    name: 'checkered-lounge.png',
                    description: 'Red-and-black lounge interior with checker panels and layered seating zones.',
                    preview: 'assets/building/checkered-lounge.png'
                },
                {
                    name: 'academy-facade.png',
                    description: 'Large academy facade with arched windows, tower, clock, and long exterior wall.',
                    preview: 'assets/building/academy-facade.png'
                }
            ]
        },
        scripting: {
            title: 'Scripting',
            files: [
                ['client_controller.lua', 'Interactive client systems and UI behavior.'],
                ['server_services.lua', 'Clean backend logic and game/service flow.'],
                ['cmd_portfolio.js', 'Terminal-style web interaction layer.']
            ]
        },
        vfxing: {
            title: 'VFXing',
            files: [
                ['impact_burst.vfx', 'Hit effects, flashes, and timing passes.'],
                ['aura_shader.fx', 'Character aura and animated material experiments.'],
                ['particle_stack.txt', 'Emitter setups, colors, and blend notes.']
            ]
        }
    };

    const loadingAssets = [
        'animating/loop_showcase.mp4',
        'animating/rig_notes.txt',
        'animating/anime_eye.gif',
        'building/map_blockout.rbxm',
        'building/interior_set.obj',
        'building/lighting_pass.txt',
        'building/destroyed-building.png',
        'building/street-storefront.png',
        'building/red-temple-arena.png',
        'building/red-interior-room.png',
        'building/sandstone-street.png',
        'building/sunny-plaza.png',
        'building/checkered-lounge.png',
        'building/academy-facade.png',
        'scripting/client_controller.lua',
        'scripting/server_services.lua',
        'scripting/cmd_portfolio.js',
        'vfxing/impact_burst.vfx',
        'vfxing/aura_shader.fx',
        'vfxing/particle_stack.txt'
    ];

    function getEggCount() {
        return Number.parseInt(localStorage.getItem('portfolioAdminDiscoveries') || '0', 10) || 0;
    }

    function setEggCount(value) {
        localStorage.setItem('portfolioAdminDiscoveries', String(value));
        if (eggCounter) eggCounter.textContent = String(value);
    }

    function incrementEggCount() {
        const nextCount = getEggCount() + 1;
        setEggCount(nextCount);
        return nextCount;
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

    function outputCommand(options, command, outputHTML) {
        if (options.silent) {
            setAppOutput(outputHTML);
        } else {
            appendEntry(command, outputHTML);
        }
    }

    function renderTabs(active = state.activeTab) {
        const tabs = [
            ['projects', 'Projects'],
            ['contact', 'Contact'],
            ['prices', 'Prices']
        ];

        return `
<div class="cmd-tabs" role="tablist" aria-label="Client app tabs">
    ${tabs.map(([command, label]) => `
        <button class="cmd-tab ${active === command ? 'active' : ''}" data-command="${command}" role="tab" aria-selected="${active === command}">
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
                <img src="${escapeHTML(artifact.preview)}" alt="${escapeHTML(artifact.description)}">
                <span class="preview-name">${escapeHTML(artifact.name)}</span>
                <span class="preview-desc">${escapeHTML(artifact.description)}</span>
            </a>`;
    }

    function renderProjects(folderKey = null) {
        const folderRows = Object.entries(folders).map(([key, folder]) => `
            <button class="folder-row ${folderKey === key ? 'active' : ''}" data-command="open ${key}">
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

    function renderHelp() {
        return `
<div class="content-section">
    <pre class="ascii-header">COMMANDS
--------
projects          open the project file manager
open animating    inspect animation files
open building     inspect building files
open scripting    inspect scripting files
open vfxing       inspect VFX files
contact           show contact info
prices            show price tabs
admin             hidden command
matrix            toggle matrix mode
cls               clear the terminal</pre>
</div>`;
    }

    function runAdminEasterEgg(command) {
        if (state.adminTimer) clearTimeout(state.adminTimer);
        const discoveries = incrementEggCount();
        document.body.classList.add('rgb-party');
        appendEntry(command, `
<div class="admin-message">
    Yo, you found the admin easter egg. That was actually a pretty solid dig.
    RGB mode is unlocked for 15 seconds. Discovery count: ${discoveries}.
</div>`);

        state.adminTimer = setTimeout(() => {
            document.body.classList.remove('rgb-party');
            state.adminTimer = null;
        }, 15000);
    }

    function toggleMatrix(command) {
        state.matrixActive = !state.matrixActive;
        if (state.matrixActive) {
            matrixCanvas.style.display = 'block';
            startMatrixRain();
        } else {
            matrixCanvas.style.display = 'none';
            if (window.matrixInterval) clearInterval(window.matrixInterval);
        }
        appendEntry(command, `<div class="content-section"><p>Matrix mode ${state.matrixActive ? 'enabled' : 'disabled'}.</p></div>`);
    }

    function processCommand(rawCommand, options = {}) {
        const command = rawCommand.trim();
        if (!command) return;

        if (!options.skipHistory && !options.silent) {
            state.history.push(command);
            state.historyIndex = state.history.length;
        }

        const [cmd, ...rest] = command.toLowerCase().split(/\s+/);
        const arg = rest.join(' ');

        if (cmd === 'cls' || cmd === 'clear') {
            dynamicContent.innerHTML = '';
            return;
        }

        if (cmd === 'help') {
            outputCommand(options, command, renderHelp());
            return;
        }

        if (cmd === 'client_app.exe' || cmd === 'client_app') {
            outputCommand(options, command, `
<div class="content-section">
    <p>Installing client shell................ OK</p>
    <p>Mounting tabs: Projects Contact Prices. OK</p>
    <p>Preparing file manager................ OK</p>
    <p>Ready.</p>
</div>`);
            return;
        }

        if (cmd === 'tabs') {
            outputCommand(options, command, renderTabs(state.activeTab));
            return;
        }

        if (cmd === 'projects' || cmd === 'project' || cmd === 'dir') {
            state.activeTab = 'projects';
            state.activeFolder = null;
            outputCommand(options, command, renderProjects());
            return;
        }

        if (cmd === 'open') {
            const folder = arg.replace(/\s+/g, '');
            if (folders[folder]) {
                state.activeTab = 'projects';
                state.activeFolder = folder;
                outputCommand(options, command, renderProjects(folder));
            } else {
                outputCommand(options, command, `<div class="content-section error-line">Folder not found: ${escapeHTML(arg || '(empty)')}</div>`);
            }
            return;
        }

        if (folders[cmd]) {
            state.activeTab = 'projects';
            state.activeFolder = cmd;
            outputCommand(options, command, renderProjects(cmd));
            return;
        }

        if (cmd === 'contact') {
            state.activeTab = 'contact';
            outputCommand(options, command, renderContact());
            return;
        }

        if (cmd === 'prices' || cmd === 'pricing') {
            state.activeTab = 'prices';
            outputCommand(options, command, renderPrices());
            return;
        }

        if (cmd === 'admin') {
            runAdminEasterEgg(command);
            return;
        }

        if (cmd === 'matrix') {
            toggleMatrix(command);
            return;
        }

        if (cmd === 'boot' || cmd === 'install') {
            runStartupSequence();
            return;
        }

        appendEntry(command, `<div class="content-section error-line">Command not found. Type HELP.</div>`);
    }

    function typeCommand(command, delay = 120) {
        return new Promise(resolve => {
            cliInput.value = '';
            let index = 0;
            const tick = () => {
                cliInput.value = command.slice(0, index);
                index += 1;
                if (index <= command.length + 1) {
                    setTimeout(tick, Math.max(12, delay / Math.max(command.length, 1)));
                } else {
                    cliInput.value = '';
                    processCommand(command, { skipHistory: true });
                    resolve();
                }
            };
            tick();
        });
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
        const totalMs = 20000;

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
            processCommand(command);
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
        const commandButton = event.target.closest('[data-command]');
        if (commandButton) {
            processCommand(commandButton.dataset.command, { silent: true });
        }
        cliInput.focus();
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'F1') {
            event.preventDefault();
            processCommand('help');
        }
    });

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

    setEggCount(getEggCount());
    cliInput.focus();
    runStartupSequence();
});
