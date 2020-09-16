// Admin microservice
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 9092

// DB
const sequelize = require('./util/database');

//Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
const restaurantRoutes = require('./routes/restaurantRoutes');

// Setting the routes
app.use(restaurantRoutes);


app.get('/', (req, res, next) => {
    res.send('Hey from restaurant service');
})

sequelize.sync()
    .then(result => {
        console.log(result);
        app.listen(PORT);
    })
    .catch(err => {
        console.log(err);
    })
