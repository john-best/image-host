import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import TestNavbar from './props/navbar';
import Home from './Home';
import Profile from './Profile';
import AuthHandler from './AuthHandler';
import Image from './Image';
import Error_404 from './404';
import Register from './Register';

class Main extends Component {

    render() {
        return (
            <BrowserRouter>
            <Grid>
                <TestNavbar logged_in={this.props.appState.logged_in} update={this.props.setAppState} />

                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/profile" component={Profile} />
                    <Route path="profile/:username" component={Profile} />
                    <Route path="/login" render={() => (<AuthHandler appState={this.props.appState} setAppState={this.props.setAppState} />)} />
                    <Route path="/logout" render={() => (<AuthHandler appState={this.props.appState} setAppState={this.props.setAppState} />)} />
                    <Route path="/register" render={() => (<Register appState={this.props.appState} setAppState={this.props.setAppState} />)} />
                    <Route path="/404" component={Error_404} />
                    <Route path="/:imgurl" component={Image} /> 
                    <Route path="*" component={Error_404} />
                </Switch>

            </Grid>
            </BrowserRouter>
        );
    }
}

export default Main;