const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const DAL = require('./dataAccessLayer')
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

// TODO: add data access layer file

const port = process.env.PORT;
const app = express();
dotenv.config();
app.use(bodyParser.json());
app.use(cors());

DAL.connect();

//endpoints
app.get('/api/patients', cors(), async function(req, res) {
    const result = await DAL.find();

    res.send(result);
    // res.send('Hello World');
});

app.get('/api/patients/:id', (req, res) => {

});

app.post('/api/patients', cors(), async function (req, res) {
    const data = req.body;
    //TODO: validate request (required fields, min length, number, etc)
    if(data.firstName && data.lastName && data.dob && data.sex > 0) {
        const result = await DAL.insert(data);

        res.send('Success');
    }
    else{
        res.send('Fail');
    }

    // if validation fail, res.sendStatus(400).send('name field missing')

    //TODO: sanitize data

    const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        dob: data.dob,
        sex: data.sex,
    };

    //TODO: insert into database
    await DAL.insert(payload)

    //TODO: send back correct status codes and useful error messages



    res.status(201); //or send back payload .send(payload);
});

//TODO: add a put/patch endpoint

//TODO: add a delete endpoint
app.delete('/api/patients/:id', cors(), async function (req, res) {
    const id = req.params.id;
    const patient = {
        _id: ObjectId(id)
    }

    await DAL.remove(patient)

    res.send();
});

app.put('/api/patients/:id', async function (req, res){
    const id = req.params.id;
    const patient = {
        _id: ObjectId(id)
    };
    const newPatient = req.body;

    console.log(newPatient)
    const updatePatient = {
        $set: newPatient
    }

    await DAL.update(patient, updatePatient);
    res.send();
})

app.listen(port, () => {
    console.log('Good to go!')

    console.log(`MONGODB_CONNECTION_STRING: ${process.env.MONGODB_CONNECTION_STRING}`)
})