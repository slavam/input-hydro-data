import React, { useState } from 'react'
import { InputHydroTelegram } from './features/hydro/inputTelegram'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar'
import logo from './components/images/logo2015_2.png'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

function App() {
  // const url = window.location.href
  // const postCode = (url.indexOf('postCode')>-1)?url.slice(-5):'99999'
  const [show, setShow] = useState(false)
  const about = show? <Card className='text-center' bg='success' >
    <Card.Body>
      <Card.Title>УГМС ДНР</Card.Title>
      <Card.Text>Дата сборки 2024-08-08</Card.Text>
      <Button onClick={()=>setShow(false)} variant='info'>Закрыть</Button>
    </Card.Body>
  </Card> : null
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
              onClick={()=>setShow(true)}
            />{'  '}
            Гидрометцентр ДНР 
          </Navbar.Brand>
        </Container>
      </Navbar>
      {about}
      <InputHydroTelegram  />
    </div>
  );
}

export default App;
