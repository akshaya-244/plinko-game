import { useGoogleLogin, TokenResponse } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { SignupInput } from "../zod/zod";
import { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";

export default function Signup() {
    const [signupInputs, setSignupInputs]=useState<SignupInput>({
        name: "",
        email: "",
        password: ""
    })
    const [ user, setUser ] = useState<TokenResponse>();
    const login=useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),    
        onError: (error) =>console.log(error)
        
    });
    useEffect(() => {
        const signinWithGoogle =async () => {
            
            if(user){
                console.log("Heeeeeeeeee")
                await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user?.access_token}`,{
                    headers: {
                        Authorization: `${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then(async (res) => {
                    const response = await axios.post(`${BACKEND_URL}/api/user/signup`, {
                        name: res.data.name,
                        email: res.data.email,
                        password:"*******"
                    })
                    // alert("You have already Signed up. Please login")
                    localStorage.setItem("token", response.data.jwt)
                    navigate('/game')
                })
               
            }
            
        }
       signinWithGoogle()
        
       
    },[user])


    const navigate=useNavigate();
    async function sendRequests() {
        try{
            console.log(signupInputs)
            const response=await axios.post(`${BACKEND_URL}/api/user/signup`, signupInputs )
            console.log("Response",response.data)


            const jwt=response.data
            console.log("JWT",jwt.jwt)


            localStorage.setItem("token", jwt.jwt)
            navigate('/game')
        }
        catch(e){
            alert("Error while Logging in")
        }
    }
   
    return  <div className="relative  backdrop-blur bg-black bg-no-repeat bg-cover backdrop-blur bg-center h-screen w-screen ">

            <div className=" flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 ">
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
                        htmlFor="name"
                        className="block text-sm font-medium text-black text-bold undefined"
                    >
                        Name
                    </label>
                    <div className="flex flex-col items-start">
                        <input 
                            type="name"
                            name="name"
                            placeholder="John Doe"
                            onChange={(e) => {setSignupInputs({
                                ...signupInputs,
                                name: e.target.value
                            })}}
                            className="block min-h-12 w-full mt-1 border border-slate-600 rounded-md focus:border-indigo-300  focus:ring-opacity-50"
                        />
                    </div>
                </div>

                        
                <div className="mt-4 required">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-black text-bold undefined"
                    >
                        Email
                    </label>
                    <div className="flex flex-col items-start">
                        <input 
                            type="email"
                            name="email"
                            placeholder=" johnDoe@gmail.com"
                            onChange={(e) => {setSignupInputs({
                                ...signupInputs,
                                email: e.target.value
                            })}}
                            className="block min-h-12 w-full mt-1 border border-slate-600 rounded-md focus:border-indigo-300  focus:ring-opacity-50"
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-black text-bold undefined"
                    >
                        Password
                    </label>
                    <div className="flex flex-col items-start">
                        <input
                            type="password"
                            name="password"
                            placeholder=" 123456"
                            onChange={(e) => {setSignupInputs({
                                ...signupInputs,
                                password: e.target.value
                            })}}
                            className="block min-h-12 w-full mt-1 border border-slate-600 rounded-md focus:border-indigo-300  focus:ring-opacity-50"
                        />
                    </div>  
                </div>
                
               
                <div className="flex items-center mt-4">
                    <button onClick={sendRequests} className="w-full px-4 py-2  text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
                        Sign Up
                    </button>

                </div>
                <div className="flex justify-center items-center mt-4 w-full px-4 py-2  text-white transition-colors duration-200 transform bg-black rounded-md focus:outline-none">
                <FaGoogle /> <button onClick={() => login()} className="ml-4">  Sign up with Google </button>
                    
                </div>
            <div className="mt-4 text-black">
                Already have an account?{" "}
                <span>
                    <Link to='/login' className="text-purple-900 text-bold underline">Login</Link>
                </span>
            </div>
          
        </div>
    </div>
            </div>
           

            
//     return <div className="bg-black  text-white">
//     <div className="bg-black flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 ">
//         <div>
//             <a href="/">
//                 <h3 className="text-4xl font-bold font-mono text-purple-600">
//                     Plinkoo
//                 </h3>
//             </a>
//         </div>
//         <div className="w-full px-6 py-4 mt-6 overflow-hidden text-black bg-white shadow-md sm:max-w-lg sm:rounded-lg">
               
//                 <div className="mt-4 required">
//                     <label
//                         htmlFor="name"
//                         className="block text-sm font-medium text-gray-700 undefined"
//                     >
//                         Name
//                     </label>
//                     <div className="flex flex-col items-start">
//                         <input 
//                             type="name"
//                             name="name"
//                             placeholder="John Doe"
//                             onChange={(e) => {setSignupInputs({
//                                 ...signupInputs,
//                                 name: e.target.value
//                             })}}
//                             className="block min-h-12 w-full mt-1 border border-slate-600 rounded-md focus:border-indigo-300  focus:ring-opacity-50"
//                         />
//                     </div>
//                 </div>

                        
//                 <div className="mt-4 required">
//                     <label
//                         htmlFor="email"
//                         className="block text-sm font-medium text-gray-700 undefined"
//                     >
//                         Email
//                     </label>
//                     <div className="flex flex-col items-start">
//                         <input 
//                             type="email"
//                             name="email"
//                             placeholder=" johnDoe@gmail.com"
//                             onChange={(e) => {setSignupInputs({
//                                 ...signupInputs,
//                                 email: e.target.value
//                             })}}
//                             className="block min-h-12 w-full mt-1 border border-slate-600 rounded-md focus:border-indigo-300  focus:ring-opacity-50"
//                         />
//                     </div>
//                 </div>
//                 <div className="mt-4">
//                     <label
//                         htmlFor="password"
//                         className="block text-sm font-medium text-gray-700 undefined"
//                     >
//                         Password
//                     </label>
//                     <div className="flex flex-col items-start">
//                         <input
//                             type="password"
//                             name="password"
//                             placeholder=" 123456"
//                             onChange={(e) => {setSignupInputs({
//                                 ...signupInputs,
//                                 password: e.target.value
//                             })}}
//                             className="block min-h-12 w-full mt-1 border border-slate-600 rounded-md focus:border-indigo-300  focus:ring-opacity-50"
//                         />
//                     </div>  
//                 </div>
                
               
//                 <div className="flex items-center mt-4">
//                     <button onClick={sendRequests} className="w-full px-4 py-2  text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
//                         Sign Up
//                     </button>

//                 </div>
//                 <div className="flex justify-center items-center mt-4 w-full px-4 py-2  text-white transition-colors duration-200 transform bg-black rounded-md focus:outline-none">
//                 <FaGoogle /> <button onClick={login} className="ml-4">  Sign up with Google </button>
                    
//                 </div>
//             <div className="mt-4 text-black">
//                 Already have an account?{" "}
//                 <span>
//                     <Link to='/login' className="text-purple-700 underline">Login</Link>
//                 </span>
//             </div>
          
//         </div>
//     </div>
// </div>
}