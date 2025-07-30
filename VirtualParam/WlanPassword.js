// virtual parameter for WPA passphrase
let m = "";
if (args[1].value) {
  m = args[1].value[0];
  console.log("Password from args:", m);
  declare("InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.KeyPassphrase", null, {value: m});
  declare("InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.KeyPassphrase", null, {value: m});
}
else {
  let d = declare("InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.KeyPassphrase", {value: Date.now()});
  let igd = declare("InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.KeyPassphrase", {value: Date.now()});

  if (d.size) {
    m = d.value[0];
    console.log("Password from d:", m);
  }
  else if (igd.size) {
    m = igd.value[0];
    console.log("Password from igd:", m);
  }
}

// Ensure m is not blank
if (!m) {
  m = "defaultPassword";
  console.log("Using default password:", m);
}

return {writable: true, value: [m, "xsd:string"]};
