import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { FormControl, FormGroup, Button, ControlLabel, Alert } from 'react-bootstrap';


const API_URL = 'http://mingler.org:8421'
class AuthHandler extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        this.login = this.login.bind(this);

        this.state = {
            username: '',
            password: '',
            login_error: false,
            login_error_msg: ''
        }
    }

    login = event => {
        event.preventDefault();

        fetch(API_URL + '/api/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson.message)
                if (responseJson.success) {
                    localStorage.setItem('jwt_token', responseJson.token);
                    localStorage.setItem('logged_in', "true")
                    this.props.setAppState({ logged_in: true });
                    this.props.history.push("/");
                } else {
                    this.setState({ login_error: true, login_error_msg: responseJson.message })
                    this.forceUpdate();
                }
            });
    }

    // TODO: blacklist logged-out jwt tokens until they expire themselves? do we really need to do this for jwt tokens?
    logout() {
        localStorage.removeItem('jwt_token');
        localStorage.setItem('logged_in', "false")
        this.props.setAppState({ logged_in: false });
        this.props.history.push("/");
    }

    handleChange = event => {
        this.setState({ [event.target.id]: event.target.value });
    }

    // we don't need to render if we're just logging out...
    componentWillMount() {
        if (this.props.appState.logged_in) {
            this.logout();
        }
    }

    render() {
        // this should only render for login

        const errmsg = this.state.login_error ? (<Alert bsStyle="danger">{this.state.login_error_msg}</Alert>) : (<div></div>)
        return (
            <div>
                {errmsg}
                <form onSubmit={this.login}>
                    <FormGroup controlId="username">
                        <ControlLabel>Username</ControlLabel>
                        <FormControl autoFocus type="text" value={this.state.username} placeholder="Username" onChange={this.handleChange} />
                    </FormGroup>
                    <FormGroup controlId="password">
                        <ControlLabel>Password</ControlLabel>
                        <FormControl type="password" value={this.state.password} placeholder="Password" onChange={this.handleChange} />
                    </FormGroup>
                    <Button type="submit">Login</Button>
                </form>
            </div>
        );
    }
}

export default withRouter(AuthHandler);