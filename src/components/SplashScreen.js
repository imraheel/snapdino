import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CircularProgress } from '@mui/material';

import logo from '../assets/images/logo-light.svg'
import { updateSetting } from '../redux/settingsSlice';


const SplashScreen = ({setAppLoading}) => {
	const dispatch = useDispatch()
	const settings = useSelector((state) => state.settings)

	useEffect(() => {

		window.electronAPI.getDefaultDownloadDirectory()
		
		window.electronAPI.onDefaultDownloadDirectory((event, directory) => {
			if (directory) {
				dispatch(updateSetting({
					outputDirectory: directory
				}))
			}
		})


		setTimeout(() => {
			setAppLoading(false)
		}, 1000)
	}, [])

	return (
		<div id='splash-screen'>
			<img src={logo} className='logo' height={100} />
			<CircularProgress />
		</div>
	)
}


export default SplashScreen;
