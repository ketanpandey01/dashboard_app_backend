// call the packages we need
var express = require("express"); // call express
var app = express(); // define our app using express
var bodyParser = require("body-parser");
var cors = require('cors')
const userRoutes = require("./router/user");

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())
var port = process.env.PORT || 8080;

app.use("/api/user", userRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}/api`);
});
// console.log('Magic happens on port ' + port);
