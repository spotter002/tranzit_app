import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const { createContext, useCallback, useState, useEffect } = require("react");

const AuthContext = createContext();
const AuthProvider = ({children}) => {
    const navigate = useNavigate()
    //initialize states from local storage
    const [token, setToken] = useState(()=> localStorage.getItem('token')||'')
    const [user, setUser] = useState(()=> JSON.parse(localStorage.getItem('user'))||null)

    //logout
    const logout = useCallback(() => {
        localStorage.clear()
        setToken('')
        setUser(null)
        navigate('/login')
    },[navigate])

    useEffect(() => {
        if(token){
            try {
                const decoded = jwtDecode(token)
                const isExpired = decoded.exp*1000 < Date.now()
                if(isExpired){
                    logout()
                }
            } catch (error) {
                logout()
            }
        }
    },[token,logout])

    //return
    return(
        <AuthContext.Provider value={{token,setToken,user,setUser,logout}}>{children}</AuthContext.Provider>
    )
}
export {AuthProvider,AuthContext}
