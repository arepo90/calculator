const { BrowserWindow } = require("electron")
const { join } = require("path")
const { autoUpdater } = require("electron-updater")
const remote = require("@electron/remote/main")
const config = require("./config")

exports.createMainWindow = async () => {
	const window = new BrowserWindow({
		width: 1280,	//920
		height: 880,	//700
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			devTools: config.isDev,
			contextIsolation: false,
		},
		frame: false,
		icon: join(__dirname, "..", "/favicon.ico"),
		title: "Rotas Calculator",
	})

	remote.enable(window.webContents)

	await window.loadURL(
		config.isDev
			? "http://localhost:3000"
			: `file://${join(__dirname, "..", "../build/index.html")}`,
	)

	window.once("ready-to-show", () => {
		autoUpdater.checkForUpdatesAndNotify()
	})

	window.on("close", (e) => {
		if (!config.isQuiting) {
			e.preventDefault()
			window.hide()
		}
	})

	return window
};
