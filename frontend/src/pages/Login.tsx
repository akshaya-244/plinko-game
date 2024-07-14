import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useEffect, useState } from "react";
import { SigninInput } from "../zod/zod";
import { useGoogleLogin, TokenResponse } from "@react-oauth/google";
import { FaGoogle } from "react-icons/fa";



export default function Login() {
    const navigate=useNavigate();
    const [loginInputs, setLoginInputs]=useState<SigninInput>({
        email:"",
        password:""
    });
    const [ user, setUser ] = useState<TokenResponse>();
    const [showError, setShowError]=useState(false);
    const login=useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),    
        onError: (error) => {console.log("Login Failed: ", error); }
        
    });

    useEffect(()=>{
        const signinWithGoogle =async () => {
            
            if(user){
                await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user?.access_token}`,{
                    headers: {
                        Authorization: `${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then(async (res) => {
                    console.log("Res data: ", res.data.email)
                    const response = await axios.post(`${BACKEND_URL}/api/user/login`, {
                        email: res.data.email,
                        password: "*******"
                    })
                    console.log(response)
                    
                        
                        localStorage.setItem("token",   response.data.jwt)
                        navigate('/game')
                    
                    
                    
                })
               
            }
           
        }
       signinWithGoogle()
    },[showError])
    async function sendRequests() {
        try{
            const response=await axios.post(`${BACKEND_URL}/api/user/login`,loginInputs )
            const jwt=response.data
            localStorage.setItem("token", jwt.jwt)
            navigate('/game')
        }
        catch(e){
            alert("Error while Logging in")
        }
    }
    return <div className="bg-black  text-white">
    <div className="bg-black flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 ">
        <div>
            <a href="/">
                <h3 className="text-4xl font-bold font-mono text-purple-600">
                    Plinkoo
                </h3>
            </a>
        </div>
        <div className="w-full px-6 py-4 mt-6 overflow-hidden text-black bg-white shadow-md sm:max-w-lg sm:rounded-lg">
               
                <div className="mt-4 required">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 undefined"
                    >
                        Email
                    </label>
                    <div className="flex flex-col items-start">
                        <input 
                            type="email"
                            name="email"
                            placeholder=" johnDoe@gmail.com"
                            onChange={(e) => {setLoginInputs({
                                ...loginInputs,
                                email: e.target.value
                            })}}
                            className="block min-h-12 w-full mt-1 border border-slate-600 rounded-md focus:border-indigo-300  focus:ring-opacity-50"
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 undefined"
                    >
                        Password
                    </label>
                    <div className="flex flex-col items-start">
                        <input
                            type="password"
                            name="password"
                            placeholder=" 123456"
                            onChange={(e) => {setLoginInputs({
                                ...loginInputs,
                                password: e.target.value
                            })}}
                            className="block min-h-12 w-full mt-1 border border-slate-600 rounded-md focus:border-indigo-300  focus:ring-opacity-50"
                        />
                    </div>  
                </div>
                
                {/* <a
                    href="#"
                    className="text-xs text-purple-600 hover:underline"
                >
                    Forget Password?
                </a> */}
                <div className="flex items-center mt-4">
                    <button onClick={sendRequests} className="w-full px-4 py-2  text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
                        Login
                    </button>
                </div>
                <div className="flex justify-center items-center mt-4 w-full px-4 py-2  text-white transition-colors duration-200 transform bg-black rounded-md focus:outline-none">
                <FaGoogle />  <button onClick={() => login()} className="ml-4">    Sign in with Google </button>
                    
                </div>
                
            <div className="mt-4 text-black">
                Don't have an account?{" "}
                <span>
                    <Link to='/signup' className="text-purple-700 underline">Sign up</Link>
                </span>
            </div>
            {showError && <div className="text-red-500 font-bold">
                Please Sign up
            </div>}
        </div>
    </div>
</div>
}