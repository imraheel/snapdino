import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import loadImage from 'blueimp-load-image';
import { Paper, Typography } from '@mui/material';


const ImagePreview = ({ fileObj }) => {
	const dispatch = useDispatch()
	const settings = useSelector((state) => state.settings)
	const imageContainerRef = useRef(null) 
	const [imageData, setImageData] = useState(null)

	useEffect(() => {
		handleImageLoad();

		return () => {

		}
	}, [])


	useEffect(() => {
		if (imageData) {
			if (imageContainerRef.current) {
				console.log('imageData.image', imageData)
				imageContainerRef.current.appendChild(imageData.image);
			}
		}

		return () => {

		}
	}, [imageData])


	const handleImageLoad = async () => {
		const data = await loadImage(fileObj.file, {
			maxWidth: 250,
			maxHeight: 250,
			canvas: true,
			aspectRatio: '16/9',
			crop: true,
			orientation: true,
		})

		setImageData(data);
	}

	return (
		<Paper elevation={3}>
			{imageData ? (
				<>
					<div ref={imageContainerRef}></div>
					<Typography>{fileObj.file.name}</Typography>
				</>
			) : (
				<span>Loading...</span>
			)}
		</Paper>
	)
}


export default ImagePreview;
