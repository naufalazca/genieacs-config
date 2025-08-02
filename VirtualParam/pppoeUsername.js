// Safe PPPoE Username retrieval with device capability detection
let result = '';

if ("value" in args[1]) {
    result = args[1].value[0];
} else {
    // First check if device has WAN capabilities
    let hasWAN = declare("InternetGatewayDevice.WANDevice", {value: 1});
    
    if (hasWAN.size === 0) {
        // Device doesn't have WAN capabilities (like F650 bridge)
        result = "N/A - Bridge Device";
        log("Device has no WAN capabilities, likely a bridge device");
    } else {
        // Device has WAN, proceed with PPPoE detection
        let found = false;
        
        // Primary keys for standard PPPoE connections
        let pppoeKeys = [
            "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.*.WANPPPConnection.*.Username",
            "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.*.WANPPPConnection.2.Username", 
            "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.Username",
            "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.2.WANPPPConnection.Username"
        ];
        
        // Try PPPoE paths
        for (let key of pppoeKeys) {
            let val = declare(key, {value: 1});
            if (val.size && val.value[0] && val.value[0] !== "" && val.value[0] !== "N/A") {
                result = val.value[0];
                found = true;
                log("Found PPPoE username: " + result);
                break;
            }
        }
        
        // Fallback to IPoE if PPPoE not found
        if (!found) {
            let ipoeKeys = [
                "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.*.WANIPConnection.*.X_CT-COM_IPoEName",
                "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.2.WANIPConnection.1.X_CT-COM_IPoEName",
                "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.X_CT-COM_IPoEName"
            ];
            
            for (let key of ipoeKeys) {
                let val = declare(key, {value: 1});
                if (val.size && val.value[0] && val.value[0] !== "") {
                    result = val.value[0];
                    found = true;
                    log("Found IPoE username: " + result);
                    break;
                }
            }
        }
        
        // If still not found
        if (!found) {
            result = "N/A - No PPPoE/IPoE";
            log("No PPPoE or IPoE username found");
        }
    }
}

log("Final pppoeUsername result: " + result);
return {writable: true, value: [result, "xsd:string"]};
