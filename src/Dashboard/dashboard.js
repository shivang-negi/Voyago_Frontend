import { useEffect } from 'react';
import './dashboard.css';
import Navbar from './Navbar/Navbar.js';
import Postlist from './PostList/Postlist.js';

export default function Dashboard({username,email, id}) {

    return (
        <div className='dashboard-main-container'>
            <Navbar username={username}/>
            <Postlist id={id} username={username}/>
        </div>
    )
}