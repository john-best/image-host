import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';


const API_URL = 'http://mingler.org:8421'
class Image extends Component {
    constructor(props) {
        super(props);

        this.state = {
            image_exists: false,
            image_url: ''
        }
    }

    componentDidMount() {
        const imgurl = this.props.match.params.imgurl;

        var that = this;
        var potential_url = API_URL + '/api/' + imgurl.toString();

        fetch(potential_url).then(function(response) {
            if (response.status === 404) {
                that.props.history.push("/404");
            } else {
                // this must be a valid link, so we can just link to it
                that.setState({image_exists: true, image_url: potential_url});
            }
        });
    }

    render() {
        var image_html = this.state.image_exists ? (<img src={this.state.image_url} alt=""></img>) : (<div></div>)
        return (
            <div><center>{image_html}</center></div>
        );
    }
}

export default withRouter(Image);