/**
 * Virtual Parameter: PPPoE Information
 * Description: Unified PPPoE information retrieval for all devices
 * Author: GenieACS Virtual Parameter
 * Date: 2025-07-29
 * 
 * This virtual parameter provides comprehensive PPPoE connection information
 * including username, IP, MAC, status, and connection details in one unified place.
 * 
 * Usage Examples:
 * - Get all info: VirtualParameters.PPPoEInformation
 * - Parse JSON to get specific values in your application
 */

let result = '';

if ("value" in args[1]) {
    // If value is already cached, use it
    result = args[1].value[0];
} else {
    // Get comprehensive PPPoE information
    result = getPPPoEInformation();
}

log("PPPoE Information: " + result);
return {writable: false, value: [result, "xsd:string"]};

function getPPPoEInformation() {
    try {
        // Define all PPPoE related parameters we want to retrieve
        let pppoeParams = {
            username: 'InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.Username',
            password: 'InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.Password',
            externalIP: 'InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.ExternalIPAddress',
            macAddress: 'InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.MACAddress',
            connectionStatus: 'InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.ConnectionStatus',
            connectionType: 'InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.ConnectionType',
            enable: 'InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.Enable',
            uptime: 'InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.Uptime',
            natEnabled: 'InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.NATEnabled',
            dnsServers: 'InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.DNSServers',
            lastConnectionError: 'InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.LastConnectionError'
        };
        
        let pppoeData = {};
        let timestamp = Date.now() - (60 * 1000); // 1 minute cache
        
        // Retrieve each parameter
        for (let [paramName, paramPath] of Object.entries(pppoeParams)) {
            let value = getParameterValue(paramPath, timestamp);
            if (value !== null && value !== '') {
                pppoeData[paramName] = value;
            }
        }
        
        // Build comprehensive output object
        let output = {
            // Basic connection info
            username: pppoeData.username || 'NOT_CONFIGURED',
            password: pppoeData.password ? (pppoeData.password.length > 0 ? '***CONFIGURED***' : 'NOT_SET') : 'NOT_SET',
            externalIP: pppoeData.externalIP || '0.0.0.0',
            macAddress: pppoeData.macAddress || '00:00:00:00:00:00',
            
            // Connection status
            connectionStatus: pppoeData.connectionStatus || 'Unknown',
            connectionType: pppoeData.connectionType || 'PPPoE',
            enabled: pppoeData.enable === '1' || pppoeData.enable === 'true',
            uptime: pppoeData.uptime || '0',
            
            // Network settings
            natEnabled: pppoeData.natEnabled === '1' || pppoeData.natEnabled === 'true',
            dnsServers: pppoeData.dnsServers || 'Auto',
            lastError: pppoeData.lastConnectionError || 'None',
            
            // Metadata
            lastUpdated: new Date().toISOString(),
            
            // Computed status fields
            isConnected: (pppoeData.connectionStatus === 'Connected' || 
                         (pppoeData.externalIP && pppoeData.externalIP !== '0.0.0.0')),
            hasValidIP: pppoeData.externalIP && pppoeData.externalIP !== '0.0.0.0' && pppoeData.externalIP !== '',
            configurationComplete: pppoeData.username && pppoeData.username.length > 0,
            
            // Summary for quick display
            summary: formatSummary(pppoeData)
        };
        
        // Return as formatted JSON string
        return JSON.stringify(output, null, 2);
        
    } catch (error) {
        log("Error getting PPPoE information: " + error);
        return JSON.stringify({
            error: "Failed to retrieve PPPoE information",
            message: error.toString(),
            timestamp: new Date().toISOString()
        }, null, 2);
    }
}

function getParameterValue(parameterPath, timestamp) {
    try {
        let declared = declare(parameterPath, {path: timestamp, value: Date.now()});
        
        for (let item of declared) {
            if (item.value && item.value[0] !== undefined && item.value[0] !== null) {
                return item.value[0];
            }
        }
        
        return null;
    } catch (error) {
        log("Error getting parameter " + parameterPath + ": " + error);
        return null;
    }
}

function formatSummary(pppoeData) {
    let status = pppoeData.connectionStatus || 'Unknown';
    let username = pppoeData.username || 'N/A';
    let ip = pppoeData.externalIP || '0.0.0.0';
    let enabled = (pppoeData.enable === '1' || pppoeData.enable === 'true') ? 'Enabled' : 'Disabled';
    
    return `User: ${username} | IP: ${ip} | Status: ${status} | Config: ${enabled}`;
}
