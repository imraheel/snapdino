import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import loadImage from 'blueimp-load-image';
import { Paper, Skeleton, Typography } from '@mui/material';
import smartcrop from 'smartcrop';

import pattern from '../assets/images/pattern.svg'

const ImagePreview = ({ file }) => {
	const dispatch = useDispatch()
	const settings = useSelector((state) => state.settings)
	const imageContainerRef = useRef(null) 
	const maskRef = useRef(null) 
	const debugRef = useRef(null) 
	const [imageData, setImageData] = useState(null)
	const [cropData, setCropData] = useState(null)

	const mask_pattern = new Image();
	mask_pattern.src = pattern;

	useEffect(() => {
		handleImageLoad();
	}, [])

	useEffect(() => {
		if (imageData) {
			if (imageContainerRef.current) {
				imageContainerRef.current.appendChild(imageData.image);
			}

			setTimeout(() => {
				initCropper();
			}, 500)
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
		setImageData(data);
	}

	const initCropper = async () => {
		const result = await smartcrop.crop(imageData.image, {
			width: settings.width, 
			height: settings.height,
			ruleOfThirds: true,
			debug: true,
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
		for (var y = 0; y < output.height; y++) {
			for (var x = 0; x < output.width; x++) {
				var p = (y * output.width + x) * 4;
				if (showCrop) {
					var I = smartcrop.importance(options, topCrop, x, y);
					if (I > 0) {
						debugOutput.data[p + 1] += I * 32;
					}

					if (I < 0) {
						debugOutput.data[p] += I * -64;
					}
				}
				// visualize alpha (boost) as magenta
				var boost = debugOutput.data[p + 3] / 2;
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
			for (var i = 0; i < options.boost.length; i++) {
				var b = options.boost[i];
				ctx.strokeRect(b.x, b.y, b.width, b.height);
			}
		}
		return canvas;
	}

	const drawMask = () => {
		maskRef.current.width = imageData.image.offsetWidth;
		maskRef.current.height = imageData.image.offsetHeight;
		maskRef.current.style.top = 0;
		maskRef.current.style.left = 0;

		const tw = settings.width;
		const th = settings.height;
		const fx = cropData.x / cropData.width;
		const fy = cropData.y / cropData.height;
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

		console.log('mask_pattern', mask_pattern)
		console.log('fillRect', 0, 0, w, h);
		console.log('clearRect', (w - nw) * fx, (h - nh) * fy, nw, nh);
		console.log({
			tw,
			th,
			fx,
			fy,
			w,
			h,
			nw,
			nh,
		})
		
		const ctx = maskRef.current.getContext("2d");
		ctx.fillStyle = ctx.createPattern(mask_pattern, "repeat");
		// ctx.fillStyle = "#FF0000";
		// ctx.fillRect(fx, fy, nw, nh);
		ctx.fillRect(0, 0, w, h);
		ctx.clearRect((w - nw) * fx, (h - nh) * fy, nw, nh);
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
