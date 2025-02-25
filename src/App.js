import React, { useEffect, useState } from 'react'
import { InputHydroTelegram } from './features/hydro/inputTelegram'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar'
import logo from './components/images/logo2015_2.png'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

function App() {
  useEffect(() => {
    document.title = 'Гидротелеграммы'
  }, [])
  const url = window.location.href
  const positionPC = url.indexOf('postCode')
  const postCode = (positionPC>-1)?url.slice(positionPC+9,positionPC+14):'99999'
  const positionOD = url.indexOf('observDate')
  const observDate = (positionOD>-1)?url.slice(positionOD+11,positionOD+21): (new Date()).toISOString().slice(0,10)
  const [show, setShow] = useState(false)
  const about = show? <Card className='text-center' bg='success' >
    <Card.Body>
      <Card.Title>УГМС ДНР</Card.Title>
      <Card.Text>Дата сборки 2025-02-17</Card.Text>
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
            Гидрометцентр ДНР {observDate}
          </Navbar.Brand>
        </Container>
      </Navbar>
      {about}
      <InputHydroTelegram  postCode={postCode} observDate={observDate} />
    </div>
  );
}

export default App;
