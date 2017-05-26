const path = require('path');
const http = require('http');
const Express = require('express');

// initialize the server and configure support for ejs templates
const app = new Express();
const server = new http.Server(app);

// define the folder that will be used for static assets
// app.use('/public/', Express.static(path.join(__dirname, 'public')));
app.use(Express.static(path.join(__dirname, 'dist')));

// Always return the main index.html, so react-router render the route in the client
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
// });
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});
// start the server
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'production';

server.listen(port, (err) => {
  if (err) {
    console.error(err);
  }
  console.info(`Server running on http://localhost:${port} [${env}]`);
});

module.exports = app;
