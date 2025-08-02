// Safe RX Power measurement with device capability detection
let result = "N/A";

// First check if device has WAN capabilities
let hasWAN = declare("InternetGatewayDevice.WANDevice", {value: 1});

if (hasWAN.size === 0) {
    // Device doesn't have WAN capabilities (like F650 bridge)
    result = "N/A - Bridge Device";
    log("Device has no WAN capabilities, RX Power not applicable");
} else {
    // Try different vendor-specific PON interface paths
    let ponPaths = [
        {path: "InternetGatewayDevice.WANDevice.*.X_ZTE-COM_WANPONInterfaceConfig.RXPower", vendor: "ZTE"},
        {path: "InternetGatewayDevice.WANDevice.*.X_GponInterafceConfig.RXPower", vendor: "Huawei"},
        {path: "InternetGatewayDevice.WANDevice.*.X_FH_GponInterfaceConfig.RXPower", vendor: "FiberHome"},
        {path: "InternetGatewayDevice.WANDevice.*.X_CMCC_EponInterfaceConfig.RXPower", vendor: "ZTE_CMCC_EPON"},
        {path: "InternetGatewayDevice.WANDevice.*.X_CMCC_GponInterfaceConfig.RXPower", vendor: "ZTE_CMCC_GPON"},
        {path: "InternetGatewayDevice.WANDevice.*.X_CT-COM_EponInterfaceConfig.RXPower", vendor: "GM220S"},
        {path: "InternetGatewayDevice.WANDevice.*.X_CU_WANEPONInterfaceConfig.OpticalTransceiver.RXPower", vendor: "F477V2"}
    ];
    
    let found = false;
    
    for (let ponConfig of ponPaths) {
        let rxPower = declare(ponConfig.path, {value: 1});
        
        if (rxPower.size > 0 && rxPower.value[0] !== undefined) {
            let powerValue = rxPower.value[0];
            
            if (powerValue < 0) {
                // Already in dBm format
                result = powerValue.toString();
            } else if (powerValue > 0) {
                // Convert from linear to dBm (vendor-specific calculation)
                let dBm = 30 + (Math.log10((powerValue * (Math.pow(10,-7))))*10);
                result = dBm.toFixed(2);
            } else {
                result = "0";
            }
            
            log("Found RX Power from " + ponConfig.vendor + ": " + result);
            found = true;
            break;
        }
    }
    
    if (!found) {
        result = "N/A - No PON Interface";
        log("No PON interface found on this device");
    }
}

log("Final RX Power result: " + result);
return {writable: true, value: [result, "xsd:string"]};
