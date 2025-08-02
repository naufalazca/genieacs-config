let result = '';

if ("value" in args[1]) {
    result = args[1].value[0];
} else {
    // Primary keys for standard PPPoE connections
    let pppoeKeys = [
        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.*.WANPPPConnection.*.Password",
        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.*.WANPPPConnection.2.Password",
        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.Password",
        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.2.WANPPPConnection.Password"
    ];
    
    // Fallback keys for CT-COM IPoE connections
    let ipoeKeys = [
        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.*.WANIPConnection.*.X_CT-COM_IPoEPassword",
        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.2.WANIPConnection.1.X_CT-COM_IPoEPassword",
        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.X_CT-COM_IPoEPassword"
    ];
    
    // Try PPPoE first
    result = getParameterValue(pppoeKeys);
    
    // If PPPoE not found, try IPoE (CT-COM specific)
    if (!result) {
        result = getParameterValue(ipoeKeys);
        log("PPPoE password not found, using IPoE password: " + (result ? "***masked***" : "empty"));
    } else {
        log("Found PPPoE password: " + (result ? "***masked***" : "empty"));
    }
}

log("Final pppoePassword retrieved: " + (result ? "***masked***" : "empty"));
return {writable: true, value: [result, "xsd:string"]};

function getParameterValue(keys) {
    for (let key of keys) {
        let d = declare(key, {path: Date.now() - (120 * 1000), value: Date.now()});

        for (let item of d) {
            if (item.value && item.value[0]) {
                return item.value[0];
            }
        }
    }

    return '';
}