import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Box from '@mui/material/Box';
import { Typography, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import CircularProgress from '@mui/material/CircularProgress';

import { addFiles } from '../redux/filesSlice';
import { updateSetting } from '../redux/settingsSlice';

import imagePlaceholder from '../assets/images/image-placeholder.png'
import ImagePreview from './ImagePreview';
import useWindowSize from '../hooks/useWindowSize';

const DropPlaceholder = ({selectFiles}) => {
	const inputFileRef = useRef(null) 

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

const ProcessingOverlay = ({ isProcessing }) => {
	const files = useSelector((state) => state.files)

	return (
		<Box sx={{
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'column',
			zIndex: 5,
			background: 'rgba(0,0,0,0.7)',
			gap: '15px'
		}}>
			<Typography variant="h4" >Processing...</Typography>
			<CircularProgress />
			<Typography >{files.length} files remaining</Typography>
		</Box>
	)
}

const WorkingArea = ({ isProcessing }) => {
	const dispatch = useDispatch()
	const settings = useSelector((state) => state.settings)
	const files = useSelector((state) => state.files)
	const windowSize = useWindowSize();
	const workingAreaRef = useRef(null) 
	const [perColumn, setPerColumn] = useState(3)

	useEffect(() => {
		if (isProcessing) {
			workingAreaRef.current.scrollTo(0, 0);
		}
	}, [isProcessing])



	/** 
	 * hack to ignore ResizeObserver error until MUI team fix this issue
	 * https://github.com/mui/material-ui/issues/36909#issuecomment-1533566818
	 */
	useEffect(() => {
		window.addEventListener('error', e => {
			if (e.message === 'ResizeObserver loop limit exceeded') {
				const resizeObserverErrDiv = document.getElementById(
					'webpack-dev-server-client-overlay-div'
				);
				const resizeObserverErr = document.getElementById(
					'webpack-dev-server-client-overlay'
				);
				if (resizeObserverErr) {
					resizeObserverErr.setAttribute('style', 'display: none');
				}
				if (resizeObserverErrDiv) {
					resizeObserverErrDiv.setAttribute('style', 'display: none');
				}
			}
		});
	}, []);

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
				<DropPlaceholder selectFiles={selectFiles} />
			</div>
		)	
	}

	return (
		<div id='workingArea' 
			ref={workingAreaRef}
			onDragEnter={handleDrag} 
			onDragLeave={handleDrag} 
			onDragOver={handleDrag} 
			onDrop={handleDrop} >
			
			{isProcessing && <ProcessingOverlay isProcessing={isProcessing} />}

			<Box sx={{
				display: 'flex',
				justifyContent: 'flex-end',
				alignItems: 'flex-end',
				flexDirection: 'column',
				gap: '5px'
			}} marginBottom={1}>
				<FormControl sx={{ minWidth: 120 }}>
					<InputLabel id="grid-view-select-label">Columns</InputLabel>
					<Select
						labelId="grid-view-select-label"
						id="aspect-ratio-select"
						value={perColumn}
						label="Columns"
						size='small'
						onChange={(event) => setPerColumn(parseInt(event.target.value))}
					>
						<MenuItem value="2">2</MenuItem>
						<MenuItem value="3">3</MenuItem>
						<MenuItem value="4">4</MenuItem>
					</Select>
				</FormControl>
			</Box>

			<Masonry columns={perColumn} spacing={2}>
				{files && files.map((fileObj, index) => {
					return (
						<Grid key={fileObj.id}>
							<ImagePreview fileObj={fileObj} viewColumns={perColumn} windowSize={windowSize} />
						</Grid>
					)
				})}
			</Masonry>
		</div>
	)
}

export default WorkingArea;
