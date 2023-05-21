import moment from 'moment';

/* 
* Convert date toISOSring to readable history format
* - 10 sec ago / TODO
* - 1 min ago / TODO
* - 1 hour ago / TODO
* - Today 02:05 am
* - Yesterday 02:05 am
* - 2020-01-01 02:05 am
*/
const formatHistoryTime = (time) => {
	let d = new Date(time).setHours(0,0,0,0);
	let today = new Date().setHours(0,0,0,0);
	let yesterday = new Date(today - 86400000).setHours(0,0,0,0);
	
	if (d == today) {
		return 'Today ' + formatTimeAMPM(time);
	} else if (d == yesterday) {
		return 'Yesterday '  + formatTimeAMPM(time);
	} else {
		return formatTimeAMPM(time);
	}
	
}

/* 
* Capitalize first letter of string
 */
const capitalize = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

/* 
* conver arraybuffer to float32array
*/
const arrayBufferToFloat32 = function(buffer) {
	let incomingData = new Uint8Array(buffer);
	
	// const floatArray = Float32Array.from(incomingData)
	// return floatArray;

	let i, l = incomingData.length;
	let outputData = new Float32Array(incomingData.length);
	for (i = 0; i < l; i++) {
		outputData[i] = (incomingData[i] - 128) / 128.0;
	}
	return outputData;
}

/* 
* clone arraybuffer object
*/
const cloneBuffer = (buffer) => {
	let bf = new ArrayBuffer(buffer.byteLength);
	let view = new Uint8Array(bf);
	view.set(new Uint8Array(buffer));
	return bf;
}

/* 
* convert multiple arraybuffers 
*/
const concatArrayBuffers = function () {
	let buffers = Array.prototype.slice.call(arguments),
		buffersLengths = buffers.map(function(b) { return b.byteLength; }),
		totalBufferlength = buffersLengths.reduce(function(p, c) { return p+c; }, 0),
		unit8Arr = new Uint8Array(totalBufferlength);
	buffersLengths.reduce(function (p, c, i) {
		unit8Arr.set(new Uint8Array(buffers[i]), p);
		return p+c;
	}, 0);
	return unit8Arr.buffer;
};

export {
	formatHistoryTime,
	capitalize,
	arrayBufferToFloat32,
	cloneBuffer,
	concatArrayBuffers,
}