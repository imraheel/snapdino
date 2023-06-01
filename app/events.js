
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
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
		ipcMain.on('open-output-directory', this.openOutputDirectory)
	}


	/**
	 * Writes the provided array buffer to a file at the specified output path or the default downloads directory.
	 * It converts the array buffer to a buffer and saves it to the file.
	 * @param {Event} event - The event object that triggered the function.
	 * @param {ArrayBuffer} arrayBuffer - The array buffer to be written to the file.
	 * @param {string} id - Unique identifier of the file to be saved.
	 * @param {string} fileName - The name of the file to be saved.
	 * @param {string} outputPath - (Optional) The output path where the file should be saved. If not provided, the default downloads directory will be used.
	 */
	writeFileToLocation = (event, arrayBuffer, id, fileName, outputPath = null) => {
		const webContents = event.sender
		try {
			const buffer = Buffer.from(arrayBuffer)
	
			const fileSavePath = path.join(((outputPath) ? outputPath : app.getPath('downloads')), fileName)
	
			fs.writeFile(fileSavePath, buffer, (error) => {
				if (error) {
					console.log(error)
					webContents.send('file-saved-error', error, id, fileName)
				} else {
					webContents.send('file-saved', id, fileName)
				}
			});
		} catch (error) {
			console.log(error)
			webContents.send('file-saved-error', error, id, fileName)
		}
	}


	/**
	 * Retrieves the default downloads directory path and sends it to the renderer process.
	 * @param {Event} event - The event object that triggered the function.
	 */
	getDefaultDownloadDirectory = (event) => {
		const webContents = event.sender
		const path = app.getPath('downloads');

		webContents.send('get-default-download-directory', path)
	}


	/**
	 * Opens a dialog to allow the user to select an output directory and sends the selected path to the renderer process.
	 * @param {Event} event - The event object that triggered the function.
	 */
	getOutputDirectory = (event) => {
		const webContents = event.sender
		const win = BrowserWindow.fromWebContents(webContents)

		dialog.showOpenDialog(win, {
			properties: ['openDirectory', 'createDirectory']
		}).then(result => {
			if (!result.canceled) {
				webContents.send('get-output-directory', result.filePaths[0])
			}
		}).catch(err => {
			console.log(err)
		})
	}

	/**
	 * Opens the given output directory in the desktop's default manner.
	 * @param {Event} event - The event object that triggered the function.
	 * @param {string} outputPath - (Optional) The output path where the file should be saved. If not provided, the default downloads directory will be used.
	 */
	openOutputDirectory = (event, outputPath = null) => {
		outputPath = (outputPath) ? outputPath : app.getPath('downloads')

		// shell.showItemInFolder('filepath') // Show the given file in a file manager. If possible, select the file.
		shell.openPath(outputPath) // Open the given file in the desktop's default manner.
	}
}

module.exports = IpcEvents