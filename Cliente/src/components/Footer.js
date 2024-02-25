import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faInstagram, faFacebookF} from '@fortawesome/free-brands-svg-icons';
import '../styles/footer.css';

export const Footer = () => {
    return (
        <Container fluid={true}>
          <Row className="footer">
            <Col className="col-izq">
              <img src="img/logo-bymwhite.png" alt="logo" width="82" height="22"/> 
              <a className="text" href="http://www.bebeymami.com/">Inicio</a>
              <a className="text" href="mailto:pierina@bebeymami.com">Escríbeme: pierina@bebeymami.com</a>  
              <p className="p text">Alimentación Infantil y Lactancia</p>
            </Col> 

            <Col className="col-der">
              <a className="rrss-logo" href="https://www.facebook.com/bbymami/"><FontAwesomeIcon icon={faFacebookF} color="whitesmoke"></FontAwesomeIcon></a>
              <a className="rrss-logo" href="https://www.instagram.com/_bebeymami_/"><FontAwesomeIcon icon={faInstagram} color="whitesmoke"></FontAwesomeIcon></a>
              
              <p className="text">Derechos Reservados © {new Date().getFullYear()} Bebé&amp;Mami</p>              
            </Col>
          </Row>
        </Container>
   );
}

export default Footer;