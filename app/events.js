
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');


class IpcEvents {
	mainWindow = null;
	
	constructor(win) {
		this.mainWindow = win;
	}

	/**
	 * Sets up the Electron IPC (Inter-Process Communication) listeners for file saving and directory retrieval.
	 * These listeners handle the communication between the main and renderer processes.
	 */
	setUpListeners() {
		ipcMain.on('save-file', this.writeFileToLocation)
		ipcMain.on('get-default-download-directory', this.getDefaultDownloadDirectory)
		ipcMain.on('get-output-directory', this.getOutputDirectory)
	}


	/**
	 * Writes the provided array buffer to a file at the specified output path or the default downloads directory.
	 * It converts the array buffer to a buffer and saves it to the file.
	 * @param {Event} event - The event object that triggered the function.
	 * @param {ArrayBuffer} arrayBuffer - The array buffer to be written to the file.
	 * @param {string} fileName - The name of the file to be saved.
	 * @param {string} outputPath - (Optional) The output path where the file should be saved. If not provided, the default downloads directory will be used.
	 */
	writeFileToLocation = (event, arrayBuffer, fileName, outputPath = null) => {
		const buffer = Buffer.from(arrayBuffer)

		const fileSavePath = path.join(((outputPath) ? outputPath : app.getPath('downloads')), fileName)

		fs.writeFile(fileSavePath, buffer, (error) => {
			if (error) {
				console.log(error)
			} else {
				console.log('file saved')
			}
		});
	}


	/**
	 * Retrieves the default downloads directory path and sends it to the renderer process.
	 * @param {Event} event - The event object that triggered the function.
	 */
	getDefaultDownloadDirectory = (event) => {
		const webContents = event.sender
		const win = BrowserWindow.fromWebContents(webContents)
		const path = app.getPath('downloads');

		win.webContents.send('get-default-download-directory', path)
	}


	/**
	 * Opens a dialog to allow the user to select an output directory and sends the selected path to the renderer process.
	 * @param {Event} event - The event object that triggered the function.
	 */
	getOutputDirectory = (event) => {
		const webContents = event.sender
		const win = BrowserWindow.fromWebContents(webContents)

		dialog.showOpenDialog(win, {
			properties: ['openDirectory']
		}).then(result => {
			if (!result.canceled) {
				win.webContents.send('get-output-directory', result.filePaths[0])
			}
		}).catch(err => {
			console.log(err)
		})
	}

}

module.exports = IpcEvents