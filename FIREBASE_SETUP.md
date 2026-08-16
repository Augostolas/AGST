# Firebase discovery counter

The portfolio increments `discoveries/global_count` whenever a visitor finds an easter egg for the first time during a session.

## Realtime Database

1. Open the Firebase console.
2. Create or select the `agst-77e17` project.
3. Enable Realtime Database in locked mode.
4. Confirm that the web app values in `config.js` match the project settings.
5. Add these database rules:

```json
{
  "rules": {
    "discoveries": {
      "global_count": {
        ".read": false,
        ".write": "newData.isNumber() && newData.val() == (data.exists() ? data.val() + 1 : 1)"
      }
    }
  }
}
```

These rules only permit numeric increments of one. Because the browser is still an untrusted client, enable Firebase App Check enforcement for Realtime Database before treating the count as reliable analytics.

The Firebase web configuration is public by design. Security depends on Database Rules, App Check, and API restrictions rather than hiding the configuration object.

## Local development

ES modules do not run reliably from `file://`. Start a local HTTP server from the repository root:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

If Firebase is unavailable, the portfolio remains usable and only the global discovery increment is skipped.
