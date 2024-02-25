import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Col, Container, Row } from 'react-bootstrap';

class TalleresUser extends Component {

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
    });
    window.open('https://www.flow.cl/app/web/pagarBtnPago.php?token=0ipjc8n', '_blank');
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
    
    return(
      <Container>
        <Row>
          <Col md={12} className="mb-2">
          <h3>Talleres disponibles</h3></Col>
        
          {this.state.data.map(taller=>{return(
            <Col md={4} className="mb-3">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="d-flex flex-column align-items-center text-center">
                    <div>
                        <img src={"https://avatars.dicebear.com/api/initials/" + taller.nombre + ".svg"} alt="Foto de perfil" className="rounded-circle" width="150"/>
                        <div className="mt-3">
                            <h4>{taller.nombre}</h4>
                            <hr></hr>
                            <p><b>Fecha:</b> {moment(taller.fecha).format("DD [de] MMMM [de] YYYY")}</p>
                            <hr></hr>
                            <p><b>Hora:</b> {moment(taller.hora, "HH:mm:ss").format("HH:mm")} hrs.</p>
                            <hr></hr>
                            <p><b>Valor:</b> ${taller.valor} CLP</p>
                            <hr></hr>
                            <p><b>Cupos:</b> {taller.cupos}</p>
                            <hr></hr>
                            <button className="btn btn-primary" onClick={()=>this.seleccionarTaller(taller)}>Inscribirme</button>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>)
          })}
        </Row>
      </Container>   
    )
  }
}

export default TalleresUser;