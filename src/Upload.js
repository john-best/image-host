import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { FormControl, FormGroup, Button, ControlLabel, Alert } from 'react-bootstrap';

const API_URL = 'http://mingler.org:8421'
class Upload extends Component {
    constructor(props) {
        super(props);
        this.upload = this.upload.bind(this);

        this.state = {
            image: '',
            upload_error: false,
            upload_error_msg: '',
        }
    }

    upload = event => {
        event.preventDefault();
        this.setState({ upload_error: false, upload_error_msg: '' });

        if (this.state.image === '') {
            this.setState({ upload_error: true, upload_error_msg: 'No image is being uploaded!' });
            return;
        }

        var form = new FormData();
        form.append('image', this.state.image);

        fetch(API_URL + '/api/upload', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization',
                // 'Content-Type': 'multipart/form-data', // this should be done automatically thanks to formData
                'Authorization': localStorage.getItem('jwt_token')
            },

            body: form
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.success) {
                    this.props.history.push("/" + responseJson.filename);
                } else {
                    this.setState({ upload_error: true, upload_error_msg: responseJson.message })
                }
            });
    }

    handleChange = event => {
        this.setState({ [event.target.id]: event.target.files[0] });
    }

    // you need to be logged in to upload
    componentWillMount() {

        // i'm pretty sure this doesn't work because by the time logged_in is checked, refresh() isn't done... need to make it a callback TODO
        this.props.refresh();
        if (!this.props.appState.logged_in) {
            this.props.history.push("/");
        }
    }

    render() {
        const errmsg = this.state.upload_error ? (<Alert bsStyle="danger">{this.state.upload_error_msg}</Alert>) : (<div></div>)

        return (
            <div>
                {errmsg}
                <form onSubmit={this.upload}>
                    <FormGroup controlId="image">
                        <ControlLabel>Upload Image</ControlLabel>
                        <FormControl type="file" value={this.state.upload} onChange={this.handleChange} />
                    </FormGroup>
                    <Button type="submit">Upload</Button>
                </form>
            </div>
        );
    }
}

export default withRouter(Upload);