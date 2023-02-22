import { REFRESH_TOKEN } from '@/pages/api/refresh.api';
import axios from 'axios';
import nookies from 'nookies'
import { makeRequestApi } from './requests';

interface LoginResponse {
    access_token: string
}
const ACCESS_TOKEN_KEY = "a08a31a0-1f45-46ff-8fee-191d74bb5c7e"
export const saveSessionData = (loginResponse: LoginResponse, ctx = null) => {
    // globalThis?.localStorage.setItem(ACCESS_TOKEN_KEY, JSON.stringify(loginResponse));
    nookies.set(ctx,ACCESS_TOKEN_KEY, loginResponse.access_token, {
        maxAge: 3, // UM ANO
        path: '/',
    } );
    console.log("token salvo")
}

export const getSessionData = () => {
    const sessionData = globalThis?.localStorage?.getItem(ACCESS_TOKEN_KEY) ?? '{}';

    const parsedSessionData = JSON.parse(sessionData);

    return parsedSessionData as LoginResponse;
}

export const getSessionDataCookie = (ctx = null) => {
    const cookies = nookies.get(ctx)
    console.log("COOKIES: "+JSON.stringify(cookies))
    return cookies[ACCESS_TOKEN_KEY]
}

export const logout = (ctx = null) =>{
    const cookies = nookies.get(ctx)
    for(const cookie of Object.keys(cookies)){
        nookies.destroy(ctx, cookie)
    }
}


axios.interceptors.response.use((response) => {
    return response
}, (async (error) => {
    if(error.response.status === 401){
        const cookie = nookies.get()
        const refresh_token = cookie[REFRESH_TOKEN]
        if(refresh_token){
          await makeRequestApi({url: '/api/refresh'}).then((res) => {
            const token:LoginResponse = {access_token: res.data.data.access_token}
            saveSessionData(token)
          })
        }else {
            return Promise.reject(error);
        }
    }
}))