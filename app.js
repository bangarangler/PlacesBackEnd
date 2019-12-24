const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require('./routes/places-routes');
//const userRoutes = require('./routes/user-routes');

const app = express();

app.use('/api/places', placesRoutes);
//app.use('/api/user', userRoutes);

app.listen(5000);
