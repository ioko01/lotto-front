import React, {
    ReactNode,
    useState,
    useContext,
    createContext,
    useEffect,
} from 'react'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { IUser } from '../models/User'
import { getToken } from '../utils/token'
import { AuthService, UserCredentials } from '../services/AuthService'

export interface AuthProviderProps {
    children?: ReactNode
}

export interface UserContextState {
    isUser: IUser
    status: LOGIN_STATE
    id?: string
}

type LOGIN_STATE = "LOADING" | "NULL" | "ERROR" | "SUCCESS" | "NETWORK_ERROR" | "LOGOUT";

export const UserStateContext = createContext<UserContextState>(
    {} as UserContextState,
)
export interface AuthContextData {
    isUser: IUser | null
    status: LOGIN_STATE
    login: (credentials: UserCredentials) => Promise<void>
    logout: (username: string) => Promise<{ username: string }>
}

export const AuthContext = React.createContext<AuthContextData>(
    {} as AuthContextData,
)

export function useAuth(): AuthContextData {
    return useContext(AuthContext)
}

async function fetchAuth(token: string): Promise<AxiosResponse<any, any> | any> {
    try {
        const axiosConfig: AxiosRequestConfig = { withCredentials: true, timeout: 10000, headers: { Authorization: `Bearer ${token}` } }
        const response = await axios.get(import.meta.env.VITE_OPS_URL + "/me", axiosConfig)
        if (response && response.status == 200) {
            return response
        }
    } catch (error) {
        return error
    }
}

export const AuthContextProvider = ({ children }: AuthProviderProps): JSX.Element => {
    const [isUser, setIsUser] = useState<IUser | null>(null)
    const [status, setStatus] = useState<LOGIN_STATE>("LOADING");
    const token = getToken()
    useEffect(() => {
        if (token) {
            // console.log(token);
            const fetchMe = fetchAuth(token)
            fetchMe.then((response) => {
                if (response.data.token) {
                    sessionStorage.setItem(import.meta.env.VITE_OPS_COOKIE_NAME, response.data.token)
                    fetchMe.then((response) => {
                        setIsUser(response.data)
                        setStatus("SUCCESS")
                    })
                        .catch((err) => {
                            setStatus("LOGOUT")
                            setIsUser(null)
                        })
                } else {
                    setIsUser(response.data)
                    setStatus("SUCCESS")
                }
            })
                .catch((err) => {
                    sessionStorage.removeItem(import.meta.env.VITE_OPS_COOKIE_NAME)
                    setStatus("LOGOUT")
                    setIsUser(null)
                })

        } else if (status !== "LOGOUT") {
            setStatus("LOGOUT")
        }
    }, [])

    const login = async (credentials: UserCredentials) => {
        const response = await AuthService.login(credentials)
        sessionStorage.setItem(import.meta.env.VITE_OPS_COOKIE_NAME, response.token)
        if (response) {
            location.reload()
            const fetchMe = fetchAuth(response.token)
            fetchMe.then((response) => {
                setIsUser(response.data)
                setStatus("SUCCESS")
            })
                .catch((err) => {
                    sessionStorage.removeItem(import.meta.env.VITE_OPS_COOKIE_NAME)
                    setStatus("LOGOUT")
                    setIsUser(null)
                })
        } else {
            setStatus("LOGOUT")
        }
    };

    const logout = async (username: string) => {
        const response = await AuthService.logout(username, token!)
        sessionStorage.removeItem(import.meta.env.VITE_OPS_COOKIE_NAME)
        if (response) {
            setStatus("LOGOUT")
        }
        return response
    };

    const values = {
        isUser,
        status,
        login,
        logout
    }

    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export const useUserContext = (): UserContextState => {
    return useContext(UserStateContext)
}