// Safe Device Detection with Rate Limiting and Commit Prevention
// This provision script avoids "Too many commit iterations" error

const now = Date.now();
const hourly = now + 3600000; // 1 hour from now

// Add rate limiting to prevent excessive provision calls
const lastRun = declare("VirtualParameters.LastDetectionRun", {value: now}).value;
if (lastRun && lastRun.length > 0) {
    const timeSinceLastRun = now - parseInt(lastRun[0]);
    log("Time since last detection run: " + Math.floor(timeSinceLastRun / 1000) + " seconds");
    if (timeSinceLastRun < 900000) { // 15 minutes cooldown (increased for ZTE devices)
        log("Device detection ran recently, skipping to prevent loops");
        return;
    }
}

// Check if default provision ran recently to avoid conflicts
const lastDefaultRun = declare("VirtualParameters.LastDefaultRun", {value: now}).value;
if (lastDefaultRun && lastDefaultRun.length > 0) {
    const timeSinceDefault = now - parseInt(lastDefaultRun[0]);
    if (timeSinceDefault < 300000) { // 5 minutes - wait for default to finish
        log("Default provision ran recently, skipping detection to avoid conflicts");
        return;
    }
}

log("Starting safe device detection provision");

// Limit the number of declarations to prevent too many commits
let declarationCount = 0;
const MAX_DECLARATIONS = 12; // Reduced from 15

function safeDeclare(path, options) {
    if (declarationCount >= MAX_DECLARATIONS) {
        log("Maximum declarations reached, stopping to prevent too many commits");
        return null;
    }
    declarationCount++;
    return declare(path, options);
}

// Update last run timestamp
safeDeclare("VirtualParameters.LastDetectionRun", {value: now});

// Always declare basic device info (should exist on all devices)
safeDeclare("InternetGatewayDevice.DeviceInfo.HardwareVersion", {path: hourly, value: hourly});
safeDeclare("InternetGatewayDevice.DeviceInfo.SoftwareVersion", {path: hourly, value: hourly});
safeDeclare("InternetGatewayDevice.DeviceInfo.Manufacturer", {path: hourly, value: hourly});
safeDeclare("InternetGatewayDevice.DeviceInfo.ProductClass", {path: hourly, value: hourly});
safeDeclare("InternetGatewayDevice.DeviceInfo.SerialNumber", {path: hourly, value: hourly});
safeDeclare("InternetGatewayDevice.DeviceInfo.UpTime", {path: hourly, value: hourly});

// Get device info for detection (READ-ONLY)
let manufacturer = declare("InternetGatewayDevice.DeviceInfo.Manufacturer", {value: 1});
let productClass = declare("InternetGatewayDevice.DeviceInfo.ProductClass", {value: 1});

let deviceManufacturer = manufacturer.size > 0 ? manufacturer.value[0].toLowerCase() : "";
let deviceProduct = productClass.size > 0 ? productClass.value[0].toLowerCase() : "";

log("Device Manufacturer: " + deviceManufacturer);
log("Device Product: " + deviceProduct);

// Safe check for WAN Device capabilities (READ-ONLY)
let hasWAN = declare("InternetGatewayDevice.WANDevice", {value: 1});
log("WAN Device present: " + (hasWAN.size > 0));

if (hasWAN.size > 0 && declarationCount < MAX_DECLARATIONS) {
    // Device has WAN capabilities, declare WAN parameters
    safeDeclare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANIPConnection.*.MACAddress", {path: hourly, value: hourly});
    safeDeclare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANIPConnection.*.ExternalIPAddress", {path: hourly, value: hourly});
    
    // Safe check for PPPoE capability (READ-ONLY)
    let hasPPPoE = declare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection", {value: 1});
    log("PPPoE Connection present: " + (hasPPPoE.size > 0));
    
    if (hasPPPoE.size > 0 && declarationCount < MAX_DECLARATIONS) {
        safeDeclare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.Username", {path: hourly, value: hourly});
        safeDeclare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.ExternalIPAddress", {path: hourly, value: hourly});
    }
    
    // Safe check for PON interfaces - be more conservative for ZTE devices
    let ponFound = false;
    
    // Skip PON parameter detection for problematic devices to avoid infinite loops
    if (deviceManufacturer.includes("zicg") && deviceProduct.includes("f663nv3a")) {
        log("Skipping detailed PON detection for ZTE F663NV3A to prevent parameter errors");
        ponFound = true; // Mark as found to skip further checks
    }
    
    if (!ponFound && declarationCount < MAX_DECLARATIONS) {
        // Check for CT-COM (most common in your logs)
        let ctPon = declare("InternetGatewayDevice.WANDevice.*.X_CT-COM_EponInterfaceConfig", {value: 1});
        if (ctPon.size > 0) {
            log("Found PON interface: InternetGatewayDevice.WANDevice.*.X_CT-COM_EponInterfaceConfig");
            safeDeclare("InternetGatewayDevice.WANDevice.*.X_CT-COM_EponInterfaceConfig.RXPower", {path: hourly, value: hourly});
            ponFound = true;
        }
        
        // Only check other PON types if CT-COM not found and not ZTE F663NV3A
        if (!ponFound && declarationCount < MAX_DECLARATIONS && 
            !(deviceManufacturer.includes("zicg") && deviceProduct.includes("f663"))) {
            let ztePon = declare("InternetGatewayDevice.WANDevice.*.X_ZTE-COM_WANPONInterfaceConfig", {value: 1});
            if (ztePon.size > 0) {
                log("Found PON interface: InternetGatewayDevice.WANDevice.*.X_ZTE-COM_WANPONInterfaceConfig");
                safeDeclare("InternetGatewayDevice.WANDevice.*.X_ZTE-COM_WANPONInterfaceConfig.RXPower", {path: hourly, value: hourly});
                ponFound = true;
            }
        }
    }
} else {
    log("Device is likely a bridge/access point (no WAN device)");
}

// Safe check for LAN and WiFi parameters (READ-ONLY)
let hasLAN = declare("InternetGatewayDevice.LANDevice", {value: 1});
if (hasLAN.size > 0 && declarationCount < MAX_DECLARATIONS) {
    // Safe check for WiFi capability (READ-ONLY)
    let hasWiFi = declare("InternetGatewayDevice.LANDevice.*.WLANConfiguration", {value: 1});
    log("WiFi present: " + (hasWiFi.size > 0));
    
    if (hasWiFi.size > 0 && declarationCount < MAX_DECLARATIONS) {
        safeDeclare("InternetGatewayDevice.LANDevice.*.WLANConfiguration.*.SSID", {path: hourly, value: hourly});
        // Don't refresh password field periodically because CPEs always report blank passwords for security reasons
        safeDeclare("InternetGatewayDevice.LANDevice.*.WLANConfiguration.*.KeyPassphrase", {path: hourly, value: 1});
        // Skip Enable parameter as it causes XML node warnings on ZTE devices
    }
    
    // LAN hosts info
    if (declarationCount < MAX_DECLARATIONS) {
        safeDeclare("InternetGatewayDevice.LANDevice.*.Hosts.Host.*.HostName", {path: hourly, value: hourly});
        safeDeclare("InternetGatewayDevice.LANDevice.*.Hosts.Host.*.IPAddress", {path: hourly, value: hourly});
        safeDeclare("InternetGatewayDevice.LANDevice.*.Hosts.Host.*.MACAddress", {path: hourly, value: hourly});
    }
}

log("Safe device detection provision completed with " + declarationCount + " declarations");
