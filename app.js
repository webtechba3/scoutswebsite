const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose"); 
const session = require('express-session');
const crypto = require('crypto');


const indexRouter = require('./routes/index');
const inlogRouter = require('./routes/inloggen');
const imagesRouter = require('./routes/images');
const voegUsersToeRouter = require('./routes/voegUsersToe');
const inschrijvenRouter = require('./routes/inschrijven'); // Dit importeert de inschrijvenRouter
const takkenRouter = require('./routes/takken');
const activiteitenRouter = require('./routes/activiteiten');
const takRouter = require('./routes/tak');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', inlogRouter);
app.use('/images', imagesRouter); 
app.use('/inschrijven', inschrijvenRouter); 
app.use('/inloggen', inlogRouter); 
app.use('/takken', takkenRouter);
app.use('/activiteiten', activiteitenRouter);
app.use('/tak', takRouter);


app.use('/voegUserToe', voegUsersToeRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
const secretKey = crypto.randomBytes(64).toString('hex'); // Gebruik een veilige, willekeurige sleutel

// Sessies configureren
app.use(session({
  secret: secretKey, // Gebruik de gegenereerde geheime sleutel
  resave: false,
  name: 'SessionID', // Geef de sessie een naam
  saveUninitialized: true,
  cookie: { secure: true } // Zet op true als je HTTPS gebruikt
}));


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
mongoose.set('strictQuery' ,false);

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://thibautbeckske:kl5wkamcbiJZcATq@webtechba3.kgzjk.mongodb.net/?retryWrites=true&w=majority&appName=webtechba3";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

/*async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("Closed connection to MongoDB");
  }
}
run().catch(console.dir);*/

async function connectToDatabase() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Verbonden met MongoDB!");

    // Database en collectie variabelen opslaan voor later gebruik
    const db = client.db('website');  

    const inschrijvingenCollection = db.collection('inschrijvingen'); 
    app.locals.inschrijvingenCollection = inschrijvingenCollection;
    const usersCollection = db.collection('users'); // Of de naam van je users collectie
    app.locals.usersCollection = usersCollection; // Maak beschikbaar via app.locals
     // Maak de database en collectie beschikbaar voor je routes via app.locals
    
   



  } catch (error) {
    console.error("Fout bij database connectie:", error);
  } 
}
connectToDatabase().catch(console.dir);
module.exports =app;

