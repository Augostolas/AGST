document.addEventListener('DOMContentLoaded', () => {
    const cliInput = document.getElementById('cliInput');
    const dynamicContent = document.getElementById('dynamicContent');
    const matrixCanvas = document.getElementById('matrixCanvas');
    const asciiWatermark = document.getElementById('asciiWatermark');
    const eggCounter = document.getElementById('eggCounter');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const geedorahFlash = document.getElementById('geedorahFlash');
    const audioToggle = document.getElementById('audioToggle');
    const appStatus = document.getElementById('appStatus');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const easterEggsFound = {
        matrix: false,
        '123': false,
        geedorah: false
    };
    let discoveryModulePromise = null;

    fetch('assets/ui/ascii-watermark.txt')
        .then(response => {
            if (!response.ok) throw new Error('Watermark unavailable');
            return response.text();
        })
        .then(text => {
            asciiWatermark.textContent = text.replace(/^(?:[ \t]*\r?\n)+|(?:\r?\n[ \t]*)+$/g, '');
        })
        .catch(() => {
            asciiWatermark.hidden = true;
        });

    const state = {
        history: [],
        historyIndex: 0,
        activeTab: 'projects',
        activeFolder: null,
        matrixActive: false,
        matrixFrame: null,
        matrixLastFrame: 0,
        matrixScene: null
    };

    const folders = {
        animating: {
            title: 'Animating',
            emptyMessage: 'Coming soon — animation reels are being prepared.',
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
                    description: 'Throw it, it breaks, burns stuff, and drops whoever gets hit.',
                    preview: 'assets/scripting/molotov.webp'
                },
                {
                    name: 'Ragdoll',
                    description: 'Full-body ragdoll with cleaner hits and less janky movement.',
                    preview: 'assets/scripting/ragdoll.webp'
                },
                {
                    name: 'Laser',
                    description: 'A heavy laser that pushes harder and hurts more the longer it hits.',
                    preview: 'assets/scripting/laser.webp'
                },
                {
                    name: 'Bezier Projectile',
                    description: 'Curved shot with aim preview, camera control, and a clean release.',
                    preview: 'assets/scripting/bezier-projectile.webp'
                }
            ]
        },
        vfxing: {
            title: 'VFXing',
            files: [
                {
                    name: '001',
                    preview: 'assets/vfxing/crimson-aura.webp'
                },
                {
                    name: '002',
                    preview: 'assets/vfxing/golden-aura.webp'
                }
            ]
        }
    };

    function updateEggDisplay() {
        const found = Object.values(easterEggsFound).filter(Boolean).length;
        if (eggCounter) eggCounter.textContent = `${found}/3 Easter eggs found`;
    }

    async function syncGlobalDiscovery() {
        if (['localhost', '127.0.0.1'].includes(window.location.hostname)) return;

        try {
            discoveryModulePromise ||= import('./config.js');
            const discoveryModule = await discoveryModulePromise;
            await discoveryModule.incrementGlobalDiscoveryCount();
        } catch (error) {
            console.warn('Global discovery tracking is unavailable.', error);
        }
    }

    function markEasterEggFound(name) {
        if (!easterEggsFound[name]) {
            easterEggsFound[name] = true;
            updateEggDisplay();
            syncGlobalDiscovery();

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
        if (reducedMotion.matches) {
            window.scrollTo({ top: document.body.scrollHeight });
            return;
        }

        requestAnimationFrame(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    }

    function announce(message) {
        if (!appStatus) return;
        appStatus.textContent = '';
        requestAnimationFrame(() => {
            appStatus.textContent = message;
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
<div class="cmd-tabs" role="tablist" aria-label="Portfolio sections">
    ${tabs.map(([view, label]) => `
        <button class="cmd-tab ${active === view ? 'active' : ''}" id="tab-${view}" data-view="${view}" role="tab" aria-selected="${active === view}" aria-controls="view-panel" tabindex="${active === view ? '0' : '-1'}">
            [${label}]
        </button>
    `).join('')}
</div>`;
    }

    function renderProjectFile(artifact) {

        if (!artifact.preview) {
            return `
            <div class="file-row">
                <span class="file-name">${escapeHTML(artifact.name)}</span>
                <span class="file-desc">${escapeHTML(artifact.description)}</span>
            </div>`;
        }

        return `
            <a class="preview-card" href="${escapeHTML(artifact.preview)}" target="_blank" rel="noopener">
                <img src="${escapeHTML(artifact.preview)}" alt="${escapeHTML(artifact.name)}" loading="lazy" decoding="async">
                ${artifact.hideLabel ? '' : `<span class="preview-name">${escapeHTML(artifact.name)}</span>`}
                ${artifact.description ? `<span class="preview-desc">${escapeHTML(artifact.description)}</span>` : ''}
            </a>`;
    }

    function renderProjects(folderKey = null) {
        const folderRows = Object.entries(folders).map(([key, folder]) => `
            <button class="folder-row ${key === 'animating' ? 'animating-folder' : ''} ${folderKey === key ? 'active' : ''}" data-folder="${key}">
                <span class="folder-icon" aria-hidden="true">
                    ${key === 'animating' ? `
                        <img class="folder-icon-gray" src="assets/ui/folder-gray.png" alt="">
                    ` : `
                        <img class="folder-icon-green" src="assets/ui/folder-green.png" alt="">
                        <img class="folder-icon-red" src="assets/ui/folder-red.png" alt="">
                    `}
                </span>
                <span class="folder-title">${folder.title}</span>
                ${key === 'animating' ? '<img class="animation-gear" src="assets/ui/animating-gear.png" alt="" aria-hidden="true">' : ''}
            </button>
        `).join('');

        const selected = folderKey ? folders[folderKey] : null;
        const hasPreviews = selected?.files.some(file => file.preview);
        const fileRows = selected?.files.length ? `
            <div class="${hasPreviews ? 'preview-grid' : 'plain-file-list'}">
                ${selected.files.map(renderProjectFile).join('')}
            </div>
        ` : `
            <div class="empty-folder">${selected ? escapeHTML(selected.emptyMessage || 'Nothing has been published here yet.') : 'Select a folder to inspect project files.'}</div>
        `;

        return `
${renderTabs('projects')}
<section class="view-panel" id="view-panel" role="tabpanel" aria-labelledby="tab-projects" tabindex="0">
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
</div>
</section>`;
    }

    function renderContact() {
        return `
${renderTabs('contact')}
<section class="content-section view-panel" id="view-panel" role="tabpanel" aria-labelledby="tab-contact" tabindex="0">
    <pre class="ascii-header">CONTACT CHANNELS
----------------</pre>
    <p>Discord : augostoletal</p>
    <p>Brief   : Send project type, deadline, references, and budget range.</p>
    <p>Status  : Available for animation, building, scripting, and VFX work.</p>
</section>`;
    }

    function renderPrices() {
        return `
${renderTabs('prices')}
<section class="view-panel" id="view-panel" role="tabpanel" aria-labelledby="tab-prices" tabindex="0">
<div class="price-grid">
    <div class="price-card">
        <h3>Starter</h3>
        <strong>USD $50+</strong>
        <p>Small fixes, UI polish, simple scripts, or asset tweaks.</p>
    </div>
    <div class="price-card">
        <h3>Build Pack</h3>
        <strong>USD $150+</strong>
        <p>Maps, interactive scenes, feature prototypes, and portfolio-ready pages.</p>
    </div>
    <div class="price-card">
        <h3>Full System</h3>
        <strong>Custom</strong>
        <p>Complete game/web systems with animation, scripting, VFX, and iteration.</p>
    </div>
</div>
<p class="price-note">Starting estimates only. Final quotes depend on scope, deadline, revisions, and asset requirements.</p>
</section>`;
    }

    function run123EasterEgg(command) {
        markEasterEggFound('123');
        appendEntry(command, `
<div class="egg-message">
    Easy as 1-2-3! You found another one.
</div>`);
    }

    function discoverMatrix(command) {
        markEasterEggFound('matrix');
        appendEntry(command, '<div class="content-section"><p>Follow the white rabbit.</p></div>');
    }

    function runGeedorahEasterEgg(command) {
        markEasterEggFound('geedorah');
        document.body.classList.add('geedorah-mode');
        if (state.matrixActive) startMatrixRain();
        playGeedorahFlash();
        startBackgroundMusic();
        appendEntry(command, `
<div class="geedorah-message">
    Good taste mate :)
</div>`);
    }

    function startBackgroundMusic() {
        if (!backgroundMusic) return;
        const playback = backgroundMusic.play();
        if (playback) {
            playback
                .then(updateAudioControl)
                .catch(() => updateAudioControl());
        }
    }

    function stopBackgroundMusic() {
        if (!backgroundMusic) return;
        backgroundMusic.pause();
        updateAudioControl();
    }

    function updateAudioControl() {
        if (!audioToggle || !backgroundMusic) return;
        const playing = !backgroundMusic.paused;
        audioToggle.textContent = `AUDIO: ${playing ? 'ON' : 'OFF'}`;
        audioToggle.setAttribute('aria-pressed', String(playing));
    }

    function playGeedorahFlash() {
        if (!geedorahFlash) return;
        geedorahFlash.classList.remove('active');
        void geedorahFlash.offsetWidth;
        geedorahFlash.classList.add('active');
    }

    function processEasterEgg(rawCommand) {
        const command = rawCommand.trim();
        if (!command) return;

        state.history.push(command);
        state.historyIndex = state.history.length;
        const cmd = command.toLowerCase().replace(/\s+/g, ' ');

        if (cmd === '123') {
            run123EasterEgg(command);
            return;
        }

        if (cmd === 'matrix') {
            discoverMatrix(command);
            return;
        }

        if (cmd === 'king geedorah') {
            runGeedorahEasterEgg(command);
            return;
        }

        appendEntry(command, '<div class="content-section error-line">No easter egg found.</div>');
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function runStartupSequence() {
        dynamicContent.innerHTML = '';
        cliInput.disabled = true;

        dynamicContent.innerHTML = `
<section class="terminal-entry loading-entry">
    <div class="terminal-command"><span class="prompt-path">C:\\PORTFOLIO&gt;</span> client_app.exe</div>
    <div class="terminal-output">
        <div class="content-section">
            <p class="loading-head">Starting client workspace...</p>
            <div class="asset-log" id="assetLog"><p>Interface shell ... OK</p></div>
        </div>
    </div>
</section>`;

        const assetLog = document.getElementById('assetLog');
        const stageDelay = reducedMotion.matches ? 250 : 850;
        const fontReady = Promise.race([
            document.fonts?.ready?.catch(() => {}) || Promise.resolve(),
            sleep(reducedMotion.matches ? 250 : 1200)
        ]);
        await Promise.all([fontReady, sleep(stageDelay)]);
        assetLog.insertAdjacentHTML('beforeend', '<p>Visual archive ... OK</p>');
        await sleep(stageDelay);
        assetLog.insertAdjacentHTML('beforeend', '<p>Project catalog ... OK</p>');
        await sleep(stageDelay);
        assetLog.insertAdjacentHTML('beforeend', '<p>Audio channel ... STANDBY</p><p>Ready.</p>');
        await sleep(reducedMotion.matches ? 100 : 300);

        cliInput.disabled = false;
        cliInput.focus();
        setAppOutput(renderProjects());
        announce('Projects section loaded.');
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

    function switchView(view, focusTab = false) {
        const views = {
            projects: () => renderProjects(),
            contact: renderContact,
            prices: renderPrices
        };

        if (!views[view]) return;
        state.activeTab = view;
        state.activeFolder = null;
        setAppOutput(views[view]());
        announce(`${view[0].toUpperCase()}${view.slice(1)} section loaded.`);

        if (focusTab) {
            requestAnimationFrame(() => document.getElementById(`tab-${view}`)?.focus());
        }
    }

    document.addEventListener('click', event => {
        const tabButton = event.target.closest('[data-view]');
        if (tabButton) {
            switchView(tabButton.dataset.view, true);
            return;
        }

        const folderButton = event.target.closest('[data-folder]');
        if (folderButton && folders[folderButton.dataset.folder]) {
            state.activeTab = 'projects';
            state.activeFolder = folderButton.dataset.folder;
            setAppOutput(renderProjects(state.activeFolder));
            announce(`${folders[state.activeFolder].title} folder opened.`);
            requestAnimationFrame(() => document.querySelector(`[data-folder="${state.activeFolder}"]`)?.focus());
            return;
        }

        if (event.target === audioToggle) {
            if (backgroundMusic.paused) startBackgroundMusic();
            else stopBackgroundMusic();
            return;
        }

        if (!event.target.closest('a, button, input')) cliInput.focus();
    });

    document.addEventListener('keydown', event => {
        const activeTab = event.target.closest?.('[role="tab"]');
        if (!activeTab) return;

        const tabOrder = ['projects', 'contact', 'prices'];
        const currentIndex = tabOrder.indexOf(activeTab.dataset.view);
        let nextIndex = null;

        if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabOrder.length;
        if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabOrder.length) % tabOrder.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = tabOrder.length - 1;
        if (nextIndex === null) return;

        event.preventDefault();
        switchView(tabOrder[nextIndex], true);
    });

    function unlockMatrixBackground() {
        if (state.matrixActive) return;
        state.matrixActive = true;
        document.body.classList.add('matrix-unlocked');
        matrixCanvas.style.display = 'block';
        startMatrixRain();
    }

    function prepareMatrixScene() {
        const ctx = matrixCanvas.getContext('2d');
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
        matrixCanvas.width = Math.round(window.innerWidth * pixelRatio);
        matrixCanvas.height = Math.round(window.innerHeight * pixelRatio);
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        const glyphs = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const fontSize = 16;
        const columns = Math.ceil(window.innerWidth / fontSize);
        const drops = Array.from({ length: columns }, () => 1);

        ctx.fillStyle = document.body.classList.contains('geedorah-mode') ? '#ffffff' : '#000000';
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        state.matrixScene = { ctx, glyphs, fontSize, drops };
    }

    function drawMatrixFrame() {
        if (!state.matrixScene) return;
        const { ctx, glyphs, fontSize, drops } = state.matrixScene;
        const geedorahActive = document.body.classList.contains('geedorah-mode');
        ctx.fillStyle = geedorahActive ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = geedorahActive ? '#d71938' : '#00ff66';
        ctx.font = `${fontSize}px monospace`;

        drops.forEach((drop, index) => {
            const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
            ctx.fillText(glyph, index * fontSize, drop * fontSize);
            if (drop * fontSize > window.innerHeight && Math.random() > 0.975) drops[index] = 0;
            drops[index] += 1;
        });
    }

    function runMatrixFrame(timestamp) {
        if (!state.matrixActive || document.hidden || reducedMotion.matches) return;
        if (timestamp - state.matrixLastFrame >= 50) {
            drawMatrixFrame();
            state.matrixLastFrame = timestamp;
        }
        state.matrixFrame = requestAnimationFrame(runMatrixFrame);
    }

    function stopMatrixRain() {
        if (state.matrixFrame) cancelAnimationFrame(state.matrixFrame);
        state.matrixFrame = null;
    }

    function startMatrixRain() {
        stopMatrixRain();
        prepareMatrixScene();
        drawMatrixFrame();
        if (!reducedMotion.matches && !document.hidden) {
            state.matrixFrame = requestAnimationFrame(runMatrixFrame);
        }
    }

    window.addEventListener('resize', () => {
        if (state.matrixActive) startMatrixRain();
    });

    document.addEventListener('visibilitychange', () => {
        if (!state.matrixActive) return;
        if (document.hidden) stopMatrixRain();
        else startMatrixRain();
    });

    reducedMotion.addEventListener('change', () => {
        if (state.matrixActive) startMatrixRain();
    });

    updateEggDisplay();
    if (backgroundMusic) {
        backgroundMusic.volume = 0.0105;
        backgroundMusic.addEventListener('play', updateAudioControl);
        backgroundMusic.addEventListener('pause', updateAudioControl);
    }
    updateAudioControl();
    cliInput.focus();
    runStartupSequence();
});
