import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Login from './Login';
import Register from './Register';

import '../../styles/login.css';

function LoginScreen(){
    
    return (
        <Container className="login-container">
            <Row>
                <Col md={6} className="login-form-1">
                    <h3>¿Tienes cuenta? Ingresa aquí</h3>
                    <Login />
                </Col>

                <Col md={6} className="login-form-2">
                    <h3>¿No tienes cuenta? Crea una aquí</h3>
                    <Register />
                </Col>
            </Row>
            <div className="texto">
                <p className="text">Derechos Reservados © {new Date().getFullYear()} Bebé&amp;Mami</p>
            </div>
        </Container>
    );
}


export default LoginScreen;