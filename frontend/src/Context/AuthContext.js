import { createContext, useEffect, useReducer } from "react"
import AuthReducer from "./AuthReducer"

const getStoredUser = () => {
    try {
        const storedUser = localStorage.getItem("user")
        return storedUser ? JSON.parse(storedUser) : null
    } catch (err) {
        localStorage.removeItem("user")
        return null
    }
}

const INITIAL_STATE = {
    user:getStoredUser(),
    isFetching:false,
    error:false
}

/* Reads the data from the Provider and changes INITIAL_STATE */
export const AuthContext = createContext(INITIAL_STATE)

/* Children here are the Components that need to get the data.[In this Application we specified App COmponent as Child in index.js so that we can server every every component exist in the app */
/* This will provide data to all the children that we are giving here */
export const AuthContextProvider = ({children}) =>{
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    useEffect(()=>{
        if (state.user) {
            localStorage.setItem("user", JSON.stringify(state.user))
        } else {
            localStorage.removeItem("user")
        }
      },[state.user])

    return (
        <AuthContext.Provider
        value={{
            user:state.user,
            isFetching:state.isFetching,
            error:state.error,
            dispatch
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}
