import React, { Component } from 'react';
import Main from './Main'

const API_URL = 'http://mingler.org:8421'
class AppState extends Component {
    constructor(props) {
        super(props);

        this.state = {
            logged_in: localStorage.getItem('logged_in') === "true"
        };
        this.setAppState = this.setAppState.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    // verify every time we mount... but there should be a better or more frequent time to verify? 
    componentWillMount() {
        this.refresh();
    }

    refresh() {
        if (this.state.logged_in) {
            fetch(API_URL + '/api/update', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('jwt_token')
                },
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson.message)
                    if (responseJson.success) {
                        localStorage.setItem('jwt_token', "JWT " + responseJson.token);
                        localStorage.setItem('logged_in', 'false');
                        this.setAppState({ logged_in: true });
                    } else {
                        this.setAppState({ logged_in: false});
                        localStorage.removeItem('jwt_token');
                        localStorage.setItem('logged_in', 'false')
                    }
                });
        }
    }

    setAppState(updater, callback) {
        this.setState(updater, () => {
            if (callback) {
                callback();
            }

            localStorage.setItem('logged_in', this.state.logged_in);
            console.log("setting logged_in to " + this.state.logged_in);

        });
    }

    
    render() {
        return (
            <Main appState={this.state} setAppState={this.setAppState} refresh={this.refresh} />
        );
    }
}

export default AppState;