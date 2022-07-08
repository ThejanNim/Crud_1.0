module.exports = app => {
    const users = require("../controllers/user.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", users.register);//check
    router.post("/login", users.login);
    router.post("/gettoken", users.gettoken);
    router.delete("/logout", users.logout);
    
    app.use('/api/users', router);
  };