import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import './assets/scss/App.scss';


import Sidebar from './components/Sidebar/index';
import WorkingArea from './components/WorkingArea';
import SplashScreen from './components/SplashScreen';

import { removeFile } from './redux/filesSlice';



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

	useEffect(() => {
		console.log('App initialized')

		window.electronAPI.fileSaved((event, id, fileName) => {
			console.log('fileSaved: ', id, fileName)
			dispatch(removeFile(id))
		})

	}, [])

	useEffect(() => {
		if (isProcessing) {
			saveNextFile()
		}
	}, [files])

	const startProcessing = async () => {
		if (files.length === 0) return

		setIsProcessing(true);
		saveNextFile()
	}

	const saveNextFile = () => {
		if (files.length === 0) {
			window.electronAPI.openOutputDirectory(outputSettings.outputDirectory)
			setIsProcessing(false);
			return
		}

		saveFileToLocation(files[0])
	}

	const saveFileToLocation = (fileObj) => {
		return new Promise((resolve, reject) => {
			let img = fileObj.image;

			let tw = settings.width;
			let th = settings.height;

			const fx = fileObj.focalX;
			const fy = fileObj.focalY;

			const iw = fileObj.originalWidth;
			const ih = fileObj.originalHeight;

			if (settings.disableCrop) {
				tw = fileObj.originalWidth;
				th = fileObj.originalHeight;
			} else if (settings.autoWidth) {
				tw = (iw * th) / ih;
			} else if (settings.autoHeight) {
				th = (ih * tw) / iw;
			}
			let canvas = document.createElement("canvas");
			canvas.width = tw;
			canvas.height = th;
			let con = canvas.getContext("2d");
			// con.imageSmoothingEnabled = true;
			// con.imageSmoothingQuality = "medium";
			let scale = Math.min(iw / tw, ih / th);
			let srcw = tw * scale;
			let srch = th * scale;

			let output = outputFormat(fileObj, tw, th);
			console.log({output})
			// Draw a white background for transparent images
			if (output.format === "image/jpeg" && fileObj.file.type !== 'image/jpeg') {
				con.fillStyle = "white";
				con.fillRect(0, 0, tw, th);
			}


			/*******************************************
			 * Draw Image on canvas
			 ******************************************/
			con.drawImage(img, (iw - srcw) * fx, (ih - srch) * fy, srcw, srch, 0, 0, tw, th);
			

			const quality = outputSettings.outputQuality / 100;

			const fileName = `${output.fileName}.${output.ext}`;
			
			canvas.toBlob(
				async blob => {
					const arrayBuffer = await blob.arrayBuffer();
					window.electronAPI.saveFile(arrayBuffer, fileObj.id, fileName, outputSettings.outputDirectory)
					resolve()
				},
				output.format,
				quality
			);
		})
	}

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


		// create output object
		if (outputSettings.outputFormat === "jpeg") {
			return { ext: "jpg", format: "image/jpeg", fileName };
		}
		if (outputSettings.outputFormat === "webp") {
			return { ext: "webp", format: "image/webp", fileName };
		}
		if (outputSettings.outputFormat === "png") {
			return { ext: "png", format: "image/png", fileName };
		}

		// Preserve format
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
			</div>
			)}
		</ThemeProvider>
		</>
	)
}

export default App;
