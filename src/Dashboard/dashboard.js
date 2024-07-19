import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App.js';
import { useContext } from 'react';
import axios from 'axios';

export default function Dashboard() {

    const navigate = useNavigate();
    const { setLoggedIn } = useContext(AuthContext);

    async function logout() {
        
        setLoggedIn(false);
        localStorage.removeItem('token');
        navigate('/');
    }

    return (
        <>
            <div>YOU ARE LOGGED IN</div>
            <button onClick={logout}>LOGOUT</button>
        </>
    )
}