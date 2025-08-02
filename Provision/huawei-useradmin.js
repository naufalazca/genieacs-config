//Set useradmin superadmin semua Huawei secara otomatis
// variable user dan password user admin 
const user = "user";
const pw = "user";

// variable user dan password super admin 
const superuser = "user";
const superpw = "user";

// Refresh Harian
const daily = Date.now(86400000);

// UNCOMMENT dibawah ini untuk mengaktifkan USER ADMIN
//declare("InternetGatewayDevice.UserInterface.X_HW_WebUserInfo.1.UserName", {value: daily}, {value: user});
//declare("InternetGatewayDevice.UserInterface.X_HW_WebUserInfo.1.Password", {value: daily}, {value: pw});
//declare("InternetGatewayDevice.UserInterface.X_HW_WebUserInfo.1.Enable", {value: daily}, {value: true});

// UNCOMMENT dibawah ini untuk mengaktifkan SUPER ADMIN
//declare("InternetGatewayDevice.UserInterface.X_HW_WebUserInfo.2.UserName", {value: daily}, {value: superuser});
//declare("InternetGatewayDevice.UserInterface.X_HW_WebUserInfo.2.Password", {value: daily}, {value: superpw});
//declare("InternetGatewayDevice.UserInterface.X_HW_WebUserInfo.2.Enable", {value: daily}, {value: true});

