import { makePrivateRequest } from "@/services/auth/requests";
import { useEffect, useState } from "react";

function useSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getSession(ctx = null){
    await makePrivateRequest({url: '/api/session'}, ctx).then((res) => {
      setSession(res.data.data)  
    }).catch((err) => {
      setError(err)
    }).finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    getSession();
  },[])

  return {
    data: session,
    error,
    loading
  }
}

function withSessionHOC(Component:any){
  return function Wrapper(props:any){
    const session = useSession();  
    const modifiedProps = {
      ...props,
      session: session.data,
    }
    return <Component {...modifiedProps}/>
  }
}

function AuthPageStatic(props:any){
  return (
        <div>
          <h1>
            Auth Page Static
          </h1>
          <pre>
            {JSON.stringify(props, null, 2)}
          </pre> 
        </div>
      )
    }

    export default withSessionHOC(AuthPageStatic)