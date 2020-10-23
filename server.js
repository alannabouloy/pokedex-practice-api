//invoking dotenv to add API_TOKEN
require('dotenv').config();

//import module dependencies
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const POKEDEX = require('./pokedex.json');

//sets app to express
const app = express();

//sets up morgan to log requests to api in console
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());

//app validation
app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization')

    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized request'})
    }
 

    //move to next middleware
    next()
});

//valid types of pokemon
const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`];

//handleGetTypes function
function handleGetTypes(req, res){
    res.json(validTypes);
}

//handleGetPokemon function
function handleGetPokemon(req, res){
    //get search query
    const {name, type} = req.query;
    //declare results variable
    let results = POKEDEX.pokemon;

    //filter based on name
    if(name) {
        results = results.filter(pokemon => {
            return pokemon.name.toLowerCase().includes(name.toLowerCase());
        });
    }

    //filter based on type
    if(type){
        if(!validTypes.includes(type)){
            return res.status(400).send('Please enter a valide pokemon type');
        }
        results = results.filter(pokemon => {
            return pokemon.type.includes(type);
        })
    }

    res.json(results);
        
}
//get types endpoint
app.get('/types', handleGetTypes);

//get Pokemon endpoint
app.get('/pokemon', handleGetPokemon)

app.use((error, req, res, next) => {
    let response
    if(process.env.NODE_ENV === 'production') {
        response = { error: { message: 'server error' }}
    } else {
        response = { error }
    }
    res.status(500).json(response);
})

//assigns port variable to 8000
const PORT = process.env.PORT || 8000;

//sets api to listen at port specified in above variable
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})
