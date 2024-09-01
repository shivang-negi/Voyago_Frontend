import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import { useContext } from 'react';

export default function Navbar({username}) {

    const navigate = useNavigate();
    const { setLoggedIn } = useContext(AuthContext);

    async function logout() {
        setLoggedIn(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('id');
        localStorage.removeItem('username');
        navigate('/');
    }

    return (
        <div className='navbar-d-container'>
            <div className='navbar-d-name'>{username}</div>

            <button className='navbar-d-friends'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#9b9b9b" className="bi bi-people-fill navbar-d-friends-icon" viewBox="0 0 16 16">
  <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                </svg>
                <span className='navbar-d-friends-tag'>My Friends</span>
            </button>

            <button className='navbar-d-favs'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="" className="bi bi-star-fill navbar-d-favs-icon" viewBox="0 0 16 16">
  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
</svg>
                <span className='navbar-d-favs-tag'>Favorites</span>
            </button>

            <button onClick={logout} className='navbar-d-logout'>
                
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-door-closed-fill navbar-d-logout-icon" viewBox="0 0 16 16">
            <path d="M12 1a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V2a1 1 0 0 1 1-1zm-2 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
            </svg>
            <span className='navbar-d-logout-tag'>Logout</span>



            </button>
        </div>
    )
}