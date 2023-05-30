import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Slider from '@mui/material/Slider';

import { updateSetting } from '../../redux/settingsSlice';

const marks = [
	{ value: 10, label: '10%', },
	{ value: 60, label: '60%', },
	{ value: 80, label: '80%', },
	{ value: 100, label: '100%', },
];

const OutputFormat = () => {
	const dispatch = useDispatch()
	const settings = useSelector((state) => state.settings)

	return (
		<>
			<FormControl>
				<FormLabel id="radio-output-format-label">Output Format</FormLabel>
				<RadioGroup
					aria-labelledby="radio-output-format-label"
					value={settings.outputFormat}
					name="output-format"
					onChange={(e) => {
						dispatch(updateSetting({
							outputFormat: e.target.value
						}))
					}}
				>
					<FormControlLabel value="original" control={<Radio />} label="Keep as original" />
					<FormControlLabel value="jpeg" control={<Radio />} label="JPEG" />
					<FormControlLabel value="png" control={<Radio />} label="PNG" />
					<FormControlLabel value="webp" control={<Radio />} label="WEBP" />
				</RadioGroup>
			</FormControl>

			<Box sx={{ width: '90%', marginTop: '1rem' }}>
				<FormLabel id="output-quality-label">Quality</FormLabel>
				<Slider
					aria-labelledby="output-quality-label"
					value={settings.outputQuality}
					step={10}
					valueLabelDisplay="auto"
					marks={marks}
					min={10}
					max={100}
					onChange={(e, value) => {
						dispatch(updateSetting({
							outputQuality: value
						}))
					}}
				/>
			</Box>
		</>
	)
}


export default OutputFormat;
