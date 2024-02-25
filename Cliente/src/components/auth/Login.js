import React, { useState } from 'react';
import { Alert, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { login } from  '../../actions/authActions';
import { admin_on } from  '../../actions/adminActions';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

function Login() {
    
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [estado, setEstado] = useState('');
    const dispatch = useDispatch();
    const isLogged = useSelector((store) => store.authReducer.isLogged);

        
    function peticionGet(){
        axios.get('http://localhost:3000/users', {
            headers: {
                'auth-token': localStorage.getItem('token'),
            }
        }).then(response=>{
            const data = response.data;
            if (data[0].rol === 'admin'){
                localStorage.setItem('admin', true);
                dispatch(admin_on());
            }

        }).catch(error=>{
          console.log(error);
        })
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePass = (e) => {
        setPass(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/auth/login', {
            email: email,
            contraseña: pass,
        }).then((data) => {
            setEstado('OK');
            localStorage.setItem('token', data.data);
            peticionGet();
            dispatch(login());
        }).catch((error) =>{
            setEstado('ERROR');
            console.log(error)
        });
    }

    return isLogged? ( 
        //Si estoy logeado
        <Redirect to="/consultas" />)
        :   
        //Si no estoy logeado
        (<Form>
            {estado === 'ERROR' && (
                <Alert variant= 'danger'>
                    Correo o contraseña incorrectos. Intente nuevamente
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

            <button onClick={handleSubmit} className="btnSubmit" type="submit">Ingresar</button>
        </Form>
    );
}

export default Login;