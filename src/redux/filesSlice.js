import { createSlice } from '@reduxjs/toolkit'

const filesSlice = createSlice({
	name: 'files',
	initialState: [],
	reducers: {
		addFiles(state, action) {
			Array.from(action.payload).forEach(file => {
				state.push(file)
			});
		}
	}
})

export const { addFile, addFiles } = filesSlice.actions
export default filesSlice.reducer