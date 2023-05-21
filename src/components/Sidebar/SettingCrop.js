import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Switch from '@mui/material/Switch';


function Sidebar() {
	const dispatch = useDispatch()
	const settings = useSelector((state) => state.settings)
	const files = useSelector((state) => state.files)

	useEffect(() => {


		return () => {

		}
	}, [])

	return (
		<>
			<Grid container spacing={2} marginBottom={1}>
				<Grid item xs={6}>
					<FormControlLabel control={<Checkbox />} label="Auto Width" />
				</Grid>
				<Grid item xs={6}>
					<TextField
						label="Width"
						size="small"
						InputProps={{
							endAdornment: <InputAdornment position="start">px</InputAdornment>,
						}}
					/>
				</Grid>
			</Grid>

			<Grid container spacing={2} marginBottom={1}>
				<Grid item xs={6}>
					<FormControlLabel control={<Checkbox />} label="Auto Height" />
				</Grid>
				<Grid item xs={6}>
					<TextField
						label="Height"
						size="small"
						InputProps={{
							endAdornment: <InputAdornment position="start">px</InputAdornment>,
						}}
					/>
				</Grid>
			</Grid>

			<Grid marginBottom={1}>
				<FormControl fullWidth>
					<InputLabel id="demo-simple-select-label">Aspect Ratio</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={settings?.aspectRatio}
						label="Aspect Ratio"
						onChange={(event) => console.log(event.target.value)}
					>
						<MenuItem value="1:1">1:1</MenuItem>
						<MenuItem value="4:3">4:3</MenuItem>
						<MenuItem value="3:4">3:4</MenuItem>
						<MenuItem value="9:16">9:16</MenuItem>
						<MenuItem value="Custom">Custom</MenuItem>
					</Select>
				</FormControl>
			</Grid>


			<Grid marginBottom={1}>
				<FormControl fullWidth>
					<FormControlLabel control={<Switch defaultChecked />} label="Auto detect focal point" />
				</FormControl>
			</Grid>

			<Grid marginBottom={1}>
				<FormControlLabel control={<Checkbox />} label="Disable Resize and Cropping" />
			</Grid>
		</>
	)
}


export default Sidebar;
