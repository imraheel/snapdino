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

import { updateSetting, resetSettings } from '../../redux/settingsSlice';

import logo from '../../assets/images/logo-light.svg'

import SettingCrop from './SettingCrop'

const Sidebar = () => {
	const dispatch = useDispatch()
	const settings = useSelector((state) => state.settings)
	const files = useSelector((state) => state.files)

	useEffect(() => {


		return () => {

		}
	}, [])

	return (
		<div id='sidebar'>
			<img src={logo} className='logo' height={60} />

			<Accordion defaultExpanded>
				<AccordionSummary expandIcon={<ExpandMoreIcon />} >
					<Typography color={settings?.disableCrop ? "GrayText" : "white"} >Resize & Crop</Typography>
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
					<Button variant="contained" fullWidth>Save as ZIP</Button>
				</Grid>
				<Grid item xs={6}>
					<Button variant="contained" fullWidth>Save Files</Button>
				</Grid>
			</Grid>
			
			<Grid container spacing={2} marginTop={1}>
				<Grid item xs={6}>
					<Button variant="text" color='secondary' size='small' fullWidth disabled={true}>Remove All</Button>
				</Grid>
				<Grid item xs={6}>
					<Button variant="text" color='secondary' size='small' fullWidth onClick={() => dispatch(resetSettings())}>Reset Settings</Button>
				</Grid>
			</Grid>
		</div>
	)
}


export default Sidebar;
