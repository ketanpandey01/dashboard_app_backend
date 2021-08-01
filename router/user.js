var express = require("express");
var router = express.Router();
const userController = require("../controller/user"); 

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log("routing middleware");
    next(); // make sure we go to the next routes and don't stop here
  });
  
router.get("/", function (req, res) {
    res.json({ message: "hooray! welcome to our api!" });
  });
  
router.post("/signup", userController.signup);

router.post("/login", userController.login);

module.exports = router;