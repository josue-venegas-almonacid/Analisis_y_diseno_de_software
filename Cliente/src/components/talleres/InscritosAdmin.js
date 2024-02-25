import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Redirect} from 'react-router-dom';

import InscritosUser from './InscritosUser';

class InscritosAdmin extends Component {
  
  render(){
    
    const isLogged = this.props.isLogged;
    const isAdmin = this.props.isAdmin;
    
    return isLogged && isAdmin?( //Si está logeado y es admin
      <Container>
          <h2>InscritosAdmin</h2>
      </Container>  
    ): !isLogged? //Si no está logeado
    (<Redirect to="/login" />): //Si está logeado y no es admin => es usuario
    (<InscritosUser/>);
  }
}

const mapStateToProps = state => {
  return {
      isLogged: state.authReducer.isLogged,
      isAdmin: state.adminReducer.isAdmin
  }
}

export default connect(mapStateToProps)(InscritosAdmin);