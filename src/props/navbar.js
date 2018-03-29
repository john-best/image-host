import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class TestNavbar extends Component {

    render() {
        const login_logout = this.props.logged_in ? (
            <LinkContainer to="/logout">
                <NavItem eventKey={1}>
                    Logout
                </NavItem>
            </LinkContainer>
        ) : (
            <LinkContainer to="/login">
                <NavItem eventKey={1} href="/login">
                    Login
                </NavItem>
            </LinkContainer>
            )

        const profile_register = this.props.logged_in ? (
            <LinkContainer to="/profile">
                <NavItem eventKey={2}>Profile</NavItem>
            </LinkContainer>
        ) : (
            <LinkContainer to="/Register">
                <NavItem eventKey={3}>Register</NavItem>
            </LinkContainer>
            )

        return (
            <div>
                <Navbar inverse>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <LinkContainer to="/">
                                <a>image-host</a>
                            </LinkContainer>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav>
                        {login_logout}
                        {profile_register}
                    </Nav>
                </Navbar>
            </div>
        );
    }
}

export default TestNavbar;