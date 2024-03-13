const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next){
  //Write the authenication mechanism here
  // Use the session authorization feature (implemented in the Practice project lab)
  //  to authenticate a user based on the access token.
  if (req.session.authorization) {
    let token = req.session.authorization['accessToken'];
    let sec = req.session.secret;
    jwt.verify(token, sec, (err, user) => {
      if (!err) {
        req.user = user;
        next();

      } else {
        return res.status(403).send("User not authenticated");
      }
    });

  } else {
    return res.status(403).send("User is not logged in");
  }

});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
