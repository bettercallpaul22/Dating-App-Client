import axios, {
    AxiosInstance,
    AxiosError,
    AxiosRequestConfig,
    AxiosResponse
} from "axios";
import { AuthService } from "./AuthService";
import jwtDecode from "jwt-decode";
import Cookies from 'js-cookie'
const authService = new AuthService();
const baseURL = "http://localhost:5000"



const instance: AxiosInstance = axios.create({
    baseURL: "http://localhost:5000",
    // baseURL,
    withCredentials: true,
    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },

})



const onRequest = async (config: any) => {
    const token = authService.getUserToken() as string
    const decodedToken: any = jwtDecode(token)
    const currentDtae = new Date()
    if (decodedToken.exp * 1000 < currentDtae.getTime()) {
        console.log('token expired')
        const res = await instance.post("/api/auth/refresh", { withCredentials: true })
        authService.setUserToken(res.data.accessToken)
        config.headers["Authorization"] = `Bearer ${res.data.accessToken}`
        console.log('refres instance res ',res)
        // return data
    }

    return config
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error)
}


const onResponse = (response: AxiosResponse): AxiosResponse => {
    return response
}




const onResponseError = async (error: AxiosError): Promise<any> => {

    if (error.response?.status === 401 && error.response.data === 'invalid or expired token') {
        console.log('theres axioninstance error', error.response)
        window.location.href='http://localhost:8100/login'
    }

    if (error.response?.status === 401 && "invalid or expired token") {
        try {
            // const config = {
            //     method: "post",
            //     url: "/api/auth/refresh",
            //     data: {},
            //     // withCredentials: true,

            //     // headers: {
            //     //     "Content-type": "application/json",
            //     //     "Authorization": `Bearer ${refreshToken}`,
            //     // },
            // }
            // const { data }: any = await instance(config)
            // console.log("res from instance", data.accessToken)
            // authService.setUserToken(data.accessToken)
            return
        } catch (error) {
            return Promise.reject(error)
        }

    }
    return Promise.reject(error)

}

export const setupInterceptors = (axiosInstance: AxiosInstance) => {
    axiosInstance.interceptors.request.use(onRequest, onRequestError)
    axiosInstance.interceptors.response.use(onResponse, onResponseError)
    return axiosInstance
}






