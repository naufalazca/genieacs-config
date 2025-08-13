//URL ACS
const url = "http://10.240.0.6:7547";

// Static credentials untuk management yang konsisten
const username = "genieacs_admin";
const password = "GenieACS@2024!Secure";

//Interval inform
const informInterval = 100;

// Refresh Harian
const daily = Date.now(86400000);

// Unique inform offset per device for better load distribution
const informTime = Date.now % 86400000;

//Refresh Permenit
const minutes = Date.now(60000);

//Set Remot WAN ONT dan ACS URL Huawei
declare("InternetGatewayDevice.ManagementServer.URL", {value: daily}, {value: url});
//declare("InternetGatewayDevice.X_HW_Security.AclServices.SSHWanEnable", {value: minutes}, {value: true});
declare("InternetGatewayDevice.X_HW_Security.AclServices.HTTPWanEnable", {value: minutes}, {value: true});
//declare("InternetGatewayDevice.X_HW_Security.AclServices.TELNETWanEnable", {value: minutes}, {value: true});

declare("InternetGatewayDevice.ManagementServer.ConnectionRequestUsername", {value: daily}, {value: username});
declare("InternetGatewayDevice.ManagementServer.ConnectionRequestPassword", {value: daily}, {value: password});
declare("InternetGatewayDevice.ManagementServer.Username", {value: daily}, {value: username});
declare("InternetGatewayDevice.ManagementServer.Password", {value: daily}, {value: password});
declare("InternetGatewayDevice.ManagementServer.PeriodicInformEnable", {value: daily}, {value: true});
declare("InternetGatewayDevice.ManagementServer.PeriodicInformInterval", {value: daily}, {value: informInterval});

//declare("InternetGatewayDevice.ManagementServer.PeriodicInformTime", {value: minutes}, {value: informTime});

declare("Device.ManagementServer.ConnectionRequestUsername", {value: daily}, {value: username});
declare("Device.ManagementServer.ConnectionRequestPassword", {value: daily}, {value: password});
declare("Device.ManagementServer.PeriodicInformEnable", {value: daily}, {value: true});
declare("Device.ManagementServer.PeriodicInformInterval", {value: daily}, {value: informInterval});
declare("Device.ManagementServer.PeriodicInformTime", {value: daily}, {value: informTime});
