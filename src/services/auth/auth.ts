import nookies, {destroyCookie} from 'nookies'

interface LoginResponse {
    access_token: string
}
const ACCESS_TOKEN_KEY = "a08a31a0-1f45-46ff-8fee-191d74bb5c7e"

export const saveSessionData = (loginResponse: LoginResponse, ctx = null) => {
    // globalThis?.localStorage.setItem(ACCESS_TOKEN_KEY, JSON.stringify(loginResponse));
    nookies.set(ctx,ACCESS_TOKEN_KEY, loginResponse.access_token, {
        maxAge: 60 * 60 * 24 * 365, // UM ANO
        path: '/',
    } );
}

export const getSessionData = () => {
    const sessionData = globalThis?.localStorage?.getItem(ACCESS_TOKEN_KEY) ?? '{}';

    const parsedSessionData = JSON.parse(sessionData);

    return parsedSessionData as LoginResponse;
}

export const getSessionDataCookie = (ctx = null) => {
    const cookies = nookies.get(ctx)
    return cookies[ACCESS_TOKEN_KEY]
}

export const logout = (ctx = null) =>{
    const cookies = nookies.get(ctx)
    for(const cookie of Object.keys(cookies)){
        nookies.destroy(ctx, cookie)
    }
}