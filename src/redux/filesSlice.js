import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid';

const filesSlice = createSlice({
	name: 'files',
	initialState: [],
	reducers: {
		addFiles(state, action) {
			console.log(uuid())
			Array.from(action.payload).forEach(file => {
				state.push(file)
			});
		}
	}
})

export const { addFile, addFiles } = filesSlice.actions
export default filesSlice.reducer