const path = require('path');

const { app, BrowserWindow, session, systemPreferences } = require('electron');
const isDev = true;

process.env['NODE_' + 'ENV'] = process.env.NODE_ENV

function createWindow() {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 1100,
		height: 700,
		webPreferences: {
			nodeIntegration: true,
			// webSecurity: false,
			// allowRunningInsecureContent: true,
		},
		resizable: false,
	});

	// and load the index.html of the app.
	// win.loadFile("index.html");
	win.loadURL(
		isDev
			? 'http://localhost:4100'
			: `file://${path.join(__dirname, 'build/index.html')}`
	);
	// Open the DevTools.
	if (isDev) {
		win.webContents.openDevTools({ mode: 'detach' });
	}
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.allowRendererProcessReuse = false;