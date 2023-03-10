import { REFRESH_TOKEN } from "@/pages/api/refresh.api";
import axios, { Method } from "axios";
import nookies from 'nookies'
import qs from 'qs'
import { getSessionDataCookie } from "./auth";

type RequestParam = {
  method?: Method;
  url: string;
  data?: object | string;
  params?: object;
  headers?: object;
};


const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const BASE_URL_API = process.env.NEXT_PUBLIC_API_URL

type LoginData = {
    username:string;
    password:string;
}

// axios.interceptors.response.use(function(response){
//     return response;

// }, function(error) {
//     if(error.response.status === 401){
//         history.push('/');
//     }

//     return Promise.reject(error);
// })


export const makeRequest = ({ method = 'GET', url, data, params, headers}: RequestParam) =>{
    return axios({
        method, // nao foi passado um valor pois chave e valor tem o mesmo nome
        url: `${BASE_URL}${url}` ,
        data,
        params,
        headers     
    });
};

export const makeRequestApi = ({ method = 'GET', url, data, params, headers}: RequestParam) =>{
    return axios({
        method, // nao foi passado um valor pois chave e valor tem o mesmo nome
        url: `${BASE_URL_API}${url}` ,
        data,
        params,
        headers
        
    });
};

export const makeLogin = (loginData:LoginData) => {

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }

    const payload = qs.stringify({...loginData});

    return makeRequest({url: '/api/login', data:payload, method: 'POST', headers })

}


export const makePrivateRequest = ({ method = 'GET', url, data, params}: RequestParam, ctx: any) => {
    const sessionData = getSessionDataCookie(ctx);
    const headers ={
        'Authorization':`Bearer ${sessionData}`
    }
    return makeRequest({method, url, data , params, headers})
}