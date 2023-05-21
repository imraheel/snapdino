import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Button from '@mui/material/Button';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import logo from '../../assets/images/logo-light.svg'

import SettingCrop from './SettingCrop'

function Sidebar() {
	const dispatch = useDispatch()
	const settings = useSelector((state) => state.settings)
	const files = useSelector((state) => state.files)

	useEffect(() => {


		return () => {

		}
	}, [])

	const resetSettings = () => {
		console.log('resetSettings')
	}

	return (
		<div id='sidebar'>
			<img src={logo} className='logo' height={80} />

			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />} >
					<Typography>Resize & Crop</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<SettingCrop />
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />} >
					<Typography>Image format & Quality</Typography>
				</AccordionSummary>
				<AccordionDetails>
					
				</AccordionDetails>
			</Accordion>

			<Grid container spacing={2} marginTop={1}>
				<Grid item xs={6}>
					<Button variant="contained" size='small' fullWidth>Save as ZIP</Button>
				</Grid>
				<Grid item xs={6}>
					<Button variant="contained" size='small' fullWidth>Save Files</Button>
				</Grid>
			</Grid>
			
			<Grid container spacing={2} marginTop={1}>
				<Grid item xs={6}>
					<Button variant="text" color='secondary' size='small' fullWidth disabled={true}>Remove All</Button>
				</Grid>
				<Grid item xs={6}>
					<Button variant="text" color='secondary' size='small' fullWidth onClick={resetSettings}>Reset Settings</Button>
				</Grid>
			</Grid>
		</div>
	)
}


export default Sidebar;
