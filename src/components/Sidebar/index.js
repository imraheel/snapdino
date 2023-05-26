import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Button from '@mui/material/Button';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import { saveAs } from 'file-saver';

import { updateSetting, resetSettings } from '../../redux/settingsSlice';
import { removeAllFiles } from '../../redux/filesSlice';

import logo from '../../assets/images/logo-light.svg'

import SettingCrop from './SettingCrop'

const Sidebar = () => {
	const dispatch = useDispatch()
	const settings = useSelector((state) => state.settings)
	const files = useSelector((state) => state.files)

	useEffect(() => {


		return () => {

		}
	}, [])

	const saveFiles = async () => {
		if (files.length === 0) return

		for (let file of files) {
			await saveFileToLocation(file)
		}
	}

	const saveFileToLocation = (fileObj) => {
		return new Promise((resolve, reject) => {
			let img = fileObj.image;

			let tw = settings.width;
			let th = settings.height;

			const fx = fileObj.focalX;
			const fy = fileObj.focalY;

			const iw = fileObj.originalWidth;
			const ih = fileObj.originalHeight;

			if (settings.disableCrop) {
				tw = fileObj.originalWidth;
				th = fileObj.originalHeight;
			} else if (settings.autoWidth) {
				tw = (iw * th) / ih;
			} else if (settings.autoHeight) {
				th = (ih * tw) / iw;
			}
			let canvas = document.createElement("canvas");
			canvas.width = tw;
			canvas.height = th;
			let con = canvas.getContext("2d");
			con.imageSmoothingEnabled = true;
			con.imageSmoothingQuality = "medium";
			let scale = Math.min(iw / tw, ih / th);
			let srcw = tw * scale;
			let srch = th * scale;

			let output = outputFormat(fileObj.file);
			// Draw a white background for transparent images
			// if (output.format == "image/jpeg" && !file.is_jpeg) {
			if (output.format == "image/jpeg") {
				con.fillStyle = "white";
				con.fillRect(0, 0, tw, th);
			}

			/*******************************************
			 * Border
			 ******************************************/
			let hw = 0;
			if (settings.borderWidth > 0) {
				con.lineWidth = settings.borderWidth;
				con.strokeStyle = settings.borderColor;
				hw = settings.borderWidth / 2;
				con.strokeRect(hw, hw, tw - hw * 2, th - hw * 2);
			}

			/*******************************************
			 * Image after the border
			 ******************************************/
			con.drawImage(img, (iw - srcw) * fx, (ih - srch) * fy, srcw, srch, hw, hw, tw - hw * 2, th - hw * 2);
			

			let quality = 1;
			if (output.format == "image/jpeg") {
				quality = settings.outputQuality / 100;
			} else if (output.format == "image/webp") {
				quality = settings.outputQuality / 100;
			}

			const filename = Math.random().toString(36).substring(2, 15) + "." + output.ext;
			
			canvas.toBlob(
				blob => {
					saveAs(blob, filename);
				},
				output.format,
				quality
			);
		})
	}

	const outputFormat = (file) => {
		if (settings.outputFormat == "jpeg") {
			return { ext: "jpg", format: "image/jpeg" };
		}
		if (settings.outputFormat == "webp") {
			return { ext: "webp", format: "image/webp" };
		}

		const dot_index = file.name.lastIndexOf(".");
		const extension = file.name.substr(dot_index + 1);
		// Preserve format
		switch (extension.toLowerCase()) {
			case "png":
				return { ext: "png", format: "image/png" };
			case "jpg":
			case "jpeg":
				return { ext: extension, format: "image/jpeg" };
			case "webp":
				return { ext: "webp", format: "image/webp" };
		}
	}

	return (
		<div id='sidebar'>
			<img src={logo} className='logo' height={60} />

			<Accordion defaultExpanded>
				<AccordionSummary expandIcon={<ExpandMoreIcon />} >
					<Typography color={settings?.disableCrop ? "GrayText" : "white"} >Resize & Crop</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<SettingCrop />
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />} >
					<Typography>Image format & Quality</Typography>
				</AccordionSummary>
				<AccordionDetails>
					
				</AccordionDetails>
			</Accordion>

			<Grid container spacing={2} marginTop={1}>
				<Grid item xs={12}>
					<Button variant="contained" fullWidth onClick={saveFiles}>Save Files</Button>
				</Grid>
			</Grid>
			
			<Grid container spacing={2} marginTop={1}>
				<Grid item xs={6}>
					<Button variant="text" 
						color='secondary' 
						size='small' 
						fullWidth 
						disabled={files.length === 0}
						onClick={() => dispatch(removeAllFiles())}
					>Remove All</Button>
				</Grid>
				<Grid item xs={6}>
					<Button variant="text" 
						color='secondary' 
						size='small' 
						fullWidth 
						onClick={() => dispatch(resetSettings())}
					>Reset Settings</Button>
				</Grid>
			</Grid>
		</div>
	)
}


export default Sidebar;
