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
      const response = await axios.post(`https://${BACKEND['BACKEND_IP']}:${BACKEND['BACKEND_PORT']}/${urlPath}`, postData);
      setUsername('');
      setPassword('');
      setError('');
      if (isLogin && response.data['success']) {
        setLoginId(username)
      } else if (isLogin && !response.data['success']) {
        setError(response.data["message"])
        setTimeout(() => {
            setError('')
          }, 5000)
        return
      } else if (!isLogin && response.data['username']) {
        setLogin(true)
      }
    } catch (error) {
      console.error("Error = " , error.response);
      console.log(error.response.status)
      if ( error.response.status && error.response.status ===  HttpStatusCode.BadRequest) {
        let errorMesssage = ''
        Object.keys(error.response.data).forEach(key => {
            errorMesssage += `${key} : ${error.response.data[key]}, `;
          })
        setError(errorMesssage)
        setTimeout(() => {
            setError('')
          }, 10000)
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
    <div className="background-image">
     {error && (
        <Alert variant="danger" onClose={() => setError("")} className="alert-custom" dismissible={false}>
        {error}
        </Alert>
     )}
     { !loginId &&  (
        <div className='center-component'>
        <div>
         <h1 className='account-text'>{isLogin ? "Login" : "Create Account"}</h1>
         <form onSubmit={handleSubmit}>
         <label className='account-text'>
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
         <label className='account-text'>
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
            <label className='account-text'>
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
         <button className="button-3" type="submit">{isLogin ? "Login" : "Register"}</button>
         </form>
         <br />
         { isLogin &&
            <label className="tag account-text" onClick={() => {
                setLogin(false)
            }}> Need an account? </label>
         }
         </div>
        </div>
     )}
    { loginId &&
        <StartComponent loginId={loginId}/>
    }
    </div>
  );
};

export default UserManager;
