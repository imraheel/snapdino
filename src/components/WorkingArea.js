import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';


function WorkingArea() {
	const dispatch = useDispatch()
	const settings = useSelector((state) => state.settings)
	const files = useSelector((state) => state.files)

	useEffect(() => {
		

		return () => {

		}
	}, [])

	return (
		<div id='workingArea'>
			{(files.length === 0) ? (
				<Box  sx={{ 
					p: 2, 
					border: '1px dashed grey',
					height: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center'
				}}>
					drop
				</Box>
			) : (
				<Typography>test</Typography>
			)}
		</div>
	)
}

export default WorkingArea;
