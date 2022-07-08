const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const home = require('./routes/home');
const auth = require('./middleware/auth.js');

const app = express();

/*var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.get("/", (req, res) => {
    res.status(200).json("Welcome to Crud_1.0");
});

//normall routes
app.use('/api/home', auth, home);

require("./routes/lesson.routes")(app);
require("./routes/user.routes")(app);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});