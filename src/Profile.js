import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';


const API_URL = 'http://mingler.org:8421';
class Profile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            images: []
        }

        this.potential_username = '';
    }

    // do we allow users to check profiles if not logged in?
    componentDidMount() {
        if (!this.props.appState.logged_in) {
            this.props.history.push("/");
            return;
        }

        this.potential_username = this.props.match.params.username ? this.props.match.params.username : '';

        if (this.potential_username === '') {
            fetch(API_URL + '/api/get_user', {
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization',
                    'Authorization': localStorage.getItem('jwt_token')
                }
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.success) {
                        this.setState({ username: responseJson.username });
                    } else {
                        this.props.history.push("/404");
                    }
                })
        } else {
            this.setState({ username: this.potential_username });
        }
    }

    render() {

        if (this.state.username !== '') {
            fetch(API_URL + '/api/profile/' + this.state.username, {
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization',
                    'Authorization': localStorage.getItem('jwt_token')
                }
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({ images: responseJson.images });
                });

            return (
                <center><h2> {this.state.username}'s profile xd</h2></center>
            );
        }

        return (
            <center><h2> {this.state.username}'s profile </h2></center>
        );
    }
}

export default withRouter(Profile);