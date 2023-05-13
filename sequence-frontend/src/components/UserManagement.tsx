import * as React from 'react';
import { useState } from "react";
import axios, { HttpStatusCode } from "axios";
import BACKEND from '../constants';
import StartComponent from './StartComponent'
import Alert from "react-bootstrap/Alert";
import './UserManagement.css'

const UserManager = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLogin, setLogin] = useState<boolean>(true)
  const [loginId, setLoginId] = useState<string>("")

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (username == "" || password == "" || (!isLogin && email == "")) {
        setError("Form details cannot be empty. Please Try again");
        setTimeout(() => {
            setError('')
          }, 5000)
        return;
    } else {
        setError('');
    }

    try {
      const urlPath = isLogin ? "login/" : "register/";
      let postData = isLogin ? {
        username: username,
        password: password,
      } : {
        username: username,
        password: password,
        email: email
      }
      const response = await axios.post(`${BACKEND['BACKEND_URL']}:${BACKEND['BACKEND_PORT']}/${urlPath}`, postData);
      console.log("response : ", response.data);
      setUsername('');
      setPassword('');
      setError('');
      if (isLogin && response.data['success']) {
        setLoginId(username)
      } else if (!isLogin && response.data['username']) {
        setLogin(true)
      }
    } catch (error) {
      console.error("Error = " , error.response);
      console.log(error.response.status)
      if ( error.response.status && error.response.status ===  HttpStatusCode.BadRequest) {
        let errorMesssage = ''
        Object.keys(error.response.data).forEach(key => {  
            console.log(`Error : ${error.response.data[key]}`)
            errorMesssage += `${key} : ${error.response.data[key]} `;
          })
        setError(errorMesssage)
        setTimeout(() => {
            setError('')
          }, 5000)
        return
      }
      setError(error.response.data.detail);
      setTimeout(() => {
        setError('')
      }, 5000)
      return
    }
  };

  return (
    <div className='center-component'>
     {error && (
        <Alert variant="danger" onClose={() => setError("")} className="alert-custom" dismissible={false}>
        {error}
        </Alert>
     )}
     { !loginId &&  (
         <div>
         <h1 className='header'>{isLogin ? "Login" : "Create Account"}</h1>
         <form onSubmit={handleSubmit}>
         <label className='header'>
             Username:
             <input
             type="text"
             className='input'
             value={username}
             onChange={(e) => setUsername(e.target.value)}
             />
         </label>
         <br />
         <br />
         <label className='header'>
             Password:
             <input
             type="password"
             className='input'
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             />
         </label>
         <br />
         <br />
         { !isLogin &&
            <div>
            <label className='header'>
                Email:
                <input
                    type="email"
                    className='input'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </label>
                <br />
             </div>
         }
         <br />
         <button type="submit">{isLogin ? "Login" : "Register"}</button>
         </form>
         <br />
         { isLogin &&
            <label className="tag header" onClick={() => {
                setLogin(false)
            }}> Need an account? </label>
         }
         {/* {error && <div>{error}</div>} */}
        </div>
     )}
    { loginId &&
        <StartComponent loginId={loginId}/>
    }
    </div>
  );
};

export default UserManager;
