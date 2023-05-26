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
					data: {
						focalX: 0,
						focalY: 0,
					}
				})
			});
		},

		updateFileData: (state, action) => {
			const file = state.find(file => file.id === action.payload.id)
			file.data = {
				...file.data, 
				...action.payload.data
			}
		},

		removeFile: (state, action) => {
			return state.filter(file => file.id !== action.payload)
		},

		removeAllFiles: () => initialState
	}
})

export const { addFiles, updateFileData, removeFile, removeAllFiles } = filesSlice.actions
export default filesSlice.reducer