import Homepage from './HomepageNSI/homepage.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Login from "./Login/Login.js";
import Signup from "./SignUp/signup.js";
import Dashboard from './Dashboard/dashboard.js';
import { useState, createContext, useContext, useEffect } from 'react';
import { SyncLoader } from 'react-spinners';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function FindPath() {
  const { loggedIn, setLoggedIn } = useContext(AuthContext);
  const [load, setLoad] = useState(true);

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(!token) {
      setLoggedIn(false);
      setLoad(false);
      return;
    }

    const delay = (ms) => { //Cause delay
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    const verify = async ()=> {
      const val = await axios.post('http://localhost:5000/verify',{token: token});
      await delay(2000);  //Cause delay
      if(val.data['message'] === 1) setLoggedIn(true);
      else setLoggedIn(false);
    }

    verify()
    .then(()=> {
      setLoad(false);
    });
  },[])

  return load?<SyncLoader 
      color='#36d7b7'
      size={25} 
      margin={3} 
      className='loginLoader'/>:
  ((loggedIn)?<Dashboard/>:<Homepage/>);
}

export default App;
export {AuthContext};