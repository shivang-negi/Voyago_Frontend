import './login.css';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useRef, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SyncLoader } from 'react-spinners';
import { AuthContext } from '../App.js';

export default function Login() {
    
    const navigate = useNavigate();
    const usernameref = useRef(null);
    const passwordRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const { loggedIn, setLoggedIn } = useContext(AuthContext);

    useEffect(()=>{
        if(loggedIn) navigate('/')
    },[loggedIn]);

    async function LoginFormSubmitted(e) {

        console.log('Login button pressed');
        
        e.preventDefault();
        const username = usernameref.current.value;
        const password = passwordRef.current.value;

        if(username.length === 0) {
            toast.error('Enter Username.');
        }
        else if(password.length === 0) {
            toast.error('Enter Password.');
        }
        else {
            setLoading(true);
            const data = {
                email: username,
                password: password
            }

            axios.post('http://localhost:5000/login', data)
            .then((response)=> {
                if(response.data.message === -1 || response.data.message === 0) {
                    toast.error('Incorrect E-Mail or Password.',{duration: 2000})
                }
                else if(response.data.message === -2) {
                    toast.error('Server failure. Please try again.',{duration: 2000})
                }
                else {
                    setLoggedIn(true);
                    localStorage.setItem('token',response.data['token']);
                    localStorage.setItem('user',username);
                    localStorage.setItem('id',response.data.user._id);
                    localStorage.setItem('username',response.data.user.username);
                    navigate('/');  //Navigate to homepage if correct
                }
            })
            .catch((error)=> {
                console.log(error);
                toast.error('Error sending request to server.');
            })
            .finally(()=> {
                
                setLoading(false);
            })
        }
    }

    function forgotPassword() {
        console.log('forgot password');
    }

    function CreateAccount() {
        console.log('create account');
    }

    function oauthLogin() {
        console.log('oauth login');
        window.location.href = 'http://localhost:5000/auth/google/callback';
    }

    return (
        <div className="LoginScreen">
            
            <SyncLoader
                color='#36d7b7'
                loading={loading}
                size={25}
                margin={3}
                className='loginLoader'
            />

            <div className='LoginContainer'>

                <div className='LoginHeading'>
                    Login
                </div>

                <div className='LoginFormContainer'>
                    <form className='LoginForm' onSubmit={LoginFormSubmitted}>

                        <div className='LoginUsernameContainer'>    
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-envelope-fill EmailIcon" viewBox="0 0 16 16">
    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/>
                            </svg>
                            <input type='text' placeholder='E-Mail' className='LoginUsername' ref={usernameref}></input>
                        </div>

                        <div className='LoginPasswordContainer'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" color="rgb(102,102,102)" fill="currentColor" className="bi bi-lock-fill PasswordIcon" viewBox="0 0 16 16">
                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
                            </svg>
                            <input type='password' placeholder='Password' className='LoginPassword' ref={passwordRef}></input>
                        </div>

                        <input type='submit' className='LoginSubmit' value="Login" disabled={loading}></input>
                    </form>
                </div>

                <button className='ForgetPassword' onClick={forgotPassword} disabled={loading}>Forget Password?</button>
                <Link to='/signup' className='CreateAccoutLink'>
                    <button className='LoginCreateAccount' onClick={CreateAccount} disabled={loading}>Don't have an account? Sign up now</button>
                </Link>

                <div className='ORContainer'>
                    <span className='ORLine'></span>
                    <span className='ORText'>OR</span>
                </div>

                <button className="login-with-google-btn" disabled={loading} onClick={oauthLogin}>
                    Sign in with Google
                </button>
                
                <Toaster
                    toastOptions={{
                        className: '',
                        style: {
                            fontFamily: 'Arial, sans-serif'
                        },
                    }}
                />
            </div>
        </div>
    )
}