import React, { Component } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Form, Col, Container, Row, Button, Table } from 'react-bootstrap';


class Pacientes extends Component {
  state={
    data:[],
    modalInsertar: false,
    modalInsertarLink: false,
    modalEliminar: false,
    form:{
      id: '',
      rut: '',
      id_usuario: '',
      nombre: '',
      fecha_nacimiento: '',
      peso: '',
    }
  };  
    
  peticionGet=()=>{
    axios.get('http://localhost:3000/users/pacientes', {
        headers: {
            'auth-token': localStorage.getItem('token'),
        }
    }).then(response=>{
      this.setState({data: response.data});
    }).catch(error=>{
      console.log(error.message);
    })
  }
    
  peticionPost=async()=>{
    delete this.state.form.id;
    await axios.post('http://localhost:3000/users/pacientes/agregar',this.state.form, {
        headers: {
            'auth-token': localStorage.getItem('token'),
        }
    }).then(()=>{
      this.peticionGet();
    }).catch(error=>{
      console.log(error.message);
    })
  }
    
  peticionPut=()=>{
    axios.put('http://localhost:3000/users/pacientes/editar/'+this.state.form.id, this.state.form, {
        headers: {
            'auth-token': localStorage.getItem('token'),
        }
    }).then(()=>{
      this.modalInsertar();
      this.peticionGet();
    })
  }
    
  peticionDelete=()=>{
    console.log(this.state.form.id);
    axios.delete('http://localhost:3000/users/pacientes/eliminar/'+this.state.form.id, {
      headers: {
          'auth-token': localStorage.getItem('token'),
      }
  }).then(()=>{
      this.setState({modalEliminar: false});
      this.peticionGet();
    }).catch(error=>{
      console.log(error.message);
    })
  }
    
  modalInsertar=()=>{
    this.setState({modalInsertar: !this.state.modalInsertar});
  }

    
  seleccionarPaciente=(paciente)=>{
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: paciente.id,
        rut: paciente.rut,
        id_usuario: paciente.id_usuario,
        nombre: paciente.nombre,
        fecha_nacimiento: paciente.fecha_nacimiento,
        peso: paciente.peso,
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
    
    return (
      <Container>
        <Row>
          <Col md={5}>
            <h3>Añadir paciente</h3>
            <Form>
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange}/>
                <br />
                <label htmlFor="rut">RUT</label>
                <input className="form-control" type="text" name="rut" id="rut" onChange={this.handleChange}/>
                <br />
                <label htmlFor="fecha_nacimiento">Fecha de nacimiento</label>
                <input className="form-control" type="date" name="fecha_nacimiento" id="fecha_nacimiento" onChange={this.handleChange}/>
                <br />
                <label htmlFor="peso">Peso (en kg.)</label>
                <input className="form-control" type="number" name="peso" id="peso" min="0" max="100" onChange={this.handleChange}></input>
              </div>
              <button className="btn btn-success" onClick={()=>this.peticionPost()}>Añadir bebé</button>
            </Form>
          </Col>

          <Col>
            <h3>Pacientes añadidos</h3>
            <Table striped hover>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>RUT</th>
                  <th>Fecha de nacimiento</th>
                  <th>Peso (en kg.)</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.map(paciente=>{
                  return(
                    <tr>
                      <td>{paciente.nombre}</td>
                      <td>{paciente.rut}</td>
                      <td>{paciente.fecha_nacimiento}</td>
                      <td>{paciente.peso}</td>
                      <td>
                        <button className="btn btn-primary" onClick={()=>{this.seleccionarPaciente(paciente); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                        {"   "}
                        <button className="btn btn-danger" onClick={()=>{this.seleccionarPaciente(paciente); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                      </td>
                  </tr>
                  )
                })}
              </tbody>
            </Table>
          </Col>

          <Modal isOpen={this.state.modalInsertar}>
            <ModalHeader style={{display: 'block'}}>
              Actualizar un paciente
              <Button className="btn btn-light" style={{float: 'right'}} onClick={()=>this.modalInsertar()}>X</Button>
            </ModalHeader>
            <ModalBody>                  
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input className="form-control" type="text" name="nombre" id="nombre" readOnly onChange={this.handleChange} value={form?form.nombre: ''}/>
                <br />
                <label htmlFor="rut">RUT</label>
                <input className="form-control" type="text" name="rut" id="rut" readOnly onChange={this.handleChange} value={form?form.rut: ''}/>
                <br />
                <label htmlFor="fecha_nacimiento">Fecha de nacimiento</label>
                <input className="form-control" type="date" name="fecha_nacimiento" id="fecha_nacimiento" readOnly onChange={this.handleChange} value={form?form.fecha_nacimiento: ''}/>
                <br />
                <label htmlFor="peso">Peso (en kg.)</label>
                <input className="form-control" type="number" name="peso" id="peso" step="2" min="0" max="100" onChange={this.handleChange} value={form?form.peso: ''}/>
              </div>
            </ModalBody>
            <ModalFooter>   
            <Button className="btn btn-primary" onClick={()=>this.peticionPut()}>Actualizar</Button>
            <Button className="btn btn-light" onClick={()=>this.modalInsertar()}>Cerrar</Button>         
            </ModalFooter>    
          </Modal>
      
          <Modal isOpen={this.state.modalEliminar}>
            <ModalHeader style={{display: 'block'}}>
              Eliminar un paciente
              <Button className="btn btn-light" style={{float: 'right'}} onClick={()=>this.setState({modalEliminar: false})}>X</Button>
            </ModalHeader>
            <ModalBody>
              <h6>¿Estás seguro que deseas <b>eliminar</b> el paciente <b>"{form && form.nombre}"</b>?</h6>
            </ModalBody>
            <ModalFooter>
              <Button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</Button>
              <Button className="btn btn-light" onClick={()=>this.setState({modalEliminar: false})}>No</Button>
            </ModalFooter>
          </Modal>
        </Row>
      </Container>   
    );
  }
}

export default Pacientes;