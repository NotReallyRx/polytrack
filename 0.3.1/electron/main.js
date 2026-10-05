
const {app, BrowserWindow, shell, ipcMain} = require("electron");
const path = require("path");

app.on("web-contents-created", (event, contents) => {
	// Prevent new windows from being opened
	contents.setWindowOpenHandler(({url}) => {
		if(url == "https://www.kodub.com/" || url == "https://opengameart.org/content/sci-fi-theme-1" || url == "https://www.kodub.com/discord/polytrack") {
			setImmediate(() => {
				shell.openExternal(url)
			});
		}

		return {action: "deny"};
	});

	// Prevents navigating away from index.html
	contents.on("will-navigate", (event, navigationUrl) => {
		event.preventDefault();
	});
});

ipcMain.on("quit", () => {
	app.quit();
});

app.on("window-all-closed", () => {
	app.quit();
});

app.whenReady().then(() => {
	const browserWindow = new BrowserWindow({
		width: 1024,
		height: 800,
		minWidth: 320,
		minHeight: 200,
		fullscreen: true,
		useContentSize: true,
		autoHideMenuBar: true,
		webPreferences: {
			devTools: false,
			preload: path.join(__dirname, "preload.js"),
		},
	});
	browserWindow.removeMenu();

	browserWindow.webContents.on("before-input-event", (event, input) => {
		if(!input.isAutoRepeat && input.type == "keyDown") {
			if(input.code == "F11" || input.alt && input.code == "Enter") {
				browserWindow.setFullScreen(!browserWindow.isFullScreen());
				event.preventDefault();
			}
		}
	});

	browserWindow.loadFile("index.html");
});
