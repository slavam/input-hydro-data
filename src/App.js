import React from 'react'
import {Routes,Route} from 'react-router-dom'
import { Navbar1 } from './app/Navbar'
import { HydropostsList } from './features/hydroposts/hydropostsList'
import Layout from './app/Layout'
import { InputHydroTelegram } from './features/hydro/inputTelegram'

function App() {
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
