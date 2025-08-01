import { useContext } from "react"
import { AuthContext } from "./AuthContext"
import { Navigate } from "react-router-dom"

const ProtectedRoutes = ({children,allowedRoles}) => {
    const {user}= useContext(AuthContext)
    if(!user){
        return <Navigate to={'/login'} replace/>
    }
    if(!allowedRoles.includes(user.role)){
        //role not allowed
        // incase the logged in user is not allowed to access the route
        return <Navigate to={'/not-authorized'} replace/>
    }
    return children
}
export default ProtectedRoutes