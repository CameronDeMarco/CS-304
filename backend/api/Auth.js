const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

module.exports.authenticate = function (req, res, next) {
    try{
        const {token} = req.body;
        const test = jwt.verify(token, 'your-secret-key');
        req.body.token = test;
        next();
    }catch(error){
        console.error("error authorizig user: " + error);
        res.status(401).json({ message: 'Unauthorized' });
    }
}

