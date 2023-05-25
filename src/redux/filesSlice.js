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
					data: {}
				})
			});
		},

		removeFile: (state, action) => {
			console.log(action.payload)
			return state.filter(file => file.id !== action.payload)
		},

		removeAllFiles: () => initialState
	}
})

export const { addFiles, removeFile, removeAllFiles } = filesSlice.actions
export default filesSlice.reducer