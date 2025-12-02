import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Resolves the best possible backend URL based on environment + platform.
 *
 * Priority:
 * 1. Environment variable REACT_APP_BACKEND_URL (via app.config.js)
 * 2. Platform-safe defaults for local development
 *
 * Notes:
 * - Android Emulator requires 10.0.2.2 to access host machine.
 * - iOS Simulator and Web can use localhost directly.
 * - Physical devices MUST use an IP in the .env (e.g., http://192.168.x.x:5000)
 */

const DEFAULT_PORT = "5000";

const resolveApiBaseUrl = () => {
  const envUrl = Constants.expoConfig?.extra?.REACT_APP_BACKEND_URL;

  // 1️⃣ Environment variable takes full priority
  if (envUrl) {
    console.log(`✔ Using backend URL from environment: ${envUrl}`);
    return envUrl;
  }

  // 2️⃣ Platform-specific fallback (local dev only)
  let fallbackUrl;

  switch (Platform.OS) {
    case "android":
      // Android emulator uses special alias to host machine
      fallbackUrl = `http://10.0.2.2:${DEFAULT_PORT}`;
      break;

    case "ios":
      // iOS simulator accesses host via localhost
      fallbackUrl = `http://localhost:${DEFAULT_PORT}`;
      break;

    case "web":
      fallbackUrl = `http://localhost:${DEFAULT_PORT}`;
      break;

    default:
      fallbackUrl = `http://localhost:${DEFAULT_PORT}`;
      break;
  }

  console.warn(
    `⚠️ No REACT_APP_BACKEND_URL provided. Falling back to platform default: ${fallbackUrl}`,
  );
  console.warn(
    "⚠️ If running on a physical device, set REACT_APP_BACKEND_URL to your machine IP (e.g., http://192.168.x.x:5000)",
  );

  return fallbackUrl;
};

// Export the resolved base URL
export const API_BASE_URL = resolveApiBaseUrl();

console.log("🌍 API Base URL:", API_BASE_URL);
console.log("📱 Platform:", Platform.OS);

/**
 * Build a full API URL from a relative path.
 */
export const buildApiUrl = (path = "") => {
  const clean = path.replace(/^\//, ""); // remove leading slash safely
  return `${API_BASE_URL}/${clean}`;
};
