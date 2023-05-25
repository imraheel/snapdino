import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid';

const initialState = [];

const filesSlice = createSlice({
	name: 'files',
	initialState: initialState,
	reducers: {
		addFiles(state, action) {
			console.log(uuid())
			Array.from(action.payload).forEach(file => {
				state.push(file)
			});
		},

		removeAllFiles: () => initialState
	}
})

export const { addFiles, removeAllFiles } = filesSlice.actions
export default filesSlice.reducer