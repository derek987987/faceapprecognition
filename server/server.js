const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'hay',
      password : '',
      database : 'smart-brain'
    }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send('landing page');
})

app.post('/signin',(req,res)=>{
    const {email,password} = req.body;
    // Load hash from your password DB.
    // bcrypt.compare('apple', '$2b$10$AB8pfAJUGHIid7ueMfj3bOsAcyeOphK1Lu/gx7ozkSV93W.pKdu6S', function(err, result) {
    //     console.log('first guess' + result);
    // });
    // bcrypt.compare('orange', '$2b$10$AB8pfAJUGHIid7ueMfj3bOsAcyeOphK1Lu/gx7ozkSV93W.pKdu6S', function(err, result) {
    //     console.log('second guess' + result);
    // });
    db.select('email', 'hash').from('login')
    .where('email', email)
    .then(data=>{
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if(isValid){
            db.select('*').from('users')
            .where('email',email)
            .then(user=>{
                res.json(user[0]);
            })
            .catch(err=>res.status(400).json('unable to get user'))
        }else{
            res.status(400).send('wrong credentials');
        }
    })
    .catch(err=>res.status(400).json('unable to get the db'))
})

app.post('/register',(req,res)=>{
    const {email,name,password} = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    db.transaction(trx=>{
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(email=>{
            trx('users')
            .returning('*')
            .insert({
                email: email[0].email,
                name:name,
                joined:new Date()
            })
            .then(user=>{
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err=> res.status(400).json('unable to register'));
    
})

app.get('/profile/:id',(req,res)=>{
    const {id} = req.params;
    db.select('*').from('users').where('id',id)
     .then(user=>{
        if(user.length){
            res.json(user);
        }else{
            res.status(400).json('no user');
        }
    })
    .catch(err=> res.status(400).json('unable to find the id'));
})

app.put('/image',(req,res)=>{
    const {id} = req.body;
    db('users').where('id', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries=>{
        res.json(entries);
    })
    .catch(err=> res.status(400).json('unable to get the entries'));

})

app.use(express.static(__dirname + '/public'))

app.listen(3000);