import { AxiosRequestConfig } from "axios";
import { getToken } from "./token";
const token = getToken()
export const axiosConfig: AxiosRequestConfig = { withCredentials: true, timeout: 10000, headers: { Authorization: `Bearer ${token}` } }