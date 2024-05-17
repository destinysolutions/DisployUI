import React from 'react'
import { BsMicrosoft } from 'react-icons/bs'
import { loginRequest } from '../Components/Common/authconfig';
import { useMsal } from '@azure/msal-react';
import { handleLoginUser, handleLoginWithGoogle } from '../Redux/Authslice';
import { ADD_REGISTER_URL, LOGIN_URL } from './Api';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

const MicrosoftBtn = ({ register }) => {
    const dispatch = useDispatch()
    const { instance } = useMsal();
    const SignInMicroSoft = async () => {
        instance.loginPopup(loginRequest).then(async (res) => {
            console.log('res', res)

            if (register) {
                await Registration(res)
            } else {
                await Login(res)
            }
        }).
            catch((e) => {
                console.log(e);
            });
    }

    const Registration = (res) => {
        const formData = new FormData();
        formData.append("FirstName", res?.account?.name);
        formData.append("Email", res?.account?.username);
        formData.append("Phone", null);
        formData.append("Operation", "Insert");
        formData.append("googleID", res?.uniqueId);

        const config = {
            method: "post",
            url: ADD_REGISTER_URL,
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };

        // setTimeout(async () => {
        try {
            const response = dispatch(handleLoginWithGoogle({ config })).then((res) => {
                if (res?.payload?.status) {
                    window.localStorage.setItem("timer", JSON.stringify(18_00));
                    toast.success("Sign up successfully.");
                } else {
                    toast.error(res?.payload?.message)
                }
            });
            if (!response) return;

        } catch (err) {
            console.log(err);

        }
    }

    const Login = (res) => {
        const data = JSON.stringify({
            emailID: res?.account?.username,
            googleID: res?.uniqueId,
            SystemTimeZone: new Date()
                .toLocaleDateString(undefined, {
                    day: "2-digit",
                    timeZoneName: "long",
                })
                .substring(4),
            password: ""
        });

        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: LOGIN_URL,
            headers: {
                "Content-Type": "application/json",
            },
            data: data,
        };

        const response = dispatch(handleLoginUser({ config }));
        if (response) {
            response
                .then((res) => {
                    const response = res?.payload;
                    if (response.status == 200) {
                        window.localStorage.setItem("timer", JSON.stringify(18_00));
                        const userRole = response.role;
                        if (userRole == 1) {
                            localStorage.setItem("role_access", "ADMIN");
                            toast.success("Login successfully.");
                            window.location.href = "/";
                        } else if (userRole == 2) {
                            // User login logic
                            const user_ID = response.userID;
                            // localStorage.setItem("userID", JSON.stringify(response));
                            // if (response?.userDetails?.isRetailer === false) {
                            localStorage.setItem("role_access", "USER");
                            // } else {
                            //   localStorage.setItem("role_access", "RETAILER");
                            // }
                            toast.success("Login successfully.");
                            // console.log(response);
                            // navigate("/screens");
                            window.location.href = "/dashboard";
                        } else {
                            // Handle other roles or unknown roles
                            console.log("Unexpected role value:", userRole);
                            alert("Invalid role: " + userRole);
                        }
                    } else {
                        toast.error(response?.message);
                        toast.remove();
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }



    return (
        <button onClick={SignInMicroSoft}>
            <div className="socialIcon socialIcon4">
                <BsMicrosoft className="text-lg text-primary" />
            </div>
        </button>
    )
}

export default MicrosoftBtn
