// Device Capability Detection Utility
// Helps Virtual Parameters to detect device type and available parameters

// Function to detect device capabilities
function detectDeviceCapabilities() {
    let capabilities = {
        hasWANDevice: false,
        hasPPPoE: false,
        hasPONInterface: false,
        hasWiFi: false,
        deviceType: 'unknown',
        manufacturer: 'unknown',
        productClass: 'unknown'
    };
    
    // Get basic device info
    let manufacturer = declare("InternetGatewayDevice.DeviceInfo.Manufacturer", {value: 1});
    let productClass = declare("InternetGatewayDevice.DeviceInfo.ProductClass", {value: 1});
    
    if (manufacturer.size > 0) {
        capabilities.manufacturer = manufacturer.value[0].toLowerCase();
    }
    
    if (productClass.size > 0) {
        capabilities.productClass = productClass.value[0].toLowerCase();
    }
    
    // Check for WAN Device
    let wanDevice = declare("InternetGatewayDevice.WANDevice", {value: 1});
    capabilities.hasWANDevice = wanDevice.size > 0;
    
    // Check for PPPoE Connection
    if (capabilities.hasWANDevice) {
        let pppoe = declare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection", {value: 1});
        capabilities.hasPPPoE = pppoe.size > 0;
    }
    
    // Check for PON Interface (various vendor implementations)
    let ponInterfaces = [
        "InternetGatewayDevice.WANDevice.*.X_ZTE-COM_WANPONInterfaceConfig",
        "InternetGatewayDevice.WANDevice.*.X_GponInterafceConfig", 
        "InternetGatewayDevice.WANDevice.*.X_FH_GponInterfaceConfig",
        "InternetGatewayDevice.WANDevice.*.X_CMCC_EponInterfaceConfig",
        "InternetGatewayDevice.WANDevice.*.X_CMCC_GponInterfaceConfig",
        "InternetGatewayDevice.WANDevice.*.X_CT-COM_EponInterfaceConfig",
        "InternetGatewayDevice.WANDevice.*.X_CU_WANEPONInterfaceConfig"
    ];
    
    for (let path of ponInterfaces) {
        let pon = declare(path, {value: 1});
        if (pon.size > 0) {
            capabilities.hasPONInterface = true;
            break;
        }
    }
    
    // Check for WiFi
    let wifi = declare("InternetGatewayDevice.LANDevice.*.WLANConfiguration", {value: 1});
    capabilities.hasWiFi = wifi.size > 0;
    
    // Determine device type based on capabilities
    if (capabilities.productClass.includes('f650') || 
        capabilities.productClass.includes('bridge')) {
        capabilities.deviceType = 'bridge';
    } else if (capabilities.hasPONInterface && capabilities.hasPPPoE) {
        capabilities.deviceType = 'ont_router';
    } else if (capabilities.hasPONInterface) {
        capabilities.deviceType = 'ont_bridge';
    } else if (capabilities.hasWANDevice) {
        capabilities.deviceType = 'router';
    } else {
        capabilities.deviceType = 'access_point';
    }
    
    return capabilities;
}

// Export for use in other Virtual Parameters
// This will be used as: eval(String.raw`${deviceCapabilityDetector}`).detectDeviceCapabilities()
let deviceCapabilityDetector = detectDeviceCapabilities.toString();
