import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Box from '@mui/material/Box';
import { Typography, Button } from '@mui/material';

import imagePlaceholder from '../assets/images/image-placeholder.png'

const DropPlaceholder = () => {
	
	return (
		<Box  sx={{ 
			p: 2, 
			border: '1px dashed grey',
			height: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'column',
			gap: '15px'
		}}>
			<Box sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				gap: '5px'
			}}>
				<img src={imagePlaceholder} height={80} style={{opacity: 0.6}}/>
				<Typography>DROP IMAGES HERE</Typography>
			</Box>
			<Typography color="GrayText">- OR -</Typography>
			<Button variant="outlined" color='primary' >Browse from your Computer</Button>
		</Box>
	)
}

const WorkingArea = () => {
	const dispatch = useDispatch()
	const settings = useSelector((state) => state.settings)
	const files = useSelector((state) => state.files)

	useEffect(() => {
		

		return () => {

		}
	}, [])

	return (
		<div id='workingArea'>
			{(files.length === 0) ? (
				<DropPlaceholder />
			) : (
				<Typography>test</Typography>
			)}
		</div>
	)
}

export default WorkingArea;
