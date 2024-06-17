import React from 'react'
// import { useSelector } from 'react-redux'
// import { menuItems } from '../menuItems';
// import MenuItems from './MenuItems'
// import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import logo from '../components/images/logo2015_2.png'

// import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown'

export const Navbar1 = () => {
  // const authUser = useSelector(x => x.auth.user);
  
  // only show nav when logged in
  // if (!authUser) return null;

  return (
    <>
    {/* <Navbar expand="lg" className="bg-body-tertiary"> */}
    <Navbar bg="primary" data-bs-theme="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">
            <img
              // src="../components/imges/logo2015_2.png"
              src = {logo}
              width="50"
              height="50"
              // className="d-inline-block align-top"
              alt="UGMS logo"
            />{'  '}
            Гидрометцентр ДНР
          </Navbar.Brand>
          {/* <Navbar.Collapse id="basic-navbar-nav"> */}
            <Nav className="me-auto">
              <Nav.Link href="/hydroposts">Гидропосты</Nav.Link>
              <Nav.Link href="/inputHydroTelegram">Ввод гидротелеграмм</Nav.Link>
            </Nav>
          {/* </Navbar.Collapse> */}
        </Container>
      </Navbar>
    {/* <nav>
      <section>
        <p>Пользователь: {authUser? authUser.login:'Unknown'}</p>
        <h1>Гидрометцентр ДНР</h1>
      </section>
      <div className="nav-area">
        <ul className="menus">
          {menuItems.map((menu, index) => {
            const depthLevel = 0;
            return (
              <MenuItems items={menu} key={index} depthLevel={depthLevel}/>
            );
          })}
        </ul>
      </div>
    </nav> */}
    </>
  )
}