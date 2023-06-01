import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Button from '@mui/material/Button';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';

import { resetSettings } from '../../redux/settingsSlice';
import { resetOutputSettings } from '../../redux/outputSettingsSlice';
import { removeAllFiles } from '../../redux/filesSlice';

import logo from '../../assets/images/logo-light.svg'

import ResizeCrop from './ResizeCrop'
import OutputDirectory from './OutputDirectory'
import OutputFormat from './OutputFormat';
import OutputFileName from './OutputFileName';

const Sidebar = ({ startProcessing, isProcessing }) => {
	const dispatch = useDispatch()
	const settings = useSelector((state) => state.settings)
	const files = useSelector((state) => state.files)

	return (
		<div id='sidebar'>
			<img src={logo} className='logo' height={60} alt='SnapDino Logo' />

			<Accordion defaultExpanded>
				<AccordionSummary expandIcon={<ExpandMoreIcon />} >
					<Typography color={settings?.disableCrop ? "GrayText" : "white"} >Resize & Crop</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<ResizeCrop />
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />} >
					<Typography>Image format & Quality</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<OutputFormat />
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />} >
					<Typography>Output File Name</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<OutputFileName />
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />} >
					<Typography>Output Directory</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<OutputDirectory />
				</AccordionDetails>
			</Accordion>

			<Grid container spacing={2} marginTop={1}>
				<Grid item xs={12}>
					<Button variant="contained" 
						fullWidth 
						disabled={isProcessing || files.length === 0}
						onClick={startProcessing}
					>Start Processing</Button>
				</Grid>
			</Grid>
			
			<Grid container spacing={2} marginTop={1}>
				<Grid item xs={6}>
					<Button variant="text" 
						color='secondary' 
						size='small' 
						fullWidth 
						disabled={files.length === 0}
						onClick={() => dispatch(removeAllFiles())}
					>Remove All</Button>
				</Grid>
				<Grid item xs={6}>
					<Button variant="text" 
						color='secondary' 
						size='small' 
						fullWidth 
						onClick={() => {
							dispatch(resetSettings())
							dispatch(resetOutputSettings())
						}}
					>Reset Settings</Button>
				</Grid>
			</Grid>
		</div>
	)
}


export default Sidebar;
