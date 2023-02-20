export default function AuthPageStatic(props:any){
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
