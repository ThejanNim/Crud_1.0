const app = require('express');
const router = app.Router();

router.get('/',(req,res)=>{
    const user = req.userpayload;
    res.json(user);
      
  })
  
  module.exports = router