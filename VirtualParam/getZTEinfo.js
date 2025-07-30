// Virtual Parameter untuk mengambil semua data ZTE PON Interface Config
let result = {};
let basePath = "InternetGatewayDevice.WANDevice.1.X_ZTE-COM_WANPONInterfaceConfig";

// Ambil nilai RX Power
let rxPower = declare(basePath + ".RXPower", {value: Date.now()});
result.RXPower = rxPower.value ? rxPower.value[0] : "No Value";

// Ambil nilai TX Power  
let txPower = declare(basePath + ".TXPower", {value: Date.now()});
result.TXPower = txPower.value ? txPower.value[0] : "No Value";

// Ambil Bias Current
let biasCurrent = declare(basePath + ".BiasCurrent", {value: Date.now()});
result.BiasCurrent = biasCurrent.value ? biasCurrent.value[0] : "No Value";

// Ambil Supply Voltage
let supplyVoltage = declare(basePath + ".SupplyVoltage", {value: Date.now()});
result.SupplyVoltage = supplyVoltage.value ? supplyVoltage.value[0] : "No Value";

// Ambil Transceiver Temperature
let transceiverTemp = declare(basePath + ".TransceiverTemperature", {value: Date.now()});
result.TransceiverTemperature = transceiverTemp.value ? transceiverTemp.value[0] : "No Value";

// Ambil Status
let status = declare(basePath + ".Status", {value: Date.now()});
result.Status = status.value ? status.value[0] : "No Value";

// Cek juga Stats object
let stats = declare(basePath + ".Stats", {value: Date.now()});
result.StatsObject = stats.writable ? "Available" : "Read-only";

// Cek GPON Interface Config juga
let gponConfig = declare("InternetGatewayDevice.WANDevice.1.X_ZTE-COM_GponInterfaceConfig", {value: Date.now()});
result.GponConfigAvailable = gponConfig.writable ? "Available" : "Read-only";

// Timestamp
result.timestamp = new Date().toISOString();

// Format output yang mudah dibaca
let output = "=== ZTE PON Interface Configuration ===\n";
output += `RX Power: ${result.RXPower} dBm\n`;
output += `TX Power: ${result.TXPower} dBm\n`;
output += `Bias Current: ${result.BiasCurrent} mA\n`;
output += `Supply Voltage: ${result.SupplyVoltage} V\n`;
output += `Transceiver Temperature: ${result.TransceiverTemperature} °C\n`;
output += `Status: ${result.Status}\n`;
output += `Stats Object: ${result.StatsObject}\n`;
output += `GPON Config: ${result.GponConfigAvailable}\n`;
output += `Generated: ${result.timestamp}`;

return {
  writable: false,
  value: [output, "xsd:string"]
};