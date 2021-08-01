var fs = require("fs");
var AWS = require("aws-sdk");
var s3 = new AWS.S3({});
const params = {
  Bucket: "elasticbeanstalk-ap-south-1-510441481777",
  Key: "user.json",
};

exports.login = (req, res, next) => {
  let potentialUser = [
    {
      username: req.body.username,
      password: req.body.password,
    },
  ];
  console.log("this is login params", params);
  s3.getObject(params, function (err, data) {
    if (data) {
      let usersList;
      try {
        if (err) {
          throw err;
        }
        if (!!data.Body.toString("utf-8")) {
          usersList = JSON.parse(data.Body.toString("utf-8"));
        }
      } catch (ex) {
        console.log("Error", ex);
      }
      console.log("Existing users", usersList);
      if (usersList) {
        let userExist;
        usersList.forEach((userObj) => {
          if (
            potentialUser[0].username === userObj.username &&
            potentialUser[0].password === userObj.password
          ) {
            console.log("inside taken", potentialUser[0], userObj);
            userExist = true;
          }
        });
        if (userExist) res.json({ message: "user exist" });
        else res.json({ error: "user doesn't exist" });
      } else {
        res.json({ error: "user doesn't exist" });
      }
    }
  });
  //   fs.readFile(
  //     "C:/Users/Ketan/Desktop/user.json",
  //     "utf8",
  //     function (err, data) {}
  //   );
};

exports.signup = (req, res, next) => {
  let newUser = [
    {
      username: req.body.username,
      password: req.body.password,
    },
  ];
  s3.getObject(params, function (err, data) {
    let usersList;
    try {
      if (err) {
        throw err;
      }
      if (!!data.Body.toString("utf-8")) {
        usersList = JSON.parse(data.Body.toString("utf-8"));
      }
    } catch (ex) {
      console.log("Error", ex);
    }
    console.log("Existing users", usersList);
    //validation against username
    let isUsernameAval = true;
    if (usersList) {
      usersList.forEach((userObj) => {
        if (newUser[0].username === userObj.username) {
          console.log("inside taken", newUser[0], userObj);
          isUsernameAval = false;
          // res.json({ message: "username taken" });
        }
      });
      if (isUsernameAval) {
        usersList.push(...newUser);
        newUser = usersList;
      }
    }
    console.log("usernameAva", isUsernameAval);
    if (isUsernameAval) {
      let writeParams = JSON.parse(JSON.stringify(params));
      writeParams.Body = JSON.stringify(newUser);
      console.log("this is write Params", writeParams);
      s3.putObject(writeParams, function (err, data) {
        console.log(data);
        if (err) {
          res.status(404).send("User not saved");
          return;
        } else res.send({ message: "user registered" });
      });

      //   fs.writeFile(
      //     "C:/Users/Ketan/Desktop/user.json",
      //     JSON.stringify(newUser),
      //     (err) => {

      //     }
      //   );
    } else {
      res.json({ error: "username taken" });
    }
  });

  //   fs.readFile("C:/Users/Ketan/Desktop/user.json", "utf8", function (err, data) {

  //     // res.json({ message: "User info" + userObj });
  //   });
};
