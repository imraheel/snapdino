import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import './assets/scss/App.scss';


import Sidebar from './components/Sidebar/index';
import WorkingArea from './components/WorkingArea';
import SplashScreen from './components/SplashScreen';



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
	const files = useSelector((state) => state.files)
	const [appLoading, setAppLoading] = useState(true)
	const [isProcessing, setIsProcessing] = useState(false)

	useEffect(() => {
		console.log('App initialized')
	}, [])

	const startProcessing = async () => {
		console.log(settings.outputDirectory)
		if (files.length === 0) return

		for (let file of files) {
			await saveFileToLocation(file)
		}
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

			let output = outputFormat(fileObj.file);
			// Draw a white background for transparent images
			if (output.format == "image/jpeg" && fileObj.file.type !== 'image/jpeg') {
				con.fillStyle = "white";
				con.fillRect(0, 0, tw, th);
			}

			/*******************************************
			 * Border
			 ******************************************/
			let hw = 0;
			if (settings.borderWidth > 0) {
				con.lineWidth = settings.borderWidth;
				con.strokeStyle = settings.borderColor;
				hw = settings.borderWidth / 2;
				con.strokeRect(hw, hw, tw - hw * 2, th - hw * 2);
			}

			/*******************************************
			 * Image after the border
			 ******************************************/
			con.drawImage(img, (iw - srcw) * fx, (ih - srch) * fy, srcw, srch, hw, hw, tw - hw * 2, th - hw * 2);
			

			let quality = 1;
			if (output.format == "image/jpeg") {
				quality = settings.outputQuality / 100;
			} else if (output.format == "image/webp") {
				quality = settings.outputQuality / 100;
			}

			const filename = Math.random().toString(36).substring(2, 15) + "." + output.ext;
			
			canvas.toBlob(
				async blob => {
					const arrayBuffer = await blob.arrayBuffer();
					// saveAs(blob, filename);
					window.electronAPI.setFile(arrayBuffer, filename, settings.outputDirectory)
					resolve()
				},
				output.format,
				quality
			);
		})
	}

	const outputFormat = (file) => {
		if (settings.outputFormat == "jpeg") {
			return { ext: "jpg", format: "image/jpeg" };
		}
		if (settings.outputFormat == "webp") {
			return { ext: "webp", format: "image/webp" };
		}

		const dot_index = file.name.lastIndexOf(".");
		const extension = file.name.substr(dot_index + 1);
		// Preserve format
		switch (extension.toLowerCase()) {
			case "png":
				return { ext: "png", format: "image/png" };
			case "jpg":
			case "jpeg":
				return { ext: extension, format: "image/jpeg" };
			case "webp":
				return { ext: "webp", format: "image/webp" };
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
