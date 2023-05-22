import { configureStore } from '@reduxjs/toolkit'

import settingsReducer from './settingsSlice'
import filesReducer from './filesSlice'


export const store = configureStore({
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({
		serializableCheck: false
	}),
	reducer: {
		settings: settingsReducer,
		files: filesReducer,
	}
})
