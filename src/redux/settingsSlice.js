import { createSlice } from '@reduxjs/toolkit'


const initialState = {
	disableCrop: false,
	autoWidth: false,
	autoHeight: false,
	width: 300,
	height: 400,
	aspectRatio: '1:1',
	autoFocalPoint: true,
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