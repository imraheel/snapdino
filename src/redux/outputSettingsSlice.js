import { createSlice } from '@reduxjs/toolkit'


const initialState = {
	/**
	 * Represents the output file name setting.
	 * If set to 'pattern', the output file name will follow the specified pattern.
	 */
	outputFileName: 'unique',

	/**
	 * Represents the output file name pattern.
	 * Used when the `outputFileName` is set to 'pattern'.
	 * Specifies the pattern for generating the output file name.
	 */
	outputFileNamePattern: 'output-[auto]',

	/**
	 * Represents the output file format setting.
	 * Specifies the desired format for the output images.
	 * Default value is set to 'original', which means the images will maintain their original format.
	 */
	outputFormat: 'original',

	/**
	 * Represents the output image quality setting.
	 * Specifies the desired quality level for the output images.
	 * Default value is set to 80.
	 */
	outputQuality: 80,

	/**
	 * Represents the output directory setting.
	 * Specifies the directory where the processed images will be saved.
	 * Default value is set to `null`, indicating that no specific output directory is set.
	 */
	outputDirectory: null,
}

const outputSettingsSlice = createSlice({
	name: 'settings',
	initialState: {
		...initialState
	},
	reducers: {
		/**
		 * The updateOutputSetting reducer is responsible for updating the settings in the state.
		 * It receives an action payload containing the updated settings as an object.
		 * For each key, it updates the corresponding setting in the state by assigning the value from the action payload to the state.
		 */
		updateOutputSetting(state, action) {
			Object.keys(action.payload).forEach(key => {
				state[key] = action.payload[key]
			})
		},

		/**
		 * The resetOutputSettings reducer is responsible for resetting the settings to their initial values.
		 * It iterates over the keys of initialState using Object.keys.
		 * For each key, it resets the corresponding setting in the state by assigning the initial value from initialState to the state.
		 */
		resetOutputSettings(state) {
			Object.keys(initialState).forEach(key => {
				state[key] = initialState[key]
			})
		}
	}
})

export const { updateOutputSetting, resetOutputSettings } = outputSettingsSlice.actions
export default outputSettingsSlice.reducer