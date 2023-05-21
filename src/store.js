import { createStore } from 'redux'

const initialState = {
	settings: {
		disableCrop: false,
		autoWidth: false,
		autoHeight: false,
		width: 600,
		height: 600,
		aspectRatio: '1:1',
	},
	files: [],
}

const changeState = (state = initialState, { type, ...rest }) => {
	switch (type) {
		case 'set':
			return { ...state, ...rest }
		default:
			return state
	}
}

const store = createStore(changeState)
export default store
