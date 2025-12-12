//import os from 'os';
// // myApp/config/apiConfig.js
// const API_URL = "http://192.168.10.17:8000";

// const API = {
//   REGISTER: `${API_URL}/register-request`,
//   LOGIN: `${API_URL}/login`,
//   Email_VERIFY: `${API_URL}/register-verify`,
//   RESET_PASSWORD: `${API_URL}/reset-password`,
//   SEND_FORGOT_OTP: `${API_URL}/forgot-password`,
// };
//function getIPv4Address() {
//  const interfaces = os.networkInterfaces();
//  for (const name of Object.keys(interfaces)) {
//    for (const iface of interfaces[name]) {
//      if (iface.family === "IPv4" && !iface.internal) {
//        return iface.address; // Return the first non-internal IPv4
//      }
//    }
//  }
//  return "127.0.0.1";
//}

//console.log("Device IPv4 Address:", getIPv4Address());
// export default API;
export const API_URL = "http://192.168.100.5:8000";

const API = {
  aapi: `${API_URL}`,
  REGISTER: `${API_URL}/auth/register-request`,
  LOGIN: `${API_URL}/auth/login`,
  Email_VERIFY: `${API_URL}/auth/register-verify`,
  RESET_PASSWORD: `${API_URL}/auth/reset-password`,
  SEND_FORGOT_OTP: `${API_URL}/auth/forgot-password`,


  // 🆕 Avatar-related endpoints

  // ✅ Updated avatar endpoints
  // GENERATE_TEMP_AVATAR: `${API_URL}/avatar/generate-temp-avatar`,
  // SAVE_AVATAR: `${API_URL}/avatar/save-avatar`,
  // GET_AVATARS: `${API_URL}/avatar/get-avatars`,

  UPLOAD_AVATAR: `${API_URL}/avatar/upload`,
  GENERATE_AVATAR: `${API_URL}/avatar/generate`,
  SAVE_AVATAR: `${API_URL}/avatar/save`,
};

export default API;