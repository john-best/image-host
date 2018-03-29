import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { FormControl, FormGroup, Button, ControlLabel, Alert } from 'react-bootstrap';

// TODO: we could prob merge this with authhandler...
const API_URL = 'http://mingler.org:8421'
class Register extends Component {
    constructor(props) {
        super(props);
        this.register = this.register.bind(this);

        this.state = {
            username: '',
            password: '',
            email: '',
            register_error: false,
            register_error_msg: ''
        }
    }

    register = event => {
        event.preventDefault();

        fetch(API_URL + '/api/register', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                email: this.state.email
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.success) {
                    localStorage.setItem('jwt_token', "JWT " + responseJson.token);
                    localStorage.setItem('logged_in', "true")
                    this.props.setAppState({ logged_in: true });
                    this.props.history.push("/");
                } else {
                    this.setState({ register_error: true, register_error_msg: responseJson.message })
                }
            });
    }

    handleChange = event => {
        this.setState({ [event.target.id]: event.target.value });
    }

    // why are you registering when logged in?
    componentWillMount() {
        if (this.props.appState.logged_in) {
            this.props.history.push("/");
        }
    }

    render() {
        const errmsg = this.state.register_error ? (<Alert bsStyle="danger">{this.state.register_error_msg}</Alert>) : (<div></div>)
        
        return (
            <div>
                {errmsg}
                <form onSubmit={this.register}>
                    <FormGroup controlId="username">
                        <ControlLabel>Username</ControlLabel>
                        <FormControl autoFocus type="text" value={this.state.username} placeholder="Username" onChange={this.handleChange} />
                    </FormGroup>
                    <FormGroup controlId="password">
                        <ControlLabel>Password</ControlLabel>
                        <FormControl type="password" value={this.state.password} placeholder="Password" onChange={this.handleChange} />
                    </FormGroup>
                    <FormGroup controlId="email">
                        <ControlLabel>Email</ControlLabel>
                        <FormControl type="email" value={this.state.email} placeholder="me@example.com" onChange={this.handleChange} />
                    </FormGroup>
                    <Button type="submit">Register</Button>
                </form>
            </div>
        );
    }
}

export default withRouter(Register);