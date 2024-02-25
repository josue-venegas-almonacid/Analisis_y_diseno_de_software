import React, { Component } from 'react';
import { Col, Container, Row, Button, Dropdown, Form } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment'
import { Redirect } from 'react-router-dom';

import '../../styles/calendar.css';

class CalendarioUser extends Component {
  state={
    data:[],
    data_pacientes: [],
    form:{
      id: '',
      id_usuario: '',
      id_paciente: '',
      nombre_paciente: '',
      rut_paciente: '',
      tipo: '',
      fecha: '',
      hora: '',
      link: '',
      estado: '',

      formBasic1: '',
      formBasic2: '',
      formBasic3: '',
      formBasic4: '',
      formBasic5: '',
      formBasic6: '',
      formBasic7: '',
      formBasic8: '',
      formRadio1: '',
      formRadio2: ''
    }
  };  

  handleFecha (fecha, hora, id){
    this.setState({
      form:{
        ...this.state.form,
        id: id,
        fecha: fecha,
        hora: hora
      }
    });
  }

  createCards=()=>{

    //Agrupo las horas por fecha en el diccionario consultas
    /* consultas = {
        fecha 1: [  [id1, hora1], [id2, hora2], ... ],
        fecha 2: [  [id1, hora1], [id2, hora2], ... ]
      }
    }*/  
    let consultas = {};
    //console.log("consultas 1:", consultas);
    for (let i=0; i<this.state.data.length; i++){
      let dato = this.state.data[i];
      
      if (!(dato.fecha in consultas)){
        consultas[dato.fecha] = []; 
      }
      consultas[dato.fecha].push([dato.hora, dato.id]);
      consultas[dato.fecha].sort();
    }
    //console.log("consultas 2:", consultas);
    

    //Guardo en una lista cómo se deben renderizar las fechas y sus horas correspondientes
    let tarjetas = [];
    tarjetas.push(<h5>1. Seleccione una hora disponible</h5>);
    for (let fecha in consultas){
      tarjetas.push(<Col md={12}><h6>{moment(fecha).format('dddd DD-MM-YYYY')}</h6></Col>);

      for (let i=0; i<consultas[fecha].length; i++){
        let hora = consultas[fecha][i][0];
        let id = consultas[fecha][i][1];
        tarjetas.push(
          
            <Button className={this.state.form.hora===hora? "btn btn-success ml-3 mb-2" : "btn btn-primary ml-3 mb-2"} onClick={()=>this.handleFecha(fecha, hora, id)}>{moment(hora, "HH:mm:ss").format("HH:mm")}</Button>
          
        )
      }
    }
    return tarjetas;
  }

  createButtonTipo=()=>{
    if ((this.state.form.fecha !== "") && (this.state.form.fecha !== "")){
      return (
      <>
        <h5>2. Seleccione tipo de consulta</h5>
        <Col md={12}>
          <Dropdown>
            <Dropdown.Toggle className={this.state.form.tipo? "btn btn-success mt-2 mb-2" : "btn btn-primary mt-2 mb-2"} variant="primary" id="dropdown-basic">
              {this.state.form.tipo? this.state.form.tipo:"Consulta"}
            </Dropdown.Toggle>
          
            <Dropdown.Menu>
              <Dropdown.Item onClick={()=>this.handleTipo("Asesoría Lactancia")}>Asesoría Lactancia</Dropdown.Item>
              <Dropdown.Item onClick={()=>this.handleTipo("Asesoría Nutricional Infantil")}>Asesoría Nutricional Infantill</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </>);
    }
    return null;
  }

  handleTipo(tipo){
    this.setState({
      form:{
        ...this.state.form,
        tipo: tipo
      }
    });
  }

  peticionGetPacientes=()=>{
    axios.get('http://localhost:3000/users/pacientes', {
        headers: {
            'auth-token': localStorage.getItem('token'),
        }
    }).then(response=>{
      this.setState({data_pacientes: response.data});
    }).catch(error=>{
      console.log(error.message);
    })
  }

  handlePaciente(paciente){
    this.setState({
      form:{
        ...this.state.form,
        id_paciente: paciente.id,
        nombre_paciente: paciente.nombre,
        rut_paciente: paciente.rut
      }
    });
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

  peticionPut=()=>{

    let form = {
      formBasic1: this.state.form.formBasic1,
      formBasic2: this.state.form.formBasic2,
      formBasic3: this.state.form.formBasic3,
      formBasic4: this.state.form.formBasic4,
      formBasic5: this.state.form.formBasic5,
      formBasic6: this.state.form.formBasic6,
      formBasic7: this.state.form.formBasic7,
      formBasic8: this.state.form.formBasic8,
      formRadio1: this.state.form.formRadio1,
      formRadio2: this.state.form.formRadio2,
      rut_paciente: this.state.form.rut_paciente,
      tipo: this.state.form.tipo};

    console.log(form);
    axios.put('http://localhost:3000/consultas/agendar/'+this.state.form.id, form, {
        headers: {
            'auth-token': localStorage.getItem('token'),
        }
    }).then(response=>{
      window.open('https://www.flow.cl/app/web/pagarBtnPago.php?token=0ipjc8n', '_blank');
      this.peticionGet();
      this.state.form.fecha = "ok";   
    })
  }

  createButtonPaciente=()=>{
    if (this.state.form.tipo !== ""){
      return (
      <>
        <hr></hr>
        <h5>3. Seleccione paciente</h5>
        <h6><a className="enlace" href="/mi-perfil">(Agregar paciente nuevo)</a></h6>
        <Col md={12}>
          <Dropdown>
            <Dropdown.Toggle 
              className={this.state.form.nombre_paciente? "btn btn-success mt-2 mb-2" : "btn btn-primary mt-2 mb-2"} 
              variant="primary" 
              id="dropdown-basic">
              {this.state.form.nombre_paciente? this.state.form.nombre_paciente:"Paciente"}
            </Dropdown.Toggle>
          
            <Dropdown.Menu>
              {this.state.data_pacientes.map(paciente=>{
                return(
                    <Dropdown.Item onClick={()=>this.handlePaciente(paciente)}>{paciente.nombre}</Dropdown.Item>
                  )
                })}
              

            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </>);
    }
    return null;
  }

  
  createForm=()=>{
    if ((this.state.form.rut_paciente !== "") && (this.state.form.tipo === "Asesoría Lactancia")){
      return (
      <>
        <hr></hr>
        
        <Row className="justify-content-center">    
        <Col md={8}><h5>4. Complete el formulario</h5></Col>  
          <Col md={8}>   
            <Form>
              <Form.Group>
                <Form.Label>Enfermedades del bebé médicamente diagnosticadas, alergias alimentarias, intolerancias o condiciones especiales</Form.Label>
                <Form.Text className="text-muted">En caso de que no tenga, escriba "No" (sin las comillas)</Form.Text>
                <Form.Control as="textarea" rows={3} name="formBasic1" id="formBasic1" onChange={this.handleChange} placeholder="Su respuesta" />
              </Form.Group>

              <Form.Group>
                <Form.Label>¿Su bebé está tomando algún medicamento, vitamina o suplemento? ¿Cuál?</Form.Label>
                <Form.Text className="text-muted">En caso de que no tome, escriba "No" (sin las comillas)</Form.Text>
                <Form.Control as="textarea" rows={3} name="formBasic2" id="formBasic2" onChange={this.handleChange} placeholder="Su respuesta" />
              </Form.Group>

              <Form.Group>
                <Form.Label>Tipo de lactancia</Form.Label>
                <Form.Check type="radio" name="formRadio1" id="formRadio1" onChange={this.handleChange} label="Lactancia Materna con horarios" value="Lactancia Materna con horarios"/>
                <Form.Check type="radio" name="formRadio1" id="formRadio1" onChange={this.handleChange} label="Lactancia Mixta (Materna + Fórmula" value="Lactancia Mixta (Materna + Fórmula" />
                <Form.Check type="radio" name="formRadio1" id="formRadio1" onChange={this.handleChange} label="Lactancia Materna a demanda" value="Lactancia Materna a demanda" />
                <Form.Check type="radio" name="formRadio1" id="formRadio1" onChange={this.handleChange} label="Sólo Fórmula" value="Sólo Fórmula" /> 
                <Form.Control type="text" className="mt-2" name="formRadio1" id="formRadio1" onChange={this.handleChange} placeholder="Otro" />
               
              </Form.Group>

              <Form.Group>
                <Form.Label>Si toma fórmula u otra leche...¿cuál, cuánto y cuántas veces al día?</Form.Label>
                <Form.Text className="text-muted">En caso de que no tome, escriba "No" (sin las comillas)</Form.Text>
                <Form.Control as="textarea" rows={3} name="formBasic4" id="formBasic4" onChange={this.handleChange} placeholder="Su respuesta" />
              </Form.Group>

              <Form.Group>
                <Form.Label>Peso del bebé en su último control (gr)</Form.Label>
                <Form.Control type="number" name="formBasic5" id="formBasic5" onChange={this.handleChange} placeholder="Su respuesta" />
              </Form.Group>

              <Form.Group>
                <Form.Label>Talla del bebé en su último control (cm)</Form.Label>
                <Form.Control type="number" name="formBasic6" id="formBasic6" onChange={this.handleChange} placeholder="Su respuesta" />
              </Form.Group>

              <Form.Group>
                <Form.Label>Fecha de su último control</Form.Label>
                <Form.Control type="date" name="formBasic7" id="formBasic7" onChange={this.handleChange} placeholder="Su respuesta" />
              </Form.Group>

              <Form.Group>
                <Form.Label>¿Por qué necesita asesoría nutricional? Describa la situación, dificultades o inquietudes que presentan</Form.Label>
                <Form.Control as="textarea" rows={3} name="formBasic8" id="formBasic8" onChange={this.handleChange} placeholder="Su respuesta" />
              </Form.Group>
              

              <Button variant="primary" onClick={()=>this.peticionPut()}>Enviar</Button>
            </Form>
          </Col>
        </Row>
      </>
      )
    }
    
    else if ((this.state.form.rut_paciente !== "") && (this.state.form.tipo === "Asesoría Nutricional Infantil")){
      return (
        <>
          <hr></hr>
          
          <Row className="justify-content-center">    
          <Col md={8}><h5>4. Complete el formulario</h5></Col>  
            <Col md={8}>   
              <Form>
                <Form.Group>
                  <Form.Label>Enfermedades del bebé médicamente diagnosticadas, alergias alimentarias, intolerancias o condiciones especiales</Form.Label>
                  <Form.Text className="text-muted">En caso de que no tenga, escriba "No" (sin las comillas)</Form.Text>
                  <Form.Control as="textarea" rows={3} name="formBasic1" id="formBasic1" onChange={this.handleChange} placeholder="Su respuesta" />
                </Form.Group>
  
                <Form.Group>
                  <Form.Label>¿Su bebé está tomando algún medicamento, vitamina o suplemento? ¿Cuál?</Form.Label>
                  <Form.Text className="text-muted">En caso de que no tome, escriba "No" (sin las comillas)</Form.Text>
                  <Form.Control as="textarea" rows={3} name="formBasic2" id="formBasic2" onChange={this.handleChange} placeholder="Su respuesta" />
                </Form.Group>
  
                <Form.Group>
                  <Form.Label>¿Usted está tomando algún medicamento, vitamina o suplemento? ¿Cuál?</Form.Label>
                  <Form.Text className="text-muted">En caso de que no tome, escriba "No" (sin las comillas)</Form.Text>
                  <Form.Control as="textarea" rows={3} name="formBasic3" id="formBasic3" onChange={this.handleChange}placeholder="Su respuesta" />
                </Form.Group>
  
                <Form.Group>
                  <Form.Label>Tipo de lactancia</Form.Label>
                  <Form.Check type="radio" name="formRadio1" id="formRadio1" onChange={this.handleChange} label="Lactancia Materna con horarios" value="Lactancia Materna con horarios"/>
                  <Form.Check type="radio" name="formRadio1" id="formRadio1" onChange={this.handleChange} label="Lactancia Mixta (Materna + Fórmula" value="Lactancia Mixta (Materna + Fórmula" />
                  <Form.Check type="radio" name="formRadio1" id="formRadio1" onChange={this.handleChange} label="Lactancia Materna a demanda" value="Lactancia Materna a demanda" />
                  <Form.Check type="radio" name="formRadio1" id="formRadio1" onChange={this.handleChange} label="Sólo Fórmula" value="Sólo Fórmula" />
                  <Form.Control type="text" className="mt-2" name="formRadio1" id="formRadio1" onChange={this.handleChange} placeholder="Otro" />
                </Form.Group>
  
                <Form.Group>
                  <Form.Label>Si toma fórmula u otra leche...¿cuál, cuánto y cuántas veces al día?</Form.Label>
                  <Form.Text className="text-muted">En caso de que no tome, escriba "No" (sin las comillas)</Form.Text>
                  <Form.Control as="textarea" rows={3} name="formBasic4" id="formBasic4" onChange={this.handleChange} placeholder="Su respuesta" />
                </Form.Group>
  
                <Form.Group>
                  <Form.Label>¿Cuántos pañales usa al día? (24 hrs.)</Form.Label>
                  <Form.Check type="radio" name="formRadio2" id="formRadio2" onChange={this.handleChange} label="1-3" value="1-3"/>
                  <Form.Check type="radio" name="formRadio2" id="formRadio2" onChange={this.handleChange} label="4-5" value="4-5"/>
                  <Form.Check type="radio" name="formRadio2" id="formRadio2" onChange={this.handleChange} label="6 o más" value="6 o más"/>
                </Form.Group>
  
                <Form.Group>
                  <Form.Label>¿Cuántas deposiciones hace al día? (24 hrs.)</Form.Label>
                  <Form.Check type="radio" name="formRadio3" id="formRadio3" onChange={this.handleChange} label="1-3" />
                  <Form.Check type="radio" name="formRadio3" id="formRadio3" onChange={this.handleChange} label="4-5" />
                  <Form.Check type="radio" name="formRadio3" id="formRadio3" onChange={this.handleChange} label="6 o más" />
                </Form.Group>
  
                <Form.Group>
                  <Form.Label>Peso del bebé en su último control (gr)</Form.Label>
                  <Form.Control type="number" name="formBasic5" id="formBasic5" onChange={this.handleChange} placeholder="Su respuesta" />
                </Form.Group>
  
                <Form.Group>
                  <Form.Label>Talla del bebé en su último control (cm)</Form.Label>
                  <Form.Control type="number" name="formBasic6" id="formBasic6" onChange={this.handleChange} placeholder="Su respuesta" />
                </Form.Group>
  
                <Form.Group>
                  <Form.Label>Fecha de su último control</Form.Label>
                  <Form.Control type="date" name="formBasic7" id="formBasic7" onChange={this.handleChange} placeholder="Su respuesta" />
                </Form.Group>
  
                <Form.Group>
                  <Form.Label>¿Por qué necesita asesoría de lactancia? Describa la situación, dificultades o inquietudes que presentan</Form.Label>
                  <Form.Control as="textarea" rows={3} name="formBasic8" id="formBasic8" onChange={this.handleChange} placeholder="Su respuesta" />
                </Form.Group>
                
  
                <Button variant="primary" onClick={()=>this.peticionPut()}>Enviar</Button>
              </Form>
            </Col>
          </Row>
        </>
      )
    }
    
    else {
      return null;
    }
  }
    
  peticionGet=()=>{
    axios.get('http://localhost:3000/admin/consultas/siguientes', {
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
    this.peticionGetPacientes();
  }
      
    
  render(){
    
    return this.state.form.fecha === "ok"?(<Redirect to="/consultas/agendadas" />):(
      <Container>
        <Row>
          <Col md={12}><h4>Agendar una consulta</h4></Col>
          <Col md={6}>{this.createCards()}</Col>
          <Col md={6}>
            {this.createButtonTipo()}
            {this.createButtonPaciente()}
          </Col>
          <Col md={12}>
            {this.createForm()}
          </Col>
          
        </Row>
      </Container>   
    );
  }
}

export default CalendarioUser;