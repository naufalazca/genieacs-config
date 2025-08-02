const now = Date.now();
const hourly = now + 3600000; // 1 hour from now

// Check if device-detection.js ran recently - if so, skip to avoid conflicts
const lastDetectionRun = declare("VirtualParameters.LastDetectionRun", {value: 1}).value;
if (lastDetectionRun && lastDetectionRun.length > 0) {
    const timeSinceDetection = now - parseInt(lastDetectionRun[0]);
    if (timeSinceDetection < 1800000) { // 30 minutes - if detection ran recently, skip default
        log("Device detection ran recently, skipping default provision to avoid conflicts");
        return;
    }
}

// Add stronger cooldown to prevent conflicts with device-detection.js
const lastDefaultRun = declare("VirtualParameters.LastDefaultRun", {value: 1}).value;
if (lastDefaultRun && lastDefaultRun.length > 0) {
    const timeSinceLastRun = now - parseInt(lastDefaultRun[0]);
    if (timeSinceLastRun < 900000) { // 15 minutes cooldown - reduced
        log("Default provision ran recently, skipping");
        return; // Skip silently
    }
}

// Get device info to avoid conflicts with ZTE devices
let manufacturer = declare("InternetGatewayDevice.DeviceInfo.Manufacturer", {value: 1});
let deviceManufacturer = manufacturer.size > 0 ? manufacturer.value[0].toLowerCase() : "";
log("Device Manufacturer: " + deviceManufacturer);

// For ZTE devices, use even more conservative approach
if (deviceManufacturer.includes("zicg") || deviceManufacturer.includes("zte")) {
    const lastZteRun = declare("VirtualParameters.LastZteDefaultRun", {value: now}).value;
    if (lastZteRun && lastZteRun.length > 0) {
        const timeSinceZteRun = now - parseInt(lastZteRun[0]);
        if (timeSinceZteRun < 1800000) { // 30 minutes for ZTE devices
            log("ZTE device default provision ran recently, skipping");
            return;
        }
    }
    declare("VirtualParameters.LastZteDefaultRun", {value: now});
}

// Update last run timestamp
declare("VirtualParameters.LastDefaultRun", {value: now});

log("Starting default provision");

// Get basic device info
let productClass = declare("InternetGatewayDevice.DeviceInfo.ProductClass", {value: 1});
let deviceProduct = productClass.size > 0 ? productClass.value[0].toLowerCase() : "";
log("Device Product: " + deviceProduct);

// Limit declarations to prevent too many commits - lower for ZTE devices
let declarationCount = 0;
const MAX_DECLARATIONS = deviceManufacturer.includes("zicg") || deviceManufacturer.includes("zte") ? 6 : 8;

function safeDeclare(path, options) {
    if (declarationCount >= MAX_DECLARATIONS) {
        log("Maximum declarations reached in default provision, stopping");
        return null;
    }
    declarationCount++;
    return declare(path, options);
}

// Only declare basic device info that should exist on all devices
safeDeclare("InternetGatewayDevice.DeviceInfo.HardwareVersion", {path: hourly, value: hourly});
safeDeclare("InternetGatewayDevice.DeviceInfo.SoftwareVersion", {path: hourly, value: hourly});
safeDeclare("InternetGatewayDevice.DeviceInfo.Manufacturer", {path: hourly, value: hourly});
safeDeclare("InternetGatewayDevice.DeviceInfo.ProductClass", {path: hourly, value: hourly});
safeDeclare("InternetGatewayDevice.DeviceInfo.SerialNumber", {path: hourly, value: hourly});

// Check if device has WAN capabilities before declaring WAN parameters
let hasWAN = declare("InternetGatewayDevice.WANDevice", {value: 1});
log("WAN Device present: " + (hasWAN.size > 0));
if (hasWAN.size > 0 && declarationCount < MAX_DECLARATIONS) {
    log("WAN Device present, declaring WAN parameters");
    // Only declare parameters that commonly exist
    safeDeclare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANIPConnection.*.MACAddress", {path: hourly, value: hourly});
    
    // Check for PPPoE separately to avoid parameter errors
    let hasPPPoE = declare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection", {value: 1});
    log("PPPoE Connection present: " + (hasPPPoE.size > 0));
    if (hasPPPoE.size > 0 && declarationCount < MAX_DECLARATIONS) {
        safeDeclare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.Username", {path: hourly, value: hourly});
    }
}

// Check for WiFi before declaring WiFi parameters
let hasWiFi = declare("InternetGatewayDevice.LANDevice.*.WLANConfiguration", {value: 1});
if (hasWiFi.size > 0 && declarationCount < MAX_DECLARATIONS) {
    log("WiFi present, declaring WiFi parameters");
    safeDeclare("InternetGatewayDevice.LANDevice.*.WLANConfiguration.*.SSID", {path: hourly, value: hourly});
    // Don't refresh password field periodically because CPEs always report blank passwords for security reasons
    safeDeclare("InternetGatewayDevice.LANDevice.*.WLANConfiguration.*.KeyPassphrase", {path: hourly, value: 1});
    // Skip Enable parameter as it causes XML node warnings on some devices
}

// Only declare LAN hosts if they exist and we have declarations left
let hasLANHosts = declare("InternetGatewayDevice.LANDevice.*.Hosts.Host", {value: 1});
if (hasLANHosts.size > 0 && declarationCount < MAX_DECLARATIONS) {
    log("LAN hosts present, declaring host parameters");
    safeDeclare("InternetGatewayDevice.LANDevice.*.Hosts.Host.*.HostName", {path: hourly, value: hourly});
    safeDeclare("InternetGatewayDevice.LANDevice.*.Hosts.Host.*.IPAddress", {path: hourly, value: hourly});
    safeDeclare("InternetGatewayDevice.LANDevice.*.Hosts.Host.*.MACAddress", {path: hourly, value: hourly});
}

log("Default provision completed with " + declarationCount + " declarations");