import Homepage from './HomepageNSI/homepage.js';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from "./Login/Login.js";
import Signup from "./SignUp/signup.js";
import Dashboard from './Dashboard/dashboard.js';
import { useState, createContext, useContext, useEffect } from 'react';
import { SyncLoader } from 'react-spinners';
import Post from './Dashboard/Post/post.js';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(()=>{
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if(token && user) setLoggedIn(true);
  },[]);

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

function App() {
  
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={ <FindPath />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/post/:postId" element={<PrivateRoute/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function PrivateRoute() {
  const { loggedIn } = useContext(AuthContext); 

  if(loggedIn) return <Post></Post>;
  else {
    return <div>Login to access this content.</div>
  }
}

function FindPath() {
  const { loggedIn, setLoggedIn } = useContext(AuthContext);
  const [load, setLoad] = useState(true);
  const [error, setError] = useState(false);
  const [userData,setUserData] = useState({});

  const location = useLocation();
  const { username,email,id} = location.state || {};

  useEffect(()=>{

    if(username && email && id) {
      setLoggedIn(true);
      setUserData({email: email, username: username, id: id});
      setLoad(false);
      return;
    }

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const _id = localStorage.getItem('id');
    if(!token || !user) {
      setLoggedIn(false);
      setLoad(false);
      return;
    }

    // const delay = (ms) => { //Cause delay
    //   return new Promise((resolve) => setTimeout(resolve, ms));
    // };

    const verify = async ()=> {
      const val = await axios.post('http://localhost:5000/verify',{token: token, user: user});
      // await delay(1000);  //Cause delay
      if(val.data.message === 1) {
        setLoggedIn(true);
        setUserData({email: val.data.email, username: val.data.username, id: val.data.id});
      }
      else setLoggedIn(false);
    }

    verify()
    .then(()=> {
      setLoad(false);
    })
    .catch(()=>{
      setLoad(false);
      setError(true);
      setLoggedIn(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('id');
      localStorage.removeItem('username');
    });
  },[])

  return load?<SyncLoader 
      color='#36d7b7'
      size={25} 
      margin={3} 
      className='loginLoader'/>:
      (
      error?
      <Homepage/>
      :
      ((loggedIn)?<Dashboard email={userData.email} username={userData.username} id={userData.id}/>: <Homepage/>)
      );
}

export default App;
export {AuthContext};