import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Col, Container, Row, Table } from 'react-bootstrap';

class HistorialConsultas extends Component {
  state={
    data:[],
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
       
  componentDidMount() {
    this.peticionGet();
  }
      
    
  render(){
    
    return (
      <Container>
        <Row>
          <Col>
          <h3>Historial de consultas</h3>
            <Table striped hover>
              <thead>
                <tr>
                  <th>RUT del Paciente</th>
                  <th>Tipo de consulta</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Diagnóstico</th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.map(consulta=>{
                  if(consulta.estado === 'Finalizada'){
                  return(
                    <tr>
                      <td>{consulta.rut_paciente}</td>
                      <td>{consulta.tipo}</td>
                      <td>{moment(consulta.fecha).format("DD-MM-YYYY")}</td>
                      <td>{moment(consulta.hora,"HH:mm:ss").format("HH:mm")}</td>
                      <td></td>
                  </tr>
                  )}
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>   
    );
  }
}

export default HistorialConsultas;