import axios from "axios";

const HELIUS_API_KEY = "9aa7deb9-8253-4679-adcd-8b23b0ac0f7c";

const HELIUS_API: string = "https://mainnet.helius-rpc.com";
const HELIUS_DEV_API: string = "https://devnet.helius-rpc.com"; // does not work

export const http = axios.create({
  baseURL: HELIUS_DEV_API,
  params: { "api-key": HELIUS_API_KEY },
});

http.interceptors.request.use((config) => {
  config.params = config.params || {};
  config.params["api-key"] = HELIUS_API_KEY;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (axios.isAxiosError(error)) return error.response?.data?.message
    if (error.response?.data) return Promise.reject(error.response.data);
    else return Promise.reject(error);
  }
);

http.defaults.params = {};
http.defaults.params["api-key"] = HELIUS_API_KEY;

export default http;
