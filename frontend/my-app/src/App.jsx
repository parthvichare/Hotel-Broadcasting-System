import React,{useEffect,useState} from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axiosInstance from './axiosInstance';
import axios from "axios"
import Signup from './components/SignInAuthentication/SignUp';
import SignIn from './components/SignInAuthentication/SignIn';
import HotelRegister from "./components/SignInAuthentication/HotelRegister"
import HotelDetail from './components/SignInAuthentication/HotelDetail';
import Navbar from './components/SignInAuthentication/Navbar';
import Allhotels from './components/SignInAuthentication/Allhotels';
import WelcomePage from './components/SignInAuthentication/WelcomePage';
import GuestDetails from './components/SignInAuthentication/GuestDetails';

const App = () => {
  const[data,setData] = useState(null)

  const Role = localStorage.getItem("Role")
    
  useEffect(()=>{
    const fetchData=async()=>{
      try{
        const response =  await axiosInstance.get('/')
        setData(response.data)
      }catch(error){
        console.log(error.message)
      }
    }
    fetchData()
  },[])
  console.log(data)

  return (
    <div>
      <p className='flex justify-center items-center text-2xl mb-10'>{Role} Dashboard Panel</p>
      <Navbar/>
      <Router>
        <Routes>
          <Route path="/admin-signUp" element={<Signup/>} />
          <Route path="/admin-signIn" element={<SignIn/>} />
          <Route path="/hotel-register" element={<HotelRegister/>} />
          <Route path="/hotel/:id" element={<HotelDetail/>}/>
          <Route path="/bookyourhotel" element={<Allhotels/>}/>
          <Route path="/welcomepage" element={<WelcomePage/>}/>
          <Route path="/guest-details" element={<GuestDetails/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App