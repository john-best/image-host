import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class TestNavbar extends Component {

    render() {
        const button = this.props.logged_in ? (
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
                        {button}
                        <LinkContainer to="/profile">
                            <NavItem eventKey={2}>Profile</NavItem>
                        </LinkContainer>
                    </Nav>
                </Navbar>
            </div>
        );
    }
}

export default TestNavbar;