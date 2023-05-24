import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import loadImage from 'blueimp-load-image';
import { Paper, Skeleton, Typography } from '@mui/material';
import smartcrop from 'smartcrop';

import pattern from '../assets/images/pattern.svg'

let isMouseDown = false;
let clientX = 0;
let clientY = 0;
let focal_x = 0;
let focal_y = 0;
const ImagePreview = ({ file }) => {
	const dispatch = useDispatch()
	const settings = useSelector((state) => state.settings)
	const imageContainerRef = useRef(null) 
	const maskRef = useRef(null) 
	const debugRef = useRef(null) 
	const [imageData, setImageData] = useState(null)
	const [cropData, setCropData] = useState(null)

	const mask_pattern = new Image(20, 20);
	mask_pattern.src = pattern;

	useEffect(() => {
		handleImageLoad();
	}, [])


	useEffect(() => {
		if (imageData) {
			if (imageContainerRef.current) {
				imageContainerRef.current.appendChild(imageData.image);
			}

			initCropper();

			if (maskRef) {
				maskRef.current.width = imageData.image.offsetWidth;
				maskRef.current.height = imageData.image.offsetHeight;
				maskRef.current.style.top = 0;
				maskRef.current.style.left = 0;

				maskRef.current.addEventListener('mousedown', onMouseDown);
				maskRef.current.addEventListener('mouseup', onMouseUp);
				maskRef.current.addEventListener('mousemove', onMouseMove);
				maskRef.current.addEventListener('mouseleave', onMouseUp);
			}
		}
	
		return () => {
			maskRef.current.removeEventListener('mousedown', onMouseDown);
			maskRef.current.removeEventListener('mouseup', onMouseUp);
			maskRef.current.removeEventListener('mousemove', onMouseMove);
			maskRef.current.removeEventListener('mouseleave', onMouseUp);
		}
	}, [imageData])

	useEffect(() => {
		if (cropData) {
			drawMask()
			//_image_mousemove
		}
	}, [cropData])


	const handleImageLoad = async () => {
		const data = await loadImage(file, {})
		console.log('imageData', data)
		setImageData(data);
	}

	const initCropper = async () => {
		const result = await smartcrop.crop(imageData.image, {
			width: settings.width, 
			height: settings.height,
			ruleOfThirds: true,
			debug: false,
		});

		console.log('smartcrop', result)
		
		if (result.debugOutput) {
			debugDraw(result, true)
		}

		setCropData({...result.topCrop})
	}

	
	function debugDraw(result, showCrop) {
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

		// console.log('mask_pattern', mask_pattern)
		// console.log('fillRect', 0, 0, w, h);
		// console.log('clearRect', (w - nw) * fx, (h - nh) * fy, nw, nh);
		// console.log({ tw, th, fx, fy, w, h, nw, nh })
		
		const ctx = maskRef.current.getContext("2d");
		ctx.fillStyle = ctx.createPattern(mask_pattern, "repeat");
		ctx.fillRect(0, 0, w, h);
		ctx.clearRect((w - nw) * fx, (h - nh) * fy, nw, nh);

		if (!customFocal) {
			focal_x = fx
			focal_y = fy
		}
	}

	const onMouseDown = (event) => {
		if (settings.autoWidth || settings.autoHeight) return;

		isMouseDown = true;

		clientX = event.clientX;
		clientY = event.clientY;
	}
	const onMouseUp = (event) => {
		isMouseDown = false;
	}
	const onMouseMove = (event) => {
		if (isMouseDown) {
			// console.log('onMouseMove', file.name, {clientX: event.clientX, clientY: event.clientY})

			let x = event.clientX;
			let y = event.clientY;
			let ox = clientX
			let oy = clientY;

			let fx = focal_x;
			let fy = focal_y;

			let new_fx = fx + ((x - ox) / imageData.image.offsetWidth) * 2;
			let new_fy = fy + ((y - oy) / imageData.image.offsetHeight) * 2;

			new_fx = Math.max(0, Math.min(1, new_fx));
			new_fy = Math.max(0, Math.min(1, new_fy));

			// file.fx = new_fx;
			// file.fy = new_fy;
			// file.is_custom_focal = true;

			if (new_fx != fx || new_fy != fy) {
				// console.log({new_fx, new_fy})

				drawMask(true, new_fx, new_fy)
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

			<div ref={imageContainerRef} className='img-container'>
				<canvas 
					className="mask-canvas" 
					ref={maskRef}
					width={0} 
					height={0} 
					style={{ top: 0, left: 0 }} 
				/>
			</div>
			<canvas 
				className="debug-canvas" 
				ref={debugRef}
				width={0} 
				height={0} 
				style={{ top: 0, left: 0, width: '100%' }} 
			/>
			<Typography style={{
				whiteSpace: 'nowrap',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
			}}>{file.name}</Typography>
		</Paper>
	)
}


export default ImagePreview;
