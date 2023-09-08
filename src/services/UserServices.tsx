// import api, { InternalaxiosInstanceRequestConfig } from "api";
import { AuthService } from "./AuthService";
import jwtDecode from "jwt-decode";
import { MyTokenResponse, RequestDataResponse, User } from "../model";
const authService = new AuthService();
import axios from "axios";
import { setupInterceptors } from "./AxiosInstance";
const baseURL = "http://localhost:5000"



const api = setupInterceptors(
    axios.create({
        baseURL:"http://localhost:5000",
        // withCredentials: true,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },

    })

)

const api_ = axios.create({
    baseURL:"http://localhost:5000",
    withCredentials: true,
    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },

})

export class UserServices {
    async register(userData: User) {
        const body = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password,
            gender: userData.gender,
            age: userData.age,
            city: userData.city,
            state: userData.state,
            country: userData.country,
            avatar: userData.avatar,
            followers: userData.followers,
            following: userData.followers,
            height: userData.height,
            orientation_: userData.orientation_,
            ethnicity: userData.ethnicity,
            bodyType: userData.bodyType,
            hasChildren: userData.hasChildren,
            genderInterest: userData.genderInterest,
            religion: userData.religion,
            about: userData.about
        }
        const res = await api_.post('api/auth/register', body)
        if (res.status === 201) {
            const user: MyTokenResponse = jwtDecode(res.data.accessToken);
            const username = user.email.split('@')[0]
            const userId = user._id
            authService.setUserId(userId)
            authService.setUserDisplayName(username)
            authService.setUserToken(res.data.accessToken)
        }
        return res.data

    }


    // login user
    async login(email: string, password: string,) {
        console.log('login')
        const res = await api_.post('api/auth/login', {
            email,
            password
        })
        console.log('login', res)

        if (res.status === 200) {
            const user: MyTokenResponse = jwtDecode(res.data.accessToken);
            const username = user.email.split('@')[0]
            const userId = user._id
            authService.setUserId(userId)
            authService.setUserDisplayName(username)
            authService.setUserToken(res.data.accessToken)
        }
        return res.data;

    }


    // get me
    async getMe() {
        const myId = authService.getUserId()
        const token = authService.getUserToken()
        const config = {
            url: `api/users/get-me/${myId}`,
            method: 'get',
            data: {},
            headers: {
                "Content-Type": `application/json`,
                "authorization": `Bearer ${token}`,
            },
        }
        try {
            const {data} = await api(config)
            return data
        } catch (error) {
            return error
        }
    }



    // get users fn
    async getUsersfN(id: any) {
        const userPromise = id.map((id: any) => fetch(`api/users/profile/${id}`))
        const res = Promise.all(userPromise)
        const userData = Promise.all((await res).map(r => r.data))
        return userData
    }

    async getProfile(id: any) {
        const userPromise = id.map((id: any) => api.get(`api/users/profile/${id}`))
        const res = await Promise.all(userPromise)
        const userData = res.map((response: any) => response.data)
        return userData
    }


    async updateProfile(userData: User, userId: any) {
        const token = authService.getUserToken()
        if (!token) return

        const body = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            gender: userData.gender,
            age: userData.age,
            avatar: userData.avatar,
            height: userData.height,
            orientation_: userData.orientation_,
            ethnicity: userData.ethnicity,
            bodyType: userData.bodyType,
            hasChildren: userData.hasChildren,
            genderInterest: userData.genderInterest,
            religion: userData.religion,
            about: userData.about
        } = userData

        const config = {
            url: `api/users/update/${userId}`,
            method: 'PUT',
            data: body,
            headers: {
                "Content-Type": `application/json`,
                "authorization": `Bearer ${token}`,
            },
        }

        const { data } = await api(config)
        return data
    }

    // Follow
    async followUser(friendId:string) {
        const myId = authService.getUserId()
        const token = authService.getUserToken()
        const config = {
            method: "post",
            url: "/api/users/follow",
            data: {friendId, myId, },
            withCredentials: true,

            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        }
        const {data} = await api(config)
        return data

    }


    // Logout
    async logOut() {
        const token = authService.getUserToken()
        const config = {
            method: "post",
            url: "/api/auth/logout",
            data: {},
            withCredentials: true,

            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        }
        const res = await api(config)
        return res

    }


    // get all users
    async getUsers() {
        try {
            const { data } = await api_.get(`api/users/all`)
            return data
        } catch (error) {
            return error
        }

    }

    // get conversation
    async createConversation(receiverId: string) {
        const senderId = authService.getUserId()
        try {
            const { data } = await api.post(`/api/chat//create-conversation`, {
                senderId,
                receiverId
            })
            return data
        } catch (error) {
            return error
        }
    }

    // get converssation
    async getConversation(userId: string) {
        try {
            const { data } = await api.get(`/api/chat/${userId}`)
            return data
        } catch (error) {
            return error
        }
    }


    // get private conversation
    async getPrivateConversation(otherUserId: string) {
        const myId = authService.getUserId()
        try {
            const { data } = await api.get(`/api/chat/private-conversation/${myId}/${otherUserId}`)
            return data
        } catch (error) {
            return error
        }
    }


    // create message
    async creatMessage(senderId: string, conversationId: string, text: string,) {
        try {
            const { data } = await api.post(`/api/message/create-message`, {
                senderId,
                conversationId,
                text,
            })
            return data
        } catch (error) {
            return error
        }
    }


    // get messages
    async getMessages(conversationId: string) {
        try {
            const { data } = await api.get(`/api/message/get-message/${conversationId}`)
            return data
        } catch (error) {
            return error
        }
    }



    // Create request
    async createRequest(requestData: RequestDataResponse) {
        const { data } = await api.post(`/api/request/new-request`,
            {
                senderId: requestData.senderId,
                recipientId: requestData.recipientId,
                firstName: requestData.firstName,
                lastName: requestData.lastName,
                avatar: requestData.avatar,
                age: requestData.age,
                gender: requestData.gender,
                text: requestData.text,
                bill: requestData.bill,
                city: requestData.city,
                state: requestData.state,
                country: requestData.country
            }
        )
        return data

    }




    // async getProfile(profileId: any) {
    //     try {
    //         const { data } = await api.get(`api/users/profile/{profileId}`)
    //         return data
    //     } catch (error) {
    //         return error
    //     }

    // }






}