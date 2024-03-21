const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

module.exports.authenticate = function (req, res, next) {
    try{
        console.log(req.body);
        const {token} = req.body;
        console.log(token);
        console.log("token: " + token);
        jwt.verify(token, 'your-secret-key');
        next();
    }catch(error){
        console.error("error authorizig user: " + error);
        res.status(401).json({ message: 'Unauthorized' });
    }
}

