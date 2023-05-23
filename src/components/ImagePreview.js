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
		});

		setCropData({...result.topCrop})
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
			<Typography>{file.name}</Typography>
		</Paper>
	)
}


export default ImagePreview;
