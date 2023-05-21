# SnapDino

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts
In the project directory, you can run:

### `npm start`
Runs the app in browser development mode.

### `npm run dev`
Run application in electron window in development mode 

### `npm run build`
Builds the app for production to the `build` folder.

### `electron-builder --mac`
Bundle production app for mac in `dist` folder, Make sure to set `isDev = false` in `electron.js` file and must run `npm run build` command before bundle for production

### `electron-builder --win`
Bundle production app for windows x64 in `dist` folder, Make sure to set `isDev = false` in `electron.js` file and must run `npm run build` command before bundle for production