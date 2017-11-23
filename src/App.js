import React, { Component } from 'react';


class UploadFiles extends React.Component {
    upload = () => {
        console.log("uploading...");
        var uploaded = document.getElementById("filesToUpload");
        var uploadstatus = document.getElementById("uploadStatus");
        uploadstatus.innerHTML = "";
  
        if (uploaded.files.length > 1) {
            console.log("Error: This application currently supports the uploading of only one file at a time.");
            uploadstatus.innerHTML = "Error: This application currently supports the uploading of only one file at a time.";
            return;
        }

        var img = uploaded.files[0];

        if (typeof img == "undefined") {
            console.log("Error: Please upload a file!");
            uploadstatus.innerHTML = "Error: Please upload a file!";
        }

        if (!img.type.match('image.*')) {
            console.log("Error: This file is of an unsupported format... is it an image?");
            uploadstatus.innerHTML = "Error: This file is of an unsupported format... is it an image?";
            return;
        }

        console.log("image passes all test cases!");

        var formData = new FormData();
        formData.append('image', img);
        fetch('/api/upload', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                //'Content-Type': 'multipart/form-data', boundary issues if this is sent
                'type': 'formData'
            },
            body: formData
        });

        console.log({ image: img });
        // probably do some kind of POST to upload api...

    }
    
    render() {
        return(
            <div className="toUpload">
                <input type="file" id="filesToUpload" />
                <button onClick={this.upload}>Upload</button>
            </div>
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <div>
                <div className="header">
                    <h1>Upload Image(s?) Here</h1>
                </div>


                <div className="body">
                    <div id="uploadStatus">
                    </div>
                    <div className="imageupload">
                        <UploadFiles />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
