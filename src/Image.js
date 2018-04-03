import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Panel } from "react-bootstrap";
import { API_URL } from "./cfg/settings";

class Image extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image_exists: false,
      image_url: "",
      uploader: "",
      upload_date: ""
    };
  }

  componentDidMount() {
    const imgurl = this.props.match.params.imgurl || this.props.imgurl;

    var that = this;
    var potential_url = API_URL + "/api/" + imgurl.toString();

    if (
      typeof this.props.uploader !== "undefined" &&
      typeof this.props.upload_date !== "undefined"
    ) {
      this.setState({
        uploader: that.props.uploader,
        upload_date: this.props.upload_date
      });
    }

    fetch(potential_url)
      .then(function(response) {
        if (response.status === 404) {
          that.props.history.push("/404");
        } else {
          // this must be a valid link, so we can just link to it
          that.setState({ image_exists: true, image_url: potential_url });
        }
      })

      // then we can do another fetch for the data on the image
      .then(function() {
        // only get this information if it wasn't passed...
        if (that.state.uploader === "" && that.state.upload_date === "") {
          var image_info_url =
            API_URL + "/api/get_image_info/" + imgurl.toString();
          fetch(image_info_url)
            .then(response => response.json())
            .then(responseJson => {
              if (responseJson.success === false) {
                that.setState({
                  uploader: "Error",
                  uploaded_by: responseJson.message
                });
              } else {
                that.setState({
                  uploader: responseJson.uploaded_by,
                  upload_date: responseJson.upload_date
                });
              }
            });
        }
      });
  }

  render() {
    var image_html = this.state.image_exists ? (
      <img
        src={this.state.image_url}
        alt=""
        style={{ maxHeight: "100%", maxWidth: "100%" }}
      />
    ) : (
      <div>Loading...</div>
    );
    return (
      <Panel>
        <Panel.Heading>
          Uploaded by {this.state.uploader} on {this.state.upload_date}
        </Panel.Heading>
        <Panel.Body>
          <center>{image_html}</center>
        </Panel.Body>
      </Panel>
    );
  }
}

export default withRouter(Image);
