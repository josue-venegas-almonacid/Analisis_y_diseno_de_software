import React, { Component } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Col, Container, Row, Button } from 'react-bootstrap';
import {connect} from 'react-redux';
import { Redirect} from 'react-router-dom';

import '../../styles/miperfil.css';

class MiPerfil extends Component {

  state={
    data:[],
    modalInsertar: false,
    modalInsertarLink: false,
    modalEliminar: false,
    form:{
      id: '',
      nombre: '',
      contraseña: '',
      numero_contacto: '',
      email: '',
      direccion: '',
      rol: ''
    }
  };  

  peticionGet=()=>{
    axios.get('http://localhost:3000/users', {
        headers: {
            'auth-token': localStorage.getItem('token'),
        }
    }).then(response=>{
      this.setState({data: response.data});
    }).catch(error=>{
      console.log(error.message);
      console.log('token');
      console.log(localStorage.getItem('token'));
    })
  }
    
  peticionPut=()=>{
    axios.put('http://localhost:3000/users/editar', this.state.form, {
        headers: {
            'auth-token': localStorage.getItem('token'),
        }
    }).then(()=>{
      this.modalInsertar();
      this.peticionGet();
    })
  }
    
  modalInsertar=()=>{
    this.setState({modalInsertar: !this.state.modalInsertar});
  }

    
  seleccionarUsuario=(usuario)=>{
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: usuario.id,
        nombre: usuario.nombre,
        numero_contacto: usuario.numero_contacto,
        email: usuario.email,
        direccion: usuario.direccion,
      }
    })
  }
    
  handleChange=async e=>{
    e.persist();
    await this.setState({
      form:{
        ...this.state.form,
        [e.target.name]: e.target.value,
      }
    });
  }
    
  componentDidMount() {
    this.peticionGet();
  }
      
    
  render(){
    const {form}=this.state;
    const isLogged = this.props.isLogged;
    
    return isLogged ? (
      //poner el isLogged en todos, así evito los intrusos que acceden por barra de direcciones del navegador.
      //aunque actualmente no se puede, podria pasar en el futuro
      //Acá podría hacer una llamada a una función handleRol que haga un axios.get.
      //En vez de definir si es admin mandarlo a calendario sino a otro lado, mandarlo siempre a calendario y ahí que haga el filtro
      //Para eso el get tiene que guardar en storage isAdmin
      <Container>
        <h3>Mi perfil</h3>
        <Row>
            <Col md={4} className="mb-3">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="d-flex flex-column align-items-center text-center">
                    {this.state.data.map(usuario=>{return(
                            <div>
                                <img src={"https://api.dicebear.com/7.x/initials/svg?seed=" + usuario.nombre} alt="Foto de perfil" className="rounded-circle" width="150"/>
                                <div className="mt-3">
                                    <h4>{usuario.nombre}</h4>
                                    <button className="btn btn-primary mt-2" onClick={()=>{this.seleccionarUsuario(usuario); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/> Editar perfil</button>
                                </div>
                            </div>)})
                    }
                  </div>
                </div>
              </div>
            </Col>

            <Col md={8}>
              <div className="card mb-3">
                <div className="card-body">

                    {this.state.data.map(usuario=>{return(
                            <div>
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Nombre</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        {usuario.nombre}
                                    </div>
                                </div>
                                <hr/>
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Correo</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        {usuario.email}
                                    </div>
                                </div>
                                <hr/>
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Número de contacto</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        {usuario.numero_contacto}
                                    </div>
                                </div>
                                <hr/>
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Dirección</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        {usuario.direccion}
                                    </div>
                                </div>
                                <hr/>
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Contraseña</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        *******
                                    </div>
                                </div>
                            </div>)})
                    }
                </div>
              </div>
            </Col>
        </Row>
                    
            <Modal isOpen={this.state.modalInsertar}>
              <ModalHeader style={{display: 'block'}}>
                Actualizar datos
                <Button className="btn btn-light" style={{float: 'right'}} onClick={()=>this.modalInsertar()}>X</Button>
              </ModalHeader>

               <ModalBody>               
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input className="form-control" type="text" name="nombre" id="nombre" readOnly onChange={this.handleChange} value={form?form.nombre: ''}/>
                  <br />
                  <label htmlFor="email">Correo</label>
                  <input className="form-control" type="email" name="email" id="email" onChange={this.handleChange} value={form?form.email: ''}/>
                  <br />
                  <label htmlFor="numero_contacto">Número de contacto</label>
                  <input className="form-control" type="text" name="numero_contacto" id="numero_contacto" onChange={this.handleChange} value={form?form.numero_contacto: ''}/>
                  <br />
                  <label htmlFor="direccion">Dirección</label>
                  <input className="form-control" type="text" name="direccion" id="direccion" onChange={this.handleChange} value={form?form.direccion: ''}/>
                  <br />
                </div>
              </ModalBody>

              <ModalFooter>       
                <Button className="btn btn-primary" onClick={()=>this.peticionPut()}>Actualizar</Button>
                <Button className="btn btn-light" onClick={()=>this.modalInsertar()}>Cerrar</Button>         
              </ModalFooter> 
            </Modal>
      </Container>
    ):
    (<Redirect to="/login" />);
  }
}


const mapStateToProps = state => {
    return {
        isLogged: state.authReducer.isLogged
    }
}

export default connect(mapStateToProps)(MiPerfil);