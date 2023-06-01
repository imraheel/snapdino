import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import FolderIcon from '@mui/icons-material/Folder';

import { updateOutputSetting } from '../../redux/outputSettingsSlice';


const OutputDirectory = () => {
	const dispatch = useDispatch()
	const outputSettings = useSelector((state) => state.outputSettings)
	
	useEffect(() => {
		/**
		 * Subscribes to the onOutputDirectory event and updates the output directory setting when it is changed.
		 */
		window.electronAPI.onOutputDirectory((event, directory) => {
			if (directory) {
				dispatch(updateOutputSetting({
					outputDirectory: directory
				}))
			}
		})

	}, [])

	/**
	 * Invoke electron api to request to select output directory dialog
	 */
	const openDirectoryDialog = () => {
		window.electronAPI.getOutputDirectory()
	}

	return (
		<>
			<Box sx={{ display: 'flex', alignItems: 'center', }}>
				<InputBase
					sx={{ ml: 1, flex: 1 }}
					placeholder="Output Directory"
					value={outputSettings?.outputDirectory}
					disabled
					inputProps={{ 'aria-label': 'Output Directory' }}
				/>
				<Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
				<IconButton color="secondary" sx={{ p: '10px' }} aria-label="open directory" onClick={openDirectoryDialog}>
					<FolderIcon />
				</IconButton>
			</Box>
		</>
	)
}


export default OutputDirectory;
