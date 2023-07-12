const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const database = {
    users:[
        {
            id:'123',
            name:'derek',
            email:'derek@gmail.com',
            password:'cookies',
            entries:0,
            joined: new Date()
        },
        {
            id:'124',
            name:'john',
            email:'john@gmail.com',
            password:'boxes',
            entries:0,
            joined: new Date()
        }
    ]
}

app.get('/',(req,res)=>{
    res.send('this is working');
})

app.post('/signin',(req,res)=>{
    
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.send('this is signing');
    }else{
        res.send('there is error signin');
    }
})

app.use(express.static(__dirname + '/public'))

app.listen(3000);