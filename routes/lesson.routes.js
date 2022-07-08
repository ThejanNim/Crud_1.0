module.exports = app => {
    const tutorials = require("../controllers/lesson.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", tutorials.create);//check
  
    // Retrieve all Tutorials
    router.get("/", tutorials.findAll);//check
  
    // Retrieve all published Tutorials
    router.get("/published", tutorials.findAllPublished); //check
  
    // Retrieve a single Tutorial with id
    router.get("/:id", tutorials.findOne); //check
  
    // Update a Tutorial with id
    router.put("/:id", tutorials.update); //check
  
    // Delete a Tutorial with id
    router.delete("/:id", tutorials.delete); //check
  
    // Delete all Tutorials
    router.delete("/", tutorials.deleteAll); //check
  
    app.use('/api/tutorials', router);
  };