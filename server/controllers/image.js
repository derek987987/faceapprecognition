const Clarifai = require('clarifai');

// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = 'c17c36740ffa41a1bc7fdf2de3724531';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'clarifai';       
const APP_ID = 'main';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '45fb9a671625463fa646c3523a3087d5';

const handleApiCall = (req, res) => {
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": req.body.input
                    }
                }
            }
        ]
    });
    
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result);
        res.json(result);
    })
    .catch(err => res.status(400).json('not working'))
}

const handleImage = (req, res, db) => {
    const {id} = req.body;
    db('users').where('id', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries=>{
        res.json(entries);
    })
    .catch(err=> res.status(400).json('unable to get the entries'));
}

module.exports = {
    handleApiCall,
    handleImage
}