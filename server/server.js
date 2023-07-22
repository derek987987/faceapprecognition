const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

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
    res.send(database.users);
})

app.post('/signin',(req,res)=>{
    // Load hash from your password DB.
    // bcrypt.compare('apple', '$2b$10$AB8pfAJUGHIid7ueMfj3bOsAcyeOphK1Lu/gx7ozkSV93W.pKdu6S', function(err, result) {
    //     console.log('first guess' + result);
    // });
    // bcrypt.compare('orange', '$2b$10$AB8pfAJUGHIid7ueMfj3bOsAcyeOphK1Lu/gx7ozkSV93W.pKdu6S', function(err, result) {
    //     console.log('second guess' + result);
    // });
    
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.send('this is signing');
    }else{
        res.status(400).send('there is error signin');
    }
})

app.post('/register',(req,res)=>{
    const {email,name,password} = req.body;
    // bcrypt.genSalt(10, function(err, salt) {
    //     bcrypt.hash(password, salt, function(err, hash) {
    //         console.log(hash);
    //     });
    // });
    database.users.push({
        id:'125',
        name:name,
        email:email,
        password:password,
        entries:0,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id',(req,res)=>{
    const {id} = req.params;
    let found = false;
    database.users.forEach(users=>{
        if(users.id === id){
            found = true;
            return res.json(users);
        }
    })
    if(!found){
        res.status(400).json("no such user");
    }
})

app.post('/image',(req,res)=>{
    const {id} = req.body;
    let found = false;
    database.users.forEach(users=>{
        if(users.id === id){
            users.entries++;
            return res.json(users.entries);
        }
    })
    if(!found){
        res.status(400).json("no such user");
    }
})

app.use(express.static(__dirname + '/public'))

app.listen(3000);