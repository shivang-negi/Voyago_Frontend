import './navbar.css';
import { Link } from 'react-router-dom';

export default function Navbar() {

    function pressedLogin() {
        console.log('login');
    }

    function pressedSign() {
        console.log('signin');
    }
 
    return (
        <nav>
            <ul className='navbar_homepage'>
                <li className='nav_li'>Voyago</li>

                <li className='nav_li'>
                    <Link to="/login"> 
                        <button className="login-button" onClick={()=>pressedLogin()}>
                            <span className="login-text">
                                Login
                            </span>
                        </button>
                    </Link>
                </li>

                <li className='nav_li'>
                    <Link to="/signup">
                        <button className="sign-button"  onClick={()=>pressedSign()}>
                            <span className="sign-text">
                                Sign up
                            </span>
                        </button>
                    </Link>
                </li>
                
            </ul>
        </nav>
    )
}