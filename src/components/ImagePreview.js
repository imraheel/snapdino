import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import loadImage from 'blueimp-load-image';
import { Grid, Paper, Skeleton, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from '@mui/material/colors';
import smartcrop from 'smartcrop';

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

	

	useEffect(() => {
		handleImageLoad();
	}, [])


	useEffect(() => {
		if (imageData) {
			if (maskRef) {
				maskRef.current.width = imageData.image.offsetWidth;
				maskRef.current.height = imageData.image.offsetHeight;

				maskRef.current.addEventListener('mousedown', onMouseDown);
				maskRef.current.addEventListener('mouseup', onMouseUp);
				maskRef.current.addEventListener('mousemove', onMouseMove);
			}

			initCropper();

			dispatch(updateFile({
				id: fileObj.id,
				image: imageData.image,
				originalWidth: imageData.originalWidth,
				originalHeight: imageData.originalHeight,
			}))
		}
	
		return () => {
			if (maskRef && maskRef.current) {
				maskRef.current.removeEventListener('mousedown', onMouseDown);
				maskRef.current.removeEventListener('mouseup', onMouseUp);
				maskRef.current.removeEventListener('mousemove', onMouseMove);
			}
		}
	}, [imageData, settings, viewColumns, windowSize])

	useEffect(() => {
		if (cropData) {
			drawMask()
		}
	}, [cropData])


	const handleImageLoad = async () => {
		const data = await loadImage(fileObj.file, {
			meta: false,
			canvas: false,
		})
		console.log('imageData', data)

		if (imageContainerRef.current) {
			imageContainerRef.current.innerHTML = '';
			imageContainerRef.current.appendChild(data.image);
		}

		if (maskRef) {
			maskRef.current.width = data.image.offsetWidth;
			maskRef.current.height = data.image.offsetHeight;
		}

		setImageData(data);
	}

	const initCropper = async () => {
		const result = await smartcrop.crop(imageData.image, {
			width: settings.width, 
			height: settings.height,
			ruleOfThirds: true,
			debug: settings.debugMode,
		});

		// console.log('smartcrop', result)
		
		if (result.debugOutput) {
			debugDraw(result, true)
		}

		setCropData({...result.topCrop})
	}

	
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

	const drawMask = (customFocal = false, customFx = 0, customFy = 0) => {

		const tw = settings.width;
		const th = settings.height;
		const fx = customFocal ? customFx : (cropData.x / cropData.width);
		const fy = customFocal ? customFy : (cropData.y / cropData.height);
		// const fx = 0.5;
		// const fy = 0.5;
		const w = imageData.image.offsetWidth;
		const h = imageData.image.offsetHeight;
		let nw = w;
		let nh = h;

		if (!(settings.autoWidth || settings.autoHeight || settings.disableCrop)) {
			nw = tw * Math.min(w / tw, h / th);
			nh = th * Math.min(w / tw, h / th);
		}

		// console.log('fillRect', 0, 0, w, h);
		// console.log('clearRect', (w - nw) * fx, (h - nh) * fy, nw, nh);
		// console.log({ tw, th, fx, fy, w, h, nw, nh })
		
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

	const onMouseDown = (event) => {
		if (settings.autoWidth || settings.autoHeight) return;

		isMouseDown = true;
		mouseDownX = event.clientX;
		mouseDownY = event.clientY;
	}
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
	const onMouseMove = (event) => {
		if (isMouseDown) {

			let newFx = lastFocalX + ((event.clientX - mouseDownX) / imageData.image.offsetWidth) * 2;
			let newFy = lastFocalY + ((event.clientY - mouseDownY) / imageData.image.offsetHeight) * 2;

			newFx = Math.max(0, Math.min(1, newFx));
			newFy = Math.max(0, Math.min(1, newFy));

			if (newFx != lastFocalX || newFy != lastFocalY) {
				drawMask(true, newFx, newFy)
			}
		}
	}

	return (
		<Paper elevation={3} sx={{ p: 1, mb: 1, }}>
			{imageData === null ? (
				<>
					<Skeleton variant="rectangular" animation="wave" width='100%' height={100} />
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
