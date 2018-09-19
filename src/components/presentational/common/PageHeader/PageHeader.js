import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-grid-system';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { onlyUpdateForKeys } from 'recompose';

const PageHeader = onlyUpdateForKeys(['user', 'inProgress'])(({ user }) => {

  const navigationLinksJsxLoggedIn = (
    <Nav className="bpm-portal-page-header__link-group">
      <LinkContainer to={'/tasks'}>
        <NavItem eventKey={1}>
          <img className="bpm-portal-page-header__icon--tasks" />Tasks
        </NavItem>
      </LinkContainer>
      <LinkContainer to={'/processInstances'}>
        <NavItem eventKey={2}>
          <img className="bpm-portal-page-header__icon--process-instances" />Process instances
        </NavItem>
      </LinkContainer>
      <LinkContainer to={'/logout'}>
        <NavItem eventKey={3}>Log Out</NavItem>
      </LinkContainer>
    </Nav>
  );

  const navigationLinksJsxLoggedOut = (
    <Nav className="bpm-portal-page-header__link-group">
      <LinkContainer to="/login">
        <NavItem eventKey={1}>Log In</NavItem>
      </LinkContainer>
    </Nav>
  );

  return (
    <Container fluid className="bpm-portal-page-header">
      <Row>
        <Col md={12}  >
          <Navbar fluid fixedTop>
            {user && user.isAuthenticated ? navigationLinksJsxLoggedIn : navigationLinksJsxLoggedOut}
            <div className="bpm-portal-page-header__logo-container">
              {globalVars.environment.name + ' / v' + globalVars.environment.version + ' (' +  globalVars.environment.deploymentDateTime + ')'}
              <img className="bpm-portal-page-header__logo-image" src={require('./images/portal_logo.png')} />
            </div>
          </Navbar>
        </Col>
      </Row>
    </Container>
  );
});

PageHeader.propTypes = {
  user: PropTypes.object.isRequired
};

export default PageHeader;
