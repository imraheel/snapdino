import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import './assets/scss/App.scss';


import Sidebar from './components/Sidebar/index';
import WorkingArea from './components/WorkingArea';
import SplashScreen from './components/SplashScreen';



const darkTheme = createTheme({
	palette: {
		mode: 'dark',

		primary: {
			main: '#1684ac',
			darker: '#1684ac',
		},
	},
	typography: {
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
		fontSize: 12,
		spacing: 4,
	},
});

function App() {
	const [appLoading, setAppLoading] = useState(true)

	useEffect(() => {
		console.log('App initialized')
	}, [])

	return (
		<>
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			{appLoading ? <SplashScreen setAppLoading={setAppLoading} /> : (
			<div id='appContainer'>
				<Sidebar />
				<WorkingArea />
			</div>
			)}
		</ThemeProvider>
		</>
	)
}

export default App;
