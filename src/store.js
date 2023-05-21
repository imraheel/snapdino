import { createStore } from 'redux'

const initialState = {
	settings: {
		autoWidth: false,
		autoHeight: false,
		width: 1200,
		height: 1200,
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
