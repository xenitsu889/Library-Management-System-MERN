import React, { useContext, useState } from 'react'
import './Signin.css'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext.js'
import Switch from '@material-ui/core/Switch';
import { getApiErrorMessage } from '../utils/formHelpers'

function Signin() {
    const [isStudent, setIsStudent] = useState(true)
    const [admissionId, setAdmissionId] = useState("")
    const [employeeId,setEmployeeId] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { dispatch } = useContext(AuthContext)
    const history = useHistory()

    const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000/").replace(/\/$/, "")
    
    const loginCall = async (userCredential, dispatch) => {
        dispatch({ type: "LOGIN_START" });
        try {
            const res = await axios.post(`${API_URL}/api/auth/signin`, userCredential);
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
            const redirectTo = res.data.isAdmin ? "/dashboard@admin" : "/dashboard@member"
            history.push(redirectTo);
        }
        catch (err) {
            dispatch({ type: "LOGIN_FAILURE", payload: err })
            const status = err?.response?.status
            if (status === 404) {
                setError("User not found. Check your ID and try again.")
            } else if (status === 400) {
                setError(getApiErrorMessage(err, "Wrong password. Please try again."))
            } else if (!err?.response) {
                setError("Unable to connect to the server. Please try again later.")
            } else {
                setError(getApiErrorMessage(err, "Sign in failed. Please try again."))
            }
        }
    }

    const handleForm = (e) => {
        e.preventDefault()
        const loginId = (isStudent ? admissionId : employeeId).trim()

        if (!loginId || !password) {
            setError("Enter your ID and password")
            return
        }

        const credentials = isStudent
            ? { admissionId: loginId, password }
            : { employeeId: loginId, password }

        loginCall(credentials, dispatch)
    }

    const handleModeChange = (event, isStaff) => {
        setError("")
        setIsStudent(!isStaff)
        if (isStaff) {
            setAdmissionId("")
        } else {
            setEmployeeId("")
        }
    }

    return (
        <div className='signin-container'>
            <div className="signin-card">
                <form onSubmit={handleForm}>
                    <h2 className="signin-title"> Log in</h2>
                    <p className="line"></p>
                    <div className="persontype-question">
                        <p>Are you signing in as staff?</p>
                        <Switch
                            onChange={handleModeChange}
                            checked={!isStudent}
                            color="primary"
                        />
                    </div>
                    <div className="error-message"><p>{error}</p></div>
                    <div className="signin-fields">
                        <label htmlFor={isStudent ? "admissionId" : "employeeId"}> <b>{isStudent ? "Admission ID" : "Employee ID"}</b></label>
                        <input id={isStudent ? "admissionId" : "employeeId"} className='signin-textbox' type="text" placeholder={isStudent ? "Enter Admission ID" : "Enter Employee ID"} name={isStudent ? "admissionId" : "employeeId"} value={isStudent ? admissionId : employeeId} autoComplete="username" required onChange={(e) => { isStudent ? setAdmissionId(e.target.value) : setEmployeeId(e.target.value) }}/>
                        <label htmlFor="password"><b>Password</b></label>
                        <input id="password" className='signin-textbox' type="password" minLength='6' placeholder="Enter Password" name="password" autoComplete="current-password" value={password} required onChange={(e) => { setPassword(e.target.value) }} />
                        </div>
                    <button className="signin-button">Sign In</button>
                    <a className="forget-pass" href="#home">For account support, contact administration.</a>
                </form>
                <div className='signup-option'>
                    <p className="signup-question">For access credentials, contact the system administrator.</p>
                </div>
            </div>
        </div>
    )
}

export default Signin
