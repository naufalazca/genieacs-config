// Unified Device Uptime parameter across Device and InternetGatewayDevice
let v1 = declare("InternetGatewayDevice.DeviceInfo.UpTime", {value: Date.now()});
let v2 = declare("Device.DeviceInfo.UpTime", {value: Date.now()});

let totalSecs = 0
if (typeof v1.value !== "undefined") {
  totalSecs = v1.value[0];
} else {
  totalSecs = v2.value[0];
}
let days = Math.floor(totalSecs / 86400);
let rem  = totalSecs % 86400;
let hrs  = Math.floor(rem / 3600);
if (hrs < 10) {
	hrs = "0" + hrs;
}

rem  = rem % 3600;
let mins = Math.floor(rem / 60);
if (mins < 10) {
	mins = "0" + mins;
}
let secs = rem % 60;
if (secs < 10) {
	secs = "0" + secs;
}

let uptime = days + "d " + hrs + ":" + mins + ":" + secs;
return {writable: false, value: uptime};