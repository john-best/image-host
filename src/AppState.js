import React, { Component } from 'react';
import Main from './Main'

class AppState extends Component {
    constructor(props) {
        super(props);

        this.state = {
            logged_in: localStorage.getItem('logged_in') === "true"
        };
        this.setAppState = this.setAppState.bind(this);
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
            <Main appState={this.state} setAppState={this.setAppState}/>
        );
    }
}

export default AppState;