# 🎥 Ak-ZeRo Video Downloader

A CLI tool built with TypeScript that allows you to download videos or playlists from YouTube using `yt-dlp`.

---

## 🧠 Features

- Download single videos or entire playlists
- Choose from various quality options (1080p down to 144p)
- Custom folder naming for playlists
- Live progress display during downloads
- Graceful shutdown on Ctrl+C (kills child processes)

---

## 🛠️ Requirements

- **Node.js** (v18 or newer)
- **yt-dlp** must be installed globally on your system
- **ffmpeg** must be installed and accessible from your system's PATH (used to merge video and audio)

Install required tools:

```bash
# Install yt-dlp
# Windows (using pip)
pip install yt-dlp

# Or using Chocolatey
choco install yt-dlp

# macOS (with Homebrew)
brew install yt-dlp


# Install ffmpeg
# Windows (using Chocolatey)
choco install ffmpeg

# macOS (with Homebrew)
brew install ffmpeg

# Linux (Debian/Ubuntu)
sudo apt install ffmpeg
```

---

## 🚀 How to Run

1. Install dependencies:

```bash
pnpm install
```

2. Build the TypeScript project:

```bash
pnpm run build
```

3. Run the script:

```bash
pnpm run start
```

---

## 🛠️ Development Mode

### To run the script in development (without compiling):

1. Install tsx globally or as a dev dependency:

```bash
pnpm add -D tsx
```

2. Then you can run the script directly:

```bash
npx tsx script.ts
```

---

## 📂 Project Structure

```bash
├── script.ts        # Entry point (main script)
├── package.json
├── tsconfig.json   # TypeScript configuration
└── dist/           # Compiled JS output (after build)
```

---

## 💻 Usage with PowerShell

To simplify running the downloader from PowerShell, you can create a custom function so that you only need to type `yt-download` from any location. After you run this command, the interactive CLI will prompt you for the URL (and other details such as quality and save path).

### 1. Create a PowerShell Function

Follow these steps to set up the function:

1. Open your **PowerShell profile** file by running:

   ```powershell
   notepad.exe $PROFILE
   ```

2. Add the following function to your profile file. Update the `$Path` variable to point to the folder where your compiled script is located (for example, the `dist` folder):

   ```powershell
   function yt-download {
     $Path = "C:\path\to\your\project\dist"  # Update this to your project's dist folder path
     node "$Path/script.js"  # Run the compiled JavaScript file using Node.js
   }
   ```

3. Save the profile file and either restart PowerShell or run:

   ```powershell
   . $PROFILE
   ```

### 2. Running the Downloader

Once the function is added, you can launch the downloader by simply typing:

```powershell
yt-download
```

The script will start and display the welcome message. It will then prompt you with the following steps:

1. **Choose Download Type**: Select whether you want to download a single video or an entire playlist.
2. **Enter URL**: Type or paste the URL of the video or playlist you want to download.
3. **Select Quality**: Choose the desired video quality (from 1080p to 144p).
4. **Enter Save Path**: Provide the path where you want to save the downloaded file(s).

_Example Usage:_

1. Open PowerShell.
2. Type `yt-download` and press Enter.
3. When prompted, enter the URL (e.g., `https://www.youtube.com/watch?v=example`), then follow the remaining prompts.

### Alternative: Running in Development Mode

If you prefer not to compile every time, modify the function to use `tsx` and run the TypeScript file directly:

```powershell
function yt-download {
  $Path = "C:\path\to\your\project"  # Update this to your project folder path
  npx tsx "$Path/script.ts"
}
```

This will allow you to run the script directly in development mode without compiling it first.

---

## 💡 Note:

- Ensure that Node.js is installed and available on your system’s PATH.
- The PowerShell function assumes that you have already built the TypeScript files using `pnpm run build` (unless you choose the development mode option).

---

## ✍️ Author

**Abdul Rahman Mahmoud Saeed Muhammad Al-Kurdi**

**_Ak-ZeRo_**

- 💼 **[Portfolio](https://ak-zero.vercel.app)**
- 📧 **[abdulrahman.mahmoud.alkurdi@gmail.com](mailto:abdulrahman.mahmoud.alkurdi@gmail.com)**

---
