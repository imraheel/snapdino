import React, { useEffect, useState } from 'react'

import { CircularProgress } from '@mui/material';

import logo from '../assets/images/logo-light.svg'


const SplashScreen = ({setAppLoading}) => {

	useEffect(() => {
		setTimeout(() => {
			setAppLoading(false)
		}, 2000)
	}, [])

	return (
		<div id='splash-screen'>
			<img src={logo} className='logo' height={100} />
			<CircularProgress />
		</div>
	)
}


export default SplashScreen;
