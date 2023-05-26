import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid';

const initialState = [];

const filesSlice = createSlice({
	name: 'files',
	initialState: initialState,
	reducers: {
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

		removeFile: (state, action) => {
			return state.filter(file => file.id !== action.payload)
		},

		removeAllFiles: () => initialState
	}
})

export const { addFiles, updateFile, removeFile, removeAllFiles } = filesSlice.actions
export default filesSlice.reducer