import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';

import { updateSetting } from '../../redux/settingsSlice';
import { updateOutputSetting } from '../../redux/outputSettingsSlice';


const OutputFileName = () => {
	const dispatch = useDispatch()
	const outputSettings = useSelector((state) => state.outputSettings)

	return (
		<>
			<FormControl>
				<RadioGroup
					value={outputSettings.outputFileName}
					name="output-format"
					onChange={(e) => {
						dispatch(updateOutputSetting({
							outputFileName: e.target.value
						}))
					}}
				>
					<FormControlLabel value="unique" control={<Radio />} label="Unique Name" />
					<FormControlLabel value="original" control={<Radio />} label="Keep as original" />
					<FormControlLabel value="pattern" control={<Radio />} label="Use Pattern" />
				</RadioGroup>
			</FormControl>

			{outputSettings.outputFileName === 'pattern' ? (
				<>
				<Box sx={{ mt: 2 }}>
					<TextField
						label="File Name Pattern"
						size="small"
						fullWidth
						value={outputSettings.outputFileNamePattern}
						onChange={(e) => {
							dispatch(updateOutputSetting({
								outputFileNamePattern: e.target.value
							}))
						}}
					/>

					<FormHelperText>Use following pattern to generate file names</FormHelperText>
					<FormHelperText>[auto] - Auto incremented number</FormHelperText>
					<FormHelperText>[uuid] - Unique random ID</FormHelperText>
					<FormHelperText>[numb] - 10 digit random number</FormHelperText>
					<FormHelperText>[size] - Output size, eg: 600x600</FormHelperText>
				</Box>
				</>
			) : null}
		</>
	)
}


export default OutputFileName;
