import { logout } from "@/services/auth/auth";
import { withSession } from "@/services/auth/sessions";
import { useRouter } from "next/router";

export default function AuthPageSSR(props:any){
  console.log(props)
 const router = useRouter()
  return (
        <div>
          <h1>
            Auth Page Server Side Render
          </h1>
          <button onClick={() => {
            logout(props)
            router.push('/')
            }}>Logout</button>
          <pre>
            {JSON.stringify(props, null, 2)}
          </pre> 
        </div>
      )
    }

    
    export const getServerSideProps = withSession((ctx:any) => {
      return {
        props: {
          session: ctx.req.session
        }
      }
    })