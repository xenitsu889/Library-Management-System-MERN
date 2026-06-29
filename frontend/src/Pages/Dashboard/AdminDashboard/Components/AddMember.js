import React, { useEffect, useState } from 'react'
import "../AdminDashboard.css"
import axios from "axios"
import { Dropdown } from 'semantic-ui-react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import FormMessage from '../../../../Components/FormMessage'
import { getApiErrorMessage, parseAge, parseMobileNumber, validatePassword, isNonEmpty } from '../../../../utils/formHelpers'

function AddMember() {

    const API_URL = process.env.REACT_APP_API_URL
    const [isLoading, setIsLoading] = useState(false)

    const [userFullName, setUserFullName] = useState("")
    const [admissionId, setAdmissionId] = useState("")
    const [employeeId, setEmployeeId] = useState("")
    const [address, setAddress] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [mobileNumber, setMobileNumber] = useState("")
    const [recentAddedMembers, setRecentAddedMembers] = useState([])
    const [userType, setUserType] = useState(null)
    const [gender, setGender] = useState(null)
    const [age, setAge] = useState("")
    const [dob, setDob] = useState(null)
    const [dobString, setDobString] = useState(null)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")


    const genderTypes = [
        { value: "Male", text: "Male" },
        { value: "Female", text: "Female" }
    ]

    const userTypes = [
        { value: 'Staff', text: 'Staff' },
        { value: 'Student', text: 'Student' }
    ]

    const addMember = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (!userType) {
            setError("Please select a user type.")
            return
        }
        if (!isNonEmpty(userFullName)) {
            setError("Full name is required.")
            return
        }
        if (userType === "Student" && !isNonEmpty(admissionId)) {
            setError("Admission ID is required for students.")
            return
        }
        if (userType === "Staff" && !isNonEmpty(employeeId)) {
            setError("Employee ID is required for staff.")
            return
        }
        if (!gender) {
            setError("Please select a gender.")
            return
        }
        if (!dobString) {
            setError("Date of birth is required.")
            return
        }
        if (!isNonEmpty(address) || !isNonEmpty(email)) {
            setError("Address and email are required.")
            return
        }

        const ageResult = parseAge(age)
        if (!ageResult.valid) {
            setError(ageResult.error)
            return
        }

        const mobileResult = parseMobileNumber(mobileNumber)
        if (!mobileResult.valid) {
            setError(mobileResult.error)
            return
        }

        const passwordResult = validatePassword(password)
        if (!passwordResult.valid) {
            setError(passwordResult.error)
            return
        }

        setIsLoading(true)
        const userData = {
            userType: userType,
            userFullName: userFullName.trim(),
            admissionId: userType === "Student" ? admissionId.trim() : undefined,
            employeeId: userType === "Staff" ? employeeId.trim() : undefined,
            age: ageResult.value,
            dob: dobString,
            gender: gender,
            address: address.trim(),
            mobileNumber: mobileResult.value,
            email: email.trim(),
            password: passwordResult.value
        }
        try {
            const response = await axios.post(API_URL + "api/auth/register", userData)
            if (recentAddedMembers.length >= 5) {
                recentAddedMembers.splice(-1)
            }
            setRecentAddedMembers([response.data, ...recentAddedMembers])
            setUserFullName("")
            setUserType(null)
            setAdmissionId("")
            setEmployeeId("")
            setAddress("")
            setMobileNumber("")
            setEmail("")
            setPassword("")
            setGender(null)
            setAge("")
            setDob(null)
            setDobString(null)
            setSuccess("Member added successfully.")
        }
        catch (err) {
            setError(getApiErrorMessage(err, "Failed to add member."))
        }
        setIsLoading(false)
    }

    useEffect(() => {
        const getMembers = async () => {
            try {
                const response = await axios.get(API_URL + "api/users/allmembers")
                const recentMembers = await response.data.slice(0, 5)
                setRecentAddedMembers(recentMembers)
            }
            catch (err) {
                setError(getApiErrorMessage(err, "Failed to load members."))
            }
        }
        getMembers()
    }, [API_URL])

    return (
        <div>
            <p className="dashboard-option-title">Add a Member</p>
            <div className="dashboard-title-line"></div>
            <FormMessage type="error" message={error} />
            <FormMessage type="success" message={success} />
            <form className="addmember-form" onSubmit={addMember}>
                <div className='semanticdropdown'>
                    <Dropdown
                        placeholder='User Type'
                        fluid
                        selection
                        options={userTypes}
                        value={userType}
                        onChange={(event, data) => { setUserType(data.value); setError("") }}
                    />
                </div>
                <label className="addmember-form-label" htmlFor="userFullName">Full Name<span className="required-field">*</span></label><br />
                <input className="addmember-form-input" type="text" id="userFullName" name="userFullName" value={userFullName} required onChange={(e) => { setUserFullName(e.target.value); setError("") }}></input><br />

                {userType && (
                    <>
                        <label className="addmember-form-label" htmlFor={userType === "Student" ? "admissionId" : "employeeId"}>{userType === "Student" ? "Admission Id" : "Employee Id"}<span className="required-field">*</span></label><br />
                        <input
                            className="addmember-form-input"
                            id={userType === "Student" ? "admissionId" : "employeeId"}
                            type="text"
                            value={userType === "Student" ? admissionId : employeeId}
                            required
                            onChange={(e) => {
                                userType === "Student" ? setAdmissionId(e.target.value) : setEmployeeId(e.target.value)
                                setError("")
                            }}
                        ></input><br />
                    </>
                )}

                <label className="addmember-form-label" htmlFor="mobileNumber">Mobile Number<span className="required-field">*</span></label><br />
                <input className="addmember-form-input" id="mobileNumber" type="tel" inputMode="numeric" pattern="[0-9]{10,15}" value={mobileNumber} required onChange={(e) => { setMobileNumber(e.target.value); setError("") }}></input><br />

                <label className="addmember-form-label" htmlFor="gender">Gender<span className="required-field">*</span></label><br />
                <div className='semanticdropdown'>
                    <Dropdown
                        placeholder='Select Gender'
                        fluid
                        selection
                        value={gender}
                        options={genderTypes}
                        onChange={(event, data) => { setGender(data.value); setError("") }}
                    />
                </div>

                <label className="addmember-form-label" htmlFor="age">Age<span className="required-field">*</span></label><br />
                <input className="addmember-form-input" id="age" type="number" min="1" max="150" step="1" value={age} required onChange={(e) => { setAge(e.target.value); setError("") }}></input><br />

                <label className="addmember-form-label" htmlFor="dob">Date of Birth<span className="required-field">*</span></label><br />
                <DatePicker
                    className="date-picker"
                    placeholderText="MM/DD/YYYY"
                    selected={dob}
                    onChange={(date) => { setDob(date); setDobString(moment(date).format("MM/DD/YYYY")); setError("") }}
                    dateFormat="MM/dd/yyyy"
                />

                <label className="addmember-form-label" htmlFor="address">Address<span className="required-field">*</span></label><br />
                <input className="addmember-form-input address-field" id="address" value={address} type="text" required onChange={(e) => { setAddress(e.target.value); setError("") }}></input><br />

                <label className="addmember-form-label" htmlFor="email">Email<span className="required-field">*</span></label><br />
                <input className="addmember-form-input" id="email" type="email" value={email} required onChange={(e) => { setEmail(e.target.value); setError("") }}></input><br />

                <label className="addmember-form-label" htmlFor="password">Password<span className="required-field">*</span></label><br />
                <input className="addmember-form-input" id="password" type="password" minLength="6" value={password} required onChange={(e) => { setPassword(e.target.value); setError("") }}></input><br />

                <input className="addmember-submit" type="submit" value="SUBMIT" disabled={isLoading} ></input>

            </form>
            <p className="dashboard-option-title">Recently Added Members</p>
            <div className="dashboard-title-line"></div>
            <table className='admindashboard-table'>
                <tr>
                    <th>S.No</th>
                    <th>Member Type</th>
                    <th>Member ID</th>
                    <th>Member Name</th>
                </tr>
                {
                    recentAddedMembers.map((member, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{member.userType}</td>
                                <td>{member.userType === "Student" ? member.admissionId : member.employeeId}</td>
                                <td>{member.userFullName}</td>
                            </tr>
                        )
                    })
                }
            </table>
        </div>
    )
}

export default AddMember
