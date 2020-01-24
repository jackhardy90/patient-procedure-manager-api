const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config();

const databaseName = 'patients-db';
const collectionName = 'patients';
const mongodbUrl = process.env.MONGODB_CONNECTION_STRING;
const settings = {
    useUnifiedTopology: true
};

console.log('url: ' + mongodbUrl);

let database;

const connect = function() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(mongodbUrl, settings, function (err, client){
            if(err){
                reject(err);
            }
            else{
                console.log('succesffulyl connecte to databse')
                database = client.db(databaseName);
                resolve();
            }
        })
    })
}

const insert = function(patients) {
    return new Promise((resolve, reject) => {
        const patientCollection = database.collection(collectionName)

        patientCollection.insertOne(patients, function(err, res) {
            if(err){
                reject(err);
            }
            else {
                console.log('succesffully inserted new patient');
                resolve(res);
            }
        })
    })
}

const find = function(patient){
    let patientQuery = {};

    if(patient) {
        patientQuery = patient;
    }

    return new Promise((resolve, reject) =>{
        const patientCollection = database.collection(collectionName)

        patientCollection.find(patientQuery).toArray(function(err, res) {
            if(err) {
                reject(err);
            }
            else{
                console.log('sucessfully found patient');
                resolve(res);
            }
        })
    })
}
const update = function(patient, newPatient){
    return new Promise((resolve, reject) =>{
        const patientCollection = database.collection(collectionName)

        patientCollection.updateOne(patient, newPatient, function(err, res) {
            if(err) {
                reject(err);
            }
            else{
                console.log('updated successfully');
                resolve(res);
            }
        })
    })
}
const remove = function(patient){

    return new Promise((resolve, reject) =>{
        const patientCollection = database.collection(collectionName)

        patientCollection.remove(patient, function(err, res) {
            if(err) {
                reject(err);
            }
            else{
                console.log('patient removed sucesfully');
                resolve(res);
            }
        })
    })
}

module.exports = {connect, insert, update, remove, find}