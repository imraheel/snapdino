import { createSlice } from '@reduxjs/toolkit'

const filesSlice = createSlice({
	name: 'files',
	initialState: [],
	reducers: {
		addFiles(state, action) {
			state.push(action.payload)
		}
	}
})

export const { addFiles } = filesSlice.actions
export default filesSlice.reducer