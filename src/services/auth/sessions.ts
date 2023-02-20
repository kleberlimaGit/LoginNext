import { useRouter } from "next/router"
import { type } from "os"
import { ReactNode, useEffect, useState } from "react"
import { makePrivateRequest } from "./requests"

export function withSession(func:any){
    return async (ctx:any) => {
        try {
          const session = await makePrivateRequest({url:'/api/session'}, ctx).then((res) => {
            return res.data.data
        }) 
    const modifiedCtx = {
      ...ctx,
      req: {
        ...ctx.req,
        session,
      }
     }
     return func(modifiedCtx)
        } catch (err) {
                return {
        redirect: {
          permanent: false,
          destination: '/?error=401'
        }
      }
        }
      }
  }
