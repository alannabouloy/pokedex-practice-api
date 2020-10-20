//import module dependencies
const express = require('express');
const morgan = require('morgan');

//sets app to express
const app = express();

//sets up morgan to log requests to api in console
app.use(morgan('dev'));

//tells the api to always respond with hello world
app.use((req, res) => {
    res.send('Hello, bees!')
});

//assigns port variable to 8000
const PORT = 8000;

//sets api to listen at port specified in above variable
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})
