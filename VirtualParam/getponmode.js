// Unified PON Mode parameter across different device models
let m = "";
if (args[1].value) {
  m = args[1].value[0];
  declare("InternetGatewayDevice.DeviceInfo.X_HW_UpPortMode", {value: Date.now()});
}
else {
  // Check WANAccessType first
  let igd = declare("InternetGatewayDevice.WANDevice.*.WANCommonInterfaceConfig.WANAccessType", {value: Date.now()});
  
  if (igd.size && igd.value && igd.value[0]) {
    // Get speed parameters
    let downSpeed = declare("InternetGatewayDevice.WANDevice.*.WANCommonInterfaceConfig.Layer1DownstreamMaxBitRate", {value: Date.now()});
    let upSpeed = declare("InternetGatewayDevice.WANDevice.*.WANCommonInterfaceConfig.Layer1UpstreamMaxBitRate", {value: Date.now()});
    
    // Convert speed values to numbers for comparison
    let downSpeedValue = downSpeed.value && downSpeed.value[0] ? Number(downSpeed.value[0]) : 0;
    let upSpeedValue = upSpeed.value && upSpeed.value[0] ? Number(upSpeed.value[0]) : 0;
    
    // Check if PON and speeds match GPON standard (2.5G/1.25G)
    if (igd.value[0] === "PON" && 
        downSpeed.size && upSpeed.size &&
        downSpeedValue === 2500000000 && 
        upSpeedValue === 1250000000) {
      m = "GPON";
    } else {
      m = igd.value[0];
    }
  }
}

return {writable: false, value: [m, "xsd:string"]};