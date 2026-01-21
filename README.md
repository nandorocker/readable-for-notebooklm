# Readable for NotebookLM

A browser extension that makes reading Google NotebookLM's "Studio > Note" sidebar actually pleasant. Because if you're going to spend hours learning through NotebookLM, your eyes deserve better than the default experience.

## Why This Exists

I use NotebookLM constantly—it's genuinely my favorite way to learn about anything. But reading the notes has always been painful. The typography is cramped, the spacing is off, and there are zero settings to fix it. After waiting for Google to improve this and realizing they're taking their time, I thought: why not fix it myself?

So here we are. This is my first browser extension, born out of mild frustration and a genuine love for the product.

## Features

- **Toggle Mode**: Enable or disable readability mode via the extension popup
- **Professional Typography**: Applies Tailwind CSS Typography (`prose`) for proper line height, font sizing, and spacing
- **Persistent State**: Your preference is saved and applied automatically across sessions
- **Native Experience**: Preserves citation markers and all native NotebookLM functionality

## Installation

### Standard Installation (Chrome/Edge)

1. Download the latest release from the [Releases](../../releases) page
2. Unzip the downloaded file
3. Open Chrome/Edge and navigate to `chrome://extensions/`
4. Enable **"Developer mode"** using the toggle in the top right
5. Click **"Load unpacked"**
6. Select the unzipped extension folder
7. Done! Visit NotebookLM and toggle the extension from the popup

### Standard Installation (Firefox)

1. Download the latest `.xpi` file from the [Releases](../../releases) page
2. Open Firefox and navigate to `about:addons`
3. Click the gear icon and select **"Install Add-on From File..."**
4. Select the downloaded `.xpi` file
5. Approve the installation when prompted

### Development Installation (Firefox)

1. Open Firefox and go to `about:debugging`
2. Click on **"This Firefox"**
3. Click **"Load Temporary Add-on..."**
4. Navigate to your project folder and select the `extension/manifest.json` file

### Development Installation (Chrome/Edge)

1. Open Chrome/Edge and navigate to `chrome://extensions/`
2. Enable **"Developer mode"**
3. Click **"Load unpacked"**
4. Select the `extension` folder from this repository

## Project Structure

```
extension/
├── manifest.json       # Extension configuration
├── popup/              # UI for the extension toggle
├── content/            # Logic to inject and apply styles
├── styles/             # CSS files (Tailwind + custom overrides)
└── icons/              # Extension icons (48x48, 96x96, 128x128)
```

## Note on Icons

If you're building from source, add your own icon files to the `extension/icons/` directory:
- `icon-48.png`
- `icon-96.png`
- `icon-128.png`

## Credits

Built with assistance from Claude (Anthropic), GitHub Copilot, and Gemini. AI helping AI out.

## License

MIT

---

Created by Nando Rossi • [nan.do](https://nan.do)