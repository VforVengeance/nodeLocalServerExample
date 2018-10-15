var exp = require('express');
var bodyParser = require('body-parser');
var app = exp();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var history = {
        draw: 0,
        win: 0, 
        lose: 0,
        counter: 0
    }
var counter = 0;
var tokens = ["abc", "def", "ghi"]; 
var posts = [
    {
        title: "Titolo del post",
        description: "La description del mio post",
        id: "1"
    },
    {
        title: "Titolo del secondo post",
        description: "La description del mio secondo post",
        id: "2"
    },
    {
        title: "titolo del terzo post",
        description: "la description del secondo post",
        id: "3"
    }
]

var users = [
    {
        name: "Giuseppe",
        surname: "Marchese",
        index: "0"
    },
    {
        name: "Genoveffa",
        surname: "Donati",
        index: "1"
    },
    {
        name: "Pancrazio",
        surname: "Cazio",
        index: "2"
    },
    {
        name: "Pippo",
        surname: "Pippone",
        index: "3"
    },
    {
        name: "Giuseppe",
        surname: "Marchese",
        index: "4"
    }
]

app.get('/posts', function(req, res) {
    console.log(req.query.appId);
    res.json(posts);
})

app.post('/posts', function(req, res){
    var newPost = req.body;
    posts.push(newPost);
    res.status(201).json();
})

app.put('/posts/:index', function(req, res) {
    var i = parseInt(req.params.index);
    //posts[i] = editPost;
    posts[i].title = req.body.title;
    posts[i].description = req.body.description;
    res.json();
})

app.get('/posts/:index', function(req, res) {
    var i = parseInt(req.params.index);
    res.json(posts[i]);
})

app.delete('/posts/:index', function(req, res) {
    var i = parseInt(req.params.index);
    posts.splice(i, 1);
    res.json();
})


app.get('/pippo', function(req, res) {
    counter++;
    var x = {message:'Ciao !!', counter: counter};
    res.json(x);
})

app.delete('/pippo', function(req, res) {
    counter--;
    var x = {message:'Sono nel delete !!', counter: counter};
    res.json(x);
})

//ESERCIZIO AUTORIZZAZIONE DI UNA STRINGA PASSATA DA CLIENT CON POSTMAN
app.get('/caio', function(req, res){
    if(tokens.indexOf(req.query.id) > -1)
        res.status(200).json("sei autorizzato");
    else 
        res.status(401).json("attento a chiddu ca fai");
})


//ESERCIZIO DI CONTROLLO E INSERIMENTO DI DUE NUMERI DA POSTMAN CHE DA COME RISULTATO CORRETTO SE IL RESTO E' ZERO SENNO' ERRORE 401
app.get('/tizio', function(req, res){
    var i = parseInt(req.query.token);
    var j = parseInt(req.query.module);
    if(isNaN(i)||isNaN(j)){
        return res.status(401).json("hai messo una lettera idiota");
    }
    else{ 
        if(i%j === 0)
            return res.status(200).json("il numero ha resto zero");
        else
            return res.status(401).json("il numero non ha resto zero");
        }

})

//ESERCIZIO DI INSERIMENTO DI UNA NUOVA STRINGA NELL'ARRAY TOKENS

//////POST PER INSERIRE UNA NUOVA STRINGA TRAMITE POSTMAN
app.post('/pluto', function(req, res){
    var x = req.body.token;
    tokens.push(x);
    res.status(201).json("l'elemento e' stato inserito con successo")
})

//////GET PER VISUALIZZARE LA NUOVA STRINGA NELL'ARRAY TOKENS
app.get('/tokens', function(req, res){
    console.log(req.query);
    res.json(tokens);
})

//////GET PER CONTROLLARE TRAMITE POSTMAN CHE L'AUTENTICAZIONE SIA FUNZIONANTE
app.get('/pluto', function(req, res){
    if(tokens.indexOf(req.query.id) > -1)
        res.status(200).json("sei autorizzato");
    else 
        res.status(401).json("attento a chiddu ca fai");
})

app.get('/users', function(req, res){
    if(((req.query.name)||(req.query.surname))||((req.query.name)&&(req.query.surname))){
        singleUser = [];
        for (var i = 0; i < users.length; i++) {
            if (
                ((users[i].name == req.query.name)||(users[i].surname == req.query.surname))||
                ((users[i].name == req.query.name)&&(users[i].surname == req.query.surname))){
                singleUser.push(users[i]);  
            }
        }
        res.status(200).json(singleUser);
    }
    else
        return res.status(200).json(users);
})

app.get('/users/:index', function(req, res) {
    var i = parseInt(req.params.index);
    if (isNaN(i)) {
        return res.status(400).json("che cazzo hai scritto?");
    }else 
        if(i >= users.length){
            return res.status(404).json("C'e' qualquadra che non cosa");
    }   else
            return res.json(users[i]);
    
})


app.post('/users', function(req, res){
    var x = req.body;
    users.push(x);
    res.status(201).json({message: " l'elemento e' stato inserito con successo"});
})

app.put('/users/:index', function(req, res) {
    var i = parseInt(req.params.index);
    users[i].name = req.body.name;
    users[i].surname = req.body.surname;
    users[i].index = req.body.index;
    res.json();
})

app.delete('/users/:index', function(req, res) {
    var i = parseInt(req.params.index);
    users.splice(i, 1);
    res.json();
})


//CALCOLARE NUMERO RANDOM
function getRandom(){
    if((Math.random()>= 0) && (Math.random()<= 0.20)){
        random = "Paper";
        return random;
    }
    else
        if((Math.random()> 0.20) && (Math.random()<= 0.40)){
            random = "Scissor";
            return random;
        }
        else
            if((Math.random()> 0.40) && (Math.random()<= 0.60)){
                random = "Rock";
                return random;
            }
            else
                if((Math.random()> 0.60) && (Math.random()<= 0.80)){
                    random = "Lizard";
                    return random;
                }
                else{
                    random = "Spock"
                    return random;
                }

}

//GIOCO DI CARTA FORBICE SASSO LIZARD SPOCK
app.get('/games/paperScissorRock', function(req, res){
    var computerChoice = getRandom();
    if(!(
        (req.query.myChoice === "Paper")||
        (req.query.myChoice === "Scissor")||
        (req.query.myChoice === "Rock")||
        (req.query.myChoice === "Lizard")||
        (req.query.myChoice === "Spock"))){
            res.status(400).json({message: "A che cazzo di gioco giochi???"})
        }
    else
        if(req.query.myChoice === computerChoice){
            history.draw++;
            history.counter++;
            res.json({computerChoice: computerChoice, result: "Draw", history: history});
        }
        else
            if(
                (req.query.myChoice === "Paper")&&(computerChoice === "Scissor")||
                (req.query.myChoice === "Scissor")&&(computerChoice === "Rock")||
                (req.query.myChoice === "Rock")&&(computerChoice === "Paper")||
                (req.query.myChoice === "Lizard")&&(computerChoice === "Rock")||
                (req.query.myChoice === "Spock")&&(computerChoice === "Lizard")||
                (req.query.myChoice === "Scissor")&&(computerChoice === "Spock")||
                (req.query.myChoice === "Lizard")&&(computerChoice === "Scissor")||
                (req.query.myChoice === "Spock")&&(computerChoice === "Paper")||
                (req.query.myChoice === "Rock")&&(computerChoice === "Spock")||
                (req.query.myChoice === "Paper")&&(computerChoice === "Lizard")){
                history.lose++;
                history.counter++;
                res.json({computerChoice: computerChoice, result: "Lose", history: history});
            }
            else
            {
                history.win++;
                history.counter++;
                res.json({computerChoice: computerChoice, result: "Win", history: history});
            }
})


var weather = require('npm-openweathermap');
// api_key is required. You can get one at http://www.openweathermap.com/
weather.api_key = '107b4de919442ede3852c72591ae798f';
// OPTIONAL: you can set return temperature unit.
// 'k' for Kelvin
// 'c' for Celsius
// 'f' for Fahrenheit
weather.temp = 'c';

app.get("/cities/:cityName", function(request, response){
    weather.get_weather_custom('city', request.params.cityName, 'forecast').then(function(res){
        response.json(res);
    },function(error){
        console.log(error)
    })
})

app.get("/zips/:zipCode", function(request, response){
    weather.get_weather_custom('zip', request.params.zipCode, 'weather').then(function(res){
        response.json(res);
    },function(error){
        console.log(error)
    })
})

app.listen(3003); 
