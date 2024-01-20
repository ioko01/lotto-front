import axios, { AxiosRequestConfig } from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContextProvider';
import { axiosConfig } from '../utils/headers';
import { IUser } from '../models/User';

const API_URL = import.meta.env.VITE_OPS_URL; // Replace with your API URL

export interface AuthResponse {
    token: string;
}

export interface UserCredentials {
    username: string;
    password: string;
}

export class AuthService {
    static async login(credentials: UserCredentials): Promise<AuthResponse> {
        try {
            const response = await axios.post<AuthResponse>(
                `${API_URL}/auth/login`,
                credentials
            );
            return response.data;
        } catch (error) {
            return { token: "invalid" };
        }

    }

    static async logout(username: string, token: string): Promise<{ username: string }> {
        const axiosConfig: AxiosRequestConfig = { withCredentials: true, timeout: 10000, headers: { Authorization: `Bearer ${token}` } }
        const response = await axios.post(`${API_URL}/auth/logout`, { username: username }, axiosConfig)

        return response.data;
    }

    // Implement other authentication methods like registration, logout, etc.
}