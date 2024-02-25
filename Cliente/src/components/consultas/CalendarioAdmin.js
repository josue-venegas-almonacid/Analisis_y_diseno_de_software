import React, { Component } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Redirect} from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';

import CalendarioUser from './CalendarioUser';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/calendar.css';
require('moment/locale/es.js');
const localizer = momentLocalizer(moment);


class CalendarioAdmin extends Component {

  state={
    data:[],
    toggleModal: false,
    tipoModal: '',
    event:{
      id: '',
      title: 'Consulta',
      start: '',
      end: '',
      tipo: '',         //En POST siempre es NULL, se usa para agendar

      id_usuario: '',   //En POST siempre es NULL, se usa para agendar
      id_paciente: '',  //En POST siempre es NULL, se usa para agendar
      rut_paciente: '', //En POST siempre es NULL, se usa para agendar

      valor: '',
      link: '',         //En POST siempre es NULL, se debería autogenerar
      estado: '',       //En POST siempre es "Disponible"
    }
  }

  convertDate = (date) => {
    return moment.utc(date).toDate()
  }

  peticionGet=()=>{
    axios.get('http://localhost:3000/admin/consultas').then(response=>{

      //Transformar las fechas en UTC-3
      let appointments = response.data;
      for (let i = 0; i < appointments.length; i++) {
        appointments[i].start = this.convertDate(appointments[i].start)
        appointments[i].end = this.convertDate(appointments[i].end)
      }
      this.setState({
        data:appointments
      })
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  peticionPost=async()=>{
    delete this.state.event.id;

    //Concatenar fecha y hora
    this.state.event.start = moment(this.state.event.fecha).format("YYYY/MM/DD") + " " + this.state.event.hora;
    //Calcular automáticamente hora final a 1 hora y media después del inicio
    this.state.event.end = moment(this.state.event.fecha).format("YYYY/MM/DD") + " " + moment(this.state.event.hora, 'HH:mm').add(90, 'minutes').format('HH:mm');

    await axios.post('http://localhost:3000/admin/consultas/agregar',this.state.event).then(()=>{
      this.toggleModal();
      this.peticionGet();
    }).catch(error=>{
      console.log(error.message);
    })
  }

  peticionPut=()=>{
    //Concatenar fecha y hora
    this.state.event.start = moment(this.state.event.fecha).format("YYYY/MM/DD") + " " + this.state.event.hora;
    //Calcular automáticamente hora final a 1 hora y media después del inicio
    this.state.event.end = moment(this.state.event.fecha).format("YYYY/MM/DD") + " " + moment(this.state.event.hora, 'HH:mm').add(90, 'minutes').format('HH:mm');

    console.log(this.state.event);
    axios.put('http://localhost:3000/admin/consultas/editar/'+this.state.event.id, this.state.event).then(()=>{
      this.toggleModal();
      this.peticionGet();
    })
  }
  
  peticionDelete=()=>{
    axios.delete('http://localhost:3000/admin/consultas/eliminar/'+this.state.event.id).then(()=>{
      this.toggleModal();
      this.peticionGet();
    })
  }

  componentDidMount() {
    this.peticionGet();
  }

  toggleModal=()=>{
    this.setState({
      toggleModal: !this.state.toggleModal
    }
    );
  }

  handleChange=async e=>{
    e.persist();
    await this.setState({
      event:{
        ...this.state.event,
        [e.target.name]: e.target.value
      }
    });
  }

  onSelectEvent = (consulta) => {
    this.setState({
      event: consulta, 
      tipoModal: 'actualizar'});
    this.toggleModal();  
  }

  render() {
    const isLogged = this.props.isLogged;
    const isAdmin = this.props.isAdmin;
    
    return isLogged && isAdmin?( //Si está logeado y es admin
      <div style={{height:`${600}px`}} className="bigCalendar-container">
        <Calendar
          localizer={localizer}
          events={this.state.data}
          startAccessor="start"
          endAccessor="end"
          selectable={true}
          onSelectEvent={ this.onSelectEvent }
          messages={{
              allDay: 'Todo el día',
              previous: '<',
              next: '>',
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
              agenda: 'Agenda',
              date: 'Fecha',
              time: 'Hora',
              event: 'Evento',
              noEventsInRange: 'No hay eventos en este rango',
              showMore: total => `+ Ver más (${total})`
            }}

        />
        <button className="btn btn-success fab" onClick={()=>{this.setState({event: null, tipoModal: 'insertar'}); this.toggleModal()}}><FontAwesomeIcon icon={faPlus}/> Agregar consulta</button>

        <Modal isOpen={this.state.toggleModal}>
          <ModalHeader style={{display: 'block'}}>
            {this.state.tipoModal === 'insertar'? "Agregar una consulta" : "Actualizar una consulta"}
            <Button className="btn btn-light" style={{float: 'right'}} onClick={()=>this.toggleModal()}>X</Button>
          </ModalHeader>

          <ModalBody>
            <div className="form-group">
              <label htmlFor="nombre">Fecha</label>
              <input className="form-control" type="date" name="fecha" id="fecha" onChange={this.handleChange} value={this.state.event?this.state.event.fecha: ''}/>
              <br />
              <label htmlFor="nombre">Hora</label>
              <input className="form-control" type="time" name="hora" id="hora" onChange={this.handleChange} value={this.state.event?this.state.event.hora: ''}/>
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal === 'insertar'?
              <Button className="btn btn-success" onClick={()=>this.peticionPost()}>Insertar</Button>
              : 
              (<div>
                <Button className="btn btn-primary" onClick={()=>this.peticionPut()}>Actualizar</Button>
                <Button className="btn btn-danger spaced" onClick={()=>this.peticionDelete()}>Eliminar</Button>
            </div>)
            }
            <button className="btn btn-light" onClick={()=>this.toggleModal()}>Cerrar</button>
          </ModalFooter>
        </Modal>
      </div>
    ): !isLogged? //Si no está logeado
    (<Redirect to="/login" />): //Si está logeado y no es admin => es usuario
    (<CalendarioUser/>);
  }
}

const mapStateToProps = state => {
  return {
      isLogged: state.authReducer.isLogged,
      isAdmin: state.adminReducer.isAdmin
  }
}

export default connect(mapStateToProps)(CalendarioAdmin);