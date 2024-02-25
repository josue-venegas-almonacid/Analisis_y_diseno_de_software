import React, { Component } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";    //Quitarlo y agregar componentes Form
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faLink } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Form, Col, Container, Row, Button, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import TalleresUser from './TalleresUser';

class TalleresAdmin extends Component {

  state={
    data:[],
    modalInsertar: false,
    modalInsertarLink: false,
    modalEliminar: false,
    form:{
      id: '',
      nombre: '',
      fecha: '',
      hora: '',
      valor: '',
      cupos: '100', //Máximo para una cuenta FREE en Zoom
      link: ''      //Debería ser autogenerado
    }
  };  
    
  peticionGet=()=>{
    axios.get('http://localhost:3000/admin/talleres').then(response=>{
      this.setState({data: response.data});
    }).catch(error=>{
      console.log(error.message);
    })
  }
    
  peticionPost=async()=>{
    delete this.state.form.id;
    await axios.post('http://localhost:3000/admin/talleres/agregar',this.state.form).then(()=>{
      this.peticionGet();
    }).catch(error=>{
      console.log(error.message);
    })
  }
    
  peticionPut=()=>{
    axios.put('http://localhost:3000/admin/talleres/editar/'+this.state.form.id, this.state.form).then(()=>{
      this.modalInsertar();
      this.peticionGet();
    })
  }

  peticionPutLink=()=>{
    axios.put('http://localhost:3000/admin/talleres/addlink/'+this.state.form.id, this.state.form).then(()=>{
      this.modalInsertarLink();
      this.peticionGet();
    })
  }
    
  peticionDelete=()=>{
    axios.delete('http://localhost:3000/admin/talleres/eliminar/'+this.state.form.id).then(()=>{
      this.setState({modalEliminar: false});
      this.peticionGet();
    })
  }
    
  modalInsertar=()=>{
    this.setState({modalInsertar: !this.state.modalInsertar});
  }

  modalInsertarLink=()=>{
    this.setState({modalInsertarLink: !this.state.modalInsertarLink});
  }
    
  seleccionarTaller=(taller)=>{
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: taller.id,
        nombre: taller.nombre,
        fecha: taller.fecha,
        hora: taller.hora,
        valor: taller.valor,
        cupos: taller.cupos,
        link: taller.link
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
    const isAdmin = this.props.isAdmin;
    
    return isLogged && isAdmin?( //Si está logeado y es admin
      <Container>
        <Row>
          <Col md={5}>
            <h3>Añadir nuevo taller</h3>
            <Form>
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange}/>
                <br />
                <label htmlFor="fecha">Fecha</label>
                <input className="form-control" type="date" name="fecha" id="fecha" onChange={this.handleChange}/>
                <br />
                <label htmlFor="hora">Hora</label>
                <input className="form-control" type="time" name="hora" id="hora" onChange={this.handleChange}/>
                <br />
                <label htmlFor="valor">Valor</label>
                <input className="form-control" type="text" name="valor" id="valor" onChange={this.handleChange}/>
                <p>Ej: 15000</p>
                <label htmlFor="cupos">Cupos</label>
                <input className="form-control" type="number" name="cupos" id="cupos" step="5" min="0" max="100" value={this.state.form.cupos} onChange={this.handleChange}></input>
                <p>Mínimo: 0 - Máximo: 100 (Capacidad para cuentas gratuitas de Zoom)</p>
              </div>
              <Button className="btn btn-success" onClick={()=>this.peticionPost()}>Añadir taller</Button>
            </Form>
          </Col>

          <Col>
            <h3>Talleres creados</h3>
            <Table striped hover>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Valor</th>
                  <th>Cupos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.map(taller=>{
                  return(
                    <tr>
                      <td>{taller.nombre}</td>
                      <td>{taller.fecha}</td>
                      <td>{taller.hora}</td>
                      <td>{taller.valor}</td>
                      <td>{taller.cupos}</td>
                      <td>
                        <Button className="btn btn-primary" onClick={()=>{this.seleccionarTaller(taller); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></Button>{"   "}
                        <Button className="btn btn-danger" onClick={()=>{this.seleccionarTaller(taller); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></Button>{"   "}
                        <Button className="btn btn-success" onClick={()=>{this.seleccionarTaller(taller); this.modalInsertarLink()}}><FontAwesomeIcon icon={faLink}/></Button>
                      </td>
                  </tr>
                  )
                })}
              </tbody>
              </Table>
          </Col>

          <Modal isOpen={this.state.modalInsertar} >
            <ModalHeader style={{display: 'block'}}>
              Actualizar un taller
              <Button className="btn btn-light" style={{float: 'right'}} onClick={()=>this.modalInsertar()}>X</Button>
            </ModalHeader>

            <ModalBody>                  
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange} value={form?form.nombre: ''}/>
                <br />
                <label htmlFor="fecha">Fecha</label>
                <input className="form-control" type="date" name="fecha" id="fecha" onChange={this.handleChange} value={form?form.fecha: ''}/>
                <br />
                <label htmlFor="hora">Hora</label>
                <input className="form-control" type="time" name="hora" id="hora" onChange={this.handleChange} value={form?form.hora: ''}/>
                <br />
                <label htmlFor="valor">Valor</label>
                <input className="form-control" type="text" name="valor" id="valor" onChange={this.handleChange} value={form?form.valor: ''}/>
                <br />
                <label htmlFor="cupos">Cupos</label>
                <input className="form-control" type="number" name="cupos" id="cupos" step="5" min="0" max="100" onChange={this.handleChange} value={form?form.cupos: ''}/>
              </div>
            </ModalBody> 
            <ModalFooter>                 
              <Button className="btn btn-primary" onClick={()=>this.peticionPut()}>Actualizar</Button>
              <Button className="btn btn-light" onClick={()=>this.modalInsertar()}>Cerrar</Button>         
            </ModalFooter>   
          </Modal>
      
          <Modal isOpen={this.state.modalEliminar}>
            <ModalHeader style={{display: 'block'}}>
              Eliminar un taller
              <Button className="btn btn-light" style={{float: 'right'}} onClick={()=>this.setState({modalEliminar: false})}>X</Button>
            </ModalHeader>

            <ModalBody>
              <h6>¿Estás seguro que deseas <b>eliminar</b> el taller <b>"{form && form.nombre}"</b>?</h6>
            </ModalBody>

            <ModalFooter>
              <Button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</Button>
              <Button className="btn btn-light" onClick={()=>this.setState({modalEliminar: false})}>No</Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.modalInsertarLink}>
            <ModalHeader style={{display: 'block'}}>
              Añadir enlace a un taller
              <Button className="btn btn-light" style={{float: 'right'}} onClick={()=>this.modalInsertar()}>X</Button>
            </ModalHeader>

            <ModalBody>
              <div className="form-group">
                <label htmlFor="link">Enlace a la reunión</label>
                <input className="form-control" type="text" name="link" id="link" onChange={this.handleChange} value={form?form.link: ''}/>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button className="btn btn-success" onClick={()=>this.peticionPutLink()}>Actualizar</Button>
              <Button className="btn btn-light" onClick={()=>this.modalInsertarLink()}>Cerrar</Button>
            </ModalFooter>
          </Modal>
        </Row>
      </Container>   
    ): !isLogged? //Si no está logeado
    (<Redirect to="/login" />): //Si está logeado y no es admin => es usuario
    (<TalleresUser/>);
  }
}

const mapStateToProps = state => {
  return {
      isLogged: state.authReducer.isLogged,
      isAdmin: state.adminReducer.isAdmin
  }
}

export default connect(mapStateToProps)(TalleresAdmin);