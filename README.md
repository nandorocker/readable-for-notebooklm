# Readable for NotebookLM by nandorocker

A web extension to improve the readability of Google NotebookLM's "Studio > Note" sidebar using professional typography and Tailwind Typography (prose). Works on Chrome and Firefox.

## Features

- **Toggle Mode**: Enable or disable readability mode via the extension popup.
- **Professional Typography**: Applies Tailwind CSS Typography (`prose`) for better line height, font sizing, and spacing.
- **Persistent State**: Your preference is saved and applied automatically across sessions.
- **Native Experience**: Preserves citation markers and all native NotebookLM functionality.

## Installation (Development Mode)

1. Open Firefox and go to `about:debugging`.
2. Click on **"This Firefox"**.
3. Click **"Load Temporary Add-on..."**.
4. Navigate to your project folder and select the `extension/manifest.json` file.

## Project Structure

- `manifest.json`: Extension configuration.
- `popup/`: UI for the extension toggle.
- `content/`: Logic to inject and apply styles to NotebookLM.
- `styles/`: CSS files including Tailwind and custom readability overrides.
- `icons/`: Extension icons (48x48, 96x96, 128x128).

## Note on Icons
Please ensure you add your own icon files to the `extension/icons/` directory:
- `icon-48.png`
- `icon-96.png`
- `icon-128.png`

## License
MIT

---

Created by Nando Rossi * https://nan.do