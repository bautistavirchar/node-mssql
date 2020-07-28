const express = require('express')
const router = require('./src/routes/routes');
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('short'));
app.use(router);

app.listen(3000,() => {
    console.log('listening port 3000...')
})