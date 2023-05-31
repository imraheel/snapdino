import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid';

const initialState = [];

const filesSlice = createSlice({
	name: 'files',
	initialState: initialState,
	reducers: {
		/**
		 * Adds multiple files to the state.
		 * Generates a unique ID using uuid() for each file.
		 * Sets initial values for properties like file, focalX, focalY, originalWidth, originalHeight, and image in the state.
		 */
		addFiles(state, action) {
			Array.from(action.payload).forEach(file => {
				state.push({
					id: uuid(),
					file: file,
					focalX: 0,
					focalY: 0,
					originalWidth: 0,
					originalHeight: 0,
					image: null,
				})
			});
		},

		/**
		 * Updates the properties of a specific file in the state.
		 * Uses the id property from the action payload to identify the file.
		 * Merges the updated properties from the action payload into the file object.
		 */
		updateFile: (state, action) => {
			return state.map(file => {
				if (file.id === action.payload.id) {
					return {
						...file,
						...action.payload,
					}
				}
				return file
			})
		},

		/**
		 * Removes a specific file from the state.
		 * Uses the id property from the action payload to identify the file object.
		 * Filters out the file object with a matching ID and returns a new state without that file object.
		 */
		removeFile: (state, action) => {
			return state.filter(file => file.id !== action.payload)
		},

		/**
		 * Removes all files from the state and resets the state to its initial value, which is an empty array (initialState).
		 */
		removeAllFiles: () => initialState
	}
})

export const { addFiles, updateFile, removeFile, removeAllFiles } = filesSlice.actions
export default filesSlice.reducer