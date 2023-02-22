import { makeRequest } from "@/services/auth/requests";
import nookies from "nookies";
export const REFRESH_TOKEN = "1982b85e-41d0-40ec-851b-065e801aa380";
const ACCESS_TOKEN_KEY = "a08a31a0-1f45-46ff-8fee-191d74bb5c7e"

interface Token {
  refresh_token: string;
}

interface LoginResponse{
    access_token: string;
  }
const controllers = {
  async storeRefreshToken(req: any, res: any) {
    const ctx = { req, res };
    nookies.set(ctx, REFRESH_TOKEN, req.body.refresh_token, {
      path: '/',
    });
    res.json({
      data: {
        message: "Stored with success!",
      },
    });
  },
  async getStorageCookies(req: any, res: any) {
    const ctx = { req, res };
    res.json({
      data: {
        cookies: nookies.get(ctx),
      },
    });
  },
  async regenerateTokens(req: any, res: any) {
    const ctx = { req, res };
    const cookies = nookies.get(ctx);
    const refresh_token = cookies[REFRESH_TOKEN];
    const payload: Token = {
      refresh_token: refresh_token,
    };
    try{
        const refreshResponse = await makeRequest({
            url: "/api/refresh",
            method: "POST",
            data: payload,
          });
      
          nookies.set(ctx, REFRESH_TOKEN, refreshResponse.data.data.refresh_token, {
              path: '/',
            });
            const access_token: LoginResponse = {
                access_token: refreshResponse.data.data.access_token
            }
            nookies.set(ctx,ACCESS_TOKEN_KEY, access_token.access_token, {
                maxAge: 60*10, // UM ANO
                path: '/',
            } );
          res.json({
              data: refreshResponse.data.data
          }) 

    }catch{
        res.status(404).json({
            status: 404,
            message: "Not Found",
          });
    }
    
  },
};

const controllerBy = {
  POST: controllers.storeRefreshToken,
  GET: controllers.regenerateTokens,
};

export default function handler(req: Request, res: any) {
  if (req.method === "POST") return controllerBy[req.method](req, res);
  if (req.method === "GET") return controllerBy[req.method](req, res);

    res.status(404).json({
      status: 404,
      message: "Not Found",
    });
}
