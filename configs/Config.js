const isLive = true;
const EXPO_DEV_API_URL = "http://192.168.1.185:5000/api/v1";
const EXPO_PROD_API_URL =
  "http://ec2-23-20-244-234.compute-1.amazonaws.com/api/v1";

export const EXPO_PUBLIC_URL = isLive ? EXPO_PROD_API_URL : EXPO_DEV_API_URL;
