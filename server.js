
require('dotenv').config(); // Load environment variables from .env file
require('./config/database.js');

const express = require('express');
const path = require('path');

const app = express();

// Sessions
const session = require('express-session');
const { MongoStore } = require('connect-mongo');

// Middleware
const methodOverride = require('method-override');
const morgan = require('morgan');
const passUserToView = require('./middleware/pass-user-to-view.js');
const isSignedIn = require('./middleware/is-signed-in');


// Controllers
const authCtrl = require('./controllers/auth');
const robotsCtrl = require('./controllers/robots');

// Set the port from environment variable or default to 3003
const port = process.env.PORT ? process.env.PORT : '3003';


app.use(express.static(path.join(__dirname, 'public'))); //all static files are in the public folder
app.use(express.urlencoded({ extended: false })); // this will allow us to see the data being sent in the POST or PUT
app.use(methodOverride('_method')); // Changes the method based on the ?_method
app.use(morgan('dev')) // logs the requests as they are sent to our sever in the terminal

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

// Locals
app.use(passUserToView);

// ---------- PUBLIC ROUTES ----------

// Routes go here

app.get('/', async (req, res) => {
  res.render('index.ejs'); //هاذي الاندكس الخارجية
});

app.use('/auth', authCtrl);
//app.get('robots/new',robotsCtrl)

// ---------- PROTECTED ROUTES ----------
app.use(isSignedIn);
app.use('/robots', robotsCtrl);



app.listen(port,()=>{
    console.log(`App is running on port 3003 ${port}!`)
}) // app will be waiting for requests on port 3003
