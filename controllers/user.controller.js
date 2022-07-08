const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Create and Save a new Tutorial
exports.register = async function(req, res) {
    const body = req.body;

    if (!(body.email && body.password)) {
      return res.status(400).send({ error: "Data not formatted properly" });
    }
    
    const email = body.email;
    const alreadyExistsUser = await User.findOne({ where: { email } }).catch(
        (err) => {
          console.log("Error: ", err);
        }
    );

    if(alreadyExistsUser)
    return res.status(409).json({message : 'email already exists'});


    
      const hash = await bcrypt.hash(body.password, 10);
      const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: email,
        password: hash
      };
    
      // Save Tutorial in the database
      User.create(user)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the user account"
          });
        });
     


        /*bcrypt.hash(req.body.password , null, null, (err, hash) => {

        const newUser = new User({ firstName, lastName, email, hash });
      const savedUser = newUser.save().catch((err) => {
        console.log("Error: ", err);
        res.status(500).json({ error: "Cannot register user at the moment!" });
    });
  if (savedUser) res.json({ message: "Thanks for registering" });

   
        /*createUser({
            firstName: firstName,
            lastName: lastName,
            email: email ,
            password : hash ,
        }).then(user =>
            res.status(200).json({ message: 'account created successfully' }) );
    })*/


    
/*
exports.create = async function(req, res) {
    const { firstName, lastName, email , password } = req.body;

    const alreadyExistsUser = await User.findOne({ where: { email } }).catch(
        (err) => {
          console.log("Error: ", err);
        }
    );
    
      if (alreadyExistsUser) {
        return res.status(409).json({ message: "User with email already exists!" });
      }

      const newUser = new User({ firstName, lastName, email, password });
      const savedUser = await newUser.save().catch((err) => {
        console.log("Error: ", err);
        res.status(500).json({ error: "Cannot register user at the moment!" });
    });
  if (savedUser) res.json({ message: "Thanks for registering" });
};*/

/*
exports.create = (req, res) => {
    // Validate request
    if (!req.body.email && !req.body.password) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    // Create a Tutorial
    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    };
  
    // Save Tutorial in the database
    User.create(user)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the user account"
        });
      });
  };*/
}  

let refreshtokens = [];

exports.login = async function(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: "Please provide email and password",
    });
  }
  const isEmail = validator.isEmail(email);
  if (!isEmail) {
    return res.status(400).json({
      error: "Please provide a valid email",
    });
  }
  const user = await User.findOne({
    where: {
      email: email,
    },
  });
  if (!user) {
    return res.status(400).json({
      error: "User not found",
    });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({
      error: "Password is incorrect",
    });
  }
  //user = userpayload
  const userpayload = {id: user.id, firstName: user.firstName, email: email};

  const token = jwt.sign(userpayload, process.env.TOKEN_KEY,{expiresIn: '60s'});
  const refreshtoken = jwt.sign(userpayload, process.env.REFRESH_TOKEN_KEY,{expiresIn: '24h'});
  refreshtokens.push(refreshtoken);
  res.send({token, refreshtoken}).status(200);
  // return res.status(200).json({
  //   message: "loged"
  // });
}

exports.gettoken = async function(req, res) {

  const refreshToken = req.body.refreshtoken;
  if(refreshToken==null) res.sendStatus(401);
  //check refreshtokens array
  if(!refreshtokens.includes(refreshToken)) res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, userpayload) => {
    if(err) res.sendStatus(403);
    const token = jwt.sign({email: User.email}, process.env.TOKEN_KEY,{expiresIn: '60s'});
    res.send({token});
  });
}

exports.logout = async function(req, res) {
  const refreshToken = req.body.refreshtoken;
  refreshtokens = refreshtokens.filter(t => t !== refreshToken);
  res.sendStatus(204);
}
