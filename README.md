# SnapDino

SnapDino is an open-source application built with Electron that allows users to crop and resize images in bulk and save them to their desired location. The application provides a user-friendly interface and offers convenient features for efficient image processing.

![SnapDino](./docs/app-preview.png?raw=true "SnapDino")

## Features

- Bulk crop and resize images.
- Customizable cropping and resizing options.
- Simple and intuitive user interface.
- Save images to the desired output location.

## Installation

To install and use SnapDino, follow these steps:

1. Clone the repository: `git clone https://github.com/imraheel/snapdino.git`
2. Install dependencies: `npm install`
3. Start the application: `npm run dev`

## Usage

1. Launch SnapDino application.
2. Add images to the application.
3. Configure the cropping and resizing options according to your requirements.
4. Specify the output location where the processed images will be saved.
5. Click the "Start Processing" button to start the batch processing.
6. Monitor the progress and wait for the operation to complete.
7. Once the process finishes, you can find the processed images in the specified output location.

## Building for Production

To build the application for production, use the following command:

- Build the app for production to the `build` folder: `npm run build`

To build the application specifically for macOS, use the following command:

- Build app for macOS: `electron-builder --mac`

To build the application specifically for Windows, use the following command:

- Build app for Windows: `electron-builder --win`

Make sure to check the documentation of [electron-builder](https://www.electron.build/) for more advanced options and customization.


## Special Thanks

SnapDino is inspired by BIRME (Bulk Image Resizing Made Easy) web application. We would like to express our gratitude to the creators of BIRME for their innovative work and contribution to the field of image processing.

Please visit [BIRME](https://www.birme.net/) to explore their web application and learn more about their features.

## Contributing

We welcome contributions from the community! If you would like to contribute to SnapDino, please follow our [contribution guidelines](CONTRIBUTING.md) for more information.

## License

SnapDino is released under the [MIT License](LICENSE.md).

---

We hope that SnapDino simplifies your image cropping and resizing tasks. If you encounter any issues or have suggestions for improvement, please feel free to [submit an issue](https://github.com/imraheel/snapdino/issues). Enjoy using SnapDino!
