import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import "bootstrap/dist/css/bootstrap.min.css";    //Quitarlo y agregar componentes Form
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrashAlt, faLink, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Form, Col, Container, Row, Button, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import AgendadasUser from './AgendadasUser';

class AgendadasAdmin extends Component {

  state={
    data:[],
    data_respuestas: [],
    modalRespuestas: false,
    modalInsertarLink: false,
    modalTerminar: false,
    modalPosponer: false,
    modalCancelar: false,
    form:{
      id: '',
      id_usuario: '',
      id_paciente: '',
      rut_paciente: '',
      tipo: '',
      fecha: '',
      hora: '',
      link: '',
      estado: '',
      diagnostico: '',
    }
  };   

  peticionGet=()=>{
    axios.get('http://localhost:3000/admin/consultas/', {
        headers: {
            'auth-token': localStorage.getItem('token'),
        }
    }).then(response=>{
      this.setState({data: response.data});
    }).catch(error=>{
      console.log(error.message);
    })
  }

  peticionGetRespuestas=()=>{
    axios.get('http://localhost:3000/admin/consultas/formulario/'+this.state.form.id, {
        headers: {
            'auth-token': localStorage.getItem('token'),
        }
    }).then(response=>{
      this.setState({data_respuestas: response.data});
    }).catch(error=>{
      console.log(error.message);
    })
  }

  peticionPutLink=()=>{
    axios.put('http://localhost:3000/admin/consultas/addlink/'+this.state.form.id, this.state.form).then(()=>{
      this.modalInsertarLink();
      this.peticionGet();
    })
  }

  peticionPutPosponer=()=>{
    //FALTA MOSTRAR FECHAS PARA POSPONER
    this.modalPosponer();
    this.peticionGet();
  }

  peticionPutCancelar=()=>{
    axios.put('http://localhost:3000/admin/consultas/cancelar/'+this.state.form.id, {
      headers: {
          'auth-token': localStorage.getItem('token'),
      }}).then(()=>{
      this.modalCancelar();
      this.peticionGet();
    })
  }


  peticionPutTerminar=()=>{
    /*this.state.form.diagnostico = this.state.form.diagnostico;
    axios.put('http://localhost:3000/admin/consultas/editar/'+this.state.form.id, this.state.form, {
      headers: {
          'auth-token': localStorage.getItem('token'),
      }});
      this.peticionGet();*/

      axios.put('http://localhost:3000/admin/consultas/finalizar/'+this.state.form.id, {
      headers: {
          'auth-token': localStorage.getItem('token'),
      }}).then(()=>{
      this.modalTerminar();
      this.peticionGet();
    })
      
  }

 


  modalRespuestas=()=>{
    this.setState({modalRespuestas: !this.state.modalRespuestas});
  }

  modalInsertarLink=()=>{
    this.setState({modalInsertarLink: !this.state.modalInsertarLink});
  }
  
  modalTerminar=()=>{
    this.setState({modalTerminar: !this.state.modalTerminar});
  }
        
  modalPosponer=()=>{
    this.setState({modalPosponer: !this.state.modalPosponer});
  }

  modalCancelar=()=>{
    this.setState({modalCancelar: !this.state.modalCancelar});
  }
    
  seleccionarConsulta=(consulta)=>{
    this.state.form.id = consulta.id;
    this.state.form.id_usuario = consulta.id_usuario;
    this.state.form.id_paciente = consulta.id_paciente;
    this.state.form.rut_paciente = consulta.rut_paciente;
    this.state.form.tipo = consulta.tipo;
    this.state.form.fecha = consulta.fecha;
    this.state.form.hora = consulta.hora;
    this.state.form.link = consulta.link;
    this.state.form.estado = consulta.estado;

    this.peticionGetRespuestas();
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

  cargarFormulario=()=>{

    let formulario = [];
    if (this.state.form.tipo === "Asesoría Nutricional Infantil"){

      formulario.push(<>

        <Row className="ml-2 mr-2">Enfermedades del bebé médicamente diagnosticadas, alergias alimentarias, intolerancias o condiciones especiales:</Row>
        <Row className="ml-2 mr-2">{this.state.data_respuestas.formBasic1}</Row>
        <Row className="ml-2 mr-2">¿Su bebé está tomando algún medicamento, vitamina o suplemento? ¿Cuál?</Row>
         <Row className="ml-2 mr-2">{this.state.data_respuestas.formBasic2}</Row>
        
         <Row className="ml-2 mr-2">¿Usted está tomando algún medicamento, vitamina o suplemento? ¿Cuál?</Row>
         <Row className="ml-2 mr-2">{this.state.data_respuestas.formBasic3}</Row>
          
         <Row className="ml-2 mr-2">Tipo de lactancia</Row>
         <Row className="ml-2 mr-2">{this.state.data_respuestas.formRadio1}</Row>
          
         <Row className="ml-2 mr-2">Si toma fórmula u otra leche...¿cuál, cuánto y cuántas veces al día?</Row>
         <Row className="ml-2 mr-2">{this.state.data_respuestas.formBasic4}</Row>

         <Row className="ml-2 mr-2">¿Cuántos pañales usa al día? (24 hrs.)</Row>
         <Row className="ml-2 mr-2">{this.state.data_respuestas.formRadio2}</Row>

         <Row className="ml-2 mr-2">Peso del bebé en su último control (gr)</Row>
         <Row className="ml-2 mr-2">{this.state.data_respuestas.formBasic5}</Row>

         <Row className="ml-2 mr-2">Talla del bebé en su último control (cm)</Row>
         <Row className="ml-2 mr-2">{this.state.data_respuestas.formBasic6}</Row>

         <Row className="ml-2 mr-2">Fecha de su último control</Row>
         <Row className="ml-2 mr-2">{this.state.data_respuestas.formBasic7}</Row>

         <Row className="ml-2 mr-2">¿Por qué necesita asesoría de lactancia? Describa la situación, dificultades o inquietudes que presentan</Row>
         <Row className="ml-2 mr-2">{this.state.data_respuestas.formBasic8}</Row>
        </>
      );
    }

    else if (this.state.form.tipo === "Asesoría Lactancia"){
      formulario.push(<>

        <Row className="ml-2 mr-2">Enfermedades del bebé médicamente diagnosticadas, alergias alimentarias, intolerancias o condiciones especiales:</Row>
        <Row className="ml-2 mr-2">{this.state.data_respuestas.formBasic1}</Row>
        <Row className="ml-2 mr-2">¿Su bebé está tomando algún medicamento, vitamina o suplemento? ¿Cuál?</Row>
        <Row className="ml-2 mr-2">{this.state.data_respuestas.formBasic2}</Row>

         <Row className="ml-2 mr-2">Tipo de lactancia</Row>
         <Row className="ml-2 mr-2">{this.state.data_respuestas.formRadio1}</Row>
          
         <Row className="ml-2 mr-2">Si toma fórmula u otra leche...¿cuál, cuánto y cuántas veces al día?</Row>
         <Row className="ml-2 mr-2">{this.state.data_respuestas.formBasic4}</Row>

         <Row className="ml-2 mr-2">Peso del bebé en su último control (gr)</Row>
         <Row className="ml-2 mr-2">{this.state.data_respuestas.formBasic5}</Row>

         <Row className="ml-2 mr-2">Talla del bebé en su último control (cm)</Row>
         <Row className="ml-2 mr-2">{this.state.data_respuestas.formBasic6}</Row>

         <Row className="ml-2 mr-2">Fecha de su último control</Row>
         <Row className="ml-2 mr-2">{this.state.data_respuestas.formBasic7}</Row>

         <Row className="ml-2 mr-2">¿Por qué necesita asesoría nutricional? Describa la situación, dificultades o inquietudes que presentan</Row>
         <Row className="ml-2 mr-2">{this.state.data_respuestas.formBasic8}</Row>
        </>
      );
    }
    return formulario;
  }
  
  render(){
    
    const isLogged = this.props.isLogged;
    const isAdmin = this.props.isAdmin;
    const {form}=this.state;
    
    return isLogged && isAdmin?( //Si está logeado y es admin
      <Container>
          <Row>
          <Col>
            <h3>Consultas agendadas</h3>
            <Table striped hover>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Paciente</th>
                  <th>Enlace</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.map(consulta=>{
                   if (consulta.estado==="Agendada"){ 
                    return(
                    <tr>
                      <td>{consulta.tipo}</td>
                      <td>{moment(consulta.fecha).format("DD [de] MMMM [de] YYYY")}</td>
                      <td>{moment(consulta.hora, "HH:mm:ss").format("HH:mm")}</td>
                      <td>{consulta.rut_paciente}</td>
                      <td>{consulta.link}</td>
                      <td>
                        {/*<Button className="btn btn-danger" onClick={()=>{this.seleccionarConsulta(consulta); this.modalPosponer()}}><FontAwesomeIcon icon={faClock}/> Posponer hora</Button>{"   "}*/}
                        <Button className="btn btn-info btn-sm mb-2" onClick={()=>{this.seleccionarConsulta(consulta); this.modalRespuestas()}}><FontAwesomeIcon icon={faEye}/> Ver respuestas</Button>{"   "}
                        <Button className="btn btn-success btn-sm mb-2" onClick={()=>{this.seleccionarConsulta(consulta); this.modalInsertarLink()}}><FontAwesomeIcon icon={faLink}/> Agregar enlace</Button>{"   "}
                        <Button className="btn btn-primary btn-sm mb-2" onClick={()=>{this.seleccionarConsulta(consulta); this.modalTerminar()}}><FontAwesomeIcon icon={faCheck}/> Terminar hora</Button>{"   "}
                        <Button className="btn btn-danger btn-sm mb-2" onClick={()=>{this.seleccionarConsulta(consulta); this.modalCancelar()}}><FontAwesomeIcon icon={faTrashAlt}/> Cancelar hora</Button>
                      </td>
                  </tr>
                  )}
                })}
              </tbody>
              </Table>
          </Col>


          <Modal isOpen={this.state.modalRespuestas}>
            <ModalHeader style={{display: 'block'}}>
              Respuestas del formulario
              <Button className="btn btn-light" style={{float: 'right'}} onClick={()=>this.modalRespuestas()}>X</Button>
            </ModalHeader>

            <ModalBody>
            {this.cargarFormulario()}
            </ModalBody>

            <ModalFooter>
              <Button className="btn btn-light" onClick={()=>this.modalRespuestas()}>Cerrar</Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.modalInsertarLink}>
            <ModalHeader style={{display: 'block'}}>
              Añadir enlace a una consulta
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

          <Modal isOpen={this.state.modalPosponer}>
            <ModalHeader style={{display: 'block'}}>
              Posponer una consulta
              <Button className="btn btn-light" style={{float: 'right'}} onClick={()=>this.modalPosponer()}>X</Button>
            </ModalHeader>

            <ModalBody>
              <h6>¿Estás seguro que deseas <b>posponer</b> la consulta para la fecha <b>"{form && form.fecha}"</b>? Se enviará una notificación al administrador</h6>
            </ModalBody>

            <ModalFooter>
            <Button className="btn btn-danger" onClick={()=>this.peticionPutPosponer()}>Posponer</Button>
              <Button className="btn btn-light" onClick={()=>this.modalPosponer()}>Cerrar</Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.modalTerminar}>
            <ModalHeader style={{display: 'block'}}>
              Terminar una consulta
              <Button className="btn btn-light" style={{float: 'right'}} onClick={()=>this.modalTerminar()}>X</Button>
            </ModalHeader>

            <ModalBody>
              <Form>
                <Form.Group>
                  <Form.Label>Diagnóstico de la consulta</Form.Label>
                  <Form.Control as="textarea" rows={3} name="diagnostico" id="diagnostico" onChange={this.handleChange} placeholder="Su respuesta" />
                </Form.Group>
              </Form>
            </ModalBody>

            <ModalFooter>
            <Button className="btn btn-primary" onClick={()=>this.peticionPutTerminar()}>Terminar</Button>
              <Button className="btn btn-light" onClick={()=>this.modalTerminar()}>Cerrar</Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.modalCancelar}>
            <ModalHeader style={{display: 'block'}}>
              Cancelar una consulta
              <Button className="btn btn-light" style={{float: 'right'}} onClick={()=>this.modalCancelar()}>X</Button>
            </ModalHeader>

            <ModalBody>
              <h6>¿Estás seguro que deseas <b>cancelar</b> la consulta para la fecha <b>"{form && form.fecha}"</b>? Se enviará una notificación al cliente</h6>
            </ModalBody>

            <ModalFooter>
            <Button className="btn btn-danger" onClick={()=>this.peticionPutCancelar()}>Cancelar</Button>
              <Button className="btn btn-light" onClick={()=>this.modalCancelar()}>Cerrar</Button>
            </ModalFooter>
          </Modal>
          </Row>










        
      </Container>  
    ): !isLogged? //Si no está logeado
    (<Redirect to="/login" />): //Si está logeado y no es admin => es usuario
    (<AgendadasUser/>);
  }
}

const mapStateToProps = state => {
  return {
      isLogged: state.authReducer.isLogged,
      isAdmin: state.adminReducer.isAdmin
  }
}

export default connect(mapStateToProps)(AgendadasAdmin);