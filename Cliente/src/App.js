import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, Link} from 'react-router-dom';
import { Container, Navbar, Nav, Button} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from  './actions/authActions';
import { admin_off } from  './actions/adminActions';

import LoginScreen from './components/auth/LoginScreen';
import CalendarioAdmin from './components/consultas/CalendarioAdmin';
import AgendadasAdmin from './components/consultas/AgendadasAdmin';
import TalleresAdmin from './components/talleres/TalleresAdmin';
import InscritosAdmin from './components/talleres/InscritosAdmin';
import MiPerfil from './components/perfiles/MiPerfil';
import Pacientes from './components/perfiles/Pacientes';
import HistorialConsultas from './components/perfiles/HistorialConsultas';
import Footer from './components/Footer';

import './styles/styles.css';
import './styles/nav.css';

function App() {

  const isLogged = useSelector((store) => store.authReducer.isLogged);
  const isAdmin = useSelector((store) => store.adminReducer.isAdmin);
  const dispatch = useDispatch();
  const handleLogout = (e) => {
    window.localStorage.removeItem("token"); //remove one item;
    window.localStorage.removeItem("admin"); //remove one item;
    dispatch(admin_off());
    dispatch(logout());
  }

  return (
    <div className="App">
        <Router>

          {isLogged && isAdmin && (
            <Navbar className="Nav">
              <Nav className="mr-auto">
                <Navbar.Brand href="http://www.bebeymami.com/"><img src="img/logo.png" alt="logo" width="220" height="60" className="align-top"/></Navbar.Brand>
              </Nav>
              <Nav>
                <Nav.Link as ={Link} to="/consultas">CALENDARIO</Nav.Link>
                <Nav.Link as ={Link} to="/consultas/agendadas">CONSULTAS AGENDADAS</Nav.Link>
                <Nav.Link as ={Link} to="/talleres">TALLERES</Nav.Link>
                <Nav.Link as ={Link} to="/talleres/inscritos">INSCRITOS EN TALLERES</Nav.Link>
                <Nav.Link as ={Link} to="/mi-perfil">MI PERFIL</Nav.Link>
                <Button onClick={handleLogout} variant="danger" type="submit"> SALIR </Button>
              </Nav>
            </Navbar>
          )}

          {isLogged && !isAdmin && (
                      <Navbar className="Nav">
                        <Nav className="mr-auto">
                          <Navbar.Brand href="http://www.bebeymami.com/"><img src="img/logo.png" alt="logo" width="220" height="60" className="align-top"/></Navbar.Brand>
                        </Nav>
                        <Nav>
                          <Nav.Link as ={Link} to="/consultas">AGENDAR CONSULTA</Nav.Link>
                          <Nav.Link as ={Link} to="/consultas/agendadas">CONSULTAS AGENDADAS</Nav.Link>
                          <Nav.Link as ={Link} to="/talleres">INSCRIBIRME A TALLERES</Nav.Link>
                          <Nav.Link as ={Link} to="/talleres/inscritos">TALLERES INSCRITOS</Nav.Link>
                          <Nav.Link as ={Link} to="/mi-perfil">MI PERFIL</Nav.Link>
                          <Button onClick={handleLogout} variant="danger" type="submit"> SALIR </Button>
                        </Nav>
                      </Navbar>
          )}

          <Switch>
            <Route path="/login">
              <LoginScreen />
            </Route>

            <Route path="/consultas/agendadas">
              <Container className="content">
                <AgendadasAdmin/>
              </Container>
              <Footer />
            </Route>
          
            <Route path="/consultas">
              <Container className="content">
                <CalendarioAdmin/>
              </Container>
              <Footer />
            </Route>

            <Route path="/talleres/inscritos">
              <Container className="content">
                <InscritosAdmin/>
              </Container>
              <Footer />
            </Route>

            <Route path="/talleres">
              <Container className="content">
                <TalleresAdmin/>
              </Container>
              <Footer />
            </Route>

            <Route path="/mi-perfil">
              <Container className="content">
                <MiPerfil/>
              </Container>

              {!isAdmin && (
              <Container className="content">
                <Pacientes/>
              </Container>)}

              {!isAdmin && (
              <Container className="content">
                <HistorialConsultas/>
              </Container>)}
              
              <Footer />
            </Route>

            <Redirect to="/login" /> 
            
          </Switch> 
        </Router> 
    </div>
  );
}

export default App;
