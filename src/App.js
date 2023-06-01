import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import './assets/scss/App.scss';


import Sidebar from './components/Sidebar/index';
import WorkingArea from './components/WorkingArea';
import SplashScreen from './components/SplashScreen';

import { removeFile } from './redux/filesSlice';

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const darkTheme = createTheme({
	palette: {
		mode: 'dark',

		primary: {
			main: '#1684ac',
			darker: '#1684ac',
		},
	},
	typography: {
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
		fontSize: 12,
		spacing: 4,
	},
});

function App() {
	const dispatch = useDispatch()
	const settings = useSelector((state) => state.settings)
	const outputSettings = useSelector((state) => state.outputSettings)
	const files = useSelector((state) => state.files)
	const [appLoading, setAppLoading] = useState(true)
	const [isProcessing, setIsProcessing] = useState(false)
	const [processingError, setProcessingError] = useState(null)

	useEffect(() => {
		// Subscribes to the fileSaved event and remove file from files array once its saved.
		window.electronAPI.fileSaved((event, id, fileName) => {
			dispatch(removeFile(id))
		})
		
		// Subscribes to the fileSavedError event and stop processing on error.
		window.electronAPI.fileSavedError((event, error, id, fileName) => {
			setProcessingError(`ERROR: Something went wrong!`)
			setIsProcessing(false);
		})
	}, [])

	useEffect(() => {
		/**
		 * If files array changed and isProcessing is true, then save the next files 
		 * - it should updated when file is saved and removed from files array
		 */
		if (isProcessing) {
			saveNextFile()
		}
	}, [files])

	/**
	 * Initiates the processing of files.
	 * - Sets the processing flag to true.
	 * - Starts saving the next file.
	 */
	const startProcessing = async () => {
		if (files.length === 0) return

		setIsProcessing(true);
		saveNextFile()
	}

	/**
	 * Saves the next file in the files array.
	 * - If there are no more files, opens the output directory and resets the processing flag.
	 * - Otherwise, calls the saveFileToLocation method for the first file in the array.
	 */
	const saveNextFile = () => {
		if (files.length === 0) {
			window.electronAPI.openOutputDirectory(outputSettings.outputDirectory)
			setIsProcessing(false);
			return
		}

		saveFileToLocation(files[0])
	}

	/**
	 * Saves the file to the specified location.
	 * - Creates a canvas element and sets its dimensions.
	 * - Calculates the target width and height based on the settings and original image dimensions.
	 * - Draws the image on the canvas, applying cropping if enabled.
	 * - Converts the canvas content to a blob with the specified format and quality.
	 * - Calls the saveFile method from the electronAPI to save the file to the output directory.
	 * @param {Object} fileObj - The file object to be saved.
	 * @returns {Promise} - A promise that resolves when the file is saved.
	 */
	const saveFileToLocation = (fileObj) => {
		return new Promise((resolve, reject) => {

			let targetWidth = settings.width;
			let targetHeight = settings.height;

			const fx = fileObj.focalX;
			const fy = fileObj.focalY;

			const originalWidth = fileObj.originalWidth;
			const originalHeight = fileObj.originalHeight;

			// Adjust target dimensions based on settings
			if (settings.disableCrop) {
				targetWidth = fileObj.originalWidth;
				targetHeight = fileObj.originalHeight;
			} else if (settings.autoWidth) {
				targetWidth = (originalWidth * targetHeight) / originalHeight;
			} else if (settings.autoHeight) {
				targetHeight = (originalHeight * targetWidth) / originalWidth;
			}
			const canvas = document.createElement("canvas");
			canvas.width = targetWidth;
			canvas.height = targetHeight;
			const con = canvas.getContext("2d");
			
			let scale = Math.min(originalWidth / targetWidth, originalHeight / targetHeight);
			let sourceWidth = targetWidth * scale;
			let sourceHeight = targetHeight * scale;

			let output = outputFormat(fileObj, targetWidth, targetHeight);
			
			// Draw a white background for transparent images when saving as JPEG
			if (output.format === "image/jpeg" && fileObj.file.type !== 'image/jpeg') {
				con.fillStyle = "white";
				con.fillRect(0, 0, targetWidth, targetHeight);
			}


			// Draw the image on the canvas with cropping
			con.drawImage(
				fileObj.image, 
				(originalWidth - sourceWidth) * fx,		// source image x
				(originalHeight - sourceHeight) * fy,	// source image y
				sourceWidth,							// source image width
				sourceHeight,							// source image height
				0,										// destination canvas x
				0,										// destination canvas y
				targetWidth,							// destination canvas width
				targetHeight							// destination canvas height
			);
			

			const quality = outputSettings.outputQuality / 100;

			const fileName = `${output.fileName}.${output.ext}`;
			
			// Convert the canvas content to a blob and save the file
			canvas.toBlob(
				async blob => {
					const arrayBuffer = await blob.arrayBuffer();

					window.electronAPI.saveFile(
						arrayBuffer, 
						fileObj.id, 
						fileName, 
						outputSettings.outputDirectory
					)

					resolve()
				},
				output.format,
				quality
			);
		})
	}

	/**
	 * Determines the output format and file name for the given file object.
	 * - Extracts the file extension from the original file name.
	 * - Generates the output file name based on the specified pattern or original file name.
	 * - Sets the output format and returns the output object.
	 * @param {Object} fileObj - The file object for which the output format is determined.
	 * @param {number} outputWidth - The target output width.
	 * @param {number} outputHeight - The target output height.
	 * @returns {Object} - The output object containing the format, extension, and file name.
	 */
	const outputFormat = (fileObj, outputWidth, outputHeight) => {
		const dot_index = fileObj.file.name.lastIndexOf(".");
		const extension = fileObj.file.name.substr(dot_index + 1);
		let fileName = fileObj.id;

		if (outputSettings.outputFileName === 'pattern') {
			fileName = outputSettings.outputFileNamePattern;

			// Checks if the fileName pattern contains the placeholder [uuid].
			// If present, replaces the [uuid] placeholder with the unique v4 uuid
			if (fileName.indexOf('[uuid]') !== -1) {
				fileName = fileName.replace('[uuid]', fileObj.id)
			}

			// Checks if the fileName pattern contains the placeholder [numb].
			// If present, replaces the [numb] placeholder with a random number
			if (fileName.indexOf('[numb]') !== -1) {
				fileName = fileName.replace('[numb]', Math.random().toString().slice(2,12))
			}

			// Checks if the fileName pattern contains the placeholder [size].
			// If present, replaces the [size] placeholder with the outputWidth and outputHeight 
			if (fileName.indexOf('[size]') !== -1) {
				fileName = fileName.replace('[size]', `${outputWidth}x${outputHeight}`)
			}

			// Checks if the fileName pattern contains the placeholder [auto].
			// If present, replaces the [auto] placeholder with the number of remaining files in the files array
			if (fileName.indexOf('[auto]') !== -1) {
				fileName = fileName.replace('[auto]', files.length)
			}
		}
		else if (outputSettings.outputFileName === 'original') {
			// get original file name without extension
			fileName = fileObj.file.name.substr(0, dot_index)
		}


		// Determine the output format based on the specified settings or file extension
		if (outputSettings.outputFormat === "jpeg") {
			return { ext: "jpg", format: "image/jpeg", fileName };
		}
		if (outputSettings.outputFormat === "webp") {
			return { ext: "webp", format: "image/webp", fileName };
		}
		if (outputSettings.outputFormat === "png") {
			return { ext: "png", format: "image/png", fileName };
		}

		// Preserve the original format if recognized, default to JPEG
		switch (extension.toLowerCase()) {
			case "png":
				return { ext: "png", format: "image/png", fileName };
			case "jpg":
			case "jpeg":
				return { ext: extension, format: "image/jpeg", fileName };
			case "webp":
				return { ext: "webp", format: "image/webp", fileName };
			default:
				return { ext: "jpg", format: "image/jpeg", fileName };
		}
	}

	return (
		<>
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			{appLoading ? <SplashScreen setAppLoading={setAppLoading} /> : (
			<div id='appContainer'>
				<Sidebar startProcessing={startProcessing} isProcessing={isProcessing} />
				<WorkingArea isProcessing={isProcessing} />

				<Snackbar 
					open={processingError !== null} 
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
					autoHideDuration={6000} 
					onClose={() => setProcessingError(null)}
				>
					<Alert onClose={() => setProcessingError(null)} severity="error">{processingError}</Alert>
				</Snackbar>
			</div>
			)}
		</ThemeProvider>
		</>
	)
}

export default App;
