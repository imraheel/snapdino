import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Box from '@mui/material/Box';
import { Typography, Button } from '@mui/material';

import imagePlaceholder from '../assets/images/image-placeholder.png'
import { addFiles } from '../redux/filesSlice';

const DropPlaceholder = ({inputFileRef, selectFiles}) => {

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
		}}
		>
			<input type='file' id='file' ref={inputFileRef} accept="image/*" multiple style={{display: 'none'}} onChange={(e) => selectFiles(e.target.files)} />
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
			<Button variant="outlined" color='primary' onClick={(e) => inputFileRef.current.click()}>Browse from your Computer</Button>
		</Box>
	)
}

const WorkingArea = () => {
	const dispatch = useDispatch()
	const settings = useSelector((state) => state.settings)
	const files = useSelector((state) => state.files)
	const inputFileRef = useRef(null) 

	useEffect(() => {
		
		return () => {

		}
	}, [])

	/**
	 * Selects and adds the specified files to the application.
	 * @param {FileList} files - The list of files to be selected and added.
	 */
	const selectFiles = (files) => {
		dispatch(addFiles(files))
	}

	/**
	 * Handles the drag event triggered by an element.
	 * It prevents the default behavior of the drag event, such as opening the dragged item in a new tab or window.
	 * @param {Event} e - The drag event object.
	 */
	const handleDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();
	}

	/**
	 * Handles the drop event triggered by an element.
	 * It prevents the default behavior of the drop event, such as opening the dropped item in a new tab or window.
	 * It also retrieves the dropped files and calls the selectFiles method to add them to the application.
	 * @param {Event} e - The drop event object.
	 */
	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		let files = e.dataTransfer.files

		selectFiles(files)
	}


	if (files && files.length === 0) {
		return (
			<div id='workingArea' 
				onDragEnter={handleDrag} 
				onDragLeave={handleDrag} 
				onDragOver={handleDrag} 
				onDrop={handleDrop} >
				<DropPlaceholder inputFileRef={inputFileRef} selectFiles={selectFiles} />
			</div>
		)	
	}

	return (
		<div id='workingArea' 
			onDragEnter={handleDrag} 
			onDragLeave={handleDrag} 
			onDragOver={handleDrag} 
			onDrop={handleDrop} >
			<input type='file' id='file' ref={inputFileRef} accept="image/*" multiple style={{display: 'none'}} onChange={(e) => selectFiles(e.target.files)} />
			<Typography>Selected files {files.length}</Typography>
		</div>
	)
}

export default WorkingArea;
