import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import smartcrop from 'smartcrop';
import loadImage from 'blueimp-load-image';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from '@mui/material/colors';

import pattern from '../assets/images/pattern.svg'
import { removeFile, updateFile } from '../redux/filesSlice';

const maskPattern = new Image(20, 20);
maskPattern.src = pattern;

let isMouseDown = false;
let mouseDownX = 0;
let mouseDownY = 0;
let lastFocalX = 0;
let lastFocalY = 0;
const ImagePreview = ({ fileObj, viewColumns = 3, windowSize }) => {
	const dispatch = useDispatch()
	const settings = useSelector((state) => state.settings)
	const imageContainerRef = useRef(null) 
	const maskRef = useRef(null) 
	const debugRef = useRef(null) 
	const [imageData, setImageData] = useState(null)
	const [cropData, setCropData] = useState(null)

	
	// load image on component mount
	useEffect(() => {
		handleImageLoad();
	}, [])


	useEffect(() => {
		if (imageData) {
			if (maskRef) {
				maskRef.current.width = imageData.image.offsetWidth;
				maskRef.current.height = imageData.image.offsetHeight;

				// subscribe mouse event listeners
				maskRef.current.addEventListener('mousedown', onMouseDown);
				maskRef.current.addEventListener('mouseup', onMouseUp);
				maskRef.current.addEventListener('mousemove', onMouseMove);
			}

			// Initializes the image cropper
			initCropper();

			dispatch(updateFile({
				id: fileObj.id,
				image: imageData.image,
				originalWidth: imageData.originalWidth,
				originalHeight: imageData.originalHeight,
			}))
		}
	
		return () => {
			// unsubscribe mouse event listeners
			if (maskRef && maskRef.current) {
				maskRef.current.removeEventListener('mousedown', onMouseDown);
				maskRef.current.removeEventListener('mouseup', onMouseUp);
				maskRef.current.removeEventListener('mousemove', onMouseMove);
			}
		}
	}, [imageData, settings, viewColumns, windowSize])

	useEffect(() => {
		// Draws the mask when crop settings available
		if (cropData) {
			drawMask()
		}
	}, [cropData])

	/**
	 * Handles the image load event and performs necessary actions.
	 * - Loads the image using the provided file object.
	 * - Updates the image container in the DOM with the loaded image.
	 * - Adjusts the size of the mask element based on the loaded image.
	 * - Sets the image data state with the loaded image data.
	 */
	const handleImageLoad = async () => {
		const data = await loadImage(fileObj.file, {
			meta: false,
			canvas: false,
		})

		// Clear existing content in the image container
		if (imageContainerRef.current) {
			imageContainerRef.current.innerHTML = '';
			// Append the loaded image to the image container
			imageContainerRef.current.appendChild(data.image);
		}

		// Adjust the size of the mask element
		if (maskRef) {
			maskRef.current.width = data.image.offsetWidth;
			maskRef.current.height = data.image.offsetHeight;
		}

		// Set the image data state
		setImageData(data);
	}

	/**
	 * Initializes the cropper based on the settings and image data.
	 * - If manual focal point is enabled, sets the crop data based on the manual focal point.
	 * - If auto focal point is enabled, performs smart cropping using the image data and settings.
	 * - Updates the crop data state with the calculated crop coordinates.
	 */
	const initCropper = async () => {
		if (!settings.autoFocalPoint) {
			// Manual focal point is enabled
			let focalPoint = parseInt(settings.manualFocalPoint)

			// Calculate crop coordinates based on the manual focal point
			setCropData({
				x: (focalPoint % 3) * 0.5,
				y: Math.floor(focalPoint / 3) * 0.5,
			})
			return;
		}

		// Auto focal point is enabled
		const result = await smartcrop.crop(imageData.image, {
			width: settings.width, 
			height: settings.height,
			ruleOfThirds: true,
			debug: settings.debugMode,
		});
		
		// If debug output is available, draw debug information
		if (result.debugOutput) {
			debugDraw(result, true)
		}

		// Set the crop data state with the calculated crop coordinates
		setCropData({...result.topCrop})
	}

	/**
	 * Draws debug information on the canvas.
	 * @param {Object} result - The result object containing debug information.
	 * @param {boolean} showCrop - Determines whether to show the crop rectangle.
	 * @returns {HTMLCanvasElement} - The canvas element with the drawn debug information.
	 */
	const debugDraw = (result, showCrop) => {
		let topCrop = result.debugTopCrop;
		let options = result.debugOptions;
		let output = result.debugOutput;
		let canvas = debugRef.current;
		canvas.width = output.width;
		canvas.height = output.height;
		let ctx = canvas.getContext('2d');
		ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
		ctx.fillRect(topCrop.x, topCrop.y, topCrop.width, topCrop.height);
		let debugOutput = ctx.createImageData(output.width, output.height);
		debugOutput.data.set(output.data);
		for (let y = 0; y < output.height; y++) {
			for (let x = 0; x < output.width; x++) {
				let p = (y * output.width + x) * 4;
				if (showCrop) {
					let I = smartcrop.importance(options, topCrop, x, y);
					if (I > 0) {
						debugOutput.data[p + 1] += I * 32;
					}

					if (I < 0) {
						debugOutput.data[p] += I * -64;
					}
				}
				// visualize alpha (boost) as magenta
				let boost = debugOutput.data[p + 3] / 2;
				debugOutput.data[p] += boost;
				debugOutput.data[p + 2] += boost;
				debugOutput.data[p + 3] = 255;
			}
		}

		ctx.putImageData(debugOutput, 0, 0);
		ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
		if (showCrop) {
			ctx.strokeRect(topCrop.x, topCrop.y, topCrop.width, topCrop.height);
		}
		if (options.boost) {
			ctx.strokeStyle = 'rgba(255, 255, 255, 1.0)';
			for (let i = 0; i < options.boost.length; i++) {
				let b = options.boost[i];
				ctx.strokeRect(b.x, b.y, b.width, b.height);
			}
		}
		return canvas;
	}

	/**
	 * Draws the mask based on the crop settings and image data.
	 * - Calculates the dimensions and focal points based on the settings.
	 * - Draws the mask with a pattern and clears the cropped area.
	 * - Updates the focal points and dispatches the file update action if not in custom focal mode.
	 * @param {boolean} customFocal - Determines if the custom focal point is used.
	 * @param {number} customFx - The custom focal x-coordinate.
	 * @param {number} customFy - The custom focal y-coordinate.
	 */
	const drawMask = (customFocal = false, customFx = 0, customFy = 0) => {

		const tw = settings.width;
		const th = settings.height;
		const fx = customFocal ? customFx : (settings.autoFocalPoint ? (cropData.x / cropData.width) : (cropData.x));
		const fy = customFocal ? customFy : (settings.autoFocalPoint ? (cropData.y / cropData.height) : (cropData.y));
		const w = imageData.image.offsetWidth;
		const h = imageData.image.offsetHeight;
		let nw = w;
		let nh = h;

		if (!(settings.autoWidth || settings.autoHeight || settings.disableCrop)) {
			nw = tw * Math.min(w / tw, h / th);
			nh = th * Math.min(w / tw, h / th);
		}
		
		const ctx = maskRef.current.getContext("2d");
		ctx.fillStyle = ctx.createPattern(maskPattern, "repeat");
		ctx.fillRect(0, 0, w, h);
		ctx.clearRect((w - nw) * fx, (h - nh) * fy, nw, nh);

		if (!customFocal) {
			lastFocalX = fx
			lastFocalY = fy

			dispatch(updateFile({
				id: fileObj.id,
				focalX: fx,
				focalY: fy,
			}))
		}
	}

	/**
	 * Handles the mouse down event on the image.
	 * - Sets the flag to indicate the mouse is down.
	 * - Stores the initial mouse position.
	 * @param {Event} event - The mouse down event.
	 */
	const onMouseDown = (event) => {
		if (settings.autoWidth || settings.autoHeight) return;

		isMouseDown = true;
		mouseDownX = event.clientX;
		mouseDownY = event.clientY;
	}

	/**
	 * Handles the mouse up event on the image.
	 * - Sets the flag to indicate the mouse is up.
	 * - Calculates the new focal point based on the mouse movement and updates it.
	 * @param {Event} event - The mouse up event.
	 */
	const onMouseUp = (event) => {
		isMouseDown = false;

		let newFx = lastFocalX + ((event.clientX - mouseDownX) / imageData.image.offsetWidth) * 2;
		let newFy = lastFocalY + ((event.clientY - mouseDownY) / imageData.image.offsetHeight) * 2;

		newFx = Math.max(0, Math.min(1, newFx));
		newFy = Math.max(0, Math.min(1, newFy));

		lastFocalX = newFx
		lastFocalY = newFy

		dispatch(updateFile({
			id: fileObj.id,
			focalX: newFx,
			focalY: newFy,
		}))
	}

	/**
	 * Handles the mouse move event on the image.
	 * - If the mouse is down, calculates the new focal point based on the mouse movement and updates it.
	 * @param {Event} event - The mouse move event.
	 */
	const onMouseMove = (event) => {
		if (isMouseDown) {

			let newFx = lastFocalX + ((event.clientX - mouseDownX) / imageData.image.offsetWidth) * 2;
			let newFy = lastFocalY + ((event.clientY - mouseDownY) / imageData.image.offsetHeight) * 2;

			newFx = Math.max(0, Math.min(1, newFx));
			newFy = Math.max(0, Math.min(1, newFy));

			if (newFx !== lastFocalX || newFy !== lastFocalY) {
				drawMask(true, newFx, newFy)
			}
		}
	}

	return (
		<Paper elevation={3} sx={{ p: 1, mb: 1, }}>
			{imageData === null ? (
				<>
					<Typography>Loading...</Typography>
				</>
			) : null}

			<div className='preview-container'>
				<canvas 
					className="mask-canvas" 
					ref={maskRef}
					width={0} 
					height={0} 
					style={{ top: 0, left: 0 }} 
				/>
				<div ref={imageContainerRef}></div>

				{settings.debugMode ? (
					<canvas 
						className="debug-canvas" 
						ref={debugRef}
						width={0} 
						height={0} 
						style={{ top: 0, left: 0, width: '100%'}} 
					/>
				) : null}
			</div>

			<Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
				<Typography style={{
					whiteSpace: 'nowrap',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
				}}>{fileObj.file.name}</Typography>
				<DeleteIcon sx={{color : red[400]}} onClick={() => dispatch(removeFile(fileObj.id))} />
			</Stack>
		</Paper>
	)
}


export default ImagePreview;
