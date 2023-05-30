import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import { updateSetting } from '../../redux/settingsSlice';


const OutputFileName = () => {
	const dispatch = useDispatch()
	const settings = useSelector((state) => state.settings)

	return (
		<>
			<FormControl>
				<RadioGroup
					value={settings.outputFileName}
					name="output-format"
					onChange={(e) => {
						dispatch(updateSetting({
							outputFileName: e.target.value
						}))
					}}
				>
					<FormControlLabel value="unique" control={<Radio />} label="Unique Name" />
					<FormControlLabel value="original" control={<Radio />} label="Keep as original" />
					<FormControlLabel value="pattern" control={<Radio />} label="Use Pattern" />
				</RadioGroup>
			</FormControl>
		</>
	)
}


export default OutputFileName;
