import React from 'react'
import './App.css';
import {Routes,Route,Navigate, useNavigate, useLocation} from 'react-router-dom'
import { Navbar1 } from './app/Navbar'
import { HydropostsList } from './features/hydroposts/hydropostsList'
import Layout from './app/Layout'
import { InputHydroTelegram } from './features/hydro/inputTelegram'
import 'bootstrap/dist/css/bootstrap.min.css'
// import { history } from './components/history'

function App() {
  // history.navigate = useNavigate();
  // history.location = useLocation();
  return (
    <div >
      <Navbar1 />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/hydroposts" element={<HydropostsList />} />
          <Route path='/inputHydroTelegram' element={<InputHydroTelegram />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
