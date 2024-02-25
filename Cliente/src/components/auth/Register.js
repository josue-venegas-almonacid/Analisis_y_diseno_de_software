import React, { useState } from 'react';
import { Alert, Form } from 'react-bootstrap';
import axios from 'axios';

function Register(props) {
    
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [location, setLocation] = useState('');
    const [estado, setEstado] = useState('');

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePass = (e) => {
        setPass(e.target.value);
    }

    const handleName = (e) => {
        setName(e.target.value);
    }

    const handleNumber = (e) => {
        setNumber(e.target.value);
    }

    const handleLocation = (e) => {
        setLocation(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/auth/register', {
            email: email,
            contraseña: pass,
            nombre: name,
            numero_contacto: number,
            direccion: location,
        }).then((data) => {
            setEstado('OK');
        }).catch((error) =>{
            setEstado('ERROR');
            console.log(error)
        });
    }

    return (
        <Form>
            {estado !== '' && (
                <Alert variant={estado === 'OK' ? 'success' : 'danger'}>
                    {estado === 'OK' ? 'Usuario registrado correctamente' : 'Ha ocurrido un error. Intente nuevamente'}
                </Alert>
            )}
            <Form.Group>               
                <Form.Label>Correo</Form.Label>
                <Form.Control onChange={handleEmail} type="email" placeholder="Ingrese su correo" />
            </Form.Group>

            <Form.Group>
                <Form.Label>Contraseña</Form.Label>
                <Form.Control onChange={handlePass} type="password" placeholder="Ingrese su contraseña" />
            </Form.Group>

            <Form.Group>              
                <Form.Label>Nombre</Form.Label>
                <Form.Control onChange={handleName} type="text" placeholder="Ingrese su nombre. Ej: Juan Perez" />
            </Form.Group>

            <Form.Group>              
                <Form.Label>Nº de contacto</Form.Label>
                <Form.Control onChange={handleNumber} type="text" placeholder="Ingrese su número de contacto. Ej: 96254175" />
            </Form.Group>

            <Form.Group>              
                <Form.Label>Dirección</Form.Label>
                <Form.Control onChange={handleLocation} type="text" placeholder="Ingrese su dirección. Ej: Pasaje 1234, Comuna, Región" />
            </Form.Group>         

            <button onClick={handleSubmit} className="btnSubmit" type="submit">Crear cuenta</button>
        </Form>
    );
}

export default Register;