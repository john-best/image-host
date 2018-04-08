# image-host
_Image hosting front-end (React) and API backend (Express)_

### What is this? ###
image-host is a simple image hosting web application that includes the basics for uploading images: authentication (login/registration) and authorization (user-based uploading).
Essentially, you can make an account and upload images to your own account. You can (obviously) also view those images via link.

Express is used here for interacting with the database (registration, authentication, authorization refreshing). React is used when they visit the application, which calls the API for everything. React also simplifies the refreshing of JSON Web Tokens, so users who frequent the website will most likely never have to login again due to inactivity.

### What's next? ###
* File limit per user
* Timed expiry of images
* Auto deletion of images meeting criteria above
* Blacklisting of manual-expiring JSON Web Tokens
* Have an API endpoint for native applications (JSON web tokens aren't really great for them)
* Modify API to be better suited for further development

## Compiling / Running ##
You're going to need Express, React, and React-Bootstrap before running this web application.

To run the API, type 'npm start' within the api folder. Alternatively, you can just do node src/server.js from within the api folder as well.

To run the web application, type 'npm start' at the root folder.

Note: You will have to modify 'cfg/settings.js' to point to where the API is hosted.
