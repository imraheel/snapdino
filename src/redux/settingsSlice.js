import { createSlice } from '@reduxjs/toolkit'


const initialState = {
	debugMode: false,
	
	disableCrop: false,
	autoWidth: false,
	autoHeight: false,
	width: 600,
	height: 600,
	aspectRatio: '1:1',
	autoFocalPoint: true,
	manualFocalPoint: '4',



	outputFileName: 'unique',

	outputFormat: 'original',
	outputQuality: 80,
	outputDirectory: null,
}

const settingsSlice = createSlice({
	name: 'settings',
	initialState: {
		...initialState
	},
	reducers: {
		updateSetting(state, action) {
			Object.keys(action.payload).forEach(key => {
				state[key] = action.payload[key]
			})
		},
		resetSettings(state) {
			Object.keys(initialState).forEach(key => {
				state[key] = initialState[key]
			})
		}
	}
})

export const { updateSetting, resetSettings } = settingsSlice.actions
export default settingsSlice.reducer