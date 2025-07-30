let result = '';

if ("value" in args[1]) {
    result = args[1].value[0];
} else {
    let keys = [
        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.*.WANPPPConnection.*.Username",
        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.*.WANPPPConnection.2.Username"
    ];

    result = getParameterValue(keys);
}

log("pppoeUsername: " + result);
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
