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


import { updateSetting } from '../../redux/settingsSlice';


const ResizeCrop = () => {
	const dispatch = useDispatch()
	const settings = useSelector((state) => state.settings)
	const files = useSelector((state) => state.files)
	const [availableAspectRatios, setAvailableAspectRatios] = useState([
		"1:1",
		"4:3",
		"3:4",
		"16:9",
		"9:16",
	])

	/**
	 * Updates the aspect ratio of the settings based on the specified ratio.
	 * If the ratio is not 'Custom', it calculates the new width based on the current height and the ratio.
	 * Then, it dispatches an action to update the aspect ratio and width in the application state.
	 * @param {string} ratio - The new aspect ratio to be applied.
	 */
	const updateAspectRatio = (ratio) => {
		let width = settings.width;
		let height = settings.height;

		if (ratio !== 'Custom') {
			let r1 = ratio.split(':')[0]
			let r2 = ratio.split(':')[1]

			if (Math.min(width, height) === width) {
				height = width * (r2 / r1)
			} else {
				width = height * (r1 / r2)
			}
		}

		dispatch(updateSetting({
			aspectRatio: ratio,
			width: parseInt(width),
			height: parseInt(height),
		}))
	}

	/**
	 * Calculates the aspect ratio based on the specified width and height.
	 * @param {number} width - The width value.
	 * @param {number} height - The height value.
	 * @returns {string} The calculated aspect ratio in the format "width:height".
	 */
	const calculateRatio = (width, height) => {
		function gcd (a, b) {
			return (b == 0) ? a : gcd (b, a%b);
		}
		let w = width;
		let h = height;
		let r = gcd (w, h);

		return (w / r) + ':' + (h / r);
	}

	/**
	 * Updates the width of the settings based on the specified width value.
	 * It calculates the new aspect ratio based on the updated width and the current height.
	 * Then, it dispatches an action to update the width and aspect ratio in the application state.
	 * @param {number} width - The new width value.
	 */
	const updateWidth = (width) => {
		let height = settings.height;

		// calculate ratio based on width and height
		let newRatio = calculateRatio(width, height);

		dispatch(updateSetting({
			width: parseInt(width),
			aspectRatio: (availableAspectRatios.includes(newRatio)) ? newRatio : 'Custom',
		}))
	}

	/**
	 * Updates the height of the settings based on the specified height value.
	 * It calculates the new aspect ratio based on the current width and the updated height.
	 * Then, it dispatches an action to update the height and aspect ratio in the application state.
	 * @param {number} height - The new height value.
	 */
	const updateHeight = (height) => {
		let width = settings.width;

		// calculate ratio based on width and height
		let newRatio = calculateRatio(width, height);

		dispatch(updateSetting({
			height: parseInt(height),
			aspectRatio: (["1:1", "4:3", "3:4", "16:9"].includes(newRatio)) ? newRatio : 'Custom',
		}))
	}

	return (
		<>
			{(settings.disableCrop === false) ? (
				<>
				<Grid container spacing={2} marginBottom={1}>
					<Grid item xs={6}>
						<FormControlLabel control={<Checkbox checked={settings.autoWidth} onChange={() => {
							dispatch(updateSetting({
								autoWidth: !settings.autoWidth
							}))
						}} />} label="Auto Width" />
					</Grid>
					<Grid item xs={6}>
						<TextField
							label="Width"
							size="small"
							value={settings.width}
							disabled={settings.autoWidth}
							InputProps={{
								endAdornment: <InputAdornment position="start">px</InputAdornment>,
							}}
							onChange={(event) => updateWidth(event.target.value)}
						/>
					</Grid>
				</Grid>

				<Grid container spacing={2} marginBottom={1}>
					<Grid item xs={6}>
						<FormControlLabel control={<Checkbox checked={settings.autoHeight} onChange={() => {
							dispatch(updateSetting({
								autoHeight: !settings.autoHeight
							}))
						}} />} label="Auto Height" />
					</Grid>
					<Grid item xs={6}>
						<TextField
							label="Height"
							size="small"
							value={settings.height}
							disabled={settings.autoHeight}
							InputProps={{
								endAdornment: <InputAdornment position="start">px</InputAdornment>,
							}}
							onChange={(event) => updateHeight(event.target.value)}
						/>
					</Grid>
				</Grid>

				<Grid marginBottom={1}>
					<FormControl fullWidth>
						<InputLabel id="aspect-ratio-select-label">Aspect Ratio</InputLabel>
						<Select
							labelId="aspect-ratio-select-label"
							id="aspect-ratio-select"
							value={settings.aspectRatio}
							disabled={settings.autoWidth || settings.autoHeight}
							label="Aspect Ratio"
							size='small'
							onChange={(event) => updateAspectRatio(event.target.value)}
						>
							{availableAspectRatios.map((ratio) => (
								<MenuItem key={ratio} value={ratio}>{ratio}</MenuItem>
							))}
							<MenuItem value="Custom">Custom</MenuItem>
						</Select>
					</FormControl>
				</Grid>


				<Grid marginBottom={1}>
					<FormControl fullWidth>
						<FormControlLabel control={<Switch checked={settings.autoFocalPoint} disabled={settings.autoWidth || settings.autoHeight} onChange={() => {
							dispatch(updateSetting({
								autoFocalPoint: !settings.autoFocalPoint
							}))
						}} />} label="Auto detect focal point" />
					</FormControl>
				</Grid>
				</>
			) : null}

			<Grid>
				<FormControlLabel control={<Checkbox checked={settings.disableCrop} onChange={() => {
					dispatch(updateSetting({
						disableCrop: !settings.disableCrop
					}))
				}} />} label="Disable Resize and Cropping" />
			</Grid>
		</>
	)
}


export default ResizeCrop;
