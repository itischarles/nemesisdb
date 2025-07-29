require('dotenv').config();
const express =  require('express');
const db = require('./db'); // Assuming db.js is in the same directory
const bcrypt =  require('bcrypt');
const cookieParser = require('cookie-parser');


// require Module routes here
const staticPageRoute =  require('./routes/staticPageRoute');
const authPageRoute =  require('./routes/authRoutes');
const userPageRoute =  require('./routes/userRoutes');


const app  =  express();
const PORT  = process.env.PORT;

// set view engine
app.set('view engine','ejs');

app.use(express.static('public')); // makes the public folder accessible
app.use(express.urlencoded({extended: true})); // Middleware to parse URL-encoded bodies
app.use(express.json()); // accepts json requests
app.use(cookieParser()); //cookie parser for jwt session



// set module routes
app.use(staticPageRoute);
app.use(authPageRoute);
app.use(userPageRoute);




app.listen(PORT, () =>{
    console.log(`Servicer is running on http://localhost:${PORT}`);
})
