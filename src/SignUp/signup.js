import './signup.css';
import Pikaday from 'pikaday';
import 'pikaday/css/pikaday.css';
import { useRef, useEffect, useState, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { AuthContext } from '../App';

export default function Signup() {
    
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const usernameref = useRef(null);
    const emailref = useRef(null);
    const passwordRef = useRef(null);
    const [loading,setLoading] = useState(false);
    const { setLoggedIn } = useContext(AuthContext);

    function validateEmail(email) {
        const emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        return emailPattern.test(email);
    }  

    function oauthLogin() {
        console.log('oauth login');
        window.location.href = 'http://localhost:5000/auth/google/callback';
    }

    useEffect(() => {
        // Initialize Pikaday when the component mounts
        const picker = new Pikaday({
          field: inputRef.current,
          format: 'DD-MM-YYYY',
          maxDate: new Date(),
          yearRange: [1960,2024],
          toString(date, format) {
              // you should do formatting based on the passed format,
              // but we will just return 'D/M/YYYY' for simplicity
              const day = date.getDate();
              const month = date.getMonth() + 1;
              const year = date.getFullYear();
              return `${day}/${month}/${year}`;
          },
          parse(dateString, format) {
              // dateString is the result of `toString` method
              const parts = dateString.split('/');
              const day = parseInt(parts[0], 10);
              const month = parseInt(parts[1], 10) - 1;
              const year = parseInt(parts[2], 10);
              return new Date(year, month, day);
          }
        });
    
        // Cleanup function to destroy Pikaday when the component unmounts
        return () => {
          picker.destroy();
        };
      }, []); 

    async function SignupFormSubmitted(e) {
        e.preventDefault();
        const username = usernameref.current.value;
        const email = emailref.current.value;
        const date = inputRef.current.value;
        const password = passwordRef.current.value;

        if(username.length < 6) {
            toast.error("Username must be atleast 6 digits.", 
                        {duration:1500});
        }
        else if(validateEmail(email) === false) {
            toast.error("E-Mail must be valid.", 
            {duration:1500})
        }
        else if(password.length < 6) {
            toast.error("Password must be 6 digits long.", 
            {duration:1500});
        }
        else if(date.length === 0) {
            toast.error("Enter Date.", 
            {duration:1500});
        }
        else {
            setLoading(true);
            const data = {
                username: username,
                email: email,
                date: date,
                password: password
            }

            axios.post('http://localhost:5000/signup', data)
            .then((response)=> {
                if(response.data.message === -1) {
                    toast.error('E-Mail already registered.');
                }
                else if(response.data.message === 0) {
                    toast.error('Server error.');
                }
                else {
                    setLoggedIn(true);
                    localStorage.setItem('token',response.data.token);
                    localStorage.setItem('user',username);
                    localStorage.setItem('id',response.data.user._id);
                    localStorage.setItem('username',response.data.user.username);
                    navigate('/', {
                        state: {
                            username: username,
                            email: email,
                            id: response.data.user._id
                        }
                    }); 
                }
            })
            .catch((error)=>{
                console.log(error);
                toast.error('Error sending request to server.');
            })
            .finally(()=>{
                setLoading(false);
            })
        }
    }

    return (
        <div className='sign-up-screen'>

            <SyncLoader
                color='#36d7b7'
                loading={loading}
                size={25}
                margin={3}
                className='signupLoader'
            />

            <div className='sign-up-container'>
                <div className='sign-up-header'>Create a Voyago account</div>

                <div className='signup-form-container'>
                    <form className='signup-form' onSubmit={SignupFormSubmitted}>

                        <div className='signup-fullname'>    
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-person-fill PersonIcon" viewBox="0 0 16 16">
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                            </svg>
                            <input type='text' placeholder='Username' className='signup-input-name' ref={usernameref}></input>
                        </div>

                        <div className='signup-email'>    
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-envelope-fill SignUpEmailIcon" viewBox="0 0 16 16">
                            <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/>
                            </svg>
                            <input type='text' placeholder='E-Mail' className='signup-input-email' ref={emailref}></input>
                        </div>

                        <div className='signup-calendar'>    
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-calendar-fill CalendarIcon" viewBox="0 0 16 16">
                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5h16V4H0V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5"/>
                            </svg>
                            <input type='text' placeholder='Date of Birth' className='signup-input-calendar' ref={inputRef}></input>
                        </div>

                        <div className='LoginPWContainer'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" color="rgb(102,102,102)" fill="currentColor" className="bi bi-lock-fill PWIcon" viewBox="0 0 16 16">
                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
                            </svg>
                            <input type='password' placeholder='Password' className='LoginPW' ref={passwordRef}></input>
                        </div>

                        <input type='submit' className='submit-signup' value="Create Account" disabled={loading}></input>
                    </form>
                </div>

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