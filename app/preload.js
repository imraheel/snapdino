
/**
 * Exposes Electron API functions to the main world (renderer process) using the context bridge.
 * It allows communication between the main and renderer processes by sending IPC messages.
 */
const { contextBridge, ipcRenderer } = require('electron')


// Expose Electron API functions to the main world
contextBridge.exposeInMainWorld('electronAPI', {
	/**
	* Sends a request to save a file with the provided array buffer, file name, and output path (optional).
	* @param {ArrayBuffer} arrayBuffer - The array buffer to be saved as a file.
	* @param {string} fileName - The name of the file.
	* @param {string} outputPath - (Optional) The output path where the file should be saved.
	*/
	setFile: (arrayBuffer, fileName, outputPath) => ipcRenderer.send('save-file', arrayBuffer, fileName, outputPath),

	/**
	 * Sends a request to retrieve the default download directory.
	 */
	getDefaultDownloadDirectory: () => ipcRenderer.send('get-default-download-directory'),
	/**
	 * Registers a callback function to be called when the default download directory is received.
	 * @param {Function} callback - The callback function to be executed when the default download directory is received.
	 */
	onDefaultDownloadDirectory: (callback) => ipcRenderer.on('get-default-download-directory', callback),
	
	/**
	 * Sends a request to retrieve the output directory.
	 */
	getOutputDirectory: () => ipcRenderer.send('get-output-directory'),
	/**
	 * Registers a callback function to be called when the output directory is received.
	 * @param {Function} callback - The callback function to be executed when the output directory is received.
	 */
	onOutputDirectory: (callback) => ipcRenderer.on('get-output-directory', callback),

})