let m = "";
let d = declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.MACAddress", {value: Date.now()});
let igd = declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.2.MACAddress", {value: Date.now()});

if (d.size) {
  for (let p of d) {
    if (p.value[0]) {
      m = p.value[0];
      break;
    }
  }
}
else if (igd.size) {
  for (let p of igd) {
    if (p.value[0]) {
      m = p.value[0];
      break;
    }
  }
}

return {writable: false, value: [m, "xsd:string"]};
