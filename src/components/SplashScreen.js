import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { CircularProgress } from '@mui/material';

import logo from '../assets/images/logo-light.svg'
import { updateOutputSetting } from '../redux/outputSettingsSlice';


const SplashScreen = ({setAppLoading}) => {
	const dispatch = useDispatch()

	useEffect(() => {

		/**
		 * Invoke electron api to get default output directory
		 */
		window.electronAPI.getDefaultDownloadDirectory()
		
		/**
		 * Subscribes to the onDefaultDownloadDirectory event and updates the default output directory.
		 */
		window.electronAPI.onDefaultDownloadDirectory((event, directory) => {
			if (directory) {
				dispatch(updateOutputSetting({
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
