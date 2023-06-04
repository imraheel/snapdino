
const path = require('path');
const { app, BrowserWindow, Menu } = require('electron');
const IpcEvents = require('./events');

const isMac = process.platform === 'darwin'

const isDev = require('electron-is-dev');

process.env['NODE_' + 'ENV'] = process.env.NODE_ENV


const template = [
	...(isMac
		? [{
			label: app.name,
			submenu: [
				{ role: 'about' },
				{ type: 'separator' },
				{ role: 'services' },
				{ type: 'separator' },
				{ role: 'hide' },
				{ role: 'hideOthers' },
				{ role: 'unhide' },
				{ type: 'separator' },
				{ role: 'quit' }
			]
		}]
		: []),
	
	{
		label: 'File',
		submenu: [
			isMac ? { role: 'close' } : { role: 'quit' }
		]
	},
	
	{
		label: 'View',
		submenu: [
			{ role: 'reload' },
			{ role: 'forceReload' },
			{ role: 'toggleDevTools' },
			{ type: 'separator' },
			{ role: 'resetZoom' },
			{ role: 'zoomIn' },
			{ role: 'zoomOut' },
			{ type: 'separator' },
			{ role: 'togglefullscreen' }
		]
	},
	
	{
		label: 'Window',
		submenu: [
			{ role: 'minimize' },
			{ role: 'zoom' },
			...(isMac
				? [
					{ type: 'separator' },
					{ role: 'front' },
					{ type: 'separator' },
					{ role: 'window' }
				]
				: [
					{ role: 'close' }
				])
		]
	},

	{
		role: 'help',
		submenu: [
			{
				label: 'Learn More',
				click: async () => {
					const { shell } = require('electron')
					await shell.openExternal('https://github.com/imraheel/snapdino')
				}
			},
			{
				label: 'About',
				click: async () => {
					let aboutWindow = new BrowserWindow({
						width: 300,
						height: 300,
						resizable: false,
						maximizable: false,
						minimizable: false,
						fullscreenable: false,
						center: true,
						alwaysOnTop: true,
						darkTheme: true,
						backgroundColor: '#252931',
						icon: path.join(__dirname, '../', 'build/app-icon/icon-1024.png'),
					});

					aboutWindow.loadURL(`file://${path.join(__dirname, '../', `build/about.html?v=${app.getVersion()}`)}`);

					aboutWindow.on("closed", function() {
						aboutWindow = null;
					});
				}
			}
		]
	}
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

function createWindow() {
	/** 
	 * Create the browser window.
	 */
	const win = new BrowserWindow({
		width: 1100,
		height: 700,
		minWidth: 1080,
		minHeight: 600,
		resizable: true,
		icon: path.join(__dirname, '../', 'build/app-icon/icon-1024.png'),
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
			contextIsolation: true,
		},
	});

	/** 
	 * Sets up the Electron IPC (Inter-Process Communication) listeners for file saving and directory retrieval.
	 */
	const ipcEvents = new IpcEvents(win);
	ipcEvents.setUpListeners();



	win.loadURL(
		isDev
			? 'http://localhost:4100'
			: `file://${path.join(__dirname, '../', 'build/index.html')}`
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