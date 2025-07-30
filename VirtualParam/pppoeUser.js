/**
 * Virtual Parameter: pppoeUser
 * Description: Extract PPPoE username from unified PPPoE Information
 * Author: GenieACS Virtual Parameter
 * Date: 2025-07-29
 * 
 * This parameter gets the username from the unified PPPoE Information virtual parameter
 * Simple and focused on just getting the username value
 */

let result = '';

if ("value" in args[1]) {
    // If value is already cached, use it
    result = args[1].value[0];
} else {
    // Get username from unified PPPoE Information
    result = getPPPoEUsername();
}

log("PPPoE Username: " + result);
return {writable: false, value: [result, "xsd:string"]};

function getPPPoEUsername() {
    try {
        // Get data from the unified PPPoE Information virtual parameter
        let pppoeInfoDeclared = declare("VirtualParameters.PPPoE Information", {
            path: Date.now() - (60 * 1000), // 1 minute cache
            value: Date.now()
        });
        
        // Parse the JSON response from PPPoE Information
        for (let item of pppoeInfoDeclared) {
            if (item.value && item.value[0]) {
                try {
                    let pppoeData = JSON.parse(item.value[0]);
                    
                    // Return the username, with fallback values
                    if (pppoeData.username && pppoeData.username !== 'NOT_CONFIGURED') {
                        return pppoeData.username;
                    } else {
                        return 'NOT_CONFIGURED';
                    }
                    
                } catch (parseError) {
                    log("Error parsing PPPoE Information JSON: " + parseError);
                    // Fallback: try to get username directly if JSON parsing fails
                    return getDirectUsername();
                }
            }
        }
        
        // If no data from unified parameter, fallback to direct method
        return getDirectUsername();
        
    } catch (error) {
        log("Error getting PPPoE username: " + error);
        return getDirectUsername();
    }
}

function getDirectUsername() {
    try {
        // Direct fallback method - get username directly from device
        let usernameDeclared = declare(
            "InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.Username",
            {path: Date.now() - (60 * 1000), value: Date.now()}
        );
        
        for (let item of usernameDeclared) {
            if (item.value && item.value[0] && item.value[0] !== '') {
                return item.value[0];
            }
        }
        
        return 'NOT_CONFIGURED';
        
    } catch (error) {
        log("Error in direct username retrieval: " + error);
        return 'ERROR';
    }
}
