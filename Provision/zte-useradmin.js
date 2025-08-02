//Set useradmin superadmin semua ZTE secara otomatis
// variable user dan password user admin 
const user = "user";
const pw = "user";

// variable user dan password super admin 
const superuser = "admin";
const superpw = "admin";

// Refresh Harian
const daily = Date.now(86400000);

// UNCOMMENT HILANGKAN "//" dibawah ini untuk mengaktifkan USER ADMIN
//declare("InternetGatewayDevice.UserInterface.X_ZTE-COM_WebUserInfo.UserName", {value: daily}, {value: user});
//declare("InternetGatewayDevice.UserInterface.X_ZTE-COM_WebUserInfo.UserPassword", {value: daily}, {value: pw});
//declare("InternetGatewayDevice.UserInterface.X_ZTE-COM_WebUserInfo.UserEnable", {value: daily}, {value: true});
//declare("InternetGatewayDevice.X_CU_Function.Web.UserName", {value: daily}, {value: user});
//declare("InternetGatewayDevice.X_CU_Function.Web.UserPassword", {value: daily}, {value: pw});

// UNCOMMENT HILANGKAN "//" dibawah ini untuk mengaktifkan SUPER ADMIN
declare("InternetGatewayDevice.UserInterface.X_ZTE-COM_WebUserInfo.AdminName", {value: daily}, {value: superuser});
declare("InternetGatewayDevice.UserInterface.X_ZTE-COM_WebUserInfo.AdminPassword", {value: daily}, {value: superpw});
declare("InternetGatewayDevice.UserInterface.X_HW_WebUserInfo.2.Enable", {value: daily}, {value: true});
declare("InternetGatewayDevice.X_CU_Function.Web.AdminName", {value: daily}, {value: superuser});
declare("InternetGatewayDevice.X_CU_Function.Web.AdminPassword", {value: daily}, {value: superpw});

