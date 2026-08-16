import { access, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const script = await readFile(path.join(root, 'script.js'), 'utf8');
const errors = [];

const requireText = (source, text, label) => {
    if (!source.includes(text)) errors.push(`Missing ${label}.`);
};

requireText(html, 'name="description"', 'meta description');
requireText(html, 'property="og:title"', 'Open Graph title');
requireText(html, 'rel="canonical"', 'canonical URL');
requireText(html, 'preload="none"', 'non-preloading background audio');
if (!/type="module" src="script\.js(?:\?[^\"]*)?"/.test(html)) errors.push('Missing module entry point.');
requireText(script, 'loading="lazy"', 'lazy-loaded project previews');

if (html.includes('firebase-app.js"></script>')) errors.push('Legacy Firebase script tag is still present.');
if (script.includes('firebase.initializeApp')) errors.push('Legacy Firebase namespace API is still present.');

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicateIds.length) errors.push(`Duplicate HTML IDs: ${duplicateIds.join(', ')}.`);

const localAssets = new Set();
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const reference = match[1];
    if (!reference.includes(':') && !reference.startsWith('#')) localAssets.add(reference.split(/[?#]/, 1)[0]);
}
for (const match of script.matchAll(/['"](assets\/[^'"]+)['"]/g)) localAssets.add(match[1]);

for (const reference of localAssets) {
    try {
        await access(path.join(root, reference));
    } catch {
        errors.push(`Missing local asset: ${reference}.`);
    }
}

async function listFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) files.push(...await listFiles(entryPath));
        else files.push(entryPath);
    }
    return files;
}

const assetFiles = await listFiles(path.join(root, 'assets'));
const gifFiles = assetFiles.filter(file => path.extname(file).toLowerCase() === '.gif');
if (gifFiles.length) errors.push(`Unexpected GIF assets: ${gifFiles.map(file => path.relative(root, file)).join(', ')}.`);

let assetBytes = 0;
for (const file of assetFiles) assetBytes += (await stat(file)).size;
const assetMegabytes = assetBytes / 1024 / 1024;
if (assetMegabytes > 35) errors.push(`Asset bundle is ${assetMegabytes.toFixed(2)} MB; limit is 35 MB.`);

if (errors.length) {
    console.error(errors.map(error => `- ${error}`).join('\n'));
    process.exitCode = 1;
} else {
    console.log(`Site validation passed. ${localAssets.size} references checked; assets total ${assetMegabytes.toFixed(2)} MB.`);
}
