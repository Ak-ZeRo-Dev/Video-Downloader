import { intro, select, text } from "@clack/prompts";
import { spawn } from "child_process";
// Define the download types (playlist or video)
var DownloadType;
(function (DownloadType) {
    DownloadType["PLAYLIST"] = "playlist";
    DownloadType["VIDEO"] = "video";
})(DownloadType || (DownloadType = {}));
// Define available quality options
const qualities = {
    1080: "1080",
    720: "720",
    480: "480",
    360: "360",
    240: "240",
    144: "144",
};
// Basic URL validation: ensures the URL starts with http:// or https://
function isValidUrl(url) {
    return /^https?:\/\//.test(url);
}
// Basic validation for the save path (can be extended for more robust checking)
function isValidPath(path) {
    return path.trim().length > 0;
}
// Array to keep track of spawned child processes
const childProcesses = [];
// Handle Ctrl+C (SIGINT) to exit immediately and kill all child processes
process.on("SIGINT", () => {
    console.log("\nExiting...");
    childProcesses.forEach((child) => child.kill("SIGINT"));
    process.exit();
});
async function main() {
    try {
        intro("Welcome to Ak-ZeRo Video Downloader");
        const { PLAYLIST, VIDEO } = DownloadType;
        // Ask the user to choose what to download
        const downloadType = await select({
            message: "What do you want to download?",
            options: [
                { value: PLAYLIST, label: PLAYLIST },
                { value: VIDEO, label: VIDEO },
            ],
            initialValue: VIDEO,
        });
        const isPlaylist = downloadType === PLAYLIST;
        // Get the URL from the user.
        // If the input is empty, exit immediately without error.
        const urlInput = String(await text({
            message: "Enter the URL:",
        }));
        if (!urlInput || urlInput.trim() === "") {
            process.exit();
        }
        if (!isValidUrl(urlInput)) {
            throw new Error("Invalid URL. Please ensure it starts with http:// or https://");
        }
        const url = urlInput;
        // Ask the user to select the quality; use 720 directly as the initial value
        const quality = await select({
            message: "Select a quality:",
            options: Object.entries(qualities).map(([key, value]) => ({
                value: Number(key),
                label: value,
            })),
            initialValue: 720,
        });
        // Get the save path from the user and validate it.
        // If the input is empty, exit immediately.
        const savePathInput = String(await text({
            message: "Enter the save path:",
        }));
        if (!savePathInput || savePathInput.trim() === "") {
            process.exit();
        }
        if (!isValidPath(savePathInput)) {
            throw new Error("Invalid save path. Please enter a valid path.");
        }
        const savePath = savePathInput;
        // Start the download process based on the selected type
        if (isPlaylist) {
            await downloadPlaylist(String(url), Number(quality), savePath);
        }
        else {
            await downloadVideo(String(url), Number(quality), savePath);
        }
    }
    catch (error) {
        // If the error was triggered by an intentional exit (or cancellation),
        // avoid printing the error message.
        if (error.message && error.message.toLowerCase().includes("invalid url")) {
            // Only print error if the error is not from an intentional cancel.
            console.error("An error occurred:", error.message);
        }
    }
}
/**
 * Function to download a playlist.
 * It includes folder naming options and constructs yt-dlp parameters.
 */
async function downloadPlaylist(url, quality, savePath) {
    try {
        const folderOption = await select({
            message: "Choose folder naming scheme:",
            options: [
                { value: "default", label: "Default (using playlist name)" },
                { value: "custom", label: "Custom name" },
            ],
            initialValue: "default",
        });
        let folderName = "";
        if (folderOption === "custom") {
            const folderInput = String(await text({
                message: "Enter the folder name:",
            }));
            if (!folderInput || folderInput.trim() === "") {
                process.exit();
            }
            folderName = folderInput;
        }
        else {
            // Use the playlist title as the folder name
            folderName = "%(playlist_title)s";
        }
        // Configure yt-dlp command arguments with fallback to best quality if specified quality is not available
        const args = [
            "-f",
            `bestvideo[height=${quality}]+bestaudio/best[height=${quality}]/best`,
            "-o",
            // All videos will be saved inside a single folder named after the playlist.
            `${savePath}/${folderName}/%(playlist_index)s - %(title)s.%(ext)s`,
            "--merge-output-format",
            "mp4",
            "--newline",
            url,
        ];
        console.log("🚀 Downloading Playlist...");
        const ytDlpProcess = spawn("yt-dlp", args);
        // Keep track of the process so we can kill it on SIGINT
        childProcesses.push(ytDlpProcess);
        // Output live data from stdout
        ytDlpProcess.stdout.setEncoding("utf8");
        ytDlpProcess.stdout.on("data", (data) => {
            process.stdout.write(data);
        });
        // Output any errors from stderr
        ytDlpProcess.stderr.setEncoding("utf8");
        ytDlpProcess.stderr.on("data", (data) => {
            process.stderr.write(data);
        });
        ytDlpProcess.on("close", (code) => {
            if (code === 0) {
                console.log("✅ Playlist downloaded successfully");
            }
            else {
                console.error(`❌ Process exited with code ${code}`);
            }
        });
    }
    catch (error) {
        console.error(`Error downloading playlist: ${error.message}`);
    }
}
/**
 * Function to download a single video.
 * It constructs yt-dlp parameters and spawns the download process.
 */
async function downloadVideo(url, quality, savePath) {
    try {
        // Configure yt-dlp command arguments with fallback to best quality if specified quality is not available
        const args = [
            "-f",
            `bestvideo[height=${quality}]+bestaudio/best[height=${quality}]/best`,
            "-o",
            `${savePath}/%(title)s.%(ext)s`,
            "--merge-output-format",
            "mp4",
            "--no-playlist",
            "--newline",
            url,
        ];
        console.log("🚀 Downloading video...");
        const ytDlpProcess = spawn("yt-dlp", args);
        // Track the process for immediate exit on SIGINT
        childProcesses.push(ytDlpProcess);
        // Output live data from stdout
        ytDlpProcess.stdout.setEncoding("utf8");
        ytDlpProcess.stdout.on("data", (data) => {
            process.stdout.write(data);
        });
        // Output any errors from stderr
        ytDlpProcess.stderr.setEncoding("utf8");
        ytDlpProcess.stderr.on("data", (data) => {
            process.stderr.write(data);
        });
        ytDlpProcess.on("close", (code) => {
            if (code === 0) {
                console.log("✅ Video downloaded successfully");
            }
            else {
                console.error(`❌ Process exited with code ${code}`);
            }
        });
    }
    catch (error) {
        console.error(`❌ Error downloading video: ${error.message}`);
    }
}
main();
