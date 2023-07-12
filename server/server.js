const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.get('/',(req,res)=>{
    res.send('this is working');
})

app.use(express.static(__dirname + '/public'))

app.listen(3000);