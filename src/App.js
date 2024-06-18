import React from 'react'
import { InputHydroTelegram } from './features/hydro/inputTelegram'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar'
import logo from './components/images/logo2015_2.png'

function App() {
  const url = window.location.href
  const postCode = (url.indexOf('postCode')>-1)?url.slice(-5):'99999'
  return (
    <div >
      <Navbar bg="primary" data-bs-theme="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">
            <img
              src = {logo}
              width="50"
              height="50"
              alt="UGMS logo"
            />{'  '}
            Гидрометцентр ДНР 
          </Navbar.Brand>
        </Container>
      </Navbar>
      <InputHydroTelegram postCode={postCode} />
    </div>
  );
}

export default App;
