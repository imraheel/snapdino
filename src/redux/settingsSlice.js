import { createSlice } from '@reduxjs/toolkit'


const initialState = {
	/**
	 * Represents the debug mode setting.
	 * If `true`, enables debug mode for additional logging and debugging features.
	 */
	debugMode: false,

	/**
	 * Represents the disable crop setting.
	 * If `true`, disables the cropping functionality.
	 */
	disableCrop: false,

	/**
	 * Represents the auto width setting.
	 * If `true`, automatically adjusts the width based on the aspect ratio.
	 */
	autoWidth: false,

	/**
	 * Represents the auto height setting.
	 * If `true`, automatically adjusts the height based on the aspect ratio.
	 */
	autoHeight: false,

	/**
	 * Represents the width value for cropping and resizing.
	 * Default value is set to 600.
	 */
	width: 600,

	/**
	 * Represents the height value for cropping and resizing.
	 * Default value is set to 600.
	 */
	height: 600,

	/**
	 * Represents the aspect ratio setting for cropping and resizing.
	 * Default value is set to 1:1 (square).
	 */
	aspectRatio: '1:1',

	/**
	 * Represents the auto focal point setting.
	 * If `true`, automatically determines the focal point for cropping.
	 */
	autoFocalPoint: true,

	/**
	 * Represents the manual focal point setting.
	 * Specifies the focal point value for cropping.
	 * Default value is set to '4' (center).
	 */
	manualFocalPoint: '4',
}

const settingsSlice = createSlice({
	name: 'settings',
	initialState: {
		...initialState
	},
	reducers: {
		/**
		 * The updateSetting reducer is responsible for updating the settings in the state.
		 * It receives an action payload containing the updated settings as an object.
		 * For each key, it updates the corresponding setting in the state by assigning the value from the action payload to the state.
		 */
		updateSetting(state, action) {
			Object.keys(action.payload).forEach(key => {
				state[key] = action.payload[key]
			})
		},

		/**
		 * The resetSettings reducer is responsible for resetting the settings to their initial values.
		 * It iterates over the keys of initialState using Object.keys.
		 * For each key, it resets the corresponding setting in the state by assigning the initial value from initialState to the state.
		 */
		resetSettings(state) {
			Object.keys(initialState).forEach(key => {
				state[key] = initialState[key]
			})
		}
	}
})

export const { updateSetting, resetSettings } = settingsSlice.actions
export default settingsSlice.reducer