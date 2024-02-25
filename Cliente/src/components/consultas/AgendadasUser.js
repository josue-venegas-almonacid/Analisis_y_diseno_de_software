import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import "bootstrap/dist/css/bootstrap.min.css";    //Quitarlo y agregar componentes Form
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Col, Container, Row, Button, Table } from 'react-bootstrap';


class AgendadasUser extends Component {

  state={
    data:[],
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
    }
  };   
    
  peticionGet=()=>{
    axios.get('http://localhost:3000/consultas/', {
        headers: {
            'auth-token': localStorage.getItem('token'),
        }
    }).then(response=>{
      this.setState({data: response.data});
    }).catch(error=>{
      console.log(error.message);
    })
  }
    
  peticionPutPosponer=()=>{
    axios.put('http://localhost:3000/consultas/posponer/'+this.state.form.id, {
      headers: {
          'auth-token': localStorage.getItem('token'),
      }}).then(()=>{
      this.modalPosponer();
      this.peticionGet();
    })
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

  modalPosponer=()=>{
    this.setState({modalPosponer: !this.state.modalPosponer});
  }

  modalCancelar=()=>{
    this.setState({modalCancelar: !this.state.modalCancelar});
  }
    
  seleccionarConsulta=(consulta)=>{
    this.setState({
      form: {
        id: consulta.id,
        id_usuario: consulta.id_usuario,
        id_paciente: consulta.id_paciente,
        rut_paciente: consulta.rut_paciente,
        tipo: consulta.tipo,
        fecha: consulta.fecha,
        hora: consulta.hora,
        link: consulta.link,
        estado: consulta.estado 
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
          <Col>
            <h3>Mis próximas consultas</h3>
            <Table striped>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>RUT Paciente</th>
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
                        <Button className="btn btn-danger" onClick={()=>{this.seleccionarConsulta(consulta); this.modalCancelar()}}><FontAwesomeIcon icon={faTrashAlt}/> Cancelar hora</Button>{"   "}
                      </td>
                  </tr>
                  )}
                })}
              </tbody>
              </Table>
          </Col>
      
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

          <Modal isOpen={this.state.modalCancelar}>
            <ModalHeader style={{display: 'block'}}>
              Cancelar una consulta
              <Button className="btn btn-light" style={{float: 'right'}} onClick={()=>this.modalCancelar()}>X</Button>
            </ModalHeader>

            <ModalBody>
              <h6>¿Estás seguro que deseas <b>cancelar</b> la consulta para la fecha <b>"{form && form.fecha}"</b>? Se enviará una notificación al administrador</h6>
            </ModalBody>

            <ModalFooter>
            <Button className="btn btn-danger" onClick={()=>this.peticionPutCancelar()}>Cancelar</Button>
              <Button className="btn btn-light" onClick={()=>this.modalCancelar()}>Cerrar</Button>
            </ModalFooter>
          </Modal>

        </Row>
      </Container>   
    )
  }
}

export default AgendadasUser;